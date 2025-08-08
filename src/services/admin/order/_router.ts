import { Router } from "express";
import { list,updateStatus } from "./order";

const router = Router();

router.post("/list", list);
router.post("/update", updateStatus);

export default router;
