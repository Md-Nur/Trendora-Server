import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import imgs from "../utils/images.js";

const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const category = req.query.category || "";
  const brandName = req.query.brandName || "";
  const priceRange = req.query.priceRange || null;

  const pipeline = [
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $match: {
        $and: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: category, $options: "i" } },
          { brandName: { $regex: brandName, $options: "i" } },
          priceRange
            ? {
                price: {
                  $gte: parseInt(priceRange.split("-")[0]),
                  $lte: parseInt(priceRange.split("-")[1]),
                },
              }
            : {},
        ],
      },
    },
  ];
  try {
    const allProducts = await Product.aggregate(pipeline);
    totalPages = Math.ceil(allProducts.length / 6);
    const pageList = Array.from({ length: totalPages }, (_, i) => i + 1);
    const products = Product.aggregate([
      ...pipeline,
      { $skip: (page - 1) * 6 },
      { $limit: 6 },
    ]);
    const uniqueCategories = await Product.distinct("category");
    const uniqueBrands = await Product.distinct("brandName");

    res.json({ pageList, uniqueCategories, uniqueBrands, products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

const productsQuery = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / 6);
  const pageList = Array.from({ length: totalPages }, (_, i) => i + 1);
});

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
export { getAllProducts, productsQuery, insertProduct };
