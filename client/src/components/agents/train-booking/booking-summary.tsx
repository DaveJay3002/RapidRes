import type { SummaryType, MessageType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMessagesStore } from "@/lib/store";
import { useSocket } from "@/components/socket-provider";

export default function BookingSummary({ summary }: { summary: SummaryType }) {
  const { addMessage } = useMessagesStore();
  const { socket } = useSocket();
  return (
    <div className="w-full px-4 py-3 rounded-lg bg-muted border grid gap-3">
      <div className="space-y-1">
        <p className="text-muted-foreground">{summary.trainId}</p>
        <p className="text-xl text-secondary-foreground font-medium">
          {summary.train}
        </p>
      </div>
      <Separator />
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {summary.from} - {summary.to}
          </p>
          <p className="bg-muted text-muted-foreground">
            {summary.class} ·
            <span className="text-primary">{summary.totalFare}</span>
          </p>
        </div>
        <p className="text-3xl text-secondary-foreground font-medium">
          {summary.date}
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-3">
        {summary.passengers.map((passenger) => (
          <>
            <p key={passenger.name}>{passenger.name}</p>
            <p key={passenger.name}>{passenger.age}</p>
            <p key={passenger.name}>{passenger.gender}</p>
          </>
        ))}
      </div>
      <p>{summary.contact}</p>
      <Separator />
      <div className="flex items-center justify-between">
        <p>Pay using</p>
        <p className="text-muted-foreground">{summary.upid}</p>
      </div>
      <div className="mt-4 grid space-y-2">
        <Button
          onClick={() => {
            const message: MessageType = {
              text: "Confirm",
              type: "text",
              sender: "user",
            };
            addMessage(message);
            socket.emit("message", "Confirm");
          }}
        >
          Confirm
        </Button>
        <Button
          variant="secondary"
          className="hover:bg-secondary"
          onClick={() => {
            const message: MessageType = {
              text: "Cancel",
              type: "text",
              sender: "user",
            };
            addMessage(message);
            socket.emit("message", "Cancel");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
