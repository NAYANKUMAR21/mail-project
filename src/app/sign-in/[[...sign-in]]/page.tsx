import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <span className="flex h-screen items-center justify-center">
      <SignIn />
    </span>
  );
}
