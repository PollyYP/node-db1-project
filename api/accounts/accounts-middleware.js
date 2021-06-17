const db = require("./accounts-model");

exports.checkAccountPayload = (req, res, next) => {
  const name = req.body.name;
  const budget = req.body.budget;

  if (!name || !budget) {
    return res.status(400).json({ message: "name and budget are required" });
  }
  if (typeof name !== "string") {
    return res
      .status(400)
      .json({ message: "name of account must be a string" });
  }
  if (name.length < 3 || name.length > 100) {
    return res
      .status(400)
      .json({ message: "name of account must be between 3 and 100" });
  }
  if (typeof budget !== "number") {
    return res
      .status(400)
      .json({ message: "budget of account must be a number" });
  }
  if (budget < 0 || budget > 1000000) {
    return res
      .status(400)
      .json({ message: "budget of account is too large or too small" });
  }
  next();
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const allAccounts = await db.getAll();
    allAccounts.map((account) => {
      if (account.name === req.body.name) {
        res.status(400).json({
          message: "that name is taken",
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.checkAccountId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const accountID = await db.getById(id);
    if (!accountID) {
      res.status(404).json({
        message: "Account ID not found",
      });
    } else {
      req.accountID = accountID;
      next();
    }
  } catch (err) {
    next(err);
  }
};
