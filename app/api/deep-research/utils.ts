import { z } from "zod";

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(fn: () => Promise<T>, retries: number, delayMs: number): Promise<T> {
	let lastError: unknown;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fn();
		} catch (err) {
			lastError = err;
			if (attempt < retries) {
				await sleep(delayMs);
			}
		}
	}
	throw lastError;
}

export function mergeStrings(parts: Array<string | undefined | null>, maxLen?: number): string {
	const merged = parts.filter(Boolean).join("\n\n");
	if (!maxLen) return merged;
	return merged.slice(0, maxLen);
}

export function safeUrl(url: string): string {
	try {
		const u = new URL(url);
		return u.toString();
	} catch {
		return "";
	}
}

export function parseWithSchema<T>(schema: z.ZodTypeAny, data: unknown): T {
	const res = schema.safeParse(data);
	if (res.success) return res.data as T;
	throw new Error(`Validation failed: ${res.error.message}`);
}
