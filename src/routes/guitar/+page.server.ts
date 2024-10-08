import PocketBase from "pocketbase";
import type { SongList } from "$lib/typesAndInterfaces";
import { EMAIL, PASSWORD, PB_URL } from "$env/static/private";

const pb = new PocketBase(PB_URL);

export const load = async () => {
  try {
    await pb.admins.authWithPassword(EMAIL, PASSWORD);
    // const records = await pb.collection("songs").getFullList(100, {
    //   sort: "-created",
    // });
    const records = await pb.collection("songs").getList(1, 100, {
      filter: 'instrumentDescription ~ "Guitar"',
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
