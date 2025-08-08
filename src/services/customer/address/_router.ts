import { Router } from "express";
import { add, list, remove, update, selectDefault } from "./address";

const router = Router();

router.post("/add", add);
router.post("/list", list);
router.post("/update", update);
router.post("/remove", remove);
router.post("/default", selectDefault)

export default router;
