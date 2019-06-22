import { Context } from "probot";
import getConfig from "probot-config";

export const loadConfig = async (context: Context): Promise<Record<string, any>> => {
	const { weeklyDigest } = await getConfig(context, "botamic.yml", {
		weeklyDigest: {
			label: {
				name: "Type: Weekly Digest",
				description: "The issue is a weekly report of the latest activities.",
				color: "ffdd44",
			},
		},
	});

	return weeklyDigest;
};
