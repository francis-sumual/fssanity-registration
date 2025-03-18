import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const justRegistered = searchParams.registered === "true";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted py-12">
      <div className="container grid flex-1 items-center justify-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Login to Your Account</h1>
          <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/" className="text-primary underline underline-offset-4">
              Cancel
            </Link>
          </p>
        </div>
        <div className="mx-auto w-full max-w-md space-y-6 bg-background p-6 rounded-lg shadow-sm">
          {justRegistered && (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Account created successfully! Please log in.</p>
                </div>
              </div>
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
