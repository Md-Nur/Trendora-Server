import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const imgs = [
  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1699796990049-3406a9991baa",
  "https://images.unsplash.com/photo-1698440050363-1697e5f0277c",
  "https://images.unsplash.com/photo-1707588521743-636355884c21",
  "https://images.unsplash.com/photo-1522198734915-76c764a8454d",
  "https://images.unsplash.com/photo-1468495244123-6c6c332eeece",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
  "https://images.unsplash.com/photo-1673718424704-51d0d2ca1fd2",
  "https://images.unsplash.com/photo-1673718423582-f3378102c0d7",
];

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    for (let i = 0; i < products.length; i++) {
      products[i].imageUrl = imgs[Math.floor(Math.random() * imgs.length)];
    }
    await products.save();
    console.log(products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

const insertProduct = asyncHandler(async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await Product.create(product);
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});
export { getAllProducts, insertProduct };
