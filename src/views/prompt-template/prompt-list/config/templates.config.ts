import type { PromptTemplate } from "../types";

export const templates: PromptTemplate[] = [
	{
		id: 1,
		title: "功能需求模板",
		content: `# 需求描述
- 功能名称：
- 使用场景：
- 现有问题：

# 期望效果
- 操作流程：
- 预期结果：

# 补充说明
- 特殊要求：
- 注意事项：`,
		type: "feature",
	},
	{
		id: 2,
		title: "BUG修复模板",
		content: `# BUG描述
- 问题现象：
- 影响范围：

# 复现步骤
1.
2.

# 错误信息
\`\`\`
// 错误日志/截图
\`\`\``,
		type: "bug",
	},
	{
		id: 3,
		title: "代码优化模板",
		content: `# 当前代码
\`\`\`typescript
// 待优化代码
\`\`\`

# 优化目标
- 当前问题：
- 优化期望：
- 重点关注：`,
		type: "optimization",
	},
	{
		id: 4,
		title: "架构设计模板",
		content: `# 业务场景
- 核心需求：
- 关键功能：

# 设计重点
- 技术难点：
- 扩展考虑：
- 性能要求：`,
		type: "architecture",
	},
	{
		id: 5,
		title: "代码审查模板",
		content: `# 代码概览
- 修改范围：
- 核心功能：

# 重点关注
- 功能完整性：
- 潜在问题：
- 改进建议：`,
		type: "review",
	},
	{
		id: 6,
		title: "API设计模板",
		content: `# 接口定义
- 名称/路径：
- 请求方式：

# 数据结构
\`\`\`typescript
// 请求参数
interface Request {
}

// 响应结果
interface Response {
}
\`\`\`

# 补充说明
- 权限要求：
- 注意事项：`,
		type: "api",
	},
	{
		id: 7,
		title: "性能优化模板",
		content: `# 性能问题
- 问题表现：
- 影响范围：
- 性能指标：

# 分析思路
- 监控数据：
- 瓶颈点：
- 优化方向：`,
		type: "performance",
	},
	{
		id: 8,
		title: "数据库设计模板",
		content: `# 业务需求
- 数据场景：
- 核心实体：

# 表结构设计
\`\`\`typescript
// 示例：用户表
@Entity()
export class User {
}
\`\`\`

# 设计考虑
- 索引设计：
- 关联关系：
- 性能考虑：`,
		type: "database",
	},
	{
		id: 9,
		title: "测试用例模板",
		content: `# 测试范围
- 测试模块：
- 测试类型：

# 测试用例
\`\`\`typescript
describe('模块名称', () => {
  // 测试用例
})
\`\`\`

# 测试重点
- 边界条件：
- 异常场景：`,
		type: "test",
	},
	{
		id: 10,
		title: "部署配置模板",
		content: `# 部署环境
- 环境类型：
- 系统要求：

# 配置项
\`\`\`yaml
# 配置示例
\`\`\`

# 注意事项
- 环境变量：
- 权限要求：`,
		type: "deployment",
	},
	{
		id: 11,
		title: "学习提问模板",
		content: `# 学习主题
- 技术领域：
- 具体概念：
- 当前理解：

# 学习目标
- 期望掌握：
- 应用场景：

# 参考资料
- 已阅读：
- 疑惑点：`,
		type: "learning",
	},
	{
		id: 12,
		title: "方案咨询模板",
		content: `# 业务背景
- 当前情况：
- 面临问题：

# 期望方案
- 目标效果：
- 限制条件：
- 重点考虑：

# 评估维度
- 技术可行性：
- 实现成本：`,
		type: "consultation",
	},
	{
		id: 13,
		title: "快速提问模板",
		content: `# 问题描述
- 具体问题：
- 相关上下文：

# 补充信息
- 已尝试：
- 期望答案：`,
		type: "quick",
	},
];
