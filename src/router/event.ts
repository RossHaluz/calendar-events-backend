import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../controllers/eventController";
import { checkAuth } from "../middlewars/checkAuth";
const router = express.Router();

router.use(checkAuth);

//Get all enets by user
router.get("/", getEvents);

//Create event
router.post("/create", createEvent);

//Update event
router.patch("/update/:eventId", updateEvent);

//Delete event
router.delete("/delete/:eventId", deleteEvent);

export default router;
