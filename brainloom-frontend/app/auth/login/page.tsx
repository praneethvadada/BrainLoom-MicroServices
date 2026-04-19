// Redirect old /auth/login → /superadmin/login
// The dedicated login pages are now at their service-specific URLs

import { redirect } from "next/navigation";

export default function OldLoginRedirect() {
  redirect("/superadmin/login");
}
