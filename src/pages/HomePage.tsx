import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Bot,
  User,
  Code2,
  Brain,
  Fish,
  Bike,
  Sparkles,
  Lightbulb,
  MessageCircle,
  FolderOpen,
  Mail,
  Github,
  ExternalLink,
  ArrowDown,
  Cpu,
  Database,
  Globe,
  Menu,
  X,
  Hexagon,
  Triangle,
  Circle,
  Square,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AVATAR_URL =
  "https://miaoda-site-img.cdn.bcebos.com/images/MiaoTu_ebf36d2c-0a01-4317-96a2-d3547278ebc6.jpg";

const KNOWLEDGE_BASE = {
  职业: "我是 Leavis，一名 Java 开发人员。目前正在学习用 AI 辅助写程序，探索技术与创意的结合点。",
  身份: "我是 Leavis，一名 Java 开发人员。目前正在学习用 AI 辅助写程序，探索技术与创意的结合点。",
  java: "Java 是我的主力语言，我对后端开发、系统架构比较熟悉。现在也在尝试用 AI 工具来提升开发效率。",
  开发: "Java 是我的主力语言，我对后端开发、系统架构比较熟悉。现在也在尝试用 AI 工具来提升开发效率。",
  程序: "Java 是我的主力语言，我对后端开发、系统架构比较熟悉。现在也在尝试用 AI 工具来提升开发效率。",
  最近: "最近我在搭建自己的个人主页，同时也在整理过去做过的项目和技术路线，想把积累的东西系统化地呈现出来。",
  现在: "最近我在搭建自己的个人主页，同时也在整理过去做过的项目和技术路线，想把积累的东西系统化地呈现出来。",
  做什么: "最近我在搭建自己的个人主页，同时也在整理过去做过的项目和技术路线，想把积累的东西系统化地呈现出来。",
  主页: "最近我在搭建自己的个人主页，同时也在整理过去做过的项目和技术路线，想把积累的东西系统化地呈现出来。",
  作品: "目前我正在整理自己的作品集和技术路线，准备在这个主页上陆续展示出来。如果你感兴趣，可以先通过聊天问我具体细节。",
  项目: "目前我正在整理自己的作品集和技术路线，准备在这个主页上陆续展示出来。如果你感兴趣，可以先通过聊天问我具体细节。",
  擅长: "我比较关心内容表达、AI 应用和知识整理这几个方向。喜欢把复杂的东西梳理清楚，也热衷于用技术解决实际问题。",
  关心: "我比较关心内容表达、AI 应用和知识整理这几个方向。喜欢把复杂的东西梳理清楚，也热衷于用技术解决实际问题。",
  方向: "我比较关心内容表达、AI 应用和知识整理这几个方向。喜欢把复杂的东西梳理清楚，也热衷于用技术解决实际问题。",
  ai: "AI 是我现在非常关注的领域，不仅在用 AI 辅助编程，也在探索如何把 AI 能力融入到日常工作和创作中。",
  应用: "AI 是我现在非常关注的领域，不仅在用 AI 辅助编程，也在探索如何把 AI 能力融入到日常工作和创作中。",
  知识: "我喜欢做知识整理，把零散的信息结构化，让复杂的东西变得清晰可读。这也是我搭建个人主页的初衷之一。",
  整理: "我喜欢做知识整理，把零散的信息结构化，让复杂的东西变得清晰可读。这也是我搭建个人主页的初衷之一。",
  联系: "你可以通过这个聊天窗口直接和我交流，我会通过数字分身回复你。如果有更深入的合作意向，可以在这里留言。",
  你好: "你好！我是 Leavis 的数字分身，很高兴认识你。你可以问我关于我的职业、兴趣、最近在做什么，或者任何你想了解的问题。",
  兴趣: "我的兴趣比较多元：AI 应用、Java 开发、钓鱼和骑行。钓鱼让我学会耐心，骑行让我保持活力，技术和创作则让我持续成长。",
  爱好: "我的兴趣比较多元：AI 应用、Java 开发、钓鱼和骑行。钓鱼让我学会耐心，骑行让我保持活力，技术和创作则让我持续成长。",
  钓鱼: "钓鱼是我放松的方式之一。在水边坐着，等待的过程本身就是一种修行，能帮我理清很多思路。",
  骑行: "骑行是我保持活力的方式。喜欢在山路上骑行，感受风的速度，这时候头脑往往特别清晰。",
  特点: "我特别喜欢抽象的概念，喜欢把复杂的事情拆解、归类、找到本质。性格偏内向，更倾向于深度交流而非浅层社交。",
  性格: "我特别喜欢抽象的概念，喜欢把复杂的事情拆解、归类、找到本质。性格偏内向，更倾向于深度交流而非浅层社交。",
  内向: "没错，我是个内向的人。虽然不擅长在人群中表达，但在熟悉的环境或感兴趣的话题上，我可以聊很久。",
  抽象: "抽象概念对我有特别的吸引力。无论是编程中的设计模式，还是哲学中的逻辑结构，我都喜欢去探究它们背后的统一规律。",
};

const SUGGESTED_QUESTIONS = [
  "你现在在做什么？",
  "你有哪些作品？",
  "怎么联系你？",
];

const PROJECTS = [
  {
    id: "1",
    name: "个人主页",
    desc: "用 React + Tailwind + shadcn/ui 搭建的响应式个人主页，包含数字分身互动功能。",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    icon: Globe,
  },
  {
    id: "2",
    name: "后端服务框架",
    desc: "基于 Spring Boot 构建的微服务基础框架，包含常用模块封装和基础设施集成。",
    tags: ["Java", "Spring Boot", "MySQL"],
    icon: Database,
  },
  {
    id: "3",
    name: "AI 辅助工具集",
    desc: "探索用 AI 提升开发效率的一系列小工具，包括代码生成、文档整理等实验项目。",
    tags: ["Python", "OpenAI API", "Automation"],
    icon: Cpu,
  },
];

const CONTACT_INFO = {
  email: "leavis@example.com",
  github: "https://github.com/leavis",
  wechat: "leavis_dev",
};

function getBotReply(input: string): string {
  const lowerInput = input.toLowerCase();
  for (const [keyword, reply] of Object.entries(KNOWLEDGE_BASE)) {
    if (lowerInput.includes(keyword)) {
      return reply;
    }
  }
  return "这个问题我暂时无法回答，你可以尝试问我：我在做什么、我的作品、怎么联系我，或者其他关于我的事情。";
}

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "你好！我是 Leavis 的数字分身。你可以问我关于他的职业、兴趣、最近在做什么，或者其他你想了解的问题。",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // 模拟打字延迟
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

    const reply = getBotReply(trimmed);
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: reply,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  const NAV_ITEMS = [
    { label: "关于我", href: "#about" },
    { label: "作品", href: "#projects" },
    { label: "数字分身", href: "#chat" },
    { label: "联系我", href: "#contact" },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* 全局背景装饰 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[8%] w-2 h-2 rounded-full bg-primary/15 animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute top-[15%] right-[12%] w-1.5 h-1.5 rounded-full bg-primary/10 animate-pulse" style={{ animationDuration: "3s", animationDelay: "1s" }} />
        <div className="absolute top-[35%] left-[5%] w-1 h-1 rounded-full bg-primary/20 animate-pulse" style={{ animationDuration: "5s", animationDelay: "2s" }} />
        <div className="absolute top-[60%] right-[8%] w-2 h-2 rounded-full bg-primary/10 animate-pulse" style={{ animationDuration: "4.5s", animationDelay: "0.5s" }} />
        <div className="absolute top-[80%] left-[15%] w-1.5 h-1.5 rounded-full bg-primary/15 animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "1.5s" }} />
        <div className="absolute top-[45%] right-[20%] w-1 h-1 rounded-full bg-primary/10 animate-pulse" style={{ animationDuration: "6s", animationDelay: "2.5s" }} />
      </div>

      {/* 导航栏 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-sm font-semibold text-foreground tracking-wide"
          >
            Leavis
          </a>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="打开菜单"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* 移动端菜单面板 */}
          {mobileOpen && (
            <div className="fixed inset-0 z-[60] md:hidden">
              {/* 遮罩层 */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setMobileOpen(false)}
              />
              {/* 菜单内容 */}
              <div className="absolute right-0 top-0 bottom-0 w-64 bg-background/95 backdrop-blur-xl border-l border-border/40 animate-in slide-in-from-right duration-300 p-4 pt-14">
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14">
        {/* 装饰性背景元素 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-primary/6 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-accent/8 blur-3xl" />
          <div className="absolute top-[30%] left-[20%] w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full bg-secondary/10 blur-2xl" />

          {/* 几何装饰 */}
          <div className="absolute top-[20%] right-[15%] opacity-[0.07]">
            <Hexagon className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <div className="absolute top-[60%] left-[10%] opacity-[0.06]">
            <Triangle className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-[25%] right-[8%] opacity-[0.05]">
            <Square className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <div className="absolute top-[40%] right-[25%] opacity-[0.06]">
            <Circle className="w-4 h-4 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-16 md:pb-12">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="w-24 h-24 md:w-28 md:h-28 ring-4 ring-primary/20 shadow-xl shadow-primary/5">
                <AvatarImage src={AVATAR_URL} alt="Leavis 的头像" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  LV
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center border-2 border-background">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
            </div>

            <h1 className="mt-6 text-2xl md:text-3xl font-semibold text-foreground text-balance">
              Leavis
            </h1>
            <p className="mt-2 text-base md:text-lg text-muted-foreground text-balance max-w-md">
              一个正在学习用 AI 写程序的 Java 开发人员
            </p>

            {/* 聊天入口引导 */}
            <button
              onClick={() => scrollTo("#chat")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15 transition-all border border-primary/20 hover:shadow-md hover:shadow-primary/5 active:scale-95"
            >
              <Bot className="w-4 h-4" />
              和我聊聊
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <Separator />
      </div>

      {/* About Section */}
      <section id="about" className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 scroll-mt-20">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">关于我</h2>
        </div>

        <div className="grid gap-4">
          {/* 当前状态 */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/60 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20 transition-all">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    现在在做什么
                  </h3>
                  <p className="text-base text-foreground text-pretty">
                    正在搭建自己的个人主页，整理过去做过的项目和技术路线，想把积累的东西系统化地呈现出来。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 兴趣 */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/60 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20 transition-all">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-foreground/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    兴趣标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1 px-2.5 py-1">
                      <Brain className="w-3.5 h-3.5" />
                      AI 应用
                    </Badge>
                    <Badge variant="secondary" className="gap-1 px-2.5 py-1">
                      <Code2 className="w-3.5 h-3.5" />
                      Java 开发
                    </Badge>
                    <Badge variant="secondary" className="gap-1 px-2.5 py-1">
                      <Fish className="w-3.5 h-3.5" />
                      钓鱼
                    </Badge>
                    <Badge variant="secondary" className="gap-1 px-2.5 py-1">
                      <Bike className="w-3.5 h-3.5" />
                      骑行
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 特点 */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/60 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20 transition-all">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/40 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    一点小特点
                  </h3>
                  <p className="text-base text-foreground text-pretty">
                    喜欢抽象的概念，性格偏内向。在熟悉的环境或感兴趣的话题上，可以聊很久。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <Separator />
      </div>

      {/* Projects Section */}
      <section id="projects" className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 scroll-mt-20">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">作品</h2>
        </div>

        <div className="grid gap-4">
          {PROJECTS.map((project) => {
            const Icon = project.icon;
            return (
              <Card
                key={project.id}
                className="bg-card/60 backdrop-blur-sm border-border/60 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all group"
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-medium text-foreground">
                          {project.name}
                        </h3>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground text-pretty mb-3">
                        {project.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs px-2 py-0.5 border-border/60 text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <Separator />
      </div>

      {/* Chat Section */}
      <section id="chat" className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-16 scroll-mt-20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            数字分身
          </h2>
          <span className="text-xs text-muted-foreground ml-1">
            问我关于 Leavis 的任何事情
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6 pl-10">
          可以直接在下方输入问题，或点击快捷问题开始对话
        </p>

        <Card className="border-border/60 shadow-sm overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-shadow">
          {/* Chat Messages */}
          <div className="bg-muted/30">
            <ScrollArea className="h-[380px] md:h-[420px] px-4 py-4" ref={scrollRef as any}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                        <AvatarImage src={AVATAR_URL} alt="数字分身" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          LV
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border/50 rounded-bl-md text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 shrink-0 mt-0.5 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-4 h-4 text-foreground/70" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                      <AvatarImage src={AVATAR_URL} alt="数字分身" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        LV
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && !isTyping && (
            <div className="px-4 py-3 border-t border-border/40 bg-card/50">
              <p className="text-xs text-muted-foreground mb-2">试试这些问题：</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 px-3 border-border/60 hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 md:p-4 border-t border-border/40 bg-card">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="输入你想问的问题..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 h-10 md:h-11 bg-muted/50 border-border/60 focus-visible:ring-primary/30"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-xl"
                disabled={isTyping || !inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <Separator />
      </div>

      {/* Contact Section */}
      <section id="contact" className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 scroll-mt-20">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">联系我</h2>
        </div>

        <Card className="bg-card/60 backdrop-blur-sm border-border/60 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20 transition-all">
          <CardContent className="p-5 md:p-6">
            <p className="text-sm text-muted-foreground text-pretty mb-5">
              如果你对我的项目感兴趣，或者想聊聊技术、AI、钓鱼、骑行，欢迎通过以上方式找到我。
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border/40 text-sm group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">邮箱</p>
                  <p className="text-foreground font-medium truncate">{CONTACT_INFO.email}</p>
                </div>
              </a>

              <a
                href={CONTACT_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border/40 text-sm group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Github className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">GitHub</p>
                  <p className="text-foreground font-medium truncate">@leavis</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 py-8">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              © 2025 Leavis · 用 AI 搭建的个人主页
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              回到顶部
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
