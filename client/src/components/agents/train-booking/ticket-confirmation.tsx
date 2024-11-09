import type { TicketConfirmationType } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export default function TicketConfirmation({
  ticket,
}: {
  ticket: TicketConfirmationType;
}) {
  return (
    <div className="w-full px-4 py-3 rounded-lg bg-muted border space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">PNR-{ticket.pnr}</p>
          <p className="text-xl text-secondary-foreground font-medium">
            {ticket.train_name}
          </p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <p className="w-fit font-normal text-sm px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
            {ticket.seat}
          </p>
          <p className="text-sm font-normal text-muted-foreground">
            Coach {ticket.coach}
          </p>
        </div>
      </div>
      <Separator />
      <p className="text-3xl">{ticket.boarding_time}</p>
    </div>
  );
}
