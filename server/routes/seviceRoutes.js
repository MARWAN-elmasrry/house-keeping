const express = require('express');

const serviceController = require("../controller/service.controll")

const router = express.Router();

router.post("/ser",serviceController.addService)
router.get("/ser",serviceController.getService)
router.get("/ser/:id", serviceController.getOneService); // Add this line
router.route("/ser/:id")
    .put(serviceController.updateService)
    .delete(serviceController.deleteService)

module.exports = router;