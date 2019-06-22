import moment from "moment";

import { Context } from "probot";
import { composeBody } from "../composer";
import { createIssue } from "./api";
import { loadConfig } from "./config";

const formatDate = (date: string): string => moment(date).format("MMM DD, YYYY");

export const createDigest = async (context: Context, { owner, repo, dateStart, dateEnd }): Promise<void> => {
	const { label } = await loadConfig(context);

	await createIssue(context, {
		owner,
		repo,
		title: `[Weekly Digest] ${formatDate(dateStart)} - ${formatDate(dateEnd)}`,
		body: await composeBody(context, { owner, repo, dateStart, dateEnd }),
		labels: [label.name],
	});
};
