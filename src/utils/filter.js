import {FilterType} from "../const.js";

export const getFutureEvents = (events, date) => {
  return events.filter((event) => event.endDate > date);
};

export const getPastEvents = (events, date) => {
  return events.filter((event) => event.endDate < date);
};

export const getEventsByFilter = (events, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.FUTURE:
      return getFutureEvents(events, nowDate);
    case FilterType.PAST:
      return getPastEvents(events, nowDate);
  }

  return events;
};
