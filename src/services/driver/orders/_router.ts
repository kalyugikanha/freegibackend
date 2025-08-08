import { Router } from "express";
import { activeOrder, list, OrderCountApi, OrderHistory, cancelOrder, cashPaymentOrder,updateStatus } from "./orders";

const router = Router();

router.post("/dashboard", OrderCountApi);
router.post("/activeOrder", activeOrder);
router.post("/list", list);
router.post("/order-history", OrderHistory);
router.put('/cancelOrder', cancelOrder)
router.put('/cashPayment', cashPaymentOrder)
router.put('/update', cashPaymentOrder)
router.post('/update', updateStatus)

export default router;
