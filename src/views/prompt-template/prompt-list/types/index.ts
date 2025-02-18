export type PromptTemplateType =
	| "feature"
	| "bug"
	| "optimization"
	| "architecture"
	| "review"
	| "api"
	| "performance"
	| "database"
	| "test"
	| "deployment"
	| "learning"
	| "consultation"
	| "quick"
	| "custom";

export interface PromptTemplate {
	id: number;
	title: string;
	content: string;
	type: PromptTemplateType;
}
