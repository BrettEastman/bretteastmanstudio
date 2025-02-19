import { pbUser } from '$lib/pocketbase';
import type { PageLoad } from './$types';
import type { SongList } from '$lib/typesAndInterfaces';

export const load: PageLoad = async () => {
  try {
    const records = await pbUser.collection("songs").getFullList({
      filter: 'instrumentDescription ~ "Drums"'
    });

    const songList: SongList = records.map(record => ({
      songTitle: record.songTitle,
      instrumentDescription: record.instrumentDescription,
      artistName: record.artistName,
      songPdfLink: record.songPdfLink
    }));

    return {
      songList: songList.sort((a, b) => a.songTitle.localeCompare(b.songTitle))
    };
  } catch (err) {
    console.error('Error loading drums data:', err);
    return {
      songList: [],
      error: 'Failed to load songs. Please try refreshing the page.'
    };
  }
};
