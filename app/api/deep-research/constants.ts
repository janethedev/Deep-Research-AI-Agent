export const OPENROUTER_BASE_URL = "https://openrouter.ai/";
export const EXA_BASE_URL = "https://exa.ai/";

export const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

export const MAX_ITERATIONS = 5;
export const MAX_SEARCH_RESULTS = 8;
export const MAX_CONTENT_CHARS = 16000;

export const RETRY_COUNT = 2;
export const RETRY_DELAY_MS = 800;

export const MODEL_NAME_MAP: Record<string, string> = {
	"llama-70b": "meta-llama/llama-3.3-70b-instruct:free",
	"gpt-4o": "openai/gpt-4o",
	"sonnet": "anthropic/claude-3.5-sonnet",
};
