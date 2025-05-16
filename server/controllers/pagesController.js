const { AboutPage, AboutSection, Store } = require("../models");

const getStoreAboutPage = async (req, res) => {
  try {
    // Get store_id from the authenticated user
    const store = await Store.findOne({
      where: { user_id: req.user.id }
    });

    if (!store) {
      return res.status(404).json({ 
        success: false, 
        message: "Store not found for this user" 
      });
    }

    const aboutPage = await AboutPage.findOne({
      where: { store_id: store.id },
      include: [
        {
          model: AboutSection,
          as: "AboutSections",
        },
      ],
    });

    if (!aboutPage) {
      return res.status(404).json({
        success: false,
        message: "About page not found",
      });
    }

    res.json({
      success: true,
      data: aboutPage,
    });
  } catch (error) {
    console.error("Error fetching about page:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch about page",
    });
  }
};

const createAboutSection = async (req, res) => {
  try {
    // Get store_id from the authenticated user
    const store = await Store.findOne({
      where: { user_id: req.user.id }
    });

    if (!store) {
      return res.status(404).json({ 
        success: false, 
        message: "Store not found for this user" 
      });
    }

    // Get or create about page for the store
    let aboutPage = await AboutPage.findOne({
      where: { store_id: store.id },
    });

    if (!aboutPage) {
      aboutPage = await AboutPage.create({ store_id: store.id });
    }

    const { title, content } = req.body;
    const imagePath = req.file ? `/uploads/about/${req.file.filename}` : null;

    const section = await AboutSection.create({
      about_id: aboutPage.id,
      title,
      content,
      img: imagePath,
    });

    res.status(201).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Error creating about section:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create about section",
    });
  }
};

module.exports = {
  getStoreAboutPage,
  createAboutSection,
};
