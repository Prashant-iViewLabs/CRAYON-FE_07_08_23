import moment from "moment";
export const convertDatetimeAgo = (value) => {
  return moment.utc(value).local().startOf("seconds").fromNow();
};
export const dateConverter = (value) => {
  return moment(value).format("YYYY-MM-DD");
};

export const dateConverterMonth = (value) => {
  return moment(value).format("DD MMM YYYY");
};

export const monthYear = (value) => {
  return moment(value).format("MMM YYYY");
};

export const yearConverter = (value) => {
  return moment(value).format("YYYY");
};

export const convertDOB = (value) => {
  return moment().diff(moment(value), "years");
};

export const weekConvert = (value) => {
  return moment.duration(value[0], "weeks").asDays();
};
