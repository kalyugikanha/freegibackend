import { Router } from "express";
import { list,add,update ,deletePinCode} from "./pincode";
const router = Router();

router.post("/add", add);
router.get("/", list);
router.put("/:id", update);
router.delete("/:id", deletePinCode);


export default router;
