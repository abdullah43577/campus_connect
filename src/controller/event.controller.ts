import { Response } from "express";
import { handleErrors } from "../helper/handleErrors";
import { BankInfo, EventPaymentInitializer, IUserRequest, NigerianBanksResponse, TransferRecipientResponse } from "../interface";
import { CreateEventSchema } from "../lib/schema/event_schema";
import axios from "axios";
import { api, cache } from "../server";
import Event from "../models/event.model";
import Attendee from "../models/attendee.model";
import User from "../models/user.model";
import Payment from "../models/Payment.model";
const { PAYSTACK_TEST_SECRET_KEY } = process.env;
import crypto from "crypto";

const fetch_nigerian_banks = async function (req: IUserRequest, res: Response) {
  try {
    const cachedBanks = cache.get("banks");
    if (cachedBanks) return res.status(200).json({ message: "Banks fetched successfully!", banks: cachedBanks });

    const { data } = await api.get<NigerianBanksResponse>("/bank?country=nigeria");

    const banks = data.data.map(d => ({ name: d.name, bank_code: d.code }));

    cache.set("banks", banks);

    return res.status(200).json({ message: "Banks fetched successfully!", banks });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const create_event = async function (req: IUserRequest, res: Response) {
  try {
    const { userId } = req;

    const { bank_name, account_no, bank_code, ...rest } = CreateEventSchema.parse(req.body);

    const { data } = await api.get<BankInfo>(`/bank/resolve?account_number=${account_no}&bank_code=${bank_code}`);

    if (!data.status) return res.status(400).json({ message: "Cannot find account with associated number" });

    const { data: recipientData } = await api.post<TransferRecipientResponse>("/transferrecipient", {
      type: "nuban",
      name: rest.title,
      account_number: account_no,
      bank_code: bank_code,
      currency: "NGN",
    });

    if (!recipientData.status) {
      return res.status(400).json({ message: "Failed to create transfer recipient" });
    }

    const recipient_code = recipientData.data.recipient_code;

    const event = await Event.create({
      organizer_id: userId,
      title: rest.title,
      description: rest.description,
      date: rest.date,
      location: rest.location,
      target_amount: rest.target_amount,
      contributed_so_far: rest.contributed_so_far,
      bank_name,
      bank_code,
      account_no,
      account_name: data.data.account_name,
      recipient_code,
      status: "ongoing",
    });

    res.status(200).json({ message: "Event created successfully!", event });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const event_registration = async function (req: IUserRequest, res: Response) {
  try {
    const { userId } = req;
    const { event_id } = req.body;

    if (!event_id) return res.status(400).json({ message: "Event ID is required" });

    const attendee = await Attendee.create({
      attendee_id: userId,
      event_id,
      payment_status: "pending",
    });

    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const event_payment = async function (req: IUserRequest, res: Response) {
  try {
    const { userId } = req;
    const { amount, event_id } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found!" });

    const { data } = await api.post<EventPaymentInitializer>("/transaction/initialize", {
      email: user.email,
      amount: amount * 100,
      metadata: {
        event_id,
        user_id: userId,
      },
      callback_url: `${process.env.FRONTEND_URL}/payment-callback`,
    });

    if (!data.status) return res.status(400).json({ message: "Failed to initialize payment", error: data.message });

    await Payment.create({
      user_id: userId,
      event_id,
      amount,
      reference: data.data.reference,
      status: "pending",
    });

    return res.status(200).json({
      message: "Payment initialized successfully",
      data: {
        authorization_url: data.data.authorization_url,
        reference: data.data.reference,
      },
    });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const event_payment_webhook = async function (req: IUserRequest, res: Response) {
  try {
    const hash = crypto.createHmac("sha512", PAYSTACK_TEST_SECRET_KEY!).update(JSON.stringify(req.body)).digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(400).send("Invalid signature");
    }
    const { event, data } = req.body;

    if (event === "charge.success") {
      const { reference, metadata, amount } = data;
      const { event_id, user_id } = metadata;

      // Update payment record
      const payment = await Payment.findOne({ where: { reference } });
      if (!payment) return res.send("Payment not found");

      payment.status = "completed";
      await payment.save();

      // Get event and user details
      const eventDetails = await Event.findByPk(event_id);
      const userDetails = await User.findByPk(user_id);

      if (!eventDetails || !userDetails) return res.status(404).json({ message: "Event or user not found" });

      // Update user's registration for the event
      const attendee = await Attendee.findOne({
        where: {
          id: user_id,
          event_id,
        },
      });
      if (!attendee) return res.status(404).json({ message: "User not found" });

      // Update registration payment details
      attendee.amount_paid += amount / 100;
      attendee.balance_due = Math.max(0, attendee.balance_due - amount / 100);

      if (attendee.balance_due <= 0) {
        attendee.payment_status = "complete";
        // attendee.verification_code = generateUniqueCode(); // Implement this function
      } else {
        attendee.payment_status = "pending";
      }

      await attendee.save();

      await api.post("/transfer", {
        source: "balance",
        amount: amount,
        recipient: eventDetails.recipient_code,
        reason: `Payment for ${eventDetails.title} - Registration ID: ${attendee.id}`,
      });
    }

    return res.status(200).json({ message: "Payment Confirmed" });
  } catch (error) {
    handleErrors({ res, error });
  }
};

export { fetch_nigerian_banks, create_event, event_registration, event_payment, event_payment_webhook };
