import AbstractComponent from "./abstract-component.js";
import {upperCaseFirst} from "../utils/common.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};


const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;
  const isBlockFilterButton = (count === 0);
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}"
      ${isChecked ? `checked` : ``} ${isBlockFilterButton ? `disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">${upperCaseFirst(name)}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(cb) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      cb(filterName);
    });
  }
}
