import { Router } from "express";
import { createSong } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// router.get('/' , (req, res) => {
//     res.send('Admin route with GET method');
// });

router.post('/songs' , protectRoute, requireAdmin, createSong);

export default router;