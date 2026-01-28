const express = require("express");
const router = express.Router();
const {unexpectedRouteController} = require("../controllers/appControllers");


router.use( unexpectedRouteController);



module.exports = router;
