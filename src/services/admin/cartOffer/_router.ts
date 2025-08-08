import { Router } from "express";
import {
  add,
  list,
  remove,
  update,
  view,
} from "./cartOffer";
// import { fileUpload } from "../../../helper/upload";
const router = Router();
router.get("/list",list);
router.post("/add", add);
router.put("/:id", update);
router.get("/:id", view);
router.delete("/:id", remove);

export default router;
