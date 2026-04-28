import express from "express";

const router = express.Router();

import { validateCard } from "../controllers/validationController.js";

router.post("/", validateCard);

export default router;
