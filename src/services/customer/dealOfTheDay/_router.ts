import { Router } from "express";
import { list } from "./dealOfTheDay";

const router = Router();

router.post("/list", list);

export default router;