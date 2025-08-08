import { Router } from "express";
import { list } from "./tax";

const router = Router();

router.post("/list", list);

export default router;
