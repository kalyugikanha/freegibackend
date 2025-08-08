import { Router } from "express";
import {
  add,
  categoryViseList,
  changeStatus,
  list,
  remove,
  update,
  view,
} from "./subCategory";

const router = Router();

router.post("/list", list);
router.post("/category-vise-list", categoryViseList);
router.post("/add", add);
router.post("/update", update);
router.post("/view", view);
router.post("/changeStatus", changeStatus);
router.post("/delete", remove);

export default router;
