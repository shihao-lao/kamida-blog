import http from "./http";
// 简单讲解
const chatWithChatAnywhere = async (prompt) => {
  try {
    const response = await http.post("/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{
        role:"system",
        content:"你是一个专业的前端开发,你需要回答用户提出的一些概念性的解释,你来进行简单的解释,如果有其他问题,你可以委婉拒绝"
      },{ role: "user", content: prompt }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error chatting with ChatAnywhere:", error);
    throw error;
  }
};

const articleSummary = async (
  articleContent,
  { title, model = "gpt-3.5-turbo" } = {},
) => {
  const safeContent = String(articleContent ?? "").slice(0, 20000);
  const safeTitle = title ? String(title).slice(0, 200) : "";

  const messages = [
    {
      role: "system",
      content:
        "你是一个文章总结助手。请用中文输出严格的 JSON（不要包含任何多余文本）。字段：summary（100-180字）、highlights（3-5条要点数组）、tags（3-6个短标签数组）。不要输出 Markdown。",
    },
    {
      role: "user",
      content: `${safeTitle ? `标题：${safeTitle}\n\n` : ""}正文：\n${safeContent}`,
    },
  ];

  const response = await http.post("/v1/chat/completions", {
    model,
    temperature: 0.2,
    messages,
  });

  const text = response?.data?.choices?.[0]?.message?.content;
  if (!text) {
    const message =
      response?.data?.error?.message ??
      response?.data?.message ??
      "空响应";
    throw new Error(String(message));
  }
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  const jsonText = first >= 0 && last > first ? text.slice(first, last + 1) : "";

  try {
    const parsed = JSON.parse(jsonText || text);
    const summary =
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary
        : String(text).trim();
    const highlights = Array.isArray(parsed.highlights) ? parsed.highlights : [];
    const tags = Array.isArray(parsed.tags) ? parsed.tags : [];
    return { summary, highlights, tags };
  } catch {
    return { summary: String(text).trim(), highlights: [], tags: [] };
  }
};

export { chatWithChatAnywhere, articleSummary };
export default { chatWithChatAnywhere, articleSummary };
