import { Router } from "express";
import { add, verifyPayment, list, update, view, detail, cancelOrder, orderLocation, returnOrder, exchangeOrder, recentOrderList, mostOrder } from "./orders";

const router = Router();

router.post("/verifypayment", verifyPayment);
router.post("/add", add);
router.post("/detail", detail);
router.post("/list", list);
router.post("/update", update);
router.post("/view", view);
router.post("/cancelOrder", cancelOrder);
router.post("/returnOrder", returnOrder);
router.post("/exchangeOrder", exchangeOrder);
router.post("/orderLocation", orderLocation);
router.post("/recentOrder", recentOrderList);
router.post("/mostOrder", mostOrder);

export default router;
