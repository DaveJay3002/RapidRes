import Message, { AIMessageWrapper } from "@/components/message";
import Trains from "@/components/agents/train-booking/trains";
import { useEffect } from "react";
import { useMessagesStore } from "@/lib/store";
import { useSocket } from "@/components/socket-provider";
import type { TrainType } from "@/lib/types";

export default function Chat() {
  const { messages, addMessage } = useMessagesStore();
  const { socket } = useSocket();

  useEffect(() => {
    function onMessageRecieved(message: {
      response: string;
      train_list?: TrainType[];
      type: "text" | "train_list";
    }) {
      const { response, train_list, type } = message;
      addMessage({
        text: response,
        trains: train_list,
        type,
        sender: "ai",
      });
    }
    socket.on("message", onMessageRecieved);

    return () => {
      socket.off("message", onMessageRecieved);
    };
  }, []);

  console.log(socket);
  return (
    <section className="flex flex-col gap-4">
      {messages.map((msg) =>
        msg.sender === "user" ? (
          <Message
            key={msg.text?.slice(0, 5)}
            sender="user"
            message={msg.text}
          />
        ) : (
          <AIMessageWrapper key={msg.text?.slice(0, 5)}>
            <Message sender="ai" message={msg.text} />
            {msg.type === "train_list" && msg.trains && (
              <Trains trains={msg.trains} />
            )}
          </AIMessageWrapper>
        )
      )}
    </section>
  );
}
