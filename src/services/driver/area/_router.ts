import { Router } from "express";
import { add, list, remove, update } from "./area";

const router = Router();

router.post("/add", add);
router.post("/list", list);
router.post("/update", update);
router.post("/remove", remove);

export default router;
