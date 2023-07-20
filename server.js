require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");
const { log } = require("console");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

// Log activities
app.use(logger);

// Allow other parties to access our APIs
app.use(cors(corsOptions));

// Process json files
app.use(express.json());

// Parse Cookies
app.use(cookieParser());

// Set the pathway to access static page
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

// Handle all routes not found
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

// Handle error at the very end
app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

mongoose.connection.on("err", (err) => {
    console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
    );
});
