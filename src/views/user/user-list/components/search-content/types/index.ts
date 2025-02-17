// 用户状态枚举
export enum UserStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	LOCKED = "locked",
}

// 定义表单类型
interface SearchForm {
	username: string;
	email: string;
	status: UserStatus | "";
}

// 表格数据类型
interface TableItem {
	id: number;
	username: string;
	nickname: string;
	phone: string;
	email: string;
	status: UserStatus;
	createTime: string;
}

export type { SearchForm, TableItem };
