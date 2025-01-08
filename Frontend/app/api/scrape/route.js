import { NextResponse } from "next/server";

export async function POST(request) {
  const backendUrl = process.env.BACKEND_API_URL;

  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    const transformedUsername = username.replace(/\./g, "_d_o_t_");

    const apiUrl = `${backendUrl}/scrape?username=${encodeURIComponent(
      transformedUsername
    )}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Backend API Error: ${error}`);
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in scrape API handler:", error);
    return NextResponse.json(
      { error: "Failed to process the request. Please try again." },
      { status: 500 }
    );
  }
}
