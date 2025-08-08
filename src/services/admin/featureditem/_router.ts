import { Router } from "express";
import { add, list, remove } from "./featureditem";

const router = Router();

router.get("/list", list);
router.post("/add", add);
router.post("/delete", remove);

export default router;
