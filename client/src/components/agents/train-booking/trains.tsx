import type { MessageType, TrainType } from "@/lib/types";
import { useMessagesStore } from "@/lib/store";
import { useSocket } from "@/components/socket-provider";

export default function Trains({ trains }: { trains: TrainType[] }) {
  return (
    <div className="bg-muted p-2 rounded-lg shadow-sm">
      {trains.map((train) => (
        <Train train={train} key={train.train_id} />
      ))}
    </div>
  );
}

function Train({ train }: { train: TrainType }) {
  const { addMessage } = useMessagesStore();
  const { socket } = useSocket();

  return (
    <div
      className="w-full p-2 space-y-3 hover:rounded-lg hover:bg-secondary/80 cursor-pointer border-b"
      onKeyUp={() => console.log("key up")}
      onClick={() => {
        const message: MessageType = {
          text: train.train_id,
          type: "text",
          sender: "user",
        };
        addMessage(message);
        socket.emit("message", message);
      }}
    >
      <div className="gap-1 grid grid-cols-[2fr_1fr] ">
        <div>
          <p className="font-medium text-secondary-foreground">
            {train.train_name}
          </p>
          <p className="text-sm text-muted-foreground">{train.train_id}</p>
        </div>
        <div>
          <p className="text-secondary-foreground">
            {train.departure_time} – {train.arrival_time}
          </p>
          <p className="text-sm text-muted-foreground">
            {train.departure_station} - {train.arrival_station}
          </p>
        </div>
      </div>
      <div className="w-full grid grid-cols-2">
        {train.classes.map((cls) => (
          <div key={cls.class_type}>
            <p className="text-muted-foreground">{cls.class_type}</p>
            <p className="text-primary">₹{cls.fare}</p>
            <p className="text-sm text-muted-foreground">
              {cls.seats_available} seats left
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
