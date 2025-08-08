import { Router } from "express";
import { login, signup, update, verifyOtp } from "./login";
const router = Router();

router.post("/signup", signup);
router.post("/verifyOtp", verifyOtp);
router.post("/update", update);
router.post("/login", login);

export default router;
