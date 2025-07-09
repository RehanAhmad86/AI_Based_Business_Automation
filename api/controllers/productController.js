import { Product } from "../models/productModel.js"

// Get all products with name, category, and basePrice
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query
    const query = {}

    if (category) query.category = category
    if (search) query.name = { $regex: search, $options: "i" }

    const products = await Product.find(query).select("name category basePrice")
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" })
  }
}

// Get all unique categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category")
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" })
  }
}

// Get single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id).select("name category basePrice")

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" })
  }
}
