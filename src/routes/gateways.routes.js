import { Router } from "express";
import {
  getGateways,
  getGateway,
  createGateways,
  updateGateways,
  deleteGateways,
} from "../controllers/gateways.controller.js";

const router = Router();

router.get("/api/gateways", getGateways);

router.get("/api/gateways/:id", getGateway);

router.post("/api/gateways", createGateways);

router.put("/api/gateways/:id", updateGateways);

router.delete("/api/gateways/:id", deleteGateways);

export default router;
