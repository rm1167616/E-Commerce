const {
  Product,
  Category,
  Store,
  ProductImage,
  ProductAttributeValue,
  ProductAttribute,
  AttributeOption,
  ProductOffer,
  Offer,
  sequelize,
  Review,
  UserProduct,
} = require("../models/index");
const { Op } = require("sequelize");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @desc    Get all products
 * @route   GET /api/admin/products
 * @access  Admin
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      store_id,
      category_id,
      search,
      min_price,
      max_price,
      min_stock,
      max_stock,
      sort_by = "name",
      sort_order = "ASC",
      page = 1,
      limit = 10,
    } = req.query;

    // Validate sort parameters
    const validSortFields = [
      "name",
      "price",
      "stock_quantity",
      "seen_number",
      "created_at",
    ];
    const validSortOrders = ["ASC", "DESC"];

    const sortField = validSortFields.includes(sort_by) ? sort_by : "name";
    const sortDirection = validSortOrders.includes(sort_order.toUpperCase())
      ? sort_order.toUpperCase()
      : "ASC";

    // Build where conditions
    const whereConditions = {};

    // Filter by store_id
    if (store_id) {
      whereConditions.store_id = store_id;
    }

    // Filter by category_id
    if (category_id) {
      whereConditions.category_id = category_id;
    }

    // Search by name
    if (search) {
      whereConditions.name = { [Op.like]: `%${search}%` };
    }

    // Filter by price range
    if (min_price !== undefined && !isNaN(min_price)) {
      whereConditions.price = {
        ...whereConditions.price,
        [Op.gte]: parseFloat(min_price),
      };
    }

    if (max_price !== undefined && !isNaN(max_price)) {
      whereConditions.price = {
        ...whereConditions.price,
        [Op.lte]: parseFloat(max_price),
      };
    }

    // Filter by stock range
    if (min_stock !== undefined && !isNaN(min_stock)) {
      whereConditions.stock_quantity = {
        ...whereConditions.stock_quantity,
        [Op.gte]: parseInt(min_stock),
      };
    }

    if (max_stock !== undefined && !isNaN(max_stock)) {
      whereConditions.stock_quantity = {
        ...whereConditions.stock_quantity,
        [Op.lte]: parseInt(max_stock),
      };
    }

    // Calculate pagination
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;
    باقة;
    // Get total count for pagination
    const totalCount = await Product.count({ where: whereConditions });

    // Get products with filters, sorting and pagination
    const products = await Product.findAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
      limit: limitNumber,
      offset: offset,
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductImage,
          attributes: ["id", "img_path", "is_main"],
          where: { status: "active" },
          required: false,
        },
        {
          model: ProductAttributeValue,
          include: [
            {
              model: ProductAttribute,
              attributes: ["attribute_id", "name"],
            },
            {
              model: AttributeOption,
              attributes: ["option_id", "value"],
            },
          ],
          required: false,
        },
        {
          model: ProductOffer,
          include: [
            {
              model: Offer,
              attributes: ["offer_id", "name", "discount_percentage"],
              where: {
                start_date: { [Op.lte]: new Date() },
                end_date: { [Op.gte]: new Date() },
              },
              required: false,
            },
          ],
          required: false,
        },
      ],
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      pagination: {
        total_items: totalCount,
        total_pages: totalPages,
        current_page: pageNumber,
        items_per_page: limitNumber,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
      },
      filters: {
        store_id: store_id || null,
        category_id: category_id || null,
        search: search || null,
        min_price: min_price || null,
        max_price: max_price || null,
        min_stock: min_stock || null,
        max_stock: max_stock || null,
      },
      sorting: {
        sort_by: sortField,
        sort_order: sortDirection,
      },
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get products by category ID
 * @route   GET /api/products/category/:categoryId
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const {
      search,
      min_price,
      max_price,
      sort_by = "name",
      sort_order = "ASC",
      page = 1,
      limit = 10,
    } = req.query;

    // Validate sort parameters
    const validSortFields = ["name", "price", "seen_number", "created_at"];
    const validSortOrders = ["ASC", "DESC"];

    const sortField = validSortFields.includes(sort_by) ? sort_by : "name";
    const sortDirection = validSortOrders.includes(sort_order.toUpperCase())
      ? sort_order.toUpperCase()
      : "ASC";

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Build where conditions
    const whereConditions = {
      category_id: categoryId,
    };

    // Search by name
    if (search) {
      whereConditions.name = { [Op.like]: `%${search}%` };
    }

    // Filter by price range
    if (min_price !== undefined && !isNaN(min_price)) {
      whereConditions.price = {
        ...whereConditions.price,
        [Op.gte]: parseFloat(min_price),
      };
    }

    if (max_price !== undefined && !isNaN(max_price)) {
      whereConditions.price = {
        ...whereConditions.price,
        [Op.lte]: parseFloat(max_price),
      };
    }

    // Calculate pagination
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await Product.count({ where: whereConditions });

    // Get products with filters, sorting and pagination
    const products = await Product.findAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
      limit: limitNumber,
      offset: offset,
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductImage,
          attributes: ["id", "img_path", "is_main"],
          where: { status: "active" },
          required: false,
        },
        {
          model: ProductOffer,
          include: [
            {
              model: Offer,
              attributes: ["offer_id", "name", "discount_percentage"],
              where: {
                start_date: { [Op.lte]: new Date() },
                end_date: { [Op.gte]: new Date() },
              },
              required: false,
            },
          ],
          required: false,
        },
      ],
    });

    // Increment seen_number for the category
    await Category.update(
      { seen_number: category.seen_number + 1 },
      { where: { category_id: categoryId } }
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      category: {
        id: category.category_id,
        name: category.name,
        description: category.description,
      },
      pagination: {
        total_items: totalCount,
        total_pages: totalPages,
        current_page: pageNumber,
        items_per_page: limitNumber,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
      },
      filters: {
        search: search || null,
        min_price: min_price || null,
        max_price: max_price || null,
      },
      sorting: {
        sort_by: sortField,
        sort_order: sortDirection,
      },
    });
  } catch (error) {
    console.error("Error getting products by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get products by category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product with all its related data
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          attributes: ["category_id", "name", "description"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductImage,
          attributes: ["id", "img_path", "is_main"],
          where: { status: "active" },
          required: false,
        },
        {
          model: ProductAttributeValue,
          include: [
            {
              model: ProductAttribute,
              attributes: ["attribute_id", "name"],
            },
            {
              model: AttributeOption,
              attributes: ["option_id", "value"],
            },
          ],
          required: false,
        },
        {
          model: ProductOffer,
          include: [
            {
              model: Offer,
              attributes: ["offer_id", "name", "discount_percentage"],
              where: {
                start_date: { [Op.lte]: new Date() },
                end_date: { [Op.gte]: new Date() },
              },
              required: false,
            },
          ],
          required: false,
        },
        {
          model: Review,
          attributes: ["review_id", "rating", "comment", "created_at"],
          required: false,
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment the seen_number for the product
    await Product.update(
      { seen_number: product.seen_number + 1 },
      { where: { product_id: productId } }
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error getting product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/admin/products
 * @access  Admin
 */
const createProduct = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      store_id,
      name,
      main_description,
      price,
      stock_quantity = 0,
      category_id,
      images = [],
      attributes = [],
    } = req.body;

    // Check if store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Check if category exists if provided
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Create the product
    const product = await Product.create(
      {
        store_id,
        name,
        main_description,
        price,
        stock_quantity,
        category_id,
        created_by: req.user.user_id,
      },
      { transaction }
    );

    // Add product images if provided
    if (images && images.length > 0) {
      const productImages = images.map((image, index) => ({
        product_id: product.product_id,
        img_path: image.img_path,
        is_main: image.is_main || index === 0, // First image is main by default if not specified
        status: "active",
      }));

      await ProductImage.bulkCreate(productImages, { transaction });
    }

    // Add product attributes if provided
    if (attributes && attributes.length > 0) {
      const attributeValues = [];

      for (const attr of attributes) {
        const { attribute_id, option_ids } = attr;

        // Validate attribute exists
        const attributeExists = await ProductAttribute.findByPk(attribute_id);
        if (!attributeExists) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `Attribute with ID ${attribute_id} not found`,
          });
        }

        // Add each option for this attribute
        if (option_ids && option_ids.length > 0) {
          for (const option_id of option_ids) {
            // Validate option exists
            const optionExists = await AttributeOption.findByPk(option_id);
            if (!optionExists) {
              await transaction.rollback();
              return res.status(404).json({
                success: false,
                message: `Option with ID ${option_id} not found`,
              });
            }

            attributeValues.push({
              product_id: product.product_id,
              attribute_id,
              option_id,
            });
          }
        }
      }

      if (attributeValues.length > 0) {
        await ProductAttributeValue.bulkCreate(attributeValues, {
          transaction,
        });
      }
    }

    await transaction.commit();

    // Fetch the created product with all its related data
    const createdProduct = await Product.findByPk(product.product_id, {
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductImage,
          attributes: ["id", "img_path", "is_main"],
          where: { status: "active" },
          required: false,
        },
        {
          model: ProductAttributeValue,
          include: [
            {
              model: ProductAttribute,
              attributes: ["attribute_id", "name"],
            },
            {
              model: AttributeOption,
              attributes: ["option_id", "value"],
            },
          ],
          required: false,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: createdProduct,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/admin/products/:id
 * @access  Admin
 */
const updateProduct = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const productId = req.params.id;
    const {
      store_id,
      name,
      main_description,
      price,
      stock_quantity,
      category_id,
      images,
      attributes,
    } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if store exists if provided
    if (store_id) {
      const store = await Store.findByPk(store_id);
      if (!store) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }
    }

    // Check if category exists if provided
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Update product
    await Product.update(
      {
        store_id: store_id || product.store_id,
        name: name || product.name,
        main_description:
          main_description !== undefined
            ? main_description
            : product.main_description,
        price: price || product.price,
        stock_quantity:
          stock_quantity !== undefined
            ? stock_quantity
            : product.stock_quantity,
        category_id:
          category_id !== undefined ? category_id : product.category_id,
      },
      {
        where: { product_id: productId },
        transaction,
      }
    );

    // Update product images if provided
    if (images && images.length > 0) {
      // Delete existing images
      await ProductImage.destroy({
        where: { product_id: productId },
        transaction,
      });

      // Add new images
      const productImages = images.map((image, index) => ({
        product_id: productId,
        img_path: image.img_path,
        is_main: image.is_main || index === 0, // First image is main by default if not specified
        status: "active",
      }));

      await ProductImage.bulkCreate(productImages, { transaction });
    }

    // Update product attributes if provided
    if (attributes && attributes.length > 0) {
      // Delete existing attribute values
      await ProductAttributeValue.destroy({
        where: { product_id: productId },
        transaction,
      });

      const attributeValues = [];

      for (const attr of attributes) {
        const { attribute_id, option_ids } = attr;

        // Validate attribute exists
        const attributeExists = await ProductAttribute.findByPk(attribute_id);
        if (!attributeExists) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `Attribute with ID ${attribute_id} not found`,
          });
        }

        // Add each option for this attribute
        if (option_ids && option_ids.length > 0) {
          for (const option_id of option_ids) {
            // Validate option exists
            const optionExists = await AttributeOption.findByPk(option_id);
            if (!optionExists) {
              await transaction.rollback();
              return res.status(404).json({
                success: false,
                message: `Option with ID ${option_id} not found`,
              });
            }

            attributeValues.push({
              product_id: productId,
              attribute_id,
              option_id,
            });
          }
        }
      }

      if (attributeValues.length > 0) {
        await ProductAttributeValue.bulkCreate(attributeValues, {
          transaction,
        });
      }
    }

    await transaction.commit();

    // Fetch the updated product with all its related data
    const updatedProduct = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductImage,
          attributes: ["id", "img_path", "is_main"],
          where: { status: "active" },
          required: false,
        },
        {
          model: ProductAttributeValue,
          include: [
            {
              model: ProductAttribute,
              attributes: ["attribute_id", "name"],
            },
            {
              model: AttributeOption,
              attributes: ["option_id", "value"],
            },
          ],
          required: false,
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/admin/products/:id
 * @access  Admin
 */
const deleteProduct = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete the product (this will cascade delete related records)
    await Product.destroy({
      where: { product_id: productId },
      transaction,
    });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get products with high seen_number as featured
    const products = await Product.findAll({
      order: [["seen_number", "DESC"]],
      limit: limit,
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductImage,
          attributes: ["id", "img_path", "is_main"],
          where: { status: "active" },
          required: false,
        },
        {
          model: ProductOffer,
          include: [
            {
              model: Offer,
              attributes: ["offer_id", "name", "discount_percentage"],
              where: {
                start_date: { [Op.lte]: new Date() },
                end_date: { [Op.gte]: new Date() },
              },
              required: false,
            },
          ],
          required: false,
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error getting featured products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get featured products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = async (req, res) => {
  try {
    const {
      query,
      category_id,
      min_price,
      max_price,
      sort_by = "name",
      sort_order = "ASC",
      page = 1,
      limit = 10,
    } = req.query;

    // Validate search query
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Validate sort parameters
    const validSortFields = ["name", "price", "seen_number", "created_at"];
    const validSortOrders = ["ASC", "DESC"];

    const sortField = validSortFields.includes(sort_by) ? sort_by : "name";
    const sortDirection = validSortOrders.includes(sort_order.toUpperCase())
      ? sort_order.toUpperCase()
      : "ASC";

    // Build where conditions
    const whereConditions = {
      name: { [Op.like]: `%${query}%` },
    };

    // Filter by category_id
    if (category_id) {
      whereConditions.category_id = category_id;
    }

    // Filter by price range
    if (min_price !== undefined && !isNaN(min_price)) {
      whereConditions.price = {
        ...whereConditions.price,
        [Op.gte]: parseFloat(min_price),
      };
    }

    if (max_price !== undefined && !isNaN(max_price)) {
      whereConditions.price = {
        ...whereConditions.price,
        [Op.lte]: parseFloat(max_price),
      };
    }

    // Calculate pagination
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await Product.count({ where: whereConditions });

    // Get products with filters, sorting and pagination
    const products = await Product.findAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
      limit: limitNumber,
      offset: offset,
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductImage,
          attributes: ["id", "img_path", "is_main"],
          where: { status: "active" },
          required: false,
        },
        {
          model: ProductOffer,
          include: [
            {
              model: Offer,
              attributes: ["offer_id", "name", "discount_percentage"],
              where: {
                start_date: { [Op.lte]: new Date() },
                end_date: { [Op.gte]: new Date() },
              },
              required: false,
            },
          ],
          required: false,
        },
      ],
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      pagination: {
        total_items: totalCount,
        total_pages: totalPages,
        current_page: pageNumber,
        items_per_page: limitNumber,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
      },
      filters: {
        query: query,
        category_id: category_id || null,
        min_price: min_price || null,
        max_price: max_price || null,
      },
      sorting: {
        sort_by: sortField,
        sort_order: sortDirection,
      },
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
};
