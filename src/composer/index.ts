import { Context } from "probot";
import { listCommits, listIssues, listPullRequests, listReleases, listStargazers } from "../services/api";
import { CommitList } from "../types";
import { dateHuman } from "../utils";
import { composeCommits } from "./commits";
import { composeContributors } from "./contributors";
import { composeIssues } from "./issues";
import { composePullRequests } from "./pull-requests";
import { composeReleases } from "./releases";
import { composeStargazers } from "./stargazers";

export const composeBody = async (
	context: Context,
	{ owner, repo, dateStart, dateEnd }: { owner: string; repo: string; dateStart: string; dateEnd: string },
) => {
	let body: string = `Here's the **Weekly Digest** from **${dateHuman(dateStart)}** to **${dateHuman(
		dateEnd,
	)}** for [*${owner}/${repo}*](https://github.com/${owner}/${repo}):\n`;

	const commits: CommitList = await listCommits(context, { owner, repo, since: dateStart });

	body += `\n-----\n\n`;
	body += composeIssues(await listIssues(context, { owner, repo, since: dateStart }), dateStart, dateEnd);

	body += `\n-----\n\n`;
	body += composePullRequests(await listPullRequests(context, { owner, repo }), dateStart, dateEnd);

	body += `\n-----\n\n`;
	body += composeCommits(commits, dateStart, dateEnd);

	body += `\n-----\n\n`;
	body += composeContributors(commits, dateStart, dateEnd);

	body += `\n-----\n\n`;
	body += composeStargazers(await listStargazers(context, { owner, repo }), dateStart, dateEnd);

	body += `\n-----\n\n`;
	body += composeReleases(await listReleases(context, { owner, repo }), dateStart, dateEnd);

	body += `\n-----\n\n`;
	body += `That's all activities since ${dateHuman(
		dateStart,
	)}, please _**Watch**_ and _**Star**_ the repository [*${owner}/${repo}*](https://github.com/${owner}/${repo}) to receive upcoming weekly updates.\n\n`;
	body += `*You can also [view all Weekly Digests by clicking here](https://github.com/${owner}/${repo}/issues?q=is:open+is:issue+label:"Type:+Weekly+Digest").* \n\n`;

	return body;
};
