import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoTrainOutline, IoPersonCircleOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const signedIn = true;

export default function Header() {
  const { loginWithRedirect, logout, user } = useAuth0();
  return (
    <header className="shadow-sm bg-background/90 backdrop-filter backdrop-blur-sm w-full flex flex-col fixed top-0 inset-x-0 z-50 horizontal-padding justify-center h-[52px]">
      <div className="h-full w-full flex items-center justify-between">
        <Link to="/" className="flex gap-2 items-center">
          <RiRobot2Line className="w-7 h-7" />
          <p>RapidRes</p>
        </Link>
        <div className="flex items-center gap-4 md:gap-5">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <IoPersonCircleOutline className="text-secondary-foreground w-8 h-8" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="bg-secondary -m-1 p-2">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => loginWithRedirect()}
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
