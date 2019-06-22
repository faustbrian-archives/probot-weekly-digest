import moment from "moment";
import { BOT_NAME } from "../constants";
import { CommitList } from "../types";
import { plural } from "../utils";

export const composeContributors = (commits: CommitList, dateStart: string, dateEnd: string): string => {
	const data: CommitList = (commits || []).filter(
		item => moment(item.commit.committer.date).isBetween(dateStart, dateEnd) && item.author.login !== BOT_NAME,
	);

	let body: string = "## Contributors\n\n";

	if (data.length === 0) {
		body += `Last week there were no contributors.\n\n`;
	} else {
		const contributors: Array<{ login: string; html_url: string }> = [];

		for (const item of data) {
			contributors.push({ login: item.author.login, html_url: item.author.html_url });
		}

		const uniqueContributors: Array<{ login: string; html_url: string }> = Object.values(
			contributors.reduce((acc, cul) => ({ ...acc, [cul.login]: cul }), {}),
		);

		body += `Last week there ${plural("was", uniqueContributors, false)} ${plural(
			"contributor",
			uniqueContributors,
		)}.\n\n`;

		for (const item of uniqueContributors) {
			body += `@${item.login}`;
		}

		if (uniqueContributors.length) {
			body += `\n\nThank you for your contributions! :tada:\n`;
		}
	}

	return body;
};
