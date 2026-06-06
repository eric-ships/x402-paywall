import { NextRequest, NextResponse } from "next/server";
import { getArticleById } from "@/lib/articles";
import {
  buildPaymentRequirement,
  buildX402FlowTrace,
  mockTxHash,
  MOCK_PAYER_ADDRESS,
} from "@/lib/x402";

export async function POST(req: NextRequest) {
  try {
    const { articleId, paid } = await req.json();

    if (!articleId) {
      return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
    }

    const article = getArticleById(articleId);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Step 1: If not paid, return 402 with payment requirements
    if (!paid) {
      const paymentReq = buildPaymentRequirement(
        article.priceUsdc,
        article.authorAddress
      );
      return NextResponse.json(paymentReq, { status: 402 });
    }

    // Step 2: Payment was made — simulate verification + deliver content
    // In production: verify the X-PAYMENT header proof on Base mainnet

    const txHash = mockTxHash();
    const flowTrace = buildX402FlowTrace(
      article.id,
      article.priceUsdc,
      article.authorAddress,
      MOCK_PAYER_ADDRESS,
      txHash
    );

    // Emit a payment event (stored server-side for the payment feed)
    const paymentEvent = {
      id: txHash.slice(0, 10),
      articleId: article.id,
      articleTitle: article.title,
      amount: article.priceUsdc,
      txHash,
      payer: MOCK_PAYER_ADDRESS,
      payee: article.authorAddress,
      timestamp: new Date().toISOString(),
      source: "human" as const,
    };

    // In a real app: persist to DB; here we return it for the client to cache
    return NextResponse.json({
      success: true,
      content: article.content,
      txHash,
      flowTrace,
      paymentEvent,
    });
  } catch (err) {
    console.error("[unlock] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
