import { Textarea } from "@/components/ui/textarea";
import {
  IoArrowUpCircle,
  IoPauseCircleOutline,
  IoMicCircleOutline,
} from "react-icons/io5";
import { useState } from "react";
import { useMessagesStore } from "@/lib/store";
import { useSocket } from "@/components/socket-provider";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

export default function MultimodalInput() {
  const { addMessage } = useMessagesStore();
  const { socket } = useSocket();

  const [text, setText] = useState("");
  const inProgress = false;
  const isPlaying = false;

  // const {
  //   transcript,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition,
  // } = useSpeechRecognition();

  // if (!browserSupportsSpeechRecognition) {
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Check for Enter key without Shift
      e.preventDefault();
      addMessage({
        text,
        type: "text",
        sender: "user",
      });
      socket.emit("message", text);
      setText("");
    }
  };
  const listening = false;
  return (
    <div className="px-4 bg-background grid place-items-center fixed bottom-0 inset-x-0 pt-4 pb-5 sm:inset-x-auto sm:w-full sm:max-w-2xl sm:px-0">
      <Textarea
        placeholder="Type your message..."
        className="bg-muted resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-end gap-2 absolute bottom-7 right-7 sm:right-2">
        {listening ? (
          <IoPauseCircleOutline
            className="h-8 w-8 text-primary border-muted-foreground hover:text-primary/80"
            // onClick={SpeechRecognition.stopListening}
          />
        ) : (
          <>
            {!text && (
              <IoMicCircleOutline
                className={`h-8 w-8 text-muted-foreground hover:text-muted-foreground/80 ${
                  inProgress && "text-muted-foreground/50"
                }`}
                // onClick={SpeechRecognition.startListening}
              />
            )}
            <IoArrowUpCircle
              className={`h-8 w-8 text-primary hover:text-primary/80 ${
                inProgress && "text-primary/50"
              }`}
              onClick={() => {
                addMessage({
                  text,
                  type: "text",
                  sender: "user",
                });
                socket.emit("message", text);
                setText("");
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
