// This page no longer exists — all domain management happens inline on /tutorials
// and /tutorials/[...slug] pages. Redirect permanently.
import { redirect } from "next/navigation";

export default function OldAdminTopicsPage() {
  redirect("/tutorials");
}
