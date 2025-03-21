import { SignupForm } from "@/components/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted py-12">
      <div className="container grid flex-1 items-center justify-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Sign up to get access to our platform and start exploring</p>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline underline-offset-4">
              Login here
            </Link>
          </p>
        </div>
        <div className="mx-auto w-full max-w-md space-y-6 bg-background p-6 rounded-lg shadow-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
