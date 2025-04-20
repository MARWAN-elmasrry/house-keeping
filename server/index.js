const bodyParser = require('body-parser');
const express = require("express");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const connectDB = require("./config/db");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const sallerRoutes = require("./routes/sallerRoutes");
const serviceRoutes = require("./routes/seviceRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Connect to database
connectDB();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  }
});

// Make upload middleware available to routes
app.locals.upload = upload;

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api", userRoutes);
app.use("/api", sallerRoutes);
app.use("/api", serviceRoutes);
app.use("/api", chatRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}`);
});