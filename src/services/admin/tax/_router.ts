import { Router } from "express";
import { add, changeStatus, list, remove, update, view } from "./tax";

const router = Router();

router.post("/list", list);
router.post("/add", add);
router.post("/update", update);
router.post("/view", view);
router.post("/changeStatus", changeStatus);
router.post("/delete", remove);

export default router;
