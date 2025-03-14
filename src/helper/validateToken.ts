import { NextFunction, Response } from "express";
import "dotenv/config";
import jwt, { Secret } from "jsonwebtoken";
import { CustomJwtPayload, IUserRequest } from "../interface";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const validateAccessToken = function (req: IUserRequest, res: Response, next: NextFunction) {
  let token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied, No token provided!" });

  try {
    const { id, role } = jwt.verify(token, ACCESS_TOKEN_SECRET as Secret) as CustomJwtPayload;
    req.userId = id;
    req.role = role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Error validating access token", error });
  }
};

export const validateRefreshToken = function (req: IUserRequest, res: Response, next: NextFunction) {
  let refreshToken;
  refreshToken = req.body.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: "Access Denied, Refresh token not provided!" });

  try {
    const { id, role } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as Secret) as CustomJwtPayload;
    req.userId = id;
    req.role = role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Error validating refresh", error });
  }
};
