import { pbUser } from "$lib/pocketbase";
import type { PageLoad } from "./$types";
import type { ResourceList } from "$lib/typesAndInterfaces";

export const load: PageLoad = async () => {
  try {
    const records = await pbUser.collection("resources").getFullList({
      sort: "-created",
    });

    const resourceList: ResourceList = records.map((record) => ({
      description: record.description,
      instrument: record.instrument,
      pdfLink: record.pdfLink,
    }));

    return {
      resourceList: resourceList.sort((a, b) =>
        a.description.localeCompare(b.description)
      ),
    };
  } catch (err) {
    console.error("Error loading theory data:", err);
    return {
      resourceList: [],
      error: "Failed to load theory. Please try refreshing the page.",
    };
  }
};
