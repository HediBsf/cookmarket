"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { BotMessageSquare, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { apiPost } from "@/lib/api";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type AiChatResponse = {
  answer: string;
};

const quickQuestions = [
  "Comment passer une commande ?",
  "Comment payer une formation ?",
  "Ou trouver mes recettes ?",
];

export default function AiChatWidget() {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(getUserRole() === "CLIENT");
    const user = getCurrentUser();
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: `Bonjour${user?.firstName ? ` ${user.firstName}` : ""}, je suis Lamma, votre agent IA. Posez-moi n'importe quelle question.`,
      },
    ]);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const canSend = useMemo(() => input.trim().length > 1, [input]);

  if (!isClient) {
    return null;
  }

  async function sendMessage(text: string) {
    const question = text.trim();
    if (!question || loading) {
      return;
    }
    const now = Date.now();
    setMessages((current) => [
      ...current,
      { id: now, role: "user", text: question },
      { id: now + 1, role: "assistant", text: "Lamma reflechit..." },
    ]);
    setInput("");
    setOpen(true);
    setLoading(true);

    try {
      const response = await apiPost<AiChatResponse>("/api/ai/chat", { message: question });
      setMessages((current) =>
        current.map((message) => (message.id === now + 1 ? { ...message, text: response.answer } : message)),
      );
    } catch (error) {
      const fallback =
        error instanceof Error
          ? error.message
          : "Lamma IA est indisponible. Verifiez que Ollama est lance.";
      setMessages((current) =>
        current.map((message) =>
          message.id === now + 1
            ? {
                ...message,
                text: fallback,
              }
            : message,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSend) {
      sendMessage(input);
    }
  }

  return (
    <>
      {open ? (
        <section className="fixed bottom-24 right-4 z-[70] flex h-[min(560px,calc(100vh-130px))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-lg border border-red-900/15 bg-white shadow-[0_26px_80px_rgba(43,18,9,0.22)] md:bottom-28 md:right-7">
          <header className="flex items-center justify-between gap-3 border-b border-amber-900/10 bg-red-900 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <BotMessageSquare size={22} />
              </span>
              <div>
                <h2 className="text-sm font-extrabold">Lamma IA</h2>
                <p className="text-xs text-red-50">Agent IA generaliste</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-white transition hover:bg-white/15"
              aria-label="Fermer le chat IA"
            >
              <X size={18} />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#fffaf2] px-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[82%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-red-800 text-white"
                      : "border border-amber-900/10 bg-white text-stone-800 shadow-sm"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-amber-900/10 bg-white p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  disabled={loading}
                  className="rounded-full border border-amber-900/15 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-red-950 transition hover:border-red-900/30 hover:bg-red-50"
                >
                  {question}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                className="input py-2 text-sm"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Posez votre question..."
                aria-label="Question pour Lamma IA"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!canSend || loading}
                className="btn-primary h-11 w-11 shrink-0 px-0 py-0"
                aria-label="Envoyer la question"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group fixed bottom-5 right-4 z-[71] flex h-16 w-16 items-center justify-center rounded-full bg-red-800 text-white shadow-[0_18px_45px_rgba(127,29,29,0.35)] transition hover:-translate-y-1 hover:bg-red-900 md:bottom-7 md:right-7"
        aria-label="Ouvrir Lamma IA"
        title="Lamma IA"
      >
        <MessageCircle size={28} className="transition group-hover:scale-95" />
        <Sparkles size={16} className="absolute -right-0.5 -top-0.5 rounded-full bg-amber-500 p-0.5 text-white" />
      </button>
    </>
  );
}
