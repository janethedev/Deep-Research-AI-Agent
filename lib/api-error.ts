export type ApiErrorInfo = {
	name: string;
	message: string;
	status?: number;
	isRateLimit?: boolean;
	isNetwork?: boolean;
	raw?: unknown;
};

export function isFetchResponse(obj: unknown): obj is Response {
	return typeof Response !== 'undefined' && obj instanceof Response;
}

export function classifyError(err: unknown): ApiErrorInfo {
	if (isFetchResponse(err)) {
		return {
			name: 'HttpError',
			message: `HTTP ${err.status} ${err.statusText}`,
			status: err.status,
			isRateLimit: err.status === 429,
			raw: err,
		};
	}
	if (err instanceof Error) {
		const msg = err.message || 'Unknown error';
		return {
			name: err.name || 'Error',
			message: msg,
			isNetwork: /network|fetch|failed|timeout/i.test(msg),
			raw: err,
		};
	}
	return {
		name: 'Unknown',
		message: 'Unknown error',
		raw: err,
	};
}

export function handleApiError(err: unknown): never {
	const info = classifyError(err);
	if (typeof console !== 'undefined') {
		console.error('[API ERROR]', info);
	}
	const e = new Error(info.message);
	// @ts-expect-error augment
	e.status = info.status;
	throw e;
}
