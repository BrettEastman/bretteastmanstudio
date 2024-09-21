import PocketBase from "pocketbase";
import fs from "fs/promises";
import { EMAIL, PASSWORD } from "$env/static/private";

const pb = new PocketBase("http://173.230.149.14:80");

const seedDatabase = async () => {
  try {
    const data = await fs.readFile("src/data/info.json", "utf-8");
    const songs = JSON.parse(data);

    // Authenticate with admin credentials (if needed)
    await pb.admins.authWithPassword(EMAIL, PASSWORD);

    // Iterate over the songs and create records in the PocketBase collection
    for (const song of songs) {
      await pb.collection("songs").create({
        songTitle: song.songTitle,
        instrumentDescription: song.instrumentDescription,
        artistName: song.artistName,
        songPdfLink: song.songPdfLink,
      });
      console.log(`Seeded: ${song.songTitle}`);
    }

    console.log("All songs seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
