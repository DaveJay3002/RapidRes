"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export function Login() {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button size="sm" variant="secondary" onClick={() => loginWithRedirect()}>
      Login
    </Button>
  );
}

export function Logout() {
  const { logout } = useAuth0();
  return (
    <p size="sm" variant="secondary" onClick={() => logout()}>
      Login
    </p>
  );
}
