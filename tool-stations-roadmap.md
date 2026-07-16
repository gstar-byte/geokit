# 工具站矩阵计划

> 2026年7月 — 三站并行，复用同一技术栈和模式

## 现有项目

| 项目 | 状态 | 域名 |
|---|---|---|
| GEOKit | 已上线 | geokit.site |
| MKTBee | 改版中（加工具层） | mktbee.com |
| CADGuide | 维护中（guides rebuild 待上线） | cadguide.tools |

---

## 三站执行顺序

### 第一站：DevUtils Kit（开发者工具包）

**为什么先做**：搜索量最大、粘度最高、纯前端零成本、技术博主链接诱饵极强

**域名建议**：devutils.site 或 devutils.tools

**10 个工具**：

| # | 工具 | 路径 | 搜索量 |
|---|---|---|---|
| 1 | JSON 格式化/校验器 | /tools/json-formatter | 极高 |
| 2 | Base64 编解码器 | /tools/base64 | 高 |
| 3 | URL 编解码器 | /tools/url-encoder | 高 |
| 4 | 正则表达式测试器 | /tools/regex-tester | 高 |
| 5 | JWT 解码器 | /tools/jwt-decoder | 中高 |
| 6 | UUID 生成器 | /tools/uuid-generator | 中 |
| 7 | Hash 计算器 | /tools/hash-generator | 中 |
| 8 | Cron 表达式生成器 | /tools/cron-generator | 中 |
| 9 | 颜色格式转换器 | /tools/color-converter | 中 |
| 10 | 时间戳转换器 | /tools/timestamp-converter | 中高 |

**技术栈**：Next.js + TypeScript + Tailwind + Cloudflare Pages（复用 GEOKit 模式）

**预计工时**：1-2 天（全部纯前端，无 API）

**SEO 策略**：
- 每个工具一个着陆页，精准匹配搜索词
- 技术博主写教程时引用 = 天然外链
- Reddit r/webdev、r/programming 分享

---

### 第二站：Privacy Kit（隐私合规工具包）

**为什么第二**：链接诱饵极强，创业/独立开发者博客频繁引用，搜索量中等但转化路径清晰

**域名建议**：privacykit.site 或 privtools.com

**10 个工具**：

| # | 工具 | 路径 | 说明 |
|---|---|---|---|
| 1 | 隐私政策生成器 | /tools/privacy-policy-generator | 按业务类型+地区生成 |
| 2 | Cookie 政策生成器 | /tools/cookie-policy-generator | 按 Cookie 用途生成 |
| 3 | 服务条款生成器 | /tools/terms-generator | 按 SaaS/电商/博客分类 |
| 4 | 退款政策生成器 | /tools/refund-policy-generator | 电商刚需 |
| 5 | Cookie 同意横幅生成器 | /tools/cookie-consent-banner | 生成可嵌入的 JS 代码 |
| 6 | GDPR 合规检查清单 | /tools/gdpr-checklist | 可勾选追踪 |
| 7 | CCPA 合规检查清单 | /tools/ccpa-checklist | 可勾选追踪 |
| 8 | 数据删除请求模板 | /tools/data-deletion-request | 生成请求邮件模板 |
| 9 | 隐私政策审查器 | /tools/privacy-policy-checker | 输入 URL 检查缺失条款 |
| 10 | Cookie 扫描器 | /tools/cookie-scanner | 输入 URL 列出所有 Cookie |

**关键要求**：
- 每个生成器页面底部加免责声明："This is a template, not legal advice."
- 模板覆盖 GDPR、CCPA、COPPA、EAA
- 按业务类型分类（电商/SaaS/博客/移动应用）

**预计工时**：2-3 天（生成器逻辑简单，但模板内容需要仔细编写）

**SEO 策略**：
- "free privacy policy generator" 搜索量大
- 创业博客、独立开发者博客写"上线 Checklist"必引用
- Product Hunt 发布（隐私合规是热门话题）

---

### 第三站：EmailAuth Kit（邮件认证工具包）

**为什么最后**：竞争最低但搜索量偏小、粘度低，适合作为矩阵补充

**域名建议**：emailauth.site 或 dkimtools.com

**8 个工具**：

| # | 工具 | 路径 | 说明 |
|---|---|---|---|
| 1 | SPF 记录生成器 | /tools/spf-generator | 输入邮件服务商，生成 SPF 记录 |
| 2 | DMARC 记录生成器 | /tools/dmarc-generator | 选择策略级别，生成 DMARC 记录 |
| 3 | DKIM 配置指南 | /tools/dkim-guide | 按邮件服务商生成配置步骤 |
| 4 | MX 记录查询器 | /tools/mx-lookup | 输入域名查 MX 记录（需 API） |
| 5 | SPF 记录检查器 | /tools/spf-checker | 输入域名验证 SPF 是否正确（需 API） |
| 6 | DMARC 检查器 | /tools/dmarc-checker | 输入域名验证 DMARC 状态（需 API） |
| 7 | 邮件头分析器 | /tools/email-header-analyzer | 粘贴邮件头，解析认证结果 |
| 8 | BIMI 记录生成器 | /tools/bimi-generator | 生成 BIMI DNS 记录 |

**技术注意**：
- 4 个工具需 API route（DNS 查询），其余纯前端
- API route 加 `export const runtime = "edge"`

**预计工时**：2 天

**SEO 策略**：
- "SPF record generator"、"DMARC generator" 竞争极低
- IT 博主、邮件营销博主写邮件配置教程必引用
- 2024 年 Google/Yahoo 强制 DMARC 后需求持续增长

---

## 时间线

| 阶段 | 内容 | 时间 |
|---|---|---|
| 第 1 站 | DevUtils Kit — 10 个工具 | 本周完成 |
| 第 2 站 | Privacy Kit — 10 个工具 | 下周完成 |
| 第 3 站 | EmailAuth Kit — 8 个工具 | 第三周完成 |

## 复用资源

- 技术栈完全复用：Next.js + Tailwind + Cloudflare Pages
- 组件复用：Header/Footer/layout.tsx/metadata 模式
- SEO 模式复用：sitemap.ts、robots.ts、JSON-LD
- 部署流程复用：GitHub + Cloudflare Pages 自动构建

## 矩阵效应

三站建成后可互相交叉链接：
- DevUtils 页脚链接到 Privacy Kit（"Need a privacy policy?"）
- Privacy Kit 页脚链接到 EmailAuth Kit（"Configure your email authentication"）
- 所有站点页脚链接到 GEOKit（"Optimize for AI search"）

交叉链接提升各站域名权重，形成链接网络。
