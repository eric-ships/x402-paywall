import { NextRequest, NextResponse } from "next/server";
import { addCustomArticle, Article } from "@/lib/articles";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, priceUsdc, category, author } = body;

    if (!title || !content || !priceUsdc || !category || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (priceUsdc < 0.01 || priceUsdc > 5.0) {
      return NextResponse.json(
        { error: "Price must be between 0.01 and 5.00 USDC" },
        { status: 400 }
      );
    }

    const id = `custom-${Date.now()}`;
    const article: Article = {
      id,
      title,
      author,
      authorAddress:
        "0x" +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join(""),
      teaser: content.slice(0, 120) + (content.length > 120 ? "..." : ""),
      content,
      priceUsdc: parseFloat(priceUsdc),
      category,
      publishedAt: new Date().toISOString().split("T")[0],
      tags: [category.toLowerCase()],
    };

    addCustomArticle(article);

    return NextResponse.json({ success: true, article });
  } catch (err) {
    console.error("[publish] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
