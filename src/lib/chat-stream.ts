const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ChatStreamOptions {
  messages: Array<{ role: string; content: string }>;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

/**
 * 发送流式对话请求到 Edge Function，逐字接收大模型回复。
 */
export async function sendChatStream(options: ChatStreamOptions): Promise<void> {
  const { messages, onChunk, onComplete, onError, signal } = options;

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/wenxin-chat`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
        signal,
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`请求失败: ${response.status} ${errText}`);
    }

    if (!response.body) {
      throw new Error("响应体为空");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (raw === "[DONE]") continue;
        try {
          const chunk = JSON.parse(raw);
          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (delta) onChunk(delta);
        } catch {
          // 跳过无法解析的帧
        }
      }
    }

    // 处理剩余 buffer
    if (buffer.startsWith("data: ")) {
      const raw = buffer.slice(6).trim();
      if (raw !== "[DONE]") {
        try {
          const chunk = JSON.parse(raw);
          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (delta) onChunk(delta);
        } catch {
          // 跳过
        }
      }
    }

    onComplete();
  } catch (error) {
    if (signal?.aborted) {
      onError(new Error("已取消"));
    } else {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
