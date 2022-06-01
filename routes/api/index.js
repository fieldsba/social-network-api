const router = require("express").Router();
const userRoutes = require("./users");
const thoughtRoutes = require("./thoughts");

router.use("/thoughts", thoughtRoutes);
router.use("/users", userRoutes);

module.exports = router;