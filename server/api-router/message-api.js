import express from "express";
import mongoose from "mongoose";
import querystring from "querystring";

import Message from "#models/msg.js";

const router = express.Router();
const base = "messages";

/**
 * @openapi
 * /messages:
 *   post:
 *     tags:
 *      - Messages
 *     summary: Create a message
 *     requestBody:
 *      content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstname:
 *                type: string
 *                required: true
 *              lastname:
 *                type: string
 *                required: true
 *              content:
 *                type: string
 *                required: true
 *              email:
 *                type: string
 *                required: true
 *              identity:
 *                type: string
 *                enum: ["etudiant", "parent", "autre", "non_precise"]
 *                required: true
 *     responses:
 *       201:
 *         description: Creates a SAE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SAE'
 *       400:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(`/${base}`, async (req, res) => {
    console.log(req.body);
    const ressource = new Message(req.body);

    try {
        await ressource.save();
        res.status(201).json(ressource);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            errors: [
                ...Object.values(error?.errors).map((item) => item.message),
            ],
        });
    }
});

router.get(`/${base}`, async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    let perPage = Number(req.query.per_page) || 7;
    // Clamps the value between 1 and 20
    perPage = Math.min(Math.max(perPage, 1), 20);

    try {
        const listRessources = await Message.aggregate([
            { $skip: Math.max(page - 1, 0) * perPage },
            { $limit: perPage },
        ]);

        const count = await Message.countDocuments();

        const queryParam = { ...req.query };
        delete queryParam.page;

        res.status(200).json({
            data: listRessources,
            total_pages: Math.ceil(count / perPage),
            count,
            page,
            query_params: querystring.stringify(queryParam),
        });
    } catch (e) {
        res.status(400).json({
            errors: [
                ...Object.values(
                    e?.errors || [
                        { message: e?.message || "Il y a eu un problème" },
                    ]
                ).map((val) => val.message),
            ],
        });
    }
});

export default router;
