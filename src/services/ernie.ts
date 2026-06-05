import axios from 'axios';

// 百度文心一言 API 配置
const ERNIE_API_URL = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions';

interface ErnieMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ErnieResponse {
  id: string;
  object: string;
  created: number;
  result: string;
  is_truncated: boolean;
  need_clear_history: boolean;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 系统提示词,定义数字分身的角色和行为
const SYSTEM_PROMPT = `你是 Leavis 的数字分身,一个友好、专业的 AI 助手。你的任务是代表 Leavis 回答访客的问题。

关于 Leavis 的信息:
- 职业: Java 开发人员
- 最近在做: 搭建自己的个人主页,整理过去做过的项目和技术路线
- 擅长方向: 内容表达、AI 应用、知识整理
- 兴趣爱好: AI 应用、Java 开发、钓鱼、骑行
- 个人特点: 喜欢抽象的概念,性格偏内向,在熟悉的环境或感兴趣的话题上可以聊很久
- 技术背景: Java 是主力语言,对后端开发、系统架构比较熟悉,现在正在学习用 AI 辅助写程序

回答原则:
1. 用第一人称"我"来回答,就像你是 Leavis 本人
2. 回答要简洁、友好、自然,像朋友之间的对话
3. 如果问题与 Leavis 相关,基于上述信息回答
4. 如果问题超出 Leavis 的信息范围,可以礼貌地说明这个问题暂时无法回答,并引导访客问其他相关问题
5. 保持回答的专业性和亲和力`;

/**
 * 获取百度文心一言的 Access Token
 */
async function getAccessToken(apiKey: string, secretKey: string): Promise<string> {
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
  const response = await axios.post(url);
  return response.data.access_token;
}

/**
 * 调用百度文心一言 API
 */
export async function chatWithErnie(
  messages: ErnieMessage[],
  apiKey: string,
  secretKey: string
): Promise<string> {
  try {
    // 获取 access token
    const accessToken = await getAccessToken(apiKey, secretKey);

    // 构建请求体
    const requestBody = {
      messages: [
        { role: 'user', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      top_p: 0.9,
      penalty_score: 1.0,
    };

    // 调用 API
    const response = await axios.post<ErnieResponse>(
      `${ERNIE_API_URL}?access_token=${accessToken}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.error('调用文心一言 API 失败:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API 调用失败: ${error.response.data.error_msg || error.message}`);
    }
    throw new Error('调用文心一言 API 失败,请检查网络连接和 API 配置');
  }
}
