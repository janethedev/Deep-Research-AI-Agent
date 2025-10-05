import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openRouterChat } from "../deep-research/services";
import { buildClarifyingQuestionsMessages } from "../deep-research/prompts";
import { parseWithSchema } from "../deep-research/utils";

const RequestSchema = z.object({
	topic: z.string().min(2).max(200),
});

const QuestionsSchema = z.object({
	questions: z.array(z.string().min(2)).min(2).max(4),
});

type QuestionsResult = z.infer<typeof QuestionsSchema>;


function tryParseJson(text: string): QuestionsResult | null {
	try {
		const parsed = JSON.parse(text);
		return QuestionsSchema.parse(parsed);
	} catch {
		return null;
	}
}

function fallbackExtract(text: string): QuestionsResult {
	const lines = text
		.split(/\r?\n/) 
		.map((l) => l.replace(/^[-*\d).\s]+/, "").trim())
		.filter(Boolean);
	const unique = Array.from(new Set(lines));
	const trimmed = unique.slice(0, 4);
	const atLeastTwo = trimmed.length >= 2 ? trimmed : trimmed.concat(["请补充你的研究范围。", "你期望的分析深度是什么？"]).slice(0, 4);
	return { questions: atLeastTwo };
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { topic } = RequestSchema.parse(body);

        const messages = buildClarifyingQuestionsMessages(topic);

		const completion = await openRouterChat({ messages, temperature: 0.2, max_tokens: 300 });
		// OpenRouter response shape: { choices: [{ message: { role, content } }] }
		const content = completion?.choices?.[0]?.message?.content ?? "";

		let result: QuestionsResult | null = null;
		result = tryParseJson(content);
		if (!result) {
			// Sometimes the model wraps JSON in markdown; try to extract code block
			const match = content.match(/```(?:json)?([\s\S]*?)```/i);
			if (match) {
				result = tryParseJson(match[1].trim());
			}
		}
		if (!result) {
			result = fallbackExtract(content);
		}

		// Final validation
		const validated = parseWithSchema<QuestionsResult>(QuestionsSchema, result);
		return NextResponse.json(validated, { status: 200 });
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ error: { message: msg } }, { status: 400 });
	}
}
