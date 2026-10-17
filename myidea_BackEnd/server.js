const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

let connecting = null;

async function connectDB() {
    if (mongoose.connection.readyState === 1) return;

    if (!connecting) {
        connecting = mongoose
            .connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 8000,
            })
            .finally(() => {
                connecting = null;
            });
    }

    await connecting;
}

connectDB()
    .then(() => console.log("MongoDB connected"))
    .catch((err) =>
        console.error("MongoDB connection error:", err.message)
    );

app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

app.get("/health", async (req, res) => {
    try {
        await connectDB();

        res.json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(503).json({
            status: "error",
            database: "disconnected",
            error: err.message,
        });
    }
});

app.use("/api", async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({
            message: "Database connection failed",
        });
    }
});

const userRoutes = require("./routes/Users");
const destinationRoutes = require("./routes/destinations");

app.use("/api/Users", userRoutes);
app.use("/api/destinations", destinationRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            message: "The request body is not valid JSON",
        });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: `Invalid value for ${err.path}: ${err.value}`,
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            message: "That value already exists",
            fields: err.keyValue,
        });
    }

    console.error(err);

    res.status(500).json({
        message: "Something went wrong",
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
