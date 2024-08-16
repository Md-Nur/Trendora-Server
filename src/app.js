import express from "express";
import productRouter from "./routers/product.route.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "30mb", extended: true }));

app.get("/", (req, res) => {
  res.send("API is running....");
});
app.use("/products", productRouter);
export default app;
