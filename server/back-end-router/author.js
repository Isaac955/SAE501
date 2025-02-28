import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import querystring from "querystring";
import routeName from "#server/utils/name-route.middleware.js";

import upload from "#server/uploader.js";

const base = "author";
const router = express.Router();

// Get or create author
router.get(`/${base}`, routeName("author_list"), async (req, res) => {
    const queryParams = querystring.stringify(req.query);

    let options = {
        method: "GET",
        url: `${res.locals.base_url}/api/${base}?${queryParams}`,
    };
    let result = {};
    try {
        result = await axios(options);
    } catch (_error) {}

    res.render("pages/back-end/author/list.njk", {
        list_author: result.data,
    });
});

router
    .route([`/${base}/:id([a-f0-9]{24})`, `/${base}/add`])
    .get(routeName("author_form"), async (req, res) => {
        // Get or create author
        const isEdit = mongoose.Types.ObjectId.isValid(req.params.id);
        let result = {};
        let listErrors = [];

        if (isEdit) {
            const options = {
                method: "GET",
                url: `${res.locals.base_url}/api/${base}/${req.params.id}`,
            };
            try {
                result = await axios(options);
            } catch (error) {
                listErrors = error.response.data.errors;
            }
        }

        res.render("pages/back-end/author/add-edit.njk", {
            author: result?.data || {},
            list_errors: listErrors,
            is_edit: isEdit,
        });
    })
    .post(routeName("author_form"), upload.single("image"), async (req, res) => {
        // Create or update author
        let ressource = null;
        const isEdit = mongoose.Types.ObjectId.isValid(req.params.id);
        let listErrors = [];
        let options = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: {
                ...req.body,
                file: req.file,
            },
        };

        if (isEdit) {
            options = {
                ...options,
                method: "PUT",
                url: `${res.locals.base_url}/api/${base}/${req.params.id}`,
            };
        } else {
            options = {
                ...options,
                method: "POST",
                url: `${res.locals.base_url}/api/${base}`,
            };
        }

        try {
            const result = await axios(options);
            ressource = result.data;
        } catch (error) {
            listErrors = error.response.data.errors;
            ressource = error.response.data.ressource || {};
        } finally {
            if (!listErrors.length) {
                req.flash(
                    "success",
                    isEdit ? "Element mis à jour" : "Element crée"
                );
            }
            if (isEdit || listErrors.length) {
                res.render("pages/back-end/author/add-edit.njk", {
                    author: ressource,
                    list_errors: listErrors,
                    is_edit: isEdit,
                });
            } else {
                res.redirect(`${res.locals.admin_url}/${base}`);
            }
        }
    });

router.get('/auteurs', (req, res) => {
    res.render('pages/back-end/author/list.njk'); 
});   

export default router;