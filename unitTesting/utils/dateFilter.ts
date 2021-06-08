import { DateTime } from "luxon";
import { Environment } from "nunjucks";
import moment from 'moment-timezone';

let defaultFormat = "yyyy";
export const setDefaultFormat = (format: string) => (defaultFormat = format);

const dateFilter = (date: Date | string, format?: string) => {
  if (date instanceof Date) {
    return DateTime.fromMillis(date.getTime()).toFormat(
      format || defaultFormat
    );
  } else {
    return DateTime.fromMillis(Date.parse(date)).toFormat(
      format || defaultFormat
    );
  }
};

const isoDateFilter = (date: Date | string) => {
  if (date instanceof Date) {
    return DateTime.fromMillis(date.getTime()).toISODate();
  } else {
    return DateTime.fromMillis(Date.parse(date)).toISODate();
  }
};


export default (env: Environment) => {
  env.addFilter("date", dateFilter);
  env.addFilter("isodate", isoDateFilter);
  env.addFilter('timezone', (date: Date | string, timezone: string) => moment(date).tz(timezone));
};
