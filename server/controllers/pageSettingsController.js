const PageSettings = require("../models/PageSettings");
const Store = require("../models/Store");

const getPageSettings = async (req, res) => {
  try {
    // Get store_id from the authenticated user
    const store = await Store.findOne({
      where: { user_id: req.user.id }
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found for this user" });
    }

    let settings = await PageSettings.findOne({
      where: { store_id: store.id },
    });

    if (!settings) {
      // Create default settings if none exist
      settings = await PageSettings.create({ store_id: store.id });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error fetching page settings:", error);
    res.status(500).json({ message: "Failed to fetch page settings" });
  }
};

const updatePageSettings = async (req, res) => {
  try {
    // Get store_id from the authenticated user
    const store = await Store.findOne({
      where: { user_id: req.user.id }
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found for this user" });
    }

    const settings = req.body;

    const [, [updatedSettings]] = await PageSettings.upsert(
      {
        ...settings,
        store_id: store.id,
        id: 1,
      },
      { returning: true }
    );

    res.json(updatedSettings);
  } catch (error) {
    console.error("Error updating page settings:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    res.status(500).json({ message: "Failed to update page settings" });
  }
};

module.exports = {
  getPageSettings,
  updatePageSettings,
};
