const express = require('express');
const sallerController = require("../controller/saller.controll");
const router = express.Router();

router.post("/sign-s",sallerController.addSaller);
router.post("/login-s",sallerController.getSaller);
router.route("/s/:id")
    .put(sallerController.updateSaller)
    .delete(sallerController.deteleSaller)

module.exports = router;