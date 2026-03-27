const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await require("../services/otp.service")
      .verifyOTP(email, otp);

    res.json(result);
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await require("../services/auth.service").resendOTP(email);
    res.json(result);
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const result = await require("../services/auth.service")
      .login(identifier, password, req);

    res.json(result);
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};


exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await require("../services/auth.service")
      .refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};

exports.logoutDevice = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await require("../services/auth.service")
      .logoutDevice(refreshToken);
    res.json(result);
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await require("../services/auth.service")
      .logoutAll(userId);
    res.json(result);
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.sub;

    const result = await require("../services/auth.service")
      .deleteAccount(userId);

    res.json(result);
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};