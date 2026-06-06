import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAllArticles, getArticleById, Article } from "@/lib/articles";
import {
  buildX402FlowTrace,
  mockTxHash,
  MOCK_PAYER_ADDRESS,
  usdcToRaw,
} from "@/lib/x402";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type StreamEvent =
  | { type: "thinking"; text: string }
  | { type: "text"; text: string }
  | {
      type: "payment";
      articleId: string;
      articleTitle: string;
      amount: number;
      txHash: string;
      flowTrace: ReturnType<typeof buildX402FlowTrace>;
    }
  | { type: "error"; message: string }
  | { type: "done" };

function encode(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: NextRequest) {
  const { topic } = await req.json().catch(() => ({ topic: "AI trends" }));

  const encoder = new TextEncoder();
  let controllerClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => {
        if (!controllerClosed) {
          controller.enqueue(encoder.encode(encode(event)));
        }
      };

      try {
        const articles = getAllArticles();
        const articleList = articles
          .map(
            (a) =>
              `ID: ${a.id} | Title: "${a.title}" | Category: ${a.category} | Price: $${a.priceUsdc} USDC | Tags: ${a.tags.join(", ")}`
          )
          .join("\n");

        // Tool definitions for the agent
        const tools: Anthropic.Tool[] = [
          {
            name: "browse_articles",
            description:
              "List all available articles on the platform with their titles, categories, prices, and tags. Use this first to discover what content is available.",
            input_schema: {
              type: "object" as const,
              properties: {},
              required: [],
            },
          },
          {
            name: "unlock_article",
            description:
              "Pay to unlock and read the full content of an article. This initiates an x402 payment flow: sends a GET request that returns 402, constructs a USDC payment proof, and retries to receive the full content.",
            input_schema: {
              type: "object" as const,
              properties: {
                article_id: {
                  type: "string",
                  description: "The article ID to unlock",
                },
                reason: {
                  type: "string",
                  description:
                    "Why this article is relevant to the research topic",
                },
              },
              required: ["article_id", "reason"],
            },
          },
          {
            name: "write_report",
            description:
              "After reading relevant articles, synthesize a research report. Call this once you have gathered enough information.",
            input_schema: {
              type: "object" as const,
              properties: {
                report: {
                  type: "string",
                  description:
                    "The full research report in markdown format with citations to the articles read",
                },
              },
              required: ["report"],
            },
          },
        ];

        const messages: Anthropic.MessageParam[] = [
          {
            role: "user",
            content: `You are a research agent with a funded Base Account (address: ${MOCK_PAYER_ADDRESS}). You can autonomously pay for premium content using the x402 protocol.

Your research task: **${topic}**

Available articles on the platform:
${articleList}

Instructions:
1. Use browse_articles to confirm what's available
2. Select the most relevant articles for the topic (aim for 3-5)
3. Use unlock_article to pay for and read each relevant article (the x402 payment will be processed automatically)
4. After reading, use write_report to synthesize a comprehensive research report

Be selective—only pay for articles that are genuinely relevant to the research topic. The platform charges real USDC per article.`,
          },
        ];

        // Agentic loop
        let iterations = 0;
        const maxIterations = 10;
        const unlockedArticles: { article: Article; content: string }[] = [];

        while (iterations < maxIterations) {
          iterations++;

          const response = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 4096,
            tools,
            messages,
          });

          // Stream any text blocks
          for (const block of response.content) {
            if (block.type === "text" && block.text) {
              send({ type: "thinking", text: block.text });
            }
          }

          // Check stop reason
          if (
            response.stop_reason === "end_turn" ||
            response.stop_reason !== "tool_use"
          ) {
            break;
          }

          // Process tool calls
          const toolResults: Anthropic.ToolResultBlockParam[] = [];

          for (const block of response.content) {
            if (block.type !== "tool_use") continue;

            if (block.name === "browse_articles") {
              send({
                type: "thinking",
                text: `Browsing available articles on the platform...`,
              });
              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: articleList,
              });
            } else if (block.name === "unlock_article") {
              const input = block.input as {
                article_id: string;
                reason: string;
              };
              const article = getArticleById(input.article_id);

              if (!article) {
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: block.id,
                  content: `Error: Article ${input.article_id} not found`,
                  is_error: true,
                });
                continue;
              }

              // Simulate x402 flow
              const txHash = mockTxHash();
              const flowTrace = buildX402FlowTrace(
                article.id,
                article.priceUsdc,
                article.authorAddress,
                MOCK_PAYER_ADDRESS,
                txHash
              );

              send({
                type: "payment",
                articleId: article.id,
                articleTitle: article.title,
                amount: article.priceUsdc,
                txHash,
                flowTrace,
              });

              unlockedArticles.push({ article, content: article.content });

              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: `Successfully unlocked "${article.title}" via x402 payment of ${article.priceUsdc} USDC (txHash: ${txHash}).\n\nFull content:\n${article.content}`,
              });
            } else if (block.name === "write_report") {
              const input = block.input as { report: string };
              send({ type: "text", text: input.report });
              send({ type: "done" });
              controllerClosed = true;
              controller.close();
              return;
            }
          }

          // Add assistant turn + tool results
          messages.push({ role: "assistant", content: response.content });
          messages.push({
            role: "user",
            content: toolResults,
          });
        }

        // If we exit the loop without write_report being called
        if (!controllerClosed) {
          send({ type: "done" });
          controller.close();
          controllerClosed = true;
        }
      } catch (err) {
        console.error("[agent] error:", err);
        const message =
          err instanceof Error ? err.message : "Agent encountered an error";
        if (!controllerClosed) {
          controller.enqueue(
            encoder.encode(encode({ type: "error", message }))
          );
          controller.close();
          controllerClosed = true;
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
