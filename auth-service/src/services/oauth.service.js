exports.googleLogin = async (idToken, req) => {

  try {

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const providerId = payload.sub;

    return await handleOAuthLogin(
      email,
      "google",
      providerId,
      payload.name,
      req
    );

  } catch (err) {

    console.error("Google verifyIdToken failed:", err);

    throw new Error("Google token verification failed");
  }
};
// const { OAuth2Client } = require("google-auth-library");
// const axios = require("axios");
// const { v4: uuid } = require("uuid");

// const userRepo = require("../repositories/user.repository");
// const oauthRepo = require("../repositories/oauth.repository");
// const tokenUtil = require("../utils/token.util");
// const sessionService = require("./session.service");

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// exports.googleLogin = async (idToken, req) => {

//   const ticket = await client.verifyIdToken({
//     idToken,
//     audience: process.env.GOOGLE_CLIENT_ID
//   });

//   const payload = ticket.getPayload();
//   const email = payload.email;
//   const providerId = payload.sub;

//   return await handleOAuthLogin(
//     email,
//     "google",
//     providerId,
//     payload.name,
//     req
//   );
// };


// // async function handleOAuthLogin(email, provider, providerId, name, req) {

// //   let user = await userRepo.findByEmail(email);

// //   // If user does NOT exist → create new OAuth user
// //   if (!user) {

// //     const newUser = {
// //       id: uuid(),
// //       email,
// //       username: email.split("@")[0] + "_" + Date.now(),
// //       password: null,
// //       name,
// //       country: null,
// //       preferred_language: null
// //     };

// //     await userRepo.createUser({
// //       ...newUser,
// //       auth_type: "oauth"
// //     });

// //     await oauthRepo.createOAuthAccount({
// //       id: uuid(),
// //       user_id: newUser.id,
// //       provider,
// //       provider_id: providerId
// //     });

// //     user = newUser;
// //   }

// //   else {

// //     if (user.auth_type === "local") {
// //       // Auto link
// //       await oauthRepo.createOAuthAccount({
// //         id: uuid(),
// //         user_id: user.id,
// //         provider,
// //         provider_id: providerId
// //       });
// //     }

// //     else {
// //       const existingProvider = await oauthRepo.findByProvider(provider, providerId);

// //       if (!existingProvider) {
// //         throw new Error("Account exists with another provider. Please login using original provider.");
// //       }
// //     }
// //   }

// //   const accessToken = tokenUtil.generateAccessToken(user.id);
// //   const refreshToken = tokenUtil.generateRefreshToken(user.id);

// //   await sessionService.createUserSession(user.id, refreshToken, req);

// //   return { accessToken, refreshToken };
// // }


// // exports.githubLogin = async (accessToken, req) => {

// //   // Get user info
// //   const userRes = await axios.get(
// //     "https://api.github.com/user",
// //     {
// //       headers: {
// //         Authorization: `Bearer ${accessToken}`
// //       }
// //     }
// //   );

// //   // Get primary email
// //   const emailRes = await axios.get(
// //     "https://api.github.com/user/emails",
// //     {
// //       headers: {
// //         Authorization: `Bearer ${accessToken}`
// //       }
// //     }
// //   );

// //   const primaryEmailObj = emailRes.data.find(e => e.primary);
// //   if (!primaryEmailObj) {
// //     throw new Error("No primary email found in GitHub account");
// //   }

// //   const email = primaryEmailObj.email;
// //   const providerId = userRes.data.id.toString();
// //   const name = userRes.data.name || userRes.data.login;

// //   return await handleOAuthLogin(
// //     email,
// //     "github",
// //     providerId,
// //     name,
// //     req
// //   );
// // };


// // async function handleOAuthLogin(email, provider, providerId, name, req) {

// //   let user = await userRepo.findByEmail(email);

// //   // User does not exist → create OAuth user
// //   if (!user) {

// //     const newUser = {
// //       id: uuid(),
// //       email,
// //       username: email.split("@")[0] + "_" + Date.now(),
// //       password: null,
// //       name,
// //       country: null,
// //       preferred_language: null
// //     };

// //     await userRepo.createUser({
// //       ...newUser,
// //       auth_type: "oauth"
// //     });

// //     await oauthRepo.createOAuthAccount({
// //       id: uuid(),
// //       user_id: newUser.id,
// //       provider,
// //       provider_id: providerId
// //     });

// //     user = newUser;
// //   }

// //   // User already exists
// //   else {

// //     const userProviders = await oauthRepo.findByUserId(user.id);

// //     // Case 1: Local account → auto link provider
// //     if (user.auth_type === "local") {

// //       const existingProvider = userProviders.find(
// //         p => p.provider === provider
// //       );

// //       if (!existingProvider) {
// //         await oauthRepo.createOAuthAccount({
// //           id: uuid(),
// //           user_id: user.id,
// //           provider,
// //           provider_id: providerId
// //         });
// //       }

// //     }

// //     // Case 2: OAuth account → ensure same provider
// //     else {

// //       const providerExists = userProviders.find(
// //         p => p.provider === provider
// //       );

// //       if (!providerExists) {
// //         throw new Error(
// //           "Account already exists with another provider. Please login using original provider."
// //         );
// //       }

// //     }
// //   }

// //   const accessToken = tokenUtil.generateAccessToken(user.id);
// //   const refreshToken = tokenUtil.generateRefreshToken(user.id);

// //   await sessionService.createUserSession(user.id, refreshToken, req);

// //   return { accessToken, refreshToken };
// // }



// async function handleOAuthLogin(email, provider, providerId, name, req) {

//   let user = await userRepo.findByEmail(email);

//   // Case 1: User does not exist
//   if (!user) {

//     const newUser = {
//       id: uuid(),
//       email,
//       username: email.split("@")[0] + "_" + Date.now(),
//       password: null,
//       name,
//       country: null,
//       preferred_language: null
//     };

//     await userRepo.createUser({
//       ...newUser,
//       auth_type: "oauth"
//     });

//     await oauthRepo.createOAuthAccount({
//       id: uuid(),
//       user_id: newUser.id,
//       provider,
//       provider_id: providerId
//     });

//     user = newUser;
//   }

//   // Case 2: User already exists
//   // else {

//   //   const userProviders = await oauthRepo.findByUserId(user.id);

//   //   // Local account
//   //   if (user.auth_type === "local") {

//   //     // Only Google allowed to link
//   //     if (provider !== "google") {
//   //       throw new Error(
//   //         "This account was created using email/password. Only Google login is supported for linking."
//   //       );
//   //     }

//   //     const alreadyLinked = userProviders.find(p => p.provider === "google");

//   //     if (!alreadyLinked) {
//   //       await oauthRepo.createOAuthAccount({
//   //         id: uuid(),
//   //         user_id: user.id,
//   //         provider,
//   //         provider_id: providerId
//   //       });
//   //     }

//   //   }

//   //   // OAuth account
//   //   else {

//   //     const existingProvider = userProviders[0]?.provider;

//   //     if (existingProvider !== provider) {
//   //       throw new Error(
//   //         `Account already exists with ${existingProvider}. Please login using ${existingProvider}.`
//   //       );
//   //     }

//   //   }
//   // }

//   else {

//   const userProviders = await oauthRepo.findByUserId(user.id);

//   // Case: account created with email/password
//   if (user.auth_type === "local") {

//     if (provider !== "google") {
//       throw new Error(
//         "This account was created with email/password. Only Google login is supported."
//       );
//     }

//     const alreadyLinked = userProviders.find(p => p.provider === "google");

//     if (alreadyLinked) {
//       throw new Error(
//         "Google login already linked. Please login using email/password."
//       );
//     }

//     await oauthRepo.createOAuthAccount({
//       id: uuid(),
//       user_id: user.id,
//       provider,
//       provider_id: providerId
//     });

//   }

//   // Case: account created with OAuth
//   else {

//     const existingProvider = userProviders[0]?.provider;

//     if (existingProvider === provider) {
//       throw new Error(
//         `Account already registered with ${provider}. Please use the original login method.`
//       );
//     }

//     throw new Error(
//       `Account already exists with ${existingProvider}. Please login using ${existingProvider}.`
//     );

//   }
// }

//   const accessToken = tokenUtil.generateAccessToken(user.id);
//   const refreshToken = tokenUtil.generateRefreshToken(user.id);

//   await sessionService.createUserSession(user.id, refreshToken, req);

//   return { accessToken, refreshToken };
// }


// exports.githubLogin = async (code, req) => {

//   // 1️⃣ Exchange code for access token
//   // const tokenRes = await axios.post(
//   //   "https://github.com/login/oauth/access_token",
//   //   {
//   //     client_id: process.env.GITHUB_CLIENT_ID,
//   //     client_secret: process.env.GITHUB_CLIENT_SECRET,
//   //     code
//   //   },
//   //   {
//   //     headers: {
//   //       Accept: "application/json"
//   //     }
//   //   }
//   // );

//   const params = new URLSearchParams();
// params.append("client_id", process.env.GITHUB_CLIENT_ID);
// params.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
// params.append("code", code);

//   const tokenRes = await axios.post(
//   "https://github.com/login/oauth/access_token",
//   params,
//   {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/x-www-form-urlencoded"
//     }
//   }
// );

//   const accessToken = tokenRes.data.access_token;

//   if (!accessToken) {
//     throw new Error("Failed to get GitHub access token");
//   }

//   // 2️⃣ Fetch user profile
//   const userRes = await axios.get(
//     "https://api.github.com/user",
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     }
//   );

//   // 3️⃣ Fetch primary email
//   const emailRes = await axios.get(
//     "https://api.github.com/user/emails",
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     }
//   );

//   const primaryEmail = emailRes.data.find(e => e.primary);

//   if (!primaryEmail) {
//     throw new Error("No primary email found in GitHub account");
//   }

//   const email = primaryEmail.email;
//   const providerId = userRes.data.id.toString();
//   const name = userRes.data.name || userRes.data.login;

//   return await handleOAuthLogin(
//     email,
//     "github",
//     providerId,
//     name,
//     req
//   );
// };

// exports.linkedinLogin = async (accessToken, req) => {

//   const resProfile = await axios.get(
//     "https://api.linkedin.com/v2/userinfo",
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     }
//   );

//   const email = resProfile.data.email;
//   const providerId = resProfile.data.sub;
//   const name = resProfile.data.name;

//   return await handleOAuthLogin(
//     email,
//     "linkedin",
//     providerId,
//     name,
//     req
//   );
// };


// // const { OAuth2Client } = require("google-auth-library");
// // const { v4: uuid } = require("uuid");

// // const userRepo = require("../repositories/user.repository");
// // const oauthRepo = require("../repositories/oauth.repository");

// // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // exports.googleLogin = async (idToken) => {
// //   const ticket = await client.verifyIdToken({
// //     idToken,
// //     audience: process.env.GOOGLE_CLIENT_ID,
// //   });

// //   const payload = ticket.getPayload();
// //   const email = payload.email;

// //   let user = await userRepo.findByEmail(email);

// //   if (!user) {
// //     const newUser = {
// //       id: uuid(),
// //       email,
// //       username: email.split("@")[0] + "_" + Date.now(),
// //       name: payload.name,
// //       password: null
// //     };

// //     await userRepo.createOAuthUser(newUser);
// //     user = newUser;
// //   }

// //   return user;
// // };
