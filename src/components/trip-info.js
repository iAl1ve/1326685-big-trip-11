import AbstractComponent from "./abstract-component.js";
import {MONTHS} from "../const.js";

const createTripInfoTemplate = (days, months, cities) => {
  let tripTitle = ``;

  const tripDates = days[0] ? `${days[0]}&nbsp;&mdash;&nbsp;${days[days.length - 1]}` : ``;
  if (cities.length < 3) {
    cities.forEach((city, index) => {
      tripTitle += index.name < cities.length > 1 ? `${tripTitle} &mdash;` : `${tripTitle}`;
    });
  } else {
    tripTitle = `${cities[0].name} &mdash; ... &mdash; ${cities[cities.length - 1].name}`;
  }

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${tripTitle}</h1>
      <p class="trip-info__dates">${MONTHS[months[0]] ? MONTHS[months[0]] : ``} ${tripDates}</p>
    </div>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(days, months, cities) {
    super();
    this._days = days;
    this._months = months;
    this._cities = cities;
  }

  getTemplate() {
    return createTripInfoTemplate(this._days, this._months, this._cities);
  }
}
