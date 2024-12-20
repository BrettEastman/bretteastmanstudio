import { EMAIL, PASSWORD } from "$env/static/private";

import { pb } from "$lib/pocketbase";
import type { SongList } from "$lib/typesAndInterfaces";

export const load = async () => {
  try {
    await pb.admins.authWithPassword(EMAIL, PASSWORD);
    const records = await pb.collection("songs").getFullList({
      filter: 'instrumentDescription ~ "Bass"',
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
