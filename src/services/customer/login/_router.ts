import { Router } from "express";
import { login, signup, update, verifyOtp,pincodeUpdate } from "./login";
const router = Router();
import { userAuth } from "../../../middleware/auth";

router.post("/signup", signup);
router.post("/verifyOtp", verifyOtp);
router.post("/update", update);
router.post("/login", login);
router.post("/pincodeUpdate",userAuth, pincodeUpdate);

export default router;
