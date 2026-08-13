const { User } = require("../models");

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "full_name",
        "email",
        "role",
        "is_online",
        "created_at"
      ]
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getMe
};
