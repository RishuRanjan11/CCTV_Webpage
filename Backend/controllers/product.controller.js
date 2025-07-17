import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); //Find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean(); //Find all featured products

    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    res.json({ products: featuredProducts });
  } catch (error) {
    console.log("Error in getAllFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    console.log(req.body);
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    console.log(product);
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // this will get the id of the image
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log("Error in deleting image from cloudinary", error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If new image is sent and it's different from the old one
    if (image && image !== product.image) {
      // Delete old image from Cloudinary if it exists
      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (error) {
          console.log(
            "Failed to delete old image from Cloudinary:",
            error.message
          );
        }
      }

      // Upload new image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
      product.image = uploadedImage.secure_url;
    }

    // Update other fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in editProduct controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updateProduct = await product.save();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
