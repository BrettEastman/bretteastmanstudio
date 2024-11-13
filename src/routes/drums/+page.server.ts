import PocketBase from "pocketbase";
import type { SongList } from "$lib/typesAndInterfaces";
import { EMAIL, PASSWORD, PB_URL } from "$env/static/private";

const pb = new PocketBase(PB_URL);

export const load = async () => {
  try {
    await pb.admins.authWithPassword(EMAIL, PASSWORD);
    // pb.collection.getList is a method that takes 3 arguments: page, pageSize, and options. The options object has a filter property that is a query string that filters the records in the collection according to what the operand dictates. In this case, "~" is the operand and it is used to filter the records in the collection where the instrumentDescription field contains the string "Drums".
    const records = await pb.collection("songs").getFullList({
      filter: 'instrumentDescription ~ "Drums"',
    });

    const songList: SongList = records.map((record) => ({
      songTitle: record.songTitle,
      instrumentDescription: record.instrumentDescription,
      artistName: record.artistName,
      songPdfLink: record.songPdfLink,
    }));

    songList.sort((a, b) => a.songTitle.localeCompare(b.songTitle));

    return { songList };
  } catch (error) {
    console.error("Error fetching songs from PocketBase:", error);
    return { songList: [] };
  }
};
