import { Request, Response } from "express";
import User from "../models/user.model";
import { loginSchema, OTPSchema, registerSchema } from "../lib/schema/auth_schema";
import { comparePassword, hashPassword } from "../helper/hashPassword";
import OTP from "../models/otp.model";
import { Op } from "sequelize";
import { generateOTP } from "../lib/generateOTP";
import { handleErrors } from "../helper/handleErrors";
import { generateAccessToken, generateRefreshToken } from "../helper/generateToken";
import { IUserRequest } from "../interface";

const register_user = async function (req: Request, res: Response) {
  try {
    const { password, ...rest } = registerSchema.parse(req.body);
    const hashedPassword = await hashPassword(password);
    const newObject = { ...rest, password: hashedPassword };
    const newUser = await User.create(newObject);
    const generatedOTP = generateOTP();

    await OTP.create({
      email: rest.email,
      code: generatedOTP.code,
      expires_at: generatedOTP.expiresAt,
    });

    //* send OTP to mail
    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const verifyOTP = async function (req: Request, res: Response) {
  try {
    const { email, code } = OTPSchema.parse(req.body);

    const otp = await OTP.findOne({
      where: {
        email: email,
        code,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!otp) return res.status(404).json({ message: "OTP not found/or invalid OTP" });

    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found!" });

    await user.update({ is_verified: true });
    const access_token = generateAccessToken({ id: user.id, role: user.user_type });
    const refresh_token = generateRefreshToken({ id: user.id, role: user.user_type });

    res.status(200).json({ message: "Email verified successfully!", tokens: { access_token, refresh_token } });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const login_user = async function (req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.is_locked) return res.status(400).json({ message: "Account is locked due to multiple failed attempts, please contact the administrator" });

    const isMatch = await comparePassword(password, user.password as string);

    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) user.is_locked = true;

      await user.save();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //* Reset login attempts
    user.failedLoginAttempts = 0;
    await user.save();

    const access_token = generateAccessToken({ id: user.id, role: user.user_type });
    const refresh_token = generateRefreshToken({ id: user.id, role: user.user_type });

    res.status(200).json({ message: "Login Succesful", tokens: { access_token, refresh_token } });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const generateNewToken = async function (req: IUserRequest, res: Response) {
  try {
    const { userId, role } = req;
    const { refreshToken } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    const access_token = generateAccessToken({ id: userId, role });
    res.status(200).json({ message: "Access token generated successfully", token: { access_token } });
  } catch (error) {
    handleErrors({ res, error });
  }
};

//* reset password

export { register_user, verifyOTP, login_user, generateNewToken };

//* create an endpoint for attendees to register and pay for the event (installmental & full payment)
//* creating a json for all bank names in nigeria
//* handling validating local banks from the server side nodejs
