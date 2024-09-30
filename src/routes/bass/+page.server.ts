import PocketBase from "pocketbase";
import type { SongList } from "$lib/typesAndInterfaces";
import { EMAIL, PASSWORD } from "$env/static/private";

const pb = new PocketBase("http://173.230.149.14:80");

export const load = async () => {
  try {
    await pb.admins.authWithPassword(EMAIL, PASSWORD);
    // const records = await pb.collection("songs").getFirstListItem("Bass");
    const records = await pb.collection("songs").getList(1, 100, {
      filter: 'instrumentDescription ~ "Bass"',
    });

    const songList: SongList = records.items.map((record) => ({
      songTitle: record.songTitle,
      instrumentDescription: record.instrumentDescription,
      artistName: record.artistName,
      songPdfLink: record.songPdfLink,
    }));

    return { songList };
  } catch (error) {
    console.error("Error fetching songs from PocketBase:", error);
    return { songList: [] };
  }
};
