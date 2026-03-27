const userRepo = require("../repositories/user.repository");
const adminRepo = require("../repositories/admin.repository");

exports.getClaims = async (req, res) => {
  try {

    const { userId } = req.params;

    if (userId.startsWith("admin_")) {
      const splitId = userId.replace("admin_", "");
      const admin = await adminRepo.findById(splitId);
      
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.json({
        id: `admin_${admin.id}`,
        role: "admin",
        is_premium: 0,
        email_verified: 1,
        is_deleted: 0,
        is_super: admin.is_super
      });
    }

    const user = await userRepo.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      id: user.id,
      role: user.role,
      is_premium: user.is_premium,
      email_verified: user.email_verified,
      is_deleted: user.is_deleted
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};


// const userRepo = require("../repositories/user.repository");

// exports.getClaims = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await userRepo.findById(userId);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({
//       id: user.id,
//       role: user.role,
//       is_premium: user.is_premium,
//       email_verified: user.email_verified,
//       is_deleted: user.is_deleted
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal error" });
//   }
// };
