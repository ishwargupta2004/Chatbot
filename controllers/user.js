import User from "@/models/User";
import dbConnect from "@/lib/db";

// ─── Create User (Webhook: user.created) ─────────────────────────────────────
export async function createUser(data) {
  await dbConnect();

  // Duplicate check — agar already exist karta hai toh create mat karo
  const existingUser = await User.findOne({ clerkId: data.id });
  if (existingUser) return existingUser._id;

  const user = await User.create({
    clerkId: data.id,
    email: data.email_addresses?.[0]?.email_address ?? "",
    name:
      `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "Anonymous",
  });

  return user._id;
}

// ─── Update User (Webhook: user.updated) ─────────────────────────────────────
export async function updateUser(data) {
  await dbConnect();

  const user = await User.findOneAndUpdate(
    { clerkId: data.id },
    {
      email: data.email_addresses?.[0]?.email_address ?? "",
      name:
        `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "Anonymous",
    },
    { new: true }
  );

  return user?._id;
}

// ─── Delete User (Webhook: user.deleted) ─────────────────────────────────────
export async function deleteUser(data) {
  await dbConnect();

  await User.findOneAndDelete({ clerkId: data.id });
}