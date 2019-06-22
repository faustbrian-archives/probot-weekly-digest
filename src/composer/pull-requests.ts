import groupBy from "lodash.groupby";
import moment from "moment";
import { BOT_NAME } from "../constants";
import { PullRequestList } from "../types";
import { plural } from "../utils";

const renderSectionByType = (title: string, pullRequests: any): string => {
	let body: string = `### ${title}\n\n`;

	body += `Last week, ${plural("pull request", pullRequests)} ${plural(
		"was",
		pullRequests,
		false,
	)} ${title.toLowerCase()}.\n\n`;

	for (const [author, authorPullRequests] of Object.entries(groupBy(pullRequests, "user.login"))) {
		body += `@${author}\n`;

		for (const item of authorPullRequests) {
			body += `- #${item.number} [${item.title}](${item.html_url})\n`;
		}
	}

	return body;
};

export const composePullRequests = (pullRequests: PullRequestList, dateStart: string, dateEnd: string): string => {
	const data: PullRequestList = (pullRequests || []).filter(item => {
		if (
			moment(item.created_at).isBetween(dateStart, dateEnd) &&
			item.state === "open" &&
			!item.merged_at &&
			moment(item.created_at).isSame(item.updated_at) &&
			item.user.login !== BOT_NAME
		) {
			return true;
		}

		if (
			moment(item.updated_at).isBetween(dateStart, dateEnd) &&
			item.state === "open" &&
			!item.merged_at &&
			item.user.login !== BOT_NAME
		) {
			return true;
		}

		if (
			moment(item.merged_at).isBetween(dateStart, dateEnd) &&
			item.state === "closed" &&
			item.user.login !== BOT_NAME
		) {
			return true;
		}
	});

	let body: string = `## Pull Requests\n\n`;

	if (data.length === 0) {
		body += "Last week, no pull requests were created, updated or merged.\n\n";
	} else {
		body += `Last week, ${plural("pull request", data)} ${plural(
			"was",
			data,
			false,
		)} created, updated or merged.\n\n`;

		const mergedPullRequest: PullRequestList = data.filter(
			item => item.merged_at && moment(item.merged_at).isBetween(dateStart, dateEnd),
		);

		if (mergedPullRequest.length > 0) {
			body += renderSectionByType("Merged", mergedPullRequest);
		}

		const openPullRequest: PullRequestList = data.filter(
			item =>
				moment(item.created_at).isBetween(dateStart, dateEnd) &&
				moment(item.created_at).isSame(item.updated_at) &&
				!item.merged_at,
		);

		if (openPullRequest.length > 0) {
			body += renderSectionByType("Opened", openPullRequest);
		}

		const updatedPullRequest: PullRequestList = data.filter(
			item =>
				moment(item.updated_at).isBetween(dateStart, dateEnd) &&
				!moment(item.updated_at).isSame(item.created_at) &&
				!item.merged_at,
		);

		if (updatedPullRequest.length > 0) {
			body += renderSectionByType("Updated", updatedPullRequest);
		}
	}

	return body;
};
