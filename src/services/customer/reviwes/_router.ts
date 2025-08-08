import { Router } from "express";
import { add, list } from "./reviews";

const router = Router();

router.post("/list", list);
router.post("/add", add);

export default router;
