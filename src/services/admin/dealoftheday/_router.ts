import { Router } from "express";
import { add, list, remove ,update,getDetails} from "./dealoftheday";

const router = Router();

router.get("/list", list);
router.post("/add", add);
router.put("/:id", update);
router.delete("/:id", remove);
router.get("/:id", getDetails);

export default router;
