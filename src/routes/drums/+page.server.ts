import { pbUser } from "$lib/pocketbase";
import type { SongList } from "$lib/typesAndInterfaces";
import { error } from '@sveltejs/kit';

export const load = async () => {
  try {
    const records = await pbUser.collection("songs").getFullList({
      filter: 'instrumentDescription ~ "Drums"',
    });

    const songList: SongList = records.map((record) => ({
      songTitle: record.songTitle,
      instrumentDescription: record.instrumentDescription,
      artistName: record.artistName,
      songPdfLink: record.songPdfLink,
    }));

    return {
      songList: songList.sort((a, b) => a.songTitle.localeCompare(b.songTitle)),
    };
  } catch (err) {
    console.error('Error loading drums data:', err);
    throw error(500, {
      message: 'Error loading drums data. Please try again later.'
    });
  }
};
