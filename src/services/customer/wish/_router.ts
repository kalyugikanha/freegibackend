import { Router } from "express";
import { add, list, remove } from "./wish";

const router = Router();

router.post("/add", add);
router.post("/list", list);
router.post("/remove", remove);

export default router;
