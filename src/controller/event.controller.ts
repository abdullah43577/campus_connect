import { Response } from "express";
import { handleErrors } from "../helper/handleErrors";
import { BankInfo, IUserRequest, NigerianBanksResponse } from "../interface";
import { CreateEventSchema } from "../lib/schema/event_schema";
import axios from "axios";
import { cache } from "../server";
import Event from "../models/event.model";
import Attendee from "../models/attendee.model";
const { PAYSTACK_TEST_SECRET_KEY } = process.env;

const fetch_nigerian_banks = async function (req: IUserRequest, res: Response) {
  try {
    const cachedBanks = cache.get("banks");
    if (cachedBanks) return res.status(200).json({ message: "Banks fetched successfully!", banks: cachedBanks });

    const { data } = await axios.get<NigerianBanksResponse>("https://api.paystack.co/bank?country=nigeria", {
      headers: {
        Authorization: `Bearer ${PAYSTACK_TEST_SECRET_KEY}`,
      },
    });

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

    const { data } = await axios.get<BankInfo>(`https://api.paystack.co/bank/resolve?account_number=${account_no}&bank_code=${bank_code}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_TEST_SECRET_KEY}`,
      },
    });

    if (!data.status) return res.status(400).json({ message: "Cannot find account with associated number" });

    const event = await Event.create({
      organizer_id: userId,
      title: rest.title,
      description: rest.description,
      date: rest.date,
      location: rest.location,
      target_amount: rest.target_amount,
      contributed_so_far: rest.contributed_so_far,
      bank_name,
      account_no,
      account_name: data.data.account_name,
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
      status: "confirmed",
    });

    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    handleErrors({ res, error });
  }
};

export { fetch_nigerian_banks, create_event, event_registration };
