import { EMAIL, PASSWORD } from "$env/static/private";
import { pb } from "$lib/pocketbase";
import type { SongList } from "$lib/typesAndInterfaces";

export const load = async () => {
  try {
    await pb.admins.authWithPassword(EMAIL, PASSWORD);
    // another option would be pb.collection.getList - a method that takes 3 arguments: page, pageSize, and options. The options object has a filter property that is a query string that filters the records in the collection according to what the operand dictates. In this case, "~" is the operand and it is used to filter the records in the collection where the instrumentDescription field contains the string "Drums".
    const records = await pb.collection("songs").getFullList({
      filter: 'instrumentDescription ~ "Drums"',
    });

    const songList: SongList = records.map((record) => ({
      songTitle: record.songTitle,
      instrumentDescription: record.instrumentDescription,
      artistName: record.artistName,
      songPdfLink: record.songPdfLink,
    }));

    // localeCompare is a method of string values that returns a number indicating whether this string comes before, or after, or is the same as the given string in sort order.
    songList.sort((a, b) => a.songTitle.localeCompare(b.songTitle));

    return { songList };
  } catch (error) {
    console.error("Error fetching songs from PocketBase:", error);
    return { songList: [] };
  }
};
