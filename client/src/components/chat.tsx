import Message, { AIMessageWrapper } from "@/components/message";
import Trains from "@/components/agents/train-booking/trains";
import { useEffect } from "react";
import { useMessagesStore } from "@/lib/store";
import { useSocket } from "@/components/socket-provider";
import type { TicketConfirmationType, TrainType } from "@/lib/types";
import TicketConfirmation from "./agents/train-booking/ticket-confirmation";

export default function Chat() {
  const { messages, addMessage } = useMessagesStore();
  const { socket } = useSocket();

  useEffect(() => {
    function onMessageRecieved(message: {
      response: string;
      train_list?: TrainType[];
      ticket?: TicketConfirmationType;
      type: "text" | "train_list" | "confirmation";
    }) {
      const { response, train_list, type, ticket } = message;
      addMessage({
        text: response,
        trains: train_list,
        type,
        sender: "ai",
        ticket: ticket,
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
            {msg.type === "confirmation" && msg.ticket && (
              <TicketConfirmation ticket={msg.ticket} />
            )}
          </AIMessageWrapper>
        )
      )}
    </section>
  );
}
