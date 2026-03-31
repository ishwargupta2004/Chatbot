import Detail from "@/models/Detail";
import dbConnect from "@/lib/db";

// ─── Create Business ──────────────────────────────────────────────
export async function createBusiness(clerkId, supportName, supportEmail, supportDetails) {
  await dbConnect();

  // Ek user ka ek hi business — agar pehle se hai toh error do
  const existing = await Detail.findOne({ clerkId });
  if (existing) throw new Error("Business already exists. Please update instead.");

  const business = await Detail.create({
    clerkId,
    supportName,
    supportEmail,
    supportDetails,
  });

  return business;
}

// ─── Get Business of a User ───────────────────────────────────────
export async function getBusiness(clerkId) {
  await dbConnect();

  const business = await Detail.findOne({ clerkId });
  if (!business) throw new Error("Business not found.");

  return business;
}

// ─── Update Business ──────────────────────────────────────────────
export async function updateBusiness(clerkId, supportName, supportEmail, supportDetails) {
  await dbConnect();

  const business = await Detail.findOneAndUpdate(
    { clerkId },
    { supportName, supportEmail, supportDetails },
    { new: true }
  );

  if (!business) throw new Error("Business not found.");
  return business;
}

// ─── Delete Business ──────────────────────────────────────────────
export async function deleteBusiness(clerkId) {
  await dbConnect();

  const business = await Detail.findOneAndDelete({ clerkId });
  if (!business) throw new Error("Business not found.");

  return business;
}