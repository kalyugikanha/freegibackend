import { Router } from "express";
import { list } from "./subCategory";

const router = Router();

router.post("/list", list);

export default router;
