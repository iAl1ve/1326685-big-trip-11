import {MONTHS} from "../const.js";
import {createElement} from "../utils.js";

const createTripInfoTemplate = (days, months, cities) => {
  let tripTitle = ``;
  let tripDates = days[0] ? `${days[0]}&nbsp;&mdash;&nbsp;${days[days.length - 1]}` : ``;
  if (cities.length < 3) {
    cities.forEach((city, index) => {
      tripTitle += index < cities.length > 1 ? `${tripTitle} &mdash;` : `${tripTitle}`;
    });
  } else {
    tripTitle = `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>
        <p class="trip-info__dates">${MONTHS[months[0]] ? MONTHS[months[0]] : ``} ${tripDates}</p>
      </div>
    </section>`
  );
};

export default class TripInfo {
  constructor(days, months, cities) {
    this._days = days;
    this._months = months;
    this._cities = cities;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._days, this._months, this._cities);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
