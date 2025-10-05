export type Role = "system" | "user" | "assistant";

export interface Activity {
	id: string;
	type: "search" | "extract" | "analyze" | "report" | "plan";
	status: "pending" | "in_progress" | "completed" | "error";
	message: string;
	timestamp: string; // ISO string for API friendliness
	details?: string;
}

export interface Source {
	id: string;
	title: string;
	url: string;
	snippet: string;
	relevance: number;
}

export interface SearchResult {
	id: string;
	title: string;
	url: string;
	snippet?: string;
	score?: number;
}

export interface ResearchFindings {
	summary: string;
	keyPoints: string[];
	sources: Source[];
	confidence: number; // 0..1
}

export interface ResearchReport {
	title: string;
	content: string; // markdown
	findings: ResearchFindings;
	generatedAt: string; // ISO
	wordCount: number;
}

export interface ResearchStateDTO {
	topic: string;
	clarifications: string[];
	questions: { id: string; text: string; answer?: string; isAnswered: boolean }[];
	currentQuestionIndex: number;
	isCompleted: boolean;
	isLoading: boolean;
	researchPhase: "input" | "questions" | "research" | "report";
	activities: Activity[];
	sources: Source[];
	findings: ResearchFindings | null;
	report: ResearchReport | null;
	startTime: string | null;
	endTime: string | null;
}

export interface ModelCallOptions {
	model?: string;
	temperature?: number;
	maxTokens?: number;
	json?: boolean;
}

export interface ActivityTracker {
	start: (type: Activity["type"], message: string) => string; // returns id
	update: (id: string, updates: Partial<Activity>) => void;
	complete: (id: string, message?: string) => void;
	error: (id: string, message: string) => void;
}

// API request/response shapes
export interface GenerateQuestionsRequest {
	topic: string;
}
export interface GenerateQuestionsResponse {
	questions: string[];
}

export interface DeepResearchRequest {
	topic: string;
	clarifications: string[];
}
export interface DeepResearchResponse {
	report: ResearchReport;
	activities: Activity[];
}
