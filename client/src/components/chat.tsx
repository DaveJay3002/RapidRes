import Message, { AIMessageWrapper } from "@/components/message";
import Trains from "@/components/agents/train-booking/trains";
import { useEffect, useRef } from "react";
import { useMessagesStore } from "@/lib/store";
import { useSocket } from "@/components/socket-provider";
import type {
  SummaryType,
  TicketConfirmationType,
  TrainType,
  WidgetType,
} from "@/lib/types";
import TicketConfirmation from "./agents/train-booking/ticket-confirmation";
import BookingSummary from "./agents/train-booking/booking-summary";

export default function Chat() {
  const { messages, addMessage } = useMessagesStore();
  const { socket } = useSocket();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMessageRecieved(message: {
      response: string;
      train_list?: TrainType[];
      ticket?: TicketConfirmationType;
      type: WidgetType;
      summary: SummaryType;
    }) {
      const { response, train_list, type, ticket, summary } = message;
      console.log(response, train_list, type, ticket, summary);
      addMessage({
        text: response,
        trains: train_list,
        type,
        sender: "ai",
        ticket: ticket,
        summary: summary,
      });

      // Check if the user is at the bottom of the chat
      if (chatRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          chatRef.current.scrollTop = scrollHeight; // Scroll to the bottom
        } else {
          chatRef.current.scrollTop = scrollHeight - clientHeight; // Scroll back up
        }
      }
    }
    socket.on("message", onMessageRecieved);

    return () => {
      socket.off("message", onMessageRecieved);
    };
  }, []);

  console.log(socket);
  return (
    <section ref={chatRef} className="flex flex-col gap-4">
      {messages.map((msg, index) =>
        msg.sender === "user" ? (
          <Message key={index.toString()} sender="user" message={msg.text} />
        ) : (
          <AIMessageWrapper key={index.toString()}>
            <Message sender="ai" message={msg.text} />
            {msg.type === "train_list" && msg.trains && (
              <Trains trains={msg.trains} />
            )}
            {msg.type === "confirmation" && msg.ticket && (
              <TicketConfirmation ticket={msg.ticket} />
            )}
            {msg.type === "summary" && msg.summary && (
              <BookingSummary summary={msg.summary} />
            )}
          </AIMessageWrapper>
        )
      )}
    </section>
  );
}
