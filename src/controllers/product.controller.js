import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import imgs from "../utils/images.js";

const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const category = req.query.category || "";
  const brandName = req.query.brandName || "";
  const priceRange = req.query.priceRange || null;
  const priceSort = parseInt(req.query.priceSort || "1");
  const timeSort = parseInt(req.query.timeSort || "-1");
  // console.log(req.query);

  const pipeline = [
    {
      $sort: {
        _id: timeSort,
      },
    },
    {
      $match: {
        $and: [
          { category: { $regex: category, $options: "i" } },
          { brandName: { $regex: brandName, $options: "i" } },
          priceRange
            ? {
                price: {
                  $gte: Number(priceRange.split("-")[0]),
                  $lte: Number(priceRange.split("-")[1]),
                },
              }
            : {},
        ],
      },
    },
    {
      $sort: {
        price: priceSort,
      },
    },
  ];
  if (search) {
    pipeline.push({
      $match: {
        name: { $regex: search, $options: "i" },
      },
    });
  }
  try {
    const allProducts = await Product.aggregate(pipeline);
    const totalPages = Math.ceil(allProducts.length / 6);
    const pageList = Array.from({ length: totalPages }, (_, i) => i + 1);
    // const products = Product.aggregate([
    //   ...pipeline,
    //   { $skip: (page - 1) * 6 },
    //   { $limit: 6 },
    // ]);

    let products = [];

    for (let i = (page - 1) * 6; i < page * 6; i++) {
      if (allProducts[i]) {
        products.push(allProducts[i]);
      }
    }

    res.json({ pageList, products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

const productsQuery = asyncHandler(async (req, res) => {
  const uniqueCategories = await Product.distinct("category");
  const uniqueBrands = await Product.distinct("brandName");
  const priceRange = await Product.aggregate([
    {
      $group: {
        _id: null,
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      },
    },
  ]);
  res.json({ uniqueCategories, uniqueBrands, priceRange: priceRange[0] });
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
