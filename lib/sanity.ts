import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "s33vmf0y",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token:
    process.env.SANITY_API_TOKEN ||
    "skFKmtZ9vjgZ6TtpllKxFxnhbv5XL9ZksQrof3NjoK5NkKw4zh9ewNTmMZDpiNJKXTcUxV0LqftodoUtxUIGSDoFhFcJzBdy8PaihUI58C0vq8wdiyP96r0NlviDfBuUUcrJvBupy3TnwMs7zdO8F1HfT7MEpzIE1PVWHDuzb9NNXfMD9x8J",
  useCdn: false,
  apiVersion: "2023-05-03",
});

// Create a builder for image URLs
const builder = imageUrlBuilder(client);

// Function to generate image URLs
export function urlFor(source: any) {
  return builder.image(source);
}

export async function getHomePageContent() {
  const data = await client.fetch(`
    *[_type == "homePage"][0]{
      hero {
        title,
        description,
        buttonText,
        buttonLink,
        "image": image {
          "url": asset->url
        }
      },
      about {
        title,
        description,
        features[] {
          title,
          description
        },
        "image": image {
          "url": asset->url
        }
      }
    }
  `);

  return data;
}
