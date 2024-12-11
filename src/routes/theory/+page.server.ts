import type { ResourceList } from "$lib/typesAndInterfaces";
import { EMAIL, PASSWORD } from "$env/static/private";

import { pb } from "$lib/pb";

export const load = async () => {
  try {
    await pb.admins.authWithPassword(EMAIL, PASSWORD);
    const records = await pb.collection("resources").getFullList({
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
