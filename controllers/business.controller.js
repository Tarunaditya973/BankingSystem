const Business = require("../models/businessModel"); // Assuming you have a business model
const bcrypt = require("bcrypt");

exports.registerBusiness = async (req, res) => {
  try {
    const { username, password } = req.body;
    const business = new Business({
      username,
      password,
    });
    await business.save();
    res.status(201).json({
      message: "Business registered successfully",
      businessId: business._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
