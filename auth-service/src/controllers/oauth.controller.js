const oauthService = require("../services/oauth.service");

exports.google = async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await oauthService.googleLogin(idToken, req);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.github = async (req, res) => {
//   try {
//     const { accessToken } = req.body;

//     const result = await require("../services/oauth.service")
//       .githubLogin(accessToken, req);

//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// exports.github = async (req, res) => {
//   try {
//     const { code } = req.body;

//     const result = await require("../services/oauth.service")
//       .githubLogin(code, req);

//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



exports.github = async (req, res) => {
  try {
    console.log("===== GITHUB OAUTH START =====");

    const { code } = req.body;

    console.log("Received GitHub code:", code);

    const result = await require("../services/oauth.service")
      .githubLogin(code, req);

    console.log("GitHub OAuth success. Tokens issued:");
    console.log(result);

    console.log("===== GITHUB OAUTH END =====");

    res.json(result);

  } catch (error) {

    console.error("❌ GitHub OAuth failed");
    console.error(error.message);
    console.error(error.stack);

    res.status(400).json({ message: error.message });
  }
};


exports.linkedin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const result = await require("../services/oauth.service")
      .linkedinLogin(accessToken, req);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};