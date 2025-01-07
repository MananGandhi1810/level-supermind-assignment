import { NextResponse } from "next/server";

export async function POST(request) {
  const url = process.env.LANGFLOW_API_URL;
  const token = process.env.LANGFLOW_AUTH_TOKEN;

  try {
    const { input_value } = await request.json();

    if (!input_value) {
      return NextResponse.json(
        { error: "Input value is required." },
        { status: 400 }
      );
    }

    const body = {
      input_value,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "Prompt-dEcXZ": {},
        "AstraDBToolComponent-6lYlE": {
          "collection_name": "neurotechh",
          "token": process.env.ASTRA_AUTH_TOKEN
        },
        "ChatOutput-rTz8f": {},
        "ChatInput-XHqvG": {},
        "ParseData-FRQuY": {},
        "GoogleGenerativeAIModel-xQxiD": {},
        "Agent-BrM99": {},
        "CalculatorTool-459TW": {},
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    const data = await response.json();
    console.log(data.outputs[0].outputs[0].results.message.text);
    return NextResponse.json({
      output: data.outputs[0].outputs[0].results.message.text,
    });
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { error: "Failed to process the request. Please try again." },
      { status: 500 }
    );
  }
}