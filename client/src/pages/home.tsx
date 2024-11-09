import MultimodalInput from "@/components/multimodal-input";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";

export default function Home() {
  return (
    <main className="px-4 sm:px-0 max-w-2xl mx-auto">
      <section className="text-center text-sm text-muted-foreground mt-10 max-w-md mx-auto">
        This is an open source project. You can contribute to this project by
        adding more agents. Integrate your own APIs and make it more powerful.
        Currently it supports only train booking and food ordering. You can add
        more agents like bus booking, hotel booking, etc.
      </section>
      <div className="sm:w-full grid gap-2 fixed bottom-[120px] inset-x-5 sm:inset-x-auto">
        <Suggestion
          text="Help me book trains from Mumbai to Pune"
          href="/chat/train-booking"
        />
        <Suggestion
          text="Show me latest PNR status of my booked train"
          href="/chat/pnr-status"
        />
        <Suggestion
          text="Order Cheeze Pizza from Domino's"
          href="/chat/order-food"
        />
      </div>
      <MultimodalInput />
    </main>
  );
}

function Suggestion({ text, href }: { text: string; href: string }) {
  return (
    <Link
      to={href}
      className="w-full max-w-2xl flex justify-between items-center text-muted-foreground text-sm rounded-lg px-4 py-2 bg-secondary hover:bg-secondary/80 cursor-pointer"
    >
      <p>{text}</p>
      <IoArrowForward className="h-5 w-5" />
    </Link>
  );
}
