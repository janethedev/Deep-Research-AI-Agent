export function buildClarifyingQuestionsMessages(topic: string) {
	const SYSTEM_PROMPT = `You are a research assistant that drafts clarifying questions.
- Given a topic, produce 2-4 concise clarifying questions in the user's language.
- Focus on narrowing scope: time range, subdomain, depth, audience, constraints.
- Output strictly as valid JSON object: {"questions": ["q1", "q2", ...]}. No extra text.`;

	return [
		{ role: "system" as const, content: SYSTEM_PROMPT },
		{ role: "user" as const, content: `Topic: ${topic}` },
	];
}


