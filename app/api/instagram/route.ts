import { NextResponse } from "next/server";

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_API_URL = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,caption&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

export async function GET() {
  try {
    const response = await fetch(INSTAGRAM_API_URL);
    if (!response.ok) throw new Error("Failed to fetch Instagram posts");

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load Instagram feed" }, { status: 500 });
  }
}
