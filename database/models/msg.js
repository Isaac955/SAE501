import mongoose, { Schema } from "mongoose";
import validator from "validator";

const msgSchema = new Schema(
    {
        lastname: {
            type: String,
            required: [true, "Veuillez mettre un nom de famille"],
        },
        firstname: {
            type: String,
            required: [true, "Veuillez mettre votre prénom"],
        },
        email: {
            type: String,
            validate: [validator.isEmail, "E-mail incorrect"],
            required: [true, "Veuillez mettre votre email"],
        },
        content: {
            type: String,
            required: [true, "Veuillez mettre un message"],
        },
        identity: {
            type: String,
            enum: ["nom_precise", "autre", "etudiant", "parent"],
            default: "nom_precise",
        },
    },
    {
        timestamps: { createdAt: "created_at" }, 
    }
);

export default mongoose.model("Message", msgSchema); // export du modèle

