import express from "express";
import gatewayRoutes from "./routes/gateways.routes.js";
import peripheralRoutes from "./routes/peripherals.routes.js";
import devicesRoutes from "./routes/devices.routes.js"
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use(gatewayRoutes);
app.use(peripheralRoutes);
app.use(devicesRoutes)
app.use((req, res, next) =>
  res.status(404).json({
    message: "Endpoint not found!",
  })
);

export default app;
