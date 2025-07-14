import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getHomePageContent } from "@/lib/sanity";

export default async function HeroSection() {
  const homeData = await getHomePageContent();
  const hero = homeData?.hero || {
    title: "Welcome to Our Platform",
    description:
      "Our platform provides the tools you need to succeed. Sign up today and join our community of innovators.",
    buttonText: "Get Started",
    buttonLink: "#registration",
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="flex items-center justify-center mb-10">
        {hero.image ? (
          <Image src={"/backdrop.png"} alt={hero.title} width={600} height={400} className="rounded-lg object-cover" />
        ) : (
          <div className="relative h-[300px] w-[400px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-muted-foreground">
            <span className="text-lg font-medium">Hero Image</span>
          </div>
        )}
      </div>
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{hero.title}</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{hero.description}</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#registration">
                <Button>{hero.buttonText || "Get Started"}</Button>
              </Link>
              <Link href="#attendees">
                <Button variant="outline">Lihat Pendaftaran</Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {hero.image ? (
              <Image
                src={hero.image.url || "/placeholder.svg"}
                alt={hero.title}
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="relative h-[300px] w-[400px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-muted-foreground">
                <span className="text-lg font-medium">Hero Image</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
