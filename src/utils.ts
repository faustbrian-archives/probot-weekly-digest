import moment from "moment";
import pluralize from "pluralize";
import { APP_NAME } from "./constants";
import { searchIssues } from "./services/api";

export const dateStart = () =>
	moment
		.utc()
		.subtract(7, "days")
		.startOf("day")
		.format();

export const dateEnd = () =>
	moment
		.utc()
		.endOf("day")
		.format();

export const getPreviousDay = (date: string) =>
	moment(date)
		.subtract(1, "days")
		.format();

export const plural = (word: string, data: any, withNumber: boolean = true): string =>
	pluralize(word, typeof data === "number" ? data : data.length || 0, withNumber);

export const dateHuman = (date: string): string => moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");

export const isSunday = (): boolean =>
	moment()
		.utc()
		.isoWeekday() === 7;

// tslint:disable-next-line: no-shadowed-variable
export const hasDuplicates = async (context, { owner, repo, dateStart }) =>
	(await searchIssues(context, {
		owner,
		repo,
		date: getPreviousDay(dateStart).substr(0, 19),
		author: `app/${APP_NAME}`,
		type: "issues",
	})).data.total_count >= 1;
