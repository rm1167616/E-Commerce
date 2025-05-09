const { Category, Store } = require("../models/index");
const { Op } = require("sequelize");

/**
 * @desc    Get all categories
 * @route   GET /api/admin/categories
 * @access  Admin
 */
const getAllCategories = async (req, res) => {
  try {
    const {
      store_id,
      search,
      sort_by = "name",
      sort_order = "ASC",
      page = 1,
      limit = 10,
      min_seen = null,
      max_seen = null,
      created_after = null,
      created_before = null,
    } = req.query;

    // Validate sort parameters
    const validSortFields = [
      "name",
      "seen_number",
      "category_id",
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

    // Search by name
    if (search) {
      whereConditions.name = { [Op.like]: `%${search}%` };
    }

    // Filter by seen_number range
    if (min_seen !== null && !isNaN(min_seen)) {
      whereConditions.seen_number = {
        ...whereConditions.seen_number,
        [Op.gte]: parseInt(min_seen),
      };
    }

    if (max_seen !== null && !isNaN(max_seen)) {
      whereConditions.seen_number = {
        ...whereConditions.seen_number,
        [Op.lte]: parseInt(max_seen),
      };
    }

    // Filter by creation date range
    if (created_after) {
      const afterDate = new Date(created_after);
      if (!isNaN(afterDate.getTime())) {
        whereConditions.created_at = {
          ...whereConditions.created_at,
          [Op.gte]: afterDate,
        };
      }
    }

    if (created_before) {
      const beforeDate = new Date(created_before);
      if (!isNaN(beforeDate.getTime())) {
        whereConditions.created_at = {
          ...whereConditions.created_at,
          [Op.lte]: beforeDate,
        };
      }
    }

    // Calculate pagination
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await Category.count({ where: whereConditions });

    // Get categories with filters, sorting and pagination
    const categories = await Category.findAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
      limit: limitNumber,
      offset: offset,
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get categories",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get a single category by ID
 * @route   GET /api/admin/categories/:id
 * @access  Admin
 */
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findByPk(categoryId, {
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/admin/categories
 * @access  Admin
 */
const createCategory = async (req, res) => {
  try {
    const { store_id, name, description, img_path } = req.body;

    // Validate required fields
    if (!store_id || !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide store_id and name",
      });
    }

    // Check if store exists
    const storeExists = await Store.findByPk(store_id);
    if (!storeExists) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Create the category
    const newCategory = await Category.create({
      store_id,
      name,
      description,
      img_path,
      seen_number: 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/admin/categories/:id
 * @access  Admin
 */
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { store_id, name, description, img_path } = req.body;

    // Find the category
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if store exists if store_id is provided
    if (store_id) {
      const storeExists = await Store.findByPk(store_id);
      if (!storeExists) {
        return res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }
    }

    // Update the category
    await category.update({
      store_id: store_id || category.store_id,
      name: name || category.name,
      description:
        description !== undefined ? description : category.description,
      img_path: img_path !== undefined ? img_path : category.img_path,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/admin/categories/:id
 * @access  Admin
 */
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete the category
    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
