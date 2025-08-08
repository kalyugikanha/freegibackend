import { Router } from "express";
import { add, amountDetail, verifyPayment, list } from "./wallet";

const router = Router();

router.post("/add", add);
router.post("/verifyPayment", verifyPayment);
router.post("/amountDetail", amountDetail);
router.post("/list", list)

export default router;
