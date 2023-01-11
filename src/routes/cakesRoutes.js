import { Router } from "express";
import { postCake } from "../controllers/cakesControllers.js";
import { bodyVerification } from "../middlewares/bodyVerificationMiddleware.js";
import { paramsVerification } from "../middlewares/paramsVerificationMiddleware.js";
import { queryVerification } from "../middlewares/queryVerificationMiddleware.js";



const router = Router()

router.post("/cakes", bodyVerification, postCake)

export default router