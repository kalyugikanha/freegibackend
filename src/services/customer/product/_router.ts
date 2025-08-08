import { Router } from "express";
import { list, search } from "./product";

const router = Router();

router.post("/list", list);
router.post("/search", search);

export default router;
