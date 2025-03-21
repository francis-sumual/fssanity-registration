import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FSDevelopment. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
            Petunjuk
          </Link>
          <Link href="#registration" className="text-sm font-medium hover:underline underline-offset-4">
            Daftar Tugas
          </Link>
          <Link href="#attendees" className="text-sm font-medium hover:underline underline-offset-4">
            List Pendaftaran
          </Link>
        </nav>
      </div>
    </footer>
  );
}
