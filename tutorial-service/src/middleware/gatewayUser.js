export const attachUser = (req, res, next) => {
  req.user = {
    id: req.headers["x-user-id"],
    role: req.headers["x-user-role"],
    premium: req.headers["x-user-premium"]
  };

  next();
};