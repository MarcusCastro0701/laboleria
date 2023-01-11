import { Router } from "express";
import { postOrder, getOrders, getOrdersById, getClientAndOrders } from "../controllers/ordersControllers.js";
import { bodyVerification } from "../middlewares/bodyVerificationMiddleware.js";
import { paramsVerification } from "../middlewares/paramsVerificationMiddleware.js";
import { queryVerification } from "../middlewares/queryVerificationMiddleware.js";

const router = Router()

router.post("/orders", bodyVerification, postOrder)
router.get("/orders", queryVerification, getOrders)
router.get("/clients/:id", paramsVerification, getOrdersById)
router.get("/clients/:id/orders", paramsVerification, getClientAndOrders)

export default router