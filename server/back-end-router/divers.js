import express from "express";


const base = "divers";
const router = express.Router();



router.get(`/${base}`, async (req, res) => {
    res.render("pages/back-end/divers/divers.njk", {
        
    });
});

export default router;
