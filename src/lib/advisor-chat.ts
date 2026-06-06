export type AdvisorChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type SavedAdvisorChat = {
  messages: AdvisorChatMessage[];
  source: string | null;
  savedAt: string;
};

export const ADVISOR_CHAT_KEY = "aeen-iq-advisor-chat";

export function loadAdvisorChat(): SavedAdvisorChat | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADVISOR_CHAT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedAdvisorChat;
    if (!Array.isArray(data.messages)) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveAdvisorChat(
  messages: AdvisorChatMessage[],
  source: string | null
): void {
  if (typeof window === "undefined") return;
  const payload: SavedAdvisorChat = {
    messages,
    source,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(ADVISOR_CHAT_KEY, JSON.stringify(payload));
}

export function clearAdvisorChat(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADVISOR_CHAT_KEY);
}
