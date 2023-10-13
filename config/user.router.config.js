const express = require("express");
const router = express.Router();

//import users controller
const users = require("../controllers/users.controller");
const middleware = require("../middlewares/secure.middleware")


router.post("/api/users", users.create);
router.get("/api/users/confirm/:email", users.confirm);
router.post("/api/users/login", users.login);
router.get("/api/users", users.list);
router.get("/api/users/:id", middleware.checkAuth, users.detail);
router.patch("/api/users/:id", middleware.checkAuth, users.update);
router.delete("/api/users/:id", middleware.checkAuth, users.delete);

router.get("/api/filter", users.filter);

router.get("/", (req, res) => {
    res.json({ message: "Hello World" })
})

module.exports = router;