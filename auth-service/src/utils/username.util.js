exports.generateUsername = (email) => {
  const base = email.split("@")[0];
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}_${random}`;
};
