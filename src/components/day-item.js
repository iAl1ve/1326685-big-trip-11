import {MONTHS} from "../const.js";
import {createElement} from "../utils.js";

const createTripDaysItemTemplate = (index, date) => {
  const str = /(\d{1,4})-(\d{2})-(\d{2})/;
  const dateMonth = str.exec(date);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${date}">${MONTHS[parseInt(dateMonth[2], 10)]} ${dateMonth[3]}</time>
      </div>
    </li>`
  );
};

export default class Day {
  constructor(index, date) {
    this._index = index;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._index, this._date);
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
