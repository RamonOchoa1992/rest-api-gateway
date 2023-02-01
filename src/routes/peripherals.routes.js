import { Router } from "express";
import { createPeripherals, deletePeripherals, getPerpheral, getPerpherals, updatePeripherals } from "../controllers/peripherals.controller.js"

const router = Router();

router.get("/api/peripherals", getPerpherals);

router.get("/api/peripheral/:id", getPerpheral);

router.post("/api/peripherals", createPeripherals)

router.put("/api/peripherals/:id", updatePeripherals)

router.delete("/api/peripherals/:id", deletePeripherals)

export default router;