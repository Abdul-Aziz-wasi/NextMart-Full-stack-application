import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await dbConnect()
        const {message,role}=await req.json()
        const prompt = `
You are an AI assistant for a food delivery app chat system.

You will receive:
- role: "user" or "delivery_boy"
- message: the latest message

Your task is to help both sides communicate clearly and politely.

Context:
This is a live chat between a customer and a delivery person.
The main goal is fast delivery, accurate location, and good service.

Rules:
1. Give clear and direct answers about order status, time, and location.
2. If a message is unclear, politely rephrase it.
3. Keep replies short, friendly, and professional.
4. Do NOT give unnecessary suggestions.
5. Do NOT generate rude, unsafe, or irrelevant content.

Current Input:
Role: ${role}
Message: ${message}

Reply as a helpful assistant:
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                 "contents": [
      {
        "parts": [
          {
            "text": prompt
          }
        ]
      }
    ]
            })
        })
        const data = await response.json()
        const replayText = data.candidates[0].content.parts[0].text || ""
        const suggestions =replayText.split(",").map((s:string)=>s.trim())
        return NextResponse.json(
            suggestions,{status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {error:"Failed to fetch AI suggestions"},{status:500}
        )
    }
}