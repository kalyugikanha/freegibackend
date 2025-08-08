import { Router } from "express";
import {
  view,
  verify
} from "./profile";
const router = Router();

router.post("/view", view);
router.post("/verify", verify);
export default router;
