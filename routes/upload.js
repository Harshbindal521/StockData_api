const express = require("express");
const multer = require("multer");
const { processCSV } = require("../controllers/stockController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary file storage

router.post("/", upload.single("file"), processCSV);

module.exports = router;
