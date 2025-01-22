import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import querystring from "querystring";

import upload from "#server/uploader.js";

const router = express.Router();

router.get("/messages", (req, res) => {
    res.send("Get messages");
});


export default router;
