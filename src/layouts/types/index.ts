import type { MenuProps } from "element-plus";

export interface MenuViewProps extends Partial<MenuProps> {
	mode?: "horizontal" | "vertical";
	collapsed?: boolean;
}

export type MenuItem = App.Global.MenuItem;
