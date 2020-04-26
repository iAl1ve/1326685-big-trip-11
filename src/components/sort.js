import AbstractComponent from "./abstract-component.js";
import {SORTS_NAME} from "../const.js";

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
  const sortsMarkup = sorts.map((it, i) => createTripSortMarkup(it, i === 0)).join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortsMarkup}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(sorts) {
    super();
    this._sorts = sorts;
    this._currenSortType = null;
    this._element = null;
  }

  getTemplate() {
    return createTripSortTemplate(this._sorts);
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.htmlFor;

      if (this._currenSortType !== sortType) {
        this._currenSortType = sortType;

        // Изменяем стили в соответсвии с макетом, если это не сортировка по умолчанию
        if (document.querySelector(`label[for="${this._currenSortType}"]`).textContent !== SORTS_NAME[0]) {
          const activeBtnSort = document.querySelector(`.trip-sort__btn--active`);
          if (activeBtnSort) {
            activeBtnSort.classList.remove(`trip-sort__btn--active`, `trip-sort__btn--by-increase`);
          }
          evt.target.classList.add(`trip-sort__btn--active`, `trip-sort__btn--by-increase`);

          document.querySelector(`.trip-sort__item--day`).textContent = ``;
        } else {
          document.querySelector(`.trip-sort__item--day`).textContent = `Day`;
        }

        document.querySelector(`input[name=trip-sort]:checked`).checked = false;
        document.querySelector(`#${sortType}`).checked = true;

        handler(this._currenSortType);
      }


    });
  }
}
