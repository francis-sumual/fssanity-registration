import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getHomePageContent } from "@/lib/sanity";

export default async function HeroSection() {
  const homeData = await getHomePageContent();
  const hero = homeData?.hero || {
    title: "Welcome to Our Platform",
    description:
      "Our platform provides the tools you need to succeed. Sign up today and join our community of innovators.",
    buttonText: "Get Started",
    buttonLink: "/login",
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{hero.title}</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{hero.description}</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button>{hero.buttonText || "Get Started"}</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          </div>
          {/* <div className="flex items-center justify-center">
            {hero.image ? (
              <Image
                src={hero.image.url || "/placeholder.svg"}
                alt={hero.title}
                width={400}
                height={300}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="relative h-[300px] w-[400px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-muted-foreground">
                <span className="text-lg font-medium">Hero Image</span>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </section>
  );
}
