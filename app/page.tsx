import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import Footer from "@/components/footer";
import { PublicRegistrationForm } from "@/components/public-registration-form";
import { PublicRegistrationList } from "@/components/public-registration-list";
import { fetchActiveGatherings, fetchGroups, fetchMembers, fetchRegistrations } from "@/lib/actions";

// Add this at the top of the file, after the imports
export const dynamic = "force-dynamic";

// Define the Registration type
interface Registration {
  _id: string;
  gatheringId: string;
  memberId: string;
}

// Define the Gathering type
interface Gathering {
  _id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export default async function Home() {
  // Fetch data for registration form and list
  const [gatherings, groups, members, registrations] = await Promise.all([
    fetchActiveGatherings(),
    fetchGroups(),
    fetchMembers(),
    fetchRegistrations(),
  ]);

  // Create a list of existing registrations for filtering
  const existingRegistrations = registrations.map((reg: Registration) => ({
    gatheringId: reg.gatheringId,
    memberId: reg.memberId,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span>FSDevelopment</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              Petunjuk
            </Link>
            <Link href="#registration" className="text-sm font-medium hover:underline underline-offset-4">
              Registration
            </Link>
            <Link href="#attendees" className="text-sm font-medium hover:underline underline-offset-4">
              List Pendaftaran
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <AboutSection />

        {/* Registration Section */}
        <section id="registration" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sistim Pendaftaran Prodiakon</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tugas Misa Tri Hari Suci
                </p>
              </div>
            </div>

            {gatherings.length > 0 ? (
              <div className="mx-auto max-w-3xl">
                <PublicRegistrationForm
                  gatherings={gatherings}
                  groups={groups}
                  members={members}
                  existingRegistrations={existingRegistrations}
                />
              </div>
            ) : (
              <div className="text-center p-8 bg-background rounded-lg shadow-sm max-w-md mx-auto">
                <p className="text-muted-foreground">Tidak ada Misa yang available saat ini.</p>
              </div>
            )}
          </div>
        </section>

        {/* Attendees Section */}
        <section id="attendees" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Prodiakon/Prodiakones yang sudah terdaftar
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Lihat pendaftaran
                </p>
              </div>
            </div>

            {gatherings.length > 0 ? (
              <div className="mx-auto max-w-4xl space-y-8">
                {gatherings.map((gathering: Gathering) => (
                  <PublicRegistrationList
                    key={gathering._id}
                    registrations={registrations}
                    gatheringId={gathering._id}
                    gatheringTitle={gathering.title}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-background rounded-lg shadow-sm max-w-md mx-auto">
                <p className="text-muted-foreground">Tidak ada Misa yang available saat ini.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
