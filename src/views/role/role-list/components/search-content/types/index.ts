// 定义表单类型
export interface SearchForm {
	name: string;
	description: string;
	permissions?: string[];
}

// 表格数据类型
export interface TableItem {
	id: number;
	name: string;
	description: string;
	isSystem: boolean;
	createdAt: string;
	updatedAt: string;
}
