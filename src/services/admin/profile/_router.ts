import { Router } from "express";
import {
  view,
} from "./profile";
const router = Router();

router.post("/view", view);
export default router;
