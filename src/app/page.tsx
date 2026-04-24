import { Header } from "@/components/ui/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main id="main-content" className="flex-1 min-h-0 max-w-4xl w-full mx-auto">
        <ChatInterface />
      </main>
    </div>
  );
}
