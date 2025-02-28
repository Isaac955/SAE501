import express from "express";
import mongoose from "mongoose";
import querystring from "querystring";

import Message from "#models/messages.js";
import routeName from "#server/utils/name-route.middleware.js";


const router = express.Router();
const base = "messages";


router.get(`/${base}/:id([a-f0-9]{24})`, routeName("messages_api"), async (req, res) => {
    let listErrors = [];

    const ressource = await Message.findOne({ _id: req.params.id })
        .orFail()
        .catch(() => {
            res.status(404).json({
                errors: [...listErrors, "Élément non trouvé"],
            });
        });

    return res.status(200).json(ressource);
});
/**
 * @openapi
 * /messages:
 *   get:
 *     tags:
 *      - Messages
 *     summary: Get all messages
 *     responses:
 *       200:
 *         description: Returns all messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListMessages'
 *       400:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          example: 1
 *        description: Page's number
 *      - in: query
 *        name: per_page
 *        required: false
 *        schema:
 *          type: integer
 *          example: 7
 *        description: Number of items per page. Max 20
 *      - in: query
 *        name: id
 *        required: false
 *        schema:
 *          type: array
 *          items:
 *            type: string
 *            pattern: '([0-9a-f]{24})'
 *        description: List of messages' _id. **Invalid ids will be skipped.**
 */
// filepath: /c:/Users/taoem/Documents/SAE501/server/api-router/messages.js
router.post(`/${base}`, routeName("messages_api"), async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({
            errors: [
                ...Object.values(
                    error?.errors || [{ message: "Il y a eu un problème" }]
                ).map(val => val.message),
            ],
        });
    }
});

router.get(`/${base}/:id([a-f0-9]{24})`, routeName("message_api"), async (req, res) => {
    let listErrors = [];

    const ressource = await Message.findOne({ _id: req.params.id })
        .orFail()
        .catch(() => {
            res.status(404).json({
                errors: [...listErrors, "Élément non trouvé"],
            });
        });

    return res.status(200).json(ressource);
});

export default router;
