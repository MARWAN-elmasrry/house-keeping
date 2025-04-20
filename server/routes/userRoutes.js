const express = require("express");

const userController = require("../controller/user.controll")

const router = express.Router();

router.post("/sign-u",userController.addUser)
router.post("/login-u",userController.getUser)
router.route("/u/:id")
    .put(userController.updateUser)
    .delete(userController.deteleUser)

module.exports = router;