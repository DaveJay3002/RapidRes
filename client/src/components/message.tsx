import { RiRobot2Line } from "react-icons/ri";

export default function Message({
  sender,
  message,
}: {
  sender: "user" | "ai";
  message: string;
}) {
  return (
    <div
      className={`flex items-start gap-4 ${
        sender === "user" && "justify-end slide-up"
      }`}
    >
      <p className="max-w-[80%] break-words">{message}</p>
    </div>
  );
}

export function AIMessageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 slide-up">
      <div className="border rounded-lg p-1">
        <RiRobot2Line className="text-muted-foreground w-4 h-4" />
      </div>
      <div className="space-y-2 w-full sm:w-[80%]">{children}</div>
    </div>
  );
}
