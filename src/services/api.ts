import { Context, Octokit } from "probot";
import { CommitList, IssueList, PullRequestList, ReleaseList, SearchList, StargazerList } from "../types";

export const listIssues = async (context: Context, { owner, repo, since }): Promise<IssueList> =>
	context.github.paginate(
		context.github.issues.listForRepo.endpoint.merge({
			owner,
			repo,
			state: "all",
			since,
			per_page: 100,
			headers: {
				accept: "application/vnd.github.squirrel-girl-preview",
			},
		}),
	);

export const listPullRequests = async (context: Context, { owner, repo }): Promise<PullRequestList> =>
	context.github.paginate(
		context.github.pulls.list.endpoint.merge({
			owner,
			repo,
			state: "all",
			per_page: 100,
		}),
	);

export const listCommits = async (context: Context, { owner, repo, since }): Promise<CommitList> =>
	context.github.paginate(
		context.github.repos.listCommits.endpoint.merge({
			owner,
			repo,
			since,
			per_page: 100,
		}),
	);

export const listReleases = async (context: Context, { owner, repo }): Promise<ReleaseList> =>
	context.github.paginate(
		context.github.repos.listReleases.endpoint.merge({
			owner,
			repo,
			per_page: 100,
		}),
	);

export const listStargazers = async (context: Context, { owner, repo }): Promise<StargazerList> =>
	context.github.paginate(
		context.github.activity.listStargazersForRepo.endpoint.merge({
			owner,
			repo,
			per_page: 100,
			headers: {
				accept: "application/vnd.github.v3.star+json",
			},
		}),
	);

export const searchIssues = async (context: Context, { owner, repo, date, author, type }): Promise<SearchList> =>
	context.github.search.issuesAndPullRequests({
		q: `repo:${owner}/${repo} type:${type} author:${author} created:>=${date}`,
		per_page: 100,
	});

export const createIssue = async (
	context: Context,
	{ owner, repo, title, body, labels },
): Promise<Octokit.IssuesCreateResponse> =>
	(await context.github.issues.create({
		owner,
		repo,
		title,
		body,
		labels,
	})).data;

export const createLabel = async (
	context: Context,
	{ owner, repo, name, color, description },
): Promise<Octokit.IssuesCreateLabelResponse> =>
	(await context.github.issues.createLabel({
		owner,
		repo,
		name,
		color,
		description,
	})).data;
