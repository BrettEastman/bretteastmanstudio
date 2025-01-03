import type { SongList } from "$lib/typesAndInterfaces";
// import { EMAIL, PASSWORD } from "$env/static/private";
import { pbUser } from "$lib/pocketbase";

export const load = async () => {
  try {
    // await pbUser.admins.authWithPassword(EMAIL, PASSWORD);
    const records = await pbUser.collection("songs").getFullList({
      filter: 'instrumentDescription ~ "Guitar"',
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
