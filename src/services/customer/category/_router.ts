import { Router } from "express";
import { list } from "./category";

const router = Router();

router.post("/list", list);

export default router;
