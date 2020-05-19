import AbstractSmartComponent from "./abstract-smart-component.js";
import {activateElement} from "../utils/common.js";
import {SortItem} from "../const.js";

const createTripSortMarkup = (name, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${name.toLowerCase()}">
      <input id="sort-${name.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name.toLowerCase()}"
      ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${name.toLowerCase()}">${name}</label>
    </div>`
  );
};

const createTripSortTemplate = (sorts) => {
  const sortsMarkup = Object.values(sorts).map((it, i) => createTripSortMarkup(it, i === 0)).join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortsMarkup}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractSmartComponent {
  constructor(sorts) {
    super();
    this._sorts = sorts;
    this._currentSortType = null;

    this._sortTypeChangeHandler = null;
  }

  getTemplate() {
    return createTripSortTemplate(this._sorts);
  }

  rerender() {
    super.rerender();
  }

  // Сбрасывает значение фильтра на дефолтное
  reset() {
    this._currentSortType = `sort-${SortItem.EVENT}`;
    this.rerender();
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  setSortTypeChangeHandler(cb) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.htmlFor;

      if (this._currentSortType !== sortType) {
        this._currentSortType = sortType;

        // Изменяем стили в соответсвии с макетом, если это сортировка по умолчанию
        if (this.getElement().textContent === SortItem.EVENT) {
          document.querySelector(`.trip-sort__item--day`).textContent = `Day`;
        } else {
          document.querySelector(`.trip-sort__item--day`).textContent = ``;
        }

        activateElement(evt.target, this.getElement(), `trip-sort__btn--active`);

        document.querySelector(`#${sortType}`).checked = true;

        cb(this._currentSortType);
      }
    });

    this._sortTypeChangeHandler = cb;
  }
}
