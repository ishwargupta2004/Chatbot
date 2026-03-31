import Detail from "@/models/Detail";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import dbConnect from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── POST — Chat ──────────────────────────────────────────────────
export async function POST(req) {
  await dbConnect();
  try {
    const { message, ownerId } = await req.json();

    if (!message) return NextResponse.json({ msg: "Message is required" }, { status: 400 });
    if (!ownerId) return NextResponse.json({ msg: "Owner ID is required" }, { status: 400 });

    // ek user = ek business — clerkId se seedha fetch
    const detail = await Detail.findOne({ clerkId: ownerId });
    if (!detail) return NextResponse.json({ msg: "Chatbot is not configured yet" }, { status: 400 });

    const knowledge = `
      Name: ${detail.supportName || "not provided"}
      Email: ${detail.supportEmail || "not provided"}
      Details: ${detail.supportDetails || "not provided"}
    `;

    const prompt = `You are a professional customer support assistant for this business.
Use only the information provided below to answer the customer's question.
Do NOT invent new prices, promises, or policies.
If the question cannot be answered from the information, reply exactly with: "PLEASE CONTACT SUPPORT."

-----------------------
BUSINESS INFORMATION
-----------------------
${knowledge}
-----------------------
CUSTOMER QUESTION: ${message}
-----------------------
ANSWER:`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const reply = chatCompletion.choices[0]?.message?.content || "PLEASE CONTACT SUPPORT.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}