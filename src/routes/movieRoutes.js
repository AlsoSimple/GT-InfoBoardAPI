import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send({ message: "GET" });
});

router.post("/", (req, res) => {
    res.send({ message: "POST" });
});

router.put("/", (req, res) => {
    res.send({ message: "PUT" });
});

router.delete("/", (req, res) => {
    res.send({ message: "DELETE" });
});

export default router;