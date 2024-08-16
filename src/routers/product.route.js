import { Router } from "express";
import {
  getAllProducts,
  insertProduct,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", insertProduct);

export default productRouter;
