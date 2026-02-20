import { createPocketBaseInstance } from "$lib/pocketbase";
import type { ResourceList } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  try {
    const pbUser = createPocketBaseInstance();
    const records = await pbUser.collection("resources").getFullList({
      sort: "-created",
    });

    const resourceList: ResourceList = records.map((record) => ({
      id: record.id,
      description: record.description,
      instrument: record.instrument,
      pdfLink: record.pdfLink,
      pdfFile: record.pdfFile,
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
