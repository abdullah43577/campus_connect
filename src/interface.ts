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

export interface EventPaymentInitializer {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface TransferRecipientResponse {
  status: boolean;
  message: boolean;
  data: {
    active: boolean;
    createdAt: Date;
    currency: string;
    domain: string;
    id: number;
    integration: number;
    name: string;
    recipient_code: string;
    type: string;
    updatedAt: Date;
    is_deleted: boolean;
    details: {
      authorization_code: string;
      account_number: string;
      account_name: string;
      bank_code: string;
      bank_name: string;
    };
  };
}
