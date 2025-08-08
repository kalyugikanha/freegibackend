import { Router } from "express";
import { deliveryEnd, update } from "./geoLocation";

const router = Router();

router.post("/update", update);
router.post("/deliveryend", deliveryEnd);

export default router;
