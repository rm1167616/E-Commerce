const { Category, Store } = require("../models/index");
const { Op } = require("sequelize");

/**
 * @desc    Get all categories
 * @route   GET /api/admin/categories
 * @access  Admin
 */
const getAllCategories = async (req, res) => {
  try {
    // Get store from auth user
    const store = await getStoreFromAuth(req.user.user_id);

    const {
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
    const whereConditions = {
      store_id: store.store_id // Only get categories for this store
    };

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

// Helper function to get store from auth user
const getStoreFromAuth = async (user_id) => {
  const store = await Store.findOne({
    where: { created_by: user_id }
  });

  if (!store) {
    throw new Error("Store not found for this user");
  }

  return store;
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
const createCategory = async (req, res) => {
  try {
    // Get store from auth user
    const store = await getStoreFromAuth(req.user.user_id);

    const { name, description, parent_id } = req.body;

    // Check if parent category exists and belongs to the store
    if (parent_id) {
      const parentCategory = await Category.findOne({
        where: {
          category_id: parent_id,
          store_id: store.store_id,
        },
      });

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found in your store",
        });
      }
    }

    const category = await Category.create({
      store_id: store.store_id,
      name,
      description,
      parent_id,
      created_by: req.user.user_id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
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
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, parent_id } = req.body;

    // Get store from auth user
    const store = await getStoreFromAuth(req.user.user_id);

    // Check if category exists and belongs to the store
    const category = await Category.findOne({
      where: {
        category_id: categoryId,
        store_id: store.store_id,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found in your store",
      });
    }

    // Check if parent category exists and belongs to the store
    if (parent_id) {
      const parentCategory = await Category.findOne({
        where: {
          category_id: parent_id,
          store_id: store.store_id,
        },
      });

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found in your store",
        });
      }

      // Prevent circular reference
      if (parent_id === categoryId) {
        return res.status(400).json({
          success: false,
          message: "A category cannot be its own parent",
        });
      }
    }

    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      parent_id: parent_id !== undefined ? parent_id : category.parent_id,
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

/**
 * @desc    Get store categories
 * @route   GET /api/categories/store
 * @access  Private
 */
const getStoreCategories = async (req, res) => {
  try {
    // Get store from auth user
    const store = await getStoreFromAuth(req.user.user_id);

    const { search, parent_id, page = 1, limit = 10 } = req.query;

    // Build where conditions
    const whereConditions = {
      store_id: store.store_id,
    };

    // Search by name
    if (search) {
      whereConditions.name = { [Op.like]: `%${search}%` };
    }

    // Filter by parent
    if (parent_id !== undefined) {
      whereConditions.parent_id = parent_id;
    }

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await Category.count({ where: whereConditions });

    // Get categories
    const categories = await Category.findAll({
      where: whereConditions,
      order: [["name", "ASC"]],
      limit: limitNumber,
      offset,
      include: [
        {
          model: Category,
          as: "parent",
          attributes: ["category_id", "name"],
        },
      ],
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: categories.length,
      total_count: totalCount,
      total_pages: totalPages,
      current_page: pageNumber,
      has_next_page: hasNextPage,
      has_prev_page: hasPrevPage,
      data: categories,
    });
  } catch (error) {
    console.error("Error getting store categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get store categories",
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
  getStoreCategories,
};
