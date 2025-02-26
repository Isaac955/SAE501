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
router.get(`/${base}`, routeName("messages_api"), async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    let perPage = Number(req.query.per_page) || 7;
    // Clamps the value between 1 and 20
    perPage = Math.min(Math.max(perPage, 1), 20);

    let listIds = req.query?.id;
    if (req.query.id && !Array.isArray(req.query.id)) {
        listIds = [listIds];
    }

    listIds = (listIds || [])
        .filter(mongoose.Types.ObjectId.isValid)
        .map(item => mongoose.Types.ObjectId.createFromHexString(item));

    try {
        const listRessources = await Message.aggregate([
            ...(listIds.length ? [{ $match: { _id: { $in: listIds } } }] : []),
            { $sort: { _id: -1 } },
            { $skip: Math.max(page - 1, 0) * perPage },
            { $limit: perPage },
        ]);

        const count = await Message.countDocuments(
            listIds.length ? { _id: { $in: listIds } } : null
        );

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
                    e?.errors || [{ message: e?.message || "Il y a eu un problème" }]
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
