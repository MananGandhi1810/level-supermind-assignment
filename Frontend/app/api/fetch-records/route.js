import { NextResponse } from "next/server";

const ASTRA_ENDPOINT = process.env.ASTRA_ENDPOINT;
const ASTRA_DB_TOKEN = process.env.ASTRA_DB_TOKEN;

async function fetchRecords(collectionName) {
  try {
    const URL = `${ASTRA_ENDPOINT}/api/json/v1/default_keyspace/${collectionName}`;
    const HEADERS = {
      "Content-Type": "application/json",
      Origin: "",
      "X-Cassandra-Token": ASTRA_DB_TOKEN,
    };

    const requestBody = { find: {} };

    const response = await fetch(URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    var data = await response.json();
    if (collectionName == "sqlagent") {
      data.data.documents = data.data.documents.map((d) => ({
        ...d,
        taken_at: { $date: Date.parse(d.taken_at).valueOf() },
      }));
    }
    console.log(data.data.documents);
    return data.data || [];
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { username } = await request.json();

    const collectionName = username ? `user_${username}` : "sqlagent";

    const records = await fetchRecords(collectionName);
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
