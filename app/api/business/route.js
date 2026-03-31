import { auth } from "@clerk/nextjs/server";
import { createBusiness, getBusiness, updateBusiness, deleteBusiness } from "@/controllers/details";
import dbConnect from "@/lib/db";

// ─── POST — Create Business ───────────────────────────────────────
export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { supportName, supportEmail, supportDetails } = await req.json();

    const business = await createBusiness(userId, supportName, supportEmail, supportDetails);
    return Response.json({ success: true, business });

  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 400 });
  }
}

// ─── GET — Get Business ───────────────────────────────────────────
export async function GET(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const business = await getBusiness(userId);
    return Response.json({ success: true, business });

  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 400 });
  }
}

// ─── PUT — Update Business ────────────────────────────────────────
export async function PUT(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { supportName, supportEmail, supportDetails } = await req.json();

    const business = await updateBusiness(userId, supportName, supportEmail, supportDetails);
    return Response.json({ success: true, business });

  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 400 });
  }
}

// ─── DELETE — Delete Business ─────────────────────────────────────
export async function DELETE(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const business = await deleteBusiness(userId);
    return Response.json({ success: true, business });

  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 400 });
  }
}