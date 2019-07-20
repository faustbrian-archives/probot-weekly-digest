import { getConfig } from "@botamic/toolkit";
import Joi from "@hapi/joi";
import { Context } from "probot";

export const loadConfig = async (context: Context): Promise<Record<string, any>> =>
	(await getConfig(
		context,
		Joi.object({
			weeklyDigest: Joi.object({
				label: Joi.object({
					name: Joi.string().default("Type: Weekly Digest"),
					description: Joi.string().default("The issue is a weekly report of the latest activities."),
					color: Joi.string().default("ffdd44"),
				}).default(),
			}).default(),
		})
			.unknown(true)
			.default(),
	));
