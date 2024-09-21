
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function POST(req: Request) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
    if (!apiKey) throw new Error("Google API key is not set");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const body = await req.json();
    console.log("Received request body:", body);

    // Extract the question from the request body
    const { question } = body;
    console.log("Received question:", question);

    // Ensure the question is a string
    if (typeof question !== 'string') {
      throw new Error("Invalid question format. Expected a string.");
    }

    // Generate the answer
    const prompt : string = "You are a doctor, try to diagnose the patient based on the following symptoms: \n" + question + "ask follow up questions if needed. If you are able to come to a diagnosis, please provide a treatment plan.";
    const answer = await model.generateContent(prompt);

    const text = answer.response.text()

    console.log("Generated answer:", text);

    return NextResponse.json({
        success: true,
        data: text
      });

}