import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // ─── Clerk Auth ───────────────────────────────────────────────
        clerkId: {
            type: String,
            required: true,
            unique: true,
            index: true,  // Critical for webhook lookups
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

    },
    {
        timestamps: true,
    }
);

// ─── Model ────────────────────────────────────────────────────────
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;