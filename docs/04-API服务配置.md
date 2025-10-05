# 步骤4：API服务配置

## 🎯 任务目标

配置外部API服务，包括OpenRouter（LLM服务）和Exa（搜索服务）。

## 📋 具体任务

### 4.1 配置OpenRouter服务

**任务描述：** 配置OpenRouter API服务用于调用各种LLM模型。

**操作步骤：**
1. 创建`src/app/api/deep-research/services.ts`文件
2. 配置OpenRouter客户端
3. 设置API密钥验证
4. 实现错误处理

**测试方法：**
- 准备创建一个`src/app/api/deep-research/__tests__/services.test.ts`文件，并在该文件中进行OpenRouter服务的单元测试
- 使用curl命令测试API连接：`curl -X POST "https://openrouter.ai/api/v1/chat/completions" -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json"`
- 验证API密钥有效性
- 测试不同模型的可用性

### 4.2 配置Exa搜索服务

**任务描述：** 配置Exa API服务用于网络搜索。

**操作步骤：**
1. 在services.ts中添加Exa客户端配置
2. 设置搜索参数
3. 实现搜索结果处理
4. 添加错误处理机制

**测试方法：**
- 准备创建一个`src/app/api/deep-research/__tests__/exa.test.ts`文件，并在该文件中进行Exa搜索服务的单元测试
- 使用curl命令测试搜索API：`curl -X POST "https://api.exa.ai/search" -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d '{"query": "test", "numResults": 5}'`
- 验证搜索结果格式正确
- 测试不同搜索参数的效果

### 4.3 创建API配置常量

**任务描述：** 创建API配置和常量文件。

**操作步骤：**
1. 创建`src/app/api/deep-research/constants.ts`文件
2. 定义模型配置
3. 设置搜索参数限制
4. 配置重试机制参数

**需要定义的常量：**
- 最大迭代次数
- 最大搜索结果数量
- 最大内容字符数
- 重试次数和延迟
- 模型名称映射

**测试方法：**
- 准备创建一个`src/app/api/deep-research/__tests__/constants.test.ts`文件，并在该文件中进行常量的单元测试
- 验证所有常量值合理
- 测试常量在不同环境下的表现

### 4.4 实现API错误处理

**任务描述：** 实现统一的API错误处理机制。

**操作步骤：**
1. 创建错误处理工具函数
2. 实现重试机制
3. 添加日志记录
4. 处理不同类型的错误

**测试方法：**
- 准备创建一个`src/app/api/deep-research/__tests__/error-handling.test.ts`文件，并在该文件中进行错误处理的单元测试
- 模拟网络错误测试重试机制
- 测试API限流处理
- 验证错误日志记录正确

### 4.5 创建API工具函数

**任务描述：** 创建通用的API工具函数。

**操作步骤：**
1. 创建`src/app/api/deep-research/utils.ts`文件
2. 实现内容合并函数
3. 添加URL处理函数
4. 实现数据验证函数

**测试方法：**
- 准备创建一个`src/app/api/deep-research/__tests__/utils.test.ts`文件，并在该文件中进行工具函数的单元测试
- 测试内容合并功能
- 测试URL处理正确性
- 验证数据验证逻辑

## ✅ 完成标准

- [ ] OpenRouter服务配置完成
- [ ] Exa搜索服务配置完成
- [ ] API配置常量定义完成
- [ ] 错误处理机制实现
- [ ] 工具函数创建完成
- [ ] 所有API服务测试通过

## 🔍 测试策略

**API连接测试：**
- 使用Postman或curl测试API端点
- 验证API密钥有效性
- 测试不同参数组合

**错误处理测试：**
- 模拟网络超时
- 测试API限流响应
- 验证错误重试机制

**性能测试：**
- 测试API响应时间
- 测试并发请求处理
- 验证资源使用情况

## 📝 下一步

完成本步骤后，请继续 [05-类型定义.md](./05-类型定义.md) 定义完整的TypeScript类型系统。

