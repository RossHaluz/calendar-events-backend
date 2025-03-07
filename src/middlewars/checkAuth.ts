import { NextFunction, Request, Response } from "express";
import { HttpError } from "../helpers/HttpError";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IGetUserAuthInfoRequest extends Request {
  userId?: string;
}

const checkAuth = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization as string;
  const token = authHeader?.split(" ")[1];

  if (!token || token === "null" || token === "undefined") {
    return next(HttpError("Unauthorized", 401));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(HttpError("Secret key is required", 400));
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return next(HttpError("Unauthorized", 401));
  }
};

export { checkAuth };
