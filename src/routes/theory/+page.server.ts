import type { ResourceList } from "$lib/typesAndInterfaces";
import { pbUser } from "$lib/pocketbase";

export const load = async () => {
  try {
    const records = await pbUser.collection("resources").getFullList({
      sort: "-created",
    });

    const resourceList: ResourceList = records.map((record) => ({
      description: record.description,
      instrument: record.instrument,
      pdfLink: record.pdfLink,
    }));

    resourceList.sort((a, b) => a.description.localeCompare(b.description));
    return { resourceList };
  } catch (error) {
    console.error("Error fetching resources from Pocketbase:", error);
    return { resourceList: [] };
  }
};
