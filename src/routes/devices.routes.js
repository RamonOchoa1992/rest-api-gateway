import { Router } from "express";
import { createDevice, deleteDevice, getDevice, getDevices, updateDevice } from "../controllers/devices.controller.js";

const router = Router();

router.get("/api/devices", getDevices)

router.get("/api/devices/:id", getDevice)

router.post("/api/devices", createDevice)

router.put("/api/devices/:id", updateDevice)

router.delete("/api/devices/:id", deleteDevice)

export default router;