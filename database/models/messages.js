const messages = {
    type: "object",
    properties: {
        _id: {
            type: "string",
            pattern: "^[0-9a-fA-F]{24}$", 
        },
        lastname: {
            type: "string",
        },
        firstname: {
            type: "string",
        },
        email: {
            type: "string",
            format: "email", 
        },
        content: {
            type: "string",
        },
        identity: {
            type: "string",
            enum: ["nom_precise", "autre", "etudiant", "parent"],
        },
        created_at: {
            type: "string",
            format: "date-time", 
        },
    },
    required: ["lastname", "firstname", "email", "content"], 
};

export { messages };

export default {
    type: "object",
    properties: {
        count: {
            type: "integer",
        },
        total_pages: {
            type: "integer",
        },
        page: {
            type: "integer",
        },
        query_params: {
            type: "string",
        },
        data: {
            type: "array",
            items: messages,
        },
    },
};
