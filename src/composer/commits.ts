import groupBy from "lodash.groupby";
import moment from "moment";
import { BOT_NAME } from "../constants";
import { CommitList } from "../types";
import { plural } from "../utils";

export const composeCommits = (commits: CommitList, dateStart: string, dateEnd: string): string => {
	const data: CommitList = (commits || []).filter(
		item => moment(item.commit.committer.date).isBetween(dateStart, dateEnd) && item.author.login !== BOT_NAME,
	);

	let body: string = "## Commits\n\n";

	if (data.length === 0) {
		body += `Last week there were no commits.\n\n`;
	} else {
		body += `Last week there ${plural("was", data, false)} ${plural("commit", data)}.\n\n`;

		for (const [author, authorCommits] of Object.entries(groupBy(data, "author.login"))) {
			body += `\n@${author}\n`;

			for (const item of authorCommits) {
				body += `- [${item.commit.message.split("\n")[0]}](${item.html_url})\n`;
			}
		}
	}

	return body;
};
