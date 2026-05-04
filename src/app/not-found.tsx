import { redirect } from "next/navigation";

/** Unknown routes → home (no standalone 404 UI). */
export default function NotFound() {
  redirect("/");
}
