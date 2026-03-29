import mongoose from "mongoose";

const detailSchema = new mongoose.Schema(
    {
        // ─── Clerk Auth ───────────────────────────────────────────────
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        details: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true,
    }
);

const Detail = mongoose.models.Detail || mongoose.model("Detail", detailSchema);

export default Detail;
