import { Router } from "express";
import { postClient } from "../controllers/clientsControllers.js";
import { bodyVerification } from "../middlewares/bodyVerificationMiddleware.js";

const router = Router()

router.post("/clients", bodyVerification, postClient)

export default router