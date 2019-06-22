import { Application, Context } from "probot";
import createScheduler from "probot-scheduler";
import { SCHEDULE_INTERVAL } from "./constants";
import { createLabel } from "./services/api";
import { loadConfig } from "./services/config";
import { createDigest } from "./services/digest";
import { dateEnd, dateStart, hasDuplicates, isSunday } from "./utils";

const createLabelIfNotExist = async (context: Context, owner: string, repo: string) => {
	const { label } = await loadConfig(context);

	try {
		await createLabel(context, {
			owner,
			repo,
			name: label.name,
			color: label.color,
			description: label.description,
		});
	} catch {
		// do nothing...
	}
};

export = async (robot: Application) => {
	robot.on(["installation.created", "installation_repositories"], async context => {
		let repositories = [];
		if (context.event === "installation" && context.payload.action === "created") {
			repositories = context.payload.repositories;
		} else if (context.event === "installation_repositories") {
			repositories = context.payload.repositories_added;
		}

		for (const item of repositories) {
			const [owner, repo] = item.full_name.split("/");

			robot.log(`[INSTALL] ${owner}/${repo}`);

			await createLabelIfNotExist(context, owner, repo);
		}
	});

	createScheduler(robot, { delay: 0, interval: SCHEDULE_INTERVAL });

	robot.on("schedule.repository", async context => {
		const { owner, repo } = context.repo();
		robot.log(`[SCHEDULE] ${owner}/${repo}`);

		if (await hasDuplicates(context, { owner, repo, dateStart: dateStart() })) {
			robot.log(`Weekly Digest for [${owner}/${repo}] has already been published.`);
			return;
		}

		if (isSunday()) {
			await createDigest(context, { owner, repo, dateStart: dateStart(), dateEnd: dateEnd() });
		}
	});
};
