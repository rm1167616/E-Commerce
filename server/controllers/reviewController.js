const { Review, User, Product, sequelize } = require("../models/index");
const { Op } = require("sequelize");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review management
 */

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const {
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_order = "DESC",
    } = req.query;

    // Validate sort parameters
    const validSortFields = ["rating", "created_at"];
    const validSortOrders = ["ASC", "DESC"];

    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : "created_at";
    const sortDirection = validSortOrders.includes(sort_order.toUpperCase())
      ? sort_order.toUpperCase()
      : "DESC";

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Calculate pagination
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await Review.count({
      where: { product_id: productId },
    });

    // Get reviews for the product with pagination
    const reviews = await Review.findAll({
      where: { product_id: productId },
      order: [[sortField, sortDirection]],
      limit: limitNumber,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ["user_id", "name"],
        },
      ],
    });

    // Calculate average rating
    const avgRating = await Review.findOne({
      where: { product_id: productId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "average_rating"],
      ],
      raw: true,
    });

    // Calculate rating distribution
    const ratingDistribution = await Review.findAll({
      where: { product_id: productId },
      attributes: [
        "rating",
        [sequelize.fn("COUNT", sequelize.col("rating")), "count"],
      ],
      group: ["rating"],
      raw: true,
    });

    // Format rating distribution
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingDistribution.forEach((item) => {
      distribution[item.rating] = parseInt(item.count);
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
      meta: {
        average_rating: avgRating.average_rating
          ? parseFloat(avgRating.average_rating).toFixed(1)
          : "0.0",
        rating_distribution: distribution,
        total_reviews: totalCount,
      },
      pagination: {
        total_items: totalCount,
        total_pages: totalPages,
        current_page: pageNumber,
        items_per_page: limitNumber,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error getting product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product reviews",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get a review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ["user_id", "name"],
        },
        {
          model: Product,
          attributes: ["product_id", "name"],
        },
      ],
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error getting review by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get review",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        product_id,
        user_id,
      },
    });

    if (existingReview) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create the review
    const review = await Review.create(
      {
        product_id,
        user_id,
        rating,
        comment,
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the created review with user data
    const createdReview = await Review.findByPk(review.review_id, {
      include: [
        {
          model: User,
          attributes: ["user_id", "name"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: createdReview,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
const updateReview = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    // Check if review exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if the review belongs to the user
    if (review.user_id !== user_id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    // Update the review
    await Review.update(
      {
        rating: rating || review.rating,
        comment: comment !== undefined ? comment : review.comment,
      },
      {
        where: { review_id: reviewId },
        transaction,
      }
    );

    await transaction.commit();

    // Fetch the updated review with user data
    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ["user_id", "name"],
        },
        {
          model: Product,
          attributes: ["product_id", "name"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const reviewId = req.params.id;
    const user_id = req.user.id;
    const isAdmin =
      req.user.role === "admin" || req.user.role === "super_admin";

    // Check if review exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if the review belongs to the user or user is admin
    if (review.user_id !== user_id && !isAdmin) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    // Delete the review
    await Review.destroy({
      where: { review_id: reviewId },
      transaction,
    });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get all reviews by a user
 * @route   GET /api/reviews/user
 * @access  Private
 */
const getUserReviews = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await Review.count({
      where: { user_id },
    });

    // Get reviews by the user with pagination
    const reviews = await Review.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
      limit: limitNumber,
      offset: offset,
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "price"],
        },
      ],
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
      pagination: {
        total_items: totalCount,
        total_pages: totalPages,
        current_page: pageNumber,
        items_per_page: limitNumber,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error getting user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user reviews",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Check if user has reviewed a product
 * @route   GET /api/reviews/check/:productId
 * @access  Private
 */
const checkUserReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user_id = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        product_id: productId,
        user_id,
      },
    });

    res.status(200).json({
      success: true,
      has_reviewed: !!existingReview,
      review: existingReview || null,
    });
  } catch (error) {
    console.error("Error checking user review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check user review",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getProductReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  checkUserReview,
};
