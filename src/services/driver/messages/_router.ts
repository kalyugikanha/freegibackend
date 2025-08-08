import { Router } from "express";
import { list } from "./message";

const router = Router();

router.post("/list", list);

export default router;
