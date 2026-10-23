const express = require("express");
const Destination = require("../models/Destination");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;

        const destinations = await Destination.find(filter).sort({ createdAt: -1 });
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ message: "Destination not found" });
        res.json(destination);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json(destination);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!destination) return res.status(404).json({ message: "Destination not found" });
        res.json(destination);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if (!destination) return res.status(404).json({ message: "Destination not found" });
        res.json({ message: "Destination deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;