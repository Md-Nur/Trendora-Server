import { Router } from "express";
import {
  getAllProducts,
  insertProduct,
  productsQuery,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/query", productsQuery);
productRouter.post("/", insertProduct);

export default productRouter;
