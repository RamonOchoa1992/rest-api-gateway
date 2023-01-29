import express from "express";
import gatewayRoutes from "./routes/gateways.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use(gatewayRoutes);
app.use((req, res, next) =>
  res.status(404).json({
    message: "Endpoint not found!",
  })
);

export default app;
