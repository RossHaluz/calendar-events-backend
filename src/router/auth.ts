import express, { Router } from "express";
import {
  currentUser,
  loginUser,
  registerUser,
} from "../controllers/authController";
import { checkAuth } from "../middlewars/checkAuth";
const router: Router = express.Router();

//Register user
router.post("/register", registerUser);

//Login user
router.post("/login", loginUser);

//Current user
router.get("/current", checkAuth, currentUser);

export default router;
