import { getHomePageContent } from "@/lib/sanity";

export default async function AboutSection() {
  const homeData = await getHomePageContent();
  const about = homeData?.about || {
    title: "About Us",
    description:
      "We are a team of passionate individuals dedicated to providing the best service to our customers. Our mission is to empower businesses with innovative solutions.",
    features: [
      {
        title: "Our Vision",
        description: "To be the leading provider of innovative solutions in our industry.",
      },
      {
        title: "Our Values",
        description: "Integrity, excellence, innovation, and customer satisfaction.",
      },
      {
        title: "Our Team",
        description: "A diverse group of experts committed to delivering exceptional results.",
      },
    ],
  };

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{about.title}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {about.description}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              {about.features?.map((feature, index) => (
                <li key={index}>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="flex items-center justify-center">
            {about.image ? (
              <Image
                src={about.image.url || "/placeholder.svg"}
                alt={about.title}
                width={400}
                height={300}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="relative h-[300px] w-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-muted-foreground">
                <span className="text-lg font-medium">About Image</span>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </section>
  );
}
