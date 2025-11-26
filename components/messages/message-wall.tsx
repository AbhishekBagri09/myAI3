import { UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";
import { Copy, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MessageWall({
  messages,
  status,
  durations,
  onDurationChange,
  lastBotAudioURL,
}: {
  messages: UIMessage[];
  status?: string;
  durations?: Record<string, number>;
  onDurationChange?: (key: string, duration: number) => void;
  lastBotAudioURL?: string | null;
}) {
  
  const endRef = useRef<HTMLDivElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const playBotAudio = () => {
    if (lastBotAudioURL) new Audio(lastBotAudioURL).play();
  };

  return (
    <div className="relative max-w-3xl w-full mx-auto px-2">
      
      {/* Fade effect at top */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background to-transparent pointer-events-none z-20" />

      <div className="relative flex flex-col gap-5 pb-8">

        {messages.map((message, i) => {
          const isLast = i === messages.length - 1;
          const textContent =
            message.parts?.map((p) => (p.type === "text" ? p.text : "")).join(" ") || "";

          return (
            <div
              key={message.id}
              className="relative group"
              onMouseEnter={() => setHoveredMessage(message.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              {/* MESSAGE BUBBLE */}
              {message.role === "user" ? (
                <UserMessage message={message} />
              ) : (
                <AssistantMessage
                  message={message}
                  status={status}
                  isLastMessage={isLast}
                  durations={durations}
                  onDurationChange={onDurationChange}
                />
              )}

              {/* HOVER TOOLBAR */}
              {hoveredMessage === message.id && (
                <div className="absolute -top-3 right-0 flex gap-1 animate-fade-in z-10">
                  
                  {/* Copy Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full shadow-md bg-background border hover:bg-muted"
                    onClick={() => copyMessage(textContent)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>

                  {/* Replay AI audio */}
                  {message.role === "assistant" && lastBotAudioURL && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full shadow-md bg-background border hover:bg-muted"
                      onClick={playBotAudio}
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Assistant typing animation */}
        {status === "submitted" && (
          <div className="flex items-center gap-2 text-muted-foreground pl-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300" />
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Fade effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
