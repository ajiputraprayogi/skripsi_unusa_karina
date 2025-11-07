import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/backend");
  return null; // tidak render apa-apa karena langsung redirect
}