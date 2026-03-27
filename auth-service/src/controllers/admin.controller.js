exports.register = async (req, res) => {
  try {
    const result = await require("../services/admin.service").register(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Admin Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await require("../services/admin.service").login(email, password, req);
    res.json(result);
  } catch (error) {
    console.error("Admin Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};
