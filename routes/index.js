const controllers = require("../controllers")
const express = require("express");
const router = express.Router()

router.get("/video/:id",controllers.videoController)

router.get("/audio/:id", controllers.audioController)

router.get("/endpoint", controllers.barTestController)

router.get("/cron",controllers.cron)

module.exports = router