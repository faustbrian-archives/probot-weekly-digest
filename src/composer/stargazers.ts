import moment from "moment";
import { plural } from "../utils";

export const composeStargazers = (stargazers: any[], dateStart: string, dateEnd: string): string => {
	const data: any[] = (stargazers || []).filter(item => moment(item.starred_at).isBetween(dateStart, dateEnd));

	let body: string = `## Star Gazers\n\n`;

	if (data.length === 0) {
		body += `Last week there were no stargazers.\n\n`;
	} else {
		body += `Last week there ${plural("was", data, false)} ${plural("stargazer", data)}.\n\n`;

		for (const item of data) {
			body += `- [${item.user.login}](${item.user.html_url})\n`;
		}

		body += `\nYou are the ${plural("star", data)}! :star2:\n`;
	}

	return body;
};
