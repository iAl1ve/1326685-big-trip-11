import {createElement} from "../utils.js";

const createTripSortMarkup = (name, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-${name.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name.toLowerCase()}"
      ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${name.toLowerCase()}">${name}</label>
    </div>`
  );
};

const createTripSortTemplate = (sorts) => {
  const sortsMarkup = sorts.map((it, i) => createTripSortMarkup(it, i === 0)).join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortsMarkup}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort {
  constructor(sorts) {
    this._sorts = sorts;
    this._element = null;
  }

  getTemplate() {
    return createTripSortTemplate(this._sorts);
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
