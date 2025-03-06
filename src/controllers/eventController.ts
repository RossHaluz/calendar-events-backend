import { NextFunction, Request, Response } from "express";
import { HttpError } from "../helpers/HttpError";
import { prismadb } from "../lib/prismaClient";
import { Event } from "../models/types";
import { Priority } from "@prisma/client";

interface IGetUserAuthInfoRequest extends Request {
  userId: string;
}

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as IGetUserAuthInfoRequest).userId || "";
    const body: Event = req.body;

    const startDate = new Date(body.start).toISOString();
    const endDate = new Date(body.end).toISOString();

    const newEvent = await prismadb.event.create({
      data: {
        title: body.title,
        description: body.description || "",
        priority: body.priority,
        start: startDate,
        end: endDate,
        userId,
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const body: Event = req.body;
    const startDate = new Date(body.start).toISOString();
    const endDate = new Date(body.end).toISOString();

    const updateEvent = await prismadb.event.update({
      where: {
        id: eventId,
      },
      data: {
        title: body.title,
        description: body.description || "",
        priority: body.priority,
        start: startDate,
        end: endDate,
      },
    });

    if (!updateEvent) {
      throw HttpError("Something went wrong", 400);
    }

    res.status(200).json(updateEvent);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const deleteEvent = await prismadb.event.delete({
      where: {
        id: eventId,
      },
    });

    if (!deleteEvent) {
      throw HttpError("Something went wrong", 400);
    }

    res.status(200).json({ message: "Event success delete" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as IGetUserAuthInfoRequest).userId;
    const { priority, searchValue } = req.query;

    const formattedPriority =
      priority && typeof priority === "string"
        ? (priority.toUpperCase() as Priority)
        : undefined;

    const formattedSearchValue =
      searchValue && typeof searchValue === "string" ? searchValue : undefined;

    const events = await prismadb.event.findMany({
      where: {
        userId,
        ...(formattedPriority && { priority: formattedPriority }),
        ...(formattedSearchValue && {
          OR: [
            {
              title: {
                contains: formattedSearchValue,
                mode: "insensitive",
              },
              description: {
                contains: formattedSearchValue,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
    });

    const formattedEvents = events?.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { createEvent, updateEvent, deleteEvent, getEvents };
