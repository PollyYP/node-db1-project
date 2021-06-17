const router = require("express").Router();
const db = require("./accounts-model");
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId,
} = require("./accounts-middleware");

router.get("/", async (req, res, next) => {
  try {
    const allAccounts = await db.getAll();
    res.json(allAccounts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", checkAccountId, async (req, res) => {
  res.json(req.accountID);
});

router.post(
  "/",
  checkAccountNameUnique,
  checkAccountPayload,
  async (req, res, next) => {
    try {
      const data = await db.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.put("/:id", checkAccountId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedAccount = await db.updateById(id, req.body);
    res.status(200).json(updatedAccount);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", checkAccountId, async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleted = await db.deleteById(id);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  // eslint-disable-line
  // DO YOUR MAGIC
  res.status(500).json({
    message: "Something went wrong",
  });
});

module.exports = router;
