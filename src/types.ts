import { Octokit } from "probot";

export type IssueList = Array<Octokit.IssuesListForRepoResponseItem & { reactions?: any }>;
export type PullRequestList = Octokit.PullsListResponse;
export type CommitList = Octokit.ReposListCommitsResponse;
export type ReleaseList = Octokit.ReposListReleasesResponse;
export type StargazerList = Octokit.ActivityListStargazersForRepoResponse;
export type SearchList = Octokit.AnyResponse;
