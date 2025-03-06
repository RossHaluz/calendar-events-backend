import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prismadb } from "../lib/prismaClient";
import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError";

interface IGetUserAuthInfoRequest extends Request {
  userId: string;
}

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const body = req.body;
    const { email, password } = body;
    const user = await prismadb.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      res.status(400).json({ message: "User already exist" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prismadb.user.create({
      data: {
        ...body,
        password: hashPassword,
      },
    });

    res.status(200).json(newUser);
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prismadb.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const comparePass = await bcrypt.compare(user.id, password);

    if (!comparePass) {
      res.status(400).json({ message: "Password or email is not correct" });
      return;
    }

    const payload = {
      userId: user?.id,
    };
    // Ensure secret is defined
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(400).json({ message: "Secret key is required" });
      return;
    }

    const token = await jwt.sign(payload, secret, { expiresIn: "24h" });

    res.status(200).json({ user, token });
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as IGetUserAuthInfoRequest).userId;

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw HttpError("User not found", 404);
    }

    res.status(200).json(user);
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { registerUser, loginUser, currentUser };
