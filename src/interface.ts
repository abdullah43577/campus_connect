import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IUserRequest extends Request {
  userId?: any;
  role?: any;
}

export interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface NigerianBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NigerianBanksResponse {
  status: boolean;
  message: string;
  data: NigerianBank[];
}

export interface BankInfo {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}
