import CallInfoPage from "@/components/call-info-page";
import { headers } from "next/headers";

export default async function CallsPage() { // Mark the function as async
  // Extract the userId from the headers
  const headersList = await headers(); // Await the Promise
  const userId = headersList.get("x-user-id");

  if (!userId) {
    // Redirect to login if userId is not found
    return <div>Unauthorized. Redirecting to login...</div>;
  }

  return <CallInfoPage userId={userId} />;
}
