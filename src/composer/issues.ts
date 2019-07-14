import groupBy from "lodash.groupby";
import moment from "moment";
import { IssueList } from "../types";
import { plural } from "../utils";

const renderSection = (title: string, issues: IssueList, action): string => {
	let body: string = `### ${title}\n\n`;

	for (const [author, authorIssues] of Object.entries(groupBy(issues, "user.login"))) {
		body += `\n@${author}\n`;

		for (const item of authorIssues) {
			body += action(item);
		}
	}

	return body;
};

const getLikes = item => item.reactions["+1"] + item.reactions.laugh + item.reactions.hooray + item.reactions.heart;

export const composeIssues = (issues: IssueList, dateStart: string, dateEnd: string): string => {
	const data: IssueList = (issues || []).filter(
		item =>
			moment(item.created_at).isBetween(dateStart, dateEnd) && item.user.login !== `${process.env.APP_NAME}[bot]`,
	);

	let body: string = `## Issues\n\n`;

	if (data.length === 0) {
		body += `Last week, no issues were created.\n\n`;
	} else {
		body += `Last week ${plural("issue", data)} ${plural("was", data, false)} created. `;

		const openIssues: IssueList = data.filter(item => item.state === "open");
		const closedIssues: IssueList = data.filter(item => item.state === "closed");

		if (data.length === 1 && openIssues.length === 1) {
			body += `It is still open.\n\n`;
		} else if (data.length === 1 && closedIssues.length === 1) {
			body += `It is closed now.\n\n`;
		} else {
			body += `Of these, ${plural("issue", closedIssues)} have been closed and ${plural(
				"issue",
				openIssues,
			)} are still open.\n\n`;
		}

		if (openIssues.length > 0) {
			body += renderSection(
				"Opened",
				openIssues,
				item => `- #${item.number} [${item.title}](${item.html_url})\n`,
			);
		}

		if (closedIssues.length > 0) {
			body += renderSection(
				"Closed",
				closedIssues,
				item => `- #${item.number} [${item.title}](${item.html_url})\n`,
			);
		}

		const likedIssues: IssueList = data
			.filter(item => getLikes(item) > 0)
			.sort((a, b) => {
				return getLikes(b) - getLikes(a);
			})
			.slice(0, 5);

		if (likedIssues.length > 0) {
			body += renderSection(
				"Liked",
				likedIssues,
				item =>
					`- #${item.number} [${item.title}](${item.html_url}) _(It received :+1: x${item.reactions["+1"]}, :smile: x${item.reactions.laugh}, :tada: x${item.reactions.hooray} and :heart: x${item.reactions.heart}.)_\n`,
			);
		}

		const noisyIssues: IssueList = data
			.filter(item => item.comments > 0)
			.sort((a, b) => b.comments - a.comments)
			.slice(0, 5);

		if (noisyIssues.length > 0) {
			body += renderSection(
				"Noisy",
				noisyIssues,
				item =>
					`- #${item.number} [${item.title}](${item.html_url}) _(It received ${plural(
						"comment",
						item.comments,
					)}.)_\n`,
			);
		}
	}

	return body;
};
