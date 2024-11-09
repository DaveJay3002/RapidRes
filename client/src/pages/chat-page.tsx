import Chat from "@/components/chat";
import MultimodalInput from "@/components/multimodal-input";

export default function ChatPage() {
  return (
    <main className="px-4 sm:px-0 max-w-2xl mx-auto">
      <Chat id={"fc"} />
      <MultimodalInput />
    </main>
  );
}
