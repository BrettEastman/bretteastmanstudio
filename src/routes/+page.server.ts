// We import data from the JSON file. This is for simplicity purposes. In the real app, you would likely fetch this data from a database by making an API call.
import songs from "../data/info.json";
import type { SongList } from "../types";

const songList: SongList = songs;

// Last, we define a load function that will return an object with the assigned data. SvelteKit will automatically call this function when the page is requested. So, the magic for SSR code happens here as we fetch the data in the server and build the HTML with the data we get back.
export const load = () => {
  return {
    songList,
  };
};
