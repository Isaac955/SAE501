import path from "path";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";

// Doc : https://swagger.io/docs/specification/data-models/data-types/
// Doc : https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md

import ListMessages, { messages } from "./swagger-schemas/messages.js";
import packageJSON from "../package.json" with { "type": "json" };

const envFilePath = "env/.env.dev.local";

const envVars = dotenv.config({ path: envFilePath });
const port = envVars?.parsed?.PORT || 3900;

const options = {
    apis: [path.join(path.resolve(), "server/api-router/*.js")],
    swaggerDefinition: {
        openapi: "3.0.3",
        produces: ["application/json"],
        info: {
            title: "SAE 501",
            version: packageJSON.version,
            description: "List endpoints of SAE 501",
        },
        // externalDocs: {
        //     description: "Back to debug",
        //     url:  `http://localhost:${port}/debug`
        // },
        servers: [{ description: "Dev server", url: `http://localhost:${port}/api` }],
        components: {
            schemas: {
                ListMessages:ListMessages,
                Messages: messages,
                Error: {
                    type: "object",
                    properties: {
                        errors: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
    },
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
