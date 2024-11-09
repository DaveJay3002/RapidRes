import { Link } from "react-router-dom";

export default function NotFoundPage({
  type,
}: {
  type: "conversation" | "default";
}) {
  return (
    <>
      <div className="h-[70vh] grid place-items-center">
        <div className="text-center grid gap-y-3">
          <h1 className="leading-tight text-3xl font-semibold lg:text-4xl capitalize">
            {type === "default" ? "Page" : "Conversation"} not found
          </h1>
          <p className="text-secondary-foreground">
            The {type === "default" ? "page" : "conversation"} you are looking
            for does not exist.
          </p>
          <Link to="/" className="w-fit px-3 mx-auto mt-3 text-primary">
            Return home
          </Link>
        </div>
      </div>
    </>
  );
}
