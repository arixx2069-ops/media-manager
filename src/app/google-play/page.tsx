import { redirect } from "next/navigation";

export default function GooglePlayRedirect() {
  redirect("/install");
}
