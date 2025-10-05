import Exa from "exa-js";
import { OPENROUTER_BASE_URL, DEFAULT_MODEL, RETRY_COUNT, RETRY_DELAY_MS } from "./constants";
import { withRetry } from "./utils";
import { handleApiError } from "@/lib/api-error";

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required env: ${name}`);
	}
	return value;
}

function joinUrl(base: string, path: string): string {
	const b = base.endsWith("/") ? base.slice(0, -1) : base;
	const p = path.startsWith("/") ? path : `/${path}`;
	return `${b}${p}`;
}

// OpenRouter REST call
export type ChatCompletionParams = {
	model?: string;
	messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
	temperature?: number;
	max_tokens?: number;
};

export async function openRouterChat(params: ChatCompletionParams) {
	const apiKey = requireEnv("OPENROUTER_API_KEY");
	const endpoint = joinUrl(OPENROUTER_BASE_URL, "/api/v1/chat/completions");
	try {
		return await withRetry(async () => {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${apiKey}`,
					"Content-Type": "application/json",
					"HTTP-Referer": "https://localhost",
					"X-Title": "Deep Research AI Agent",
				},
            body: JSON.stringify({
                model: params.model ?? DEFAULT_MODEL,
                messages: params.messages,
                temperature: params.temperature ?? 0.2,
                max_tokens: params.max_tokens ?? 512,
                response_format: { type: "json_object" }
            }),
			});
			if (!res.ok) {
				const text = await res.text();
				throw new Error(`OpenRouter error ${res.status}: ${text}`);
			}
			return await res.json();
		}, RETRY_COUNT, RETRY_DELAY_MS);
	} catch (err) {
		handleApiError(err);
	}
}

// Exa client
export function getExaClient() {
	const apiKey = requireEnv("EXA_SEARCH_API_KEY");
	return new Exa(apiKey);
}

export type ExaSearchParams = {
	query: string;
	numResults?: number;
};

export async function exaSearch(params: ExaSearchParams) {
	const exa = getExaClient();
	try {
		return await withRetry(async () => {
			const res = await exa.search(params.query, {
				numResults: params.numResults ?? 5,
			});
			return res;
		}, RETRY_COUNT, RETRY_DELAY_MS);
	} catch (err) {
		handleApiError(err);
	}
}
