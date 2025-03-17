import { Router } from "express";
import { getAdmin } from "../controller/admin.controller.js";

const router = Router();

// router.get('/' , (req, res) => {
//     res.send('Admin route with GET method');
// });

router.get('/' , getAdmin)
export default router;