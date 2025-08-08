import { Router } from "express";
import { add } from "./customerService";

const router = Router();

router.post("/add", add);

export default router;
