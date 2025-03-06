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
  if (!authHeader) {
    return next(HttpError("Unouthorized", 401));
  }

  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer" || !token) {
    return next(HttpError("Unouthorized", 401));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(HttpError("Secret key is require", 400));
  }

  const decoded = jwt.verify(token, secret) as JwtPayload;

  if (!decoded) {
    return next(HttpError("Unouthorized", 401));
  }

  req.userId = decoded.userId;
  next();
};

export { checkAuth };
