const {
  Offer,
  Store,
  Product,
  ProductOffer,
  sequelize,
} = require("../models/index");
const { Op } = require("sequelize");

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Offer management
 */

/**
 * @desc    Get all offers
 * @route   GET /api/admin/offers
 * @access  Admin
 */
const getAllOffers = async (req, res) => {
  try {
    const {
      store_id,
      search,
      min_discount,
      max_discount,
      active_only,
      sort_by = "name",
      sort_order = "ASC",
      page = 1,
      limit = 10,
    } = req.query;

    // Validate sort parameters
    const validSortFields = [
      "name",
      "discount_percentage",
      "start_date",
      "end_date",
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

    // Search by name
    if (search) {
      whereConditions.name = { [Op.like]: `%${search}%` };
    }

    // Filter by discount range
    if (min_discount !== undefined && !isNaN(min_discount)) {
      whereConditions.discount_percentage = {
        ...whereConditions.discount_percentage,
        [Op.gte]: parseFloat(min_discount),
      };
    }

    if (max_discount !== undefined && !isNaN(max_discount)) {
      whereConditions.discount_percentage = {
        ...whereConditions.discount_percentage,
        [Op.lte]: parseFloat(max_discount),
      };
    }

    // Filter active offers only
    if (active_only === "true") {
      const now = new Date();
      whereConditions.start_date = { [Op.lte]: now };
      whereConditions.end_date = { [Op.gte]: now };
    }

    // Calculate pagination
    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await Offer.count({ where: whereConditions });

    // Get offers with filters, sorting and pagination
    const offers = await Offer.findAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
      limit: limitNumber,
      offset: offset,
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductOffer,
          attributes: ["id"],
          required: false,
        },
      ],
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    // Count products for each offer
    const offersWithProductCount = await Promise.all(
      offers.map(async (offer) => {
        const productCount = await ProductOffer.count({
          where: { offer_id: offer.offer_id },
        });

        return {
          ...offer.toJSON(),
          product_count: productCount,
          ProductOffers: undefined, // Remove the ProductOffers array
        };
      })
    );

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offersWithProductCount,
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
        search: search || null,
        min_discount: min_discount || null,
        max_discount: max_discount || null,
        active_only: active_only === "true" || false,
      },
      sorting: {
        sort_by: sortField,
        sort_order: sortDirection,
      },
    });
  } catch (error) {
    console.error("Error getting offers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get offers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get offer by ID
 * @route   GET /api/offers/:id
 * @access  Public
 */
const getOfferById = async (req, res) => {
  try {
    const offerId = req.params.id;

    // Find the offer with all its related data
    const offer = await Offer.findByPk(offerId, {
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductOffer,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "price", "main_description"],
            },
          ],
        },
      ],
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Increment the seen_number for the offer
    await Offer.update(
      { seen_number: offer.seen_number + 1 },
      { where: { offer_id: offerId } }
    );

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    console.error("Error getting offer by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get offer",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get active offers
 * @route   GET /api/offers/active
 * @access  Public
 */
const getActiveOffers = async (req, res) => {
  try {
    const { store_id, limit = 10 } = req.query;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;

    // Build where conditions
    const whereConditions = {
      start_date: { [Op.lte]: new Date() },
      end_date: { [Op.gte]: new Date() },
    };

    // Filter by store_id if provided
    if (store_id) {
      whereConditions.store_id = store_id;
    }

    // Get active offers
    const offers = await Offer.findAll({
      where: whereConditions,
      order: [["discount_percentage", "DESC"]],
      limit: limitNumber,
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    console.error("Error getting active offers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get active offers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Create a new offer
 * @route   POST /api/admin/offers
 * @access  Admin
 */
const createOffer = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      store_id,
      name,
      description,
      discount_percentage,
      start_date,
      end_date,
      offer_img,
      product_ids = [],
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

    // Create the offer
    const offer = await Offer.create(
      {
        store_id,
        name,
        description,
        discount_percentage,
        start_date,
        end_date,
        offer_img,
        seen_number: 0,
      },
      { transaction }
    );

    // Add products to the offer if provided
    if (product_ids && product_ids.length > 0) {
      // Validate that all products exist and belong to the store
      const products = await Product.findAll({
        where: {
          product_id: { [Op.in]: product_ids },
          store_id,
        },
      });

      if (products.length !== product_ids.length) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message:
            "Some products do not exist or do not belong to the specified store",
        });
      }

      // Create product-offer relationships
      const productOffers = product_ids.map((productId) => ({
        product_id: productId,
        offer_id: offer.offer_id,
      }));

      await ProductOffer.bulkCreate(productOffers, { transaction });
    }

    await transaction.commit();

    // Fetch the created offer with all its related data
    const createdOffer = await Offer.findByPk(offer.offer_id, {
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductOffer,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name"],
            },
          ],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: createdOffer,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create offer",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update an offer
 * @route   PUT /api/admin/offers/:id
 * @access  Admin
 */
const updateOffer = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const offerId = req.params.id;
    const {
      store_id,
      name,
      description,
      discount_percentage,
      start_date,
      end_date,
      offer_img,
      product_ids,
    } = req.body;

    // Check if offer exists
    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Offer not found",
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

    // Update offer
    await Offer.update(
      {
        store_id: store_id || offer.store_id,
        name: name || offer.name,
        description:
          description !== undefined ? description : offer.description,
        discount_percentage:
          discount_percentage !== undefined
            ? discount_percentage
            : offer.discount_percentage,
        start_date: start_date || offer.start_date,
        end_date: end_date || offer.end_date,
        offer_img: offer_img !== undefined ? offer_img : offer.offer_img,
      },
      {
        where: { offer_id: offerId },
        transaction,
      }
    );

    // Update product-offer relationships if provided
    if (product_ids !== undefined) {
      // Delete existing product-offer relationships
      await ProductOffer.destroy({
        where: { offer_id: offerId },
        transaction,
      });

      // Add new product-offer relationships if product_ids is not empty
      if (product_ids && product_ids.length > 0) {
        // Validate that all products exist and belong to the store
        const products = await Product.findAll({
          where: {
            product_id: { [Op.in]: product_ids },
            store_id: store_id || offer.store_id,
          },
        });

        if (products.length !== product_ids.length) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message:
              "Some products do not exist or do not belong to the specified store",
          });
        }

        // Create product-offer relationships
        const productOffers = product_ids.map((productId) => ({
          product_id: productId,
          offer_id: offerId,
        }));

        await ProductOffer.bulkCreate(productOffers, { transaction });
      }
    }

    await transaction.commit();

    // Fetch the updated offer with all its related data
    const updatedOffer = await Offer.findByPk(offerId, {
      include: [
        {
          model: Store,
          attributes: ["store_id", "name"],
        },
        {
          model: ProductOffer,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      data: updatedOffer,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update offer",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Delete an offer
 * @route   DELETE /api/admin/offers/:id
 * @access  Admin
 */
const deleteOffer = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const offerId = req.params.id;

    // Check if offer exists
    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Delete the offer (this will cascade delete related records)
    await Offer.destroy({
      where: { offer_id: offerId },
      transaction,
    });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete offer",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Add products to an offer
 * @route   POST /api/admin/offers/:id/products
 * @access  Admin
 */
const addProductsToOffer = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const offerId = req.params.id;
    const { product_ids } = req.body;

    if (
      !product_ids ||
      !Array.isArray(product_ids) ||
      product_ids.length === 0
    ) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Product IDs array is required",
      });
    }

    // Check if offer exists
    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Validate that all products exist and belong to the store
    const products = await Product.findAll({
      where: {
        product_id: { [Op.in]: product_ids },
        store_id: offer.store_id,
      },
    });

    if (products.length !== product_ids.length) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message:
          "Some products do not exist or do not belong to the offer's store",
      });
    }

    // Get existing product-offer relationships
    const existingProductOffers = await ProductOffer.findAll({
      where: {
        offer_id: offerId,
        product_id: { [Op.in]: product_ids },
      },
      attributes: ["product_id"],
    });

    const existingProductIds = existingProductOffers.map((po) => po.product_id);

    // Filter out products that are already in the offer
    const newProductIds = product_ids.filter(
      (id) => !existingProductIds.includes(id)
    );

    if (newProductIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "All specified products are already in the offer",
      });
    }

    // Create new product-offer relationships
    const productOffers = newProductIds.map((productId) => ({
      product_id: productId,
      offer_id: offerId,
    }));

    await ProductOffer.bulkCreate(productOffers, { transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Products added to offer successfully",
      added_products: newProductIds,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding products to offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add products to offer",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Remove products from an offer
 * @route   DELETE /api/admin/offers/:id/products
 * @access  Admin
 */
const removeProductsFromOffer = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const offerId = req.params.id;
    const { product_ids } = req.body;

    if (
      !product_ids ||
      !Array.isArray(product_ids) ||
      product_ids.length === 0
    ) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Product IDs array is required",
      });
    }

    // Check if offer exists
    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Delete product-offer relationships
    const result = await ProductOffer.destroy({
      where: {
        offer_id: offerId,
        product_id: { [Op.in]: product_ids },
      },
      transaction,
    });

    if (result === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "No products found in the offer",
      });
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Products removed from offer successfully",
      removed_count: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error removing products from offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove products from offer",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get offers for a specific product
 * @route   GET /api/offers/product/:productId
 * @access  Public
 */
const getProductOffers = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { active_only = "true" } = req.query;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Build query to get offers for the product
    const includeOptions = [
      {
        model: Store,
        attributes: ["store_id", "name"],
      },
    ];

    // If active_only is true, filter for active offers only
    const whereConditions = {};
    if (active_only === "true") {
      const now = new Date();
      whereConditions.start_date = { [Op.lte]: now };
      whereConditions.end_date = { [Op.gte]: now };
    }

    // Get offers for the product
    const productOffers = await ProductOffer.findAll({
      where: { product_id: productId },
      include: [
        {
          model: Offer,
          where: whereConditions,
          include: includeOptions,
        },
      ],
    });

    // Extract offers from productOffers
    const offers = productOffers.map((po) => po.Offer);

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
      product_id: productId,
    });
  } catch (error) {
    console.error("Error getting product offers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product offers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllOffers,
  getOfferById,
  getActiveOffers,
  getProductOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  addProductsToOffer,
  removeProductsFromOffer,
};
