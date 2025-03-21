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
import { transportMail } from "../helper/transportMail";
import { userRegistration, UserRegistrationProps } from "../helper/email-templates/user-registration";
import { emailVerificationSuccess, EmailVerificationSuccessProps } from "../helper/email-templates/email-verification-success";
import { passwordResetTemplate } from "../helper/email-templates/forgot-password";
import { passwordResetConfirmationTemplate } from "../helper/email-templates/reset-password";

const register_user = async function (req: Request, res: Response) {
  try {
    const { password, ...rest } = registerSchema.parse(req.body);

    //* check if user exists
    const user = await User.findOne({ where: { email: rest.email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);
    const newObject = { ...rest, password: hashedPassword };
    const newUser = await User.create(newObject);
    const generatedOTP = generateOTP();

    await OTP.create({
      email: rest.email,
      code: generatedOTP.code,
      expires_at: generatedOTP.expiresAt,
    });

    //* create email template data
    const emailTemplateData: UserRegistrationProps = {
      heading: "Email Verification Required",
      username: newUser.first_name,
      body: "Thank you for registering with Campus Connect. To complete your registration, please use the verification code below:",
      otp: generatedOTP.code,
      expiryTime: "10 minutes",
    };

    //* extract html
    const html = userRegistration(emailTemplateData);

    //* send mail
    await transportMail({ email: rest.email, subject: "Thank you for joining campus connect", message: html.html });

    res.status(200).json({ message: "An OTP was sent to the provided mail address" });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const verify_email = async function (req: Request, res: Response) {
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
    await otp.destroy();
    const access_token = generateAccessToken({ id: user.id, role: user.user_type });
    const refresh_token = generateRefreshToken({ id: user.id, role: user.user_type });

    const emailTemplateData: EmailVerificationSuccessProps = {
      username: user.first_name,
      loginUrl: "https://localhost:3000/auth/login",
      heading: "Email Successfully Verified",
      body: "Congratulations! Your email has been successfully verified. Your Campus Connect account is now active and ready to use.",
      btnTxt: "Log in to Your Account",
    };

    const html = emailVerificationSuccess(emailTemplateData);

    await transportMail({ email: user.email, subject: "Email Successfully Verified", message: html.html });

    res.status(200).json({ message: emailTemplateData.heading, tokens: { access_token, refresh_token } });
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

    if (!user) return res.status(404).json({ message: "Invalid email or password!" });

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

const forgot_password = async function (req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User is not a registered user" });

    //* send reset mail
    const { code, expiresAt } = generateOTP();

    await OTP.create({
      email,
      code,
      expires_at: expiresAt,
    });

    //* create email template data
    const emailTemplateData = {
      heading: "Reset Your Password",
      username: user.first_name,
      body: "We received a request to reset your password for your Campus Connect account. Click the button below to set a new password. \n\n Reset token expires in 10 minutes \n\n If you didn’t request this, you can safely ignore this email.",
      otp: code,
      expiryTime: "10 minutes",
    };

    //* extract html
    const html = passwordResetTemplate(emailTemplateData);

    //* send mail
    await transportMail({ email: user.email, subject: "Reset Your Password", message: html.html });

    res.status(200).json({ message: "reset otp sent" });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const reset_password = async function (req: Request, res: Response) {
  try {
    const { email, token, password } = req.body;
    if (!email || !token) return res.status(400).json({ message: "Email and Token is required" });

    const otp = await OTP.findOne({
      where: {
        email,
        code: token,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!otp) return res.status(404).json({ message: "OTP not found/or invalid OTP" });

    const newPassword = await hashPassword(password);
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User with specified email address not found" });

    await user.update({ password: newPassword });
    await otp.destroy();

    //* send mail
    const emailTemplateData = {
      heading: "Your Password Has Been Reset",
      username: user.first_name,
      body: "Your password for your Campus Connect account has been successfully reset. If you made this change, you can safely ignore this message.\n\nIf you did not request this change, please contact our support team immediately at support@campusconnect.com.",
      btnTxt: "Contact Support",
      btnAction: "mailto:support@campusconnect.com",
    };

    const html = passwordResetConfirmationTemplate(emailTemplateData);

    await transportMail({ email: user.email, subject: "Your Password Has Been Reset", message: html.html });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    handleErrors({ res, error });
  }
};

const generate_new_token = async function (req: IUserRequest, res: Response) {
  try {
    const { userId, role } = req;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    const access_token = generateAccessToken({ id: userId, role });
    res.status(200).json({ message: "Access token generated successfully", token: { access_token } });
  } catch (error) {
    handleErrors({ res, error });
  }
};

export { register_user, verify_email, login_user, forgot_password, reset_password, generate_new_token };
