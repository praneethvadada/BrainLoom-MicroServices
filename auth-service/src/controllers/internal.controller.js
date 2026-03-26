const userRepo = require("../repositories/user.repository");

exports.getClaims = async (req, res) => {
  try {

    const { userId } = req.params;

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
