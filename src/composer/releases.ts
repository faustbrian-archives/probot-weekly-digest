import moment from "moment";
import { ReleaseList } from "../types";
import { plural } from "../utils";

export const composeReleases = (releases: ReleaseList, dateStart: string, dateEnd: string): string => {
	const data: ReleaseList = (releases || []).filter(item => moment(item.published_at).isBetween(dateStart, dateEnd));

	let body: string = "## Releases\n\n";

	if (data.length === 0) {
		body += `Last week there were no releases.\n\n`;
	} else {
		body += `Last week there ${plural("was", data, false)} ${plural("release", data)}.\n\n`;

		for (const item of data) {
			body += `- [${item.name || item.tag_name}](${item.html_url})\n`;
		}
	}

	return body;
};
