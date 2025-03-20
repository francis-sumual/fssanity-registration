import { getHomePageContent } from "@/lib/sanity";

// Define the Feature type
interface Feature {
  title: string;
  description: string;
}

// Define the About type
interface About {
  title: string;
  description: string;
  features: Feature[];
  image?: {
    url: string;
  };
}

export default async function AboutSection() {
  const homeData = await getHomePageContent();
  const about: About = homeData?.about || {
    title: "Tata Cara Pendaftaran",
    description: "Perhatikan petunjuk dibawah untuk mendaftar, jika ada masalah silahkan hubungi ketua kelompok anda.",
    features: [
      {
        title: "Petunjuk pertama",
        description: "Pilih Jadwal Misa.",
      },
      {
        title: "Petunjuk Kedua",
        description: "Pilih Kelompok.",
      },
      {
        title: "Petunjuk Ketiga",
        description: "Pilih Nama Anda dan Klik Daftar.",
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
              {about.features?.map((feature: Feature, index: number) => (
                <li key={index}>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
