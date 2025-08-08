import { Router } from "express";
import { view, update } from "./profile";
const router = Router();

router.post("/view", view);
router.post('/update', update)

export default router;
