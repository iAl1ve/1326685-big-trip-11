import AbstractSmartComponent from "./abstract-smart-component.js";
import {upperCaseFirst, activateElement} from "../utils/common.js";

const createMenuItem = (name, isChecked) => {
  return (
    `<a class="trip-tabs__btn  ${isChecked ? `trip-tabs__btn--active` : ``}" href="#">${upperCaseFirst(name)}</a>`
  );
};

const createMenuTemplate = (menuItems) => {
  const menuMarkup = Object.values(menuItems).map((it, i) => createMenuItem(it, i === 0)).join(`\n`);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkup}
    </nav>`
  );
};

export default class Menu extends AbstractSmartComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;

    this._menuTypeChangeHandler = null;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this.setOnChange(this._menuTypeChangeHandler);
  }

  setOnChange(cb) {
    this.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.textContent.toLowerCase();
      activateElement(evt.target, this.getElement(), `trip-tabs__btn--active`);
      this._menuTypeChangeHandler = menuItem;
      cb(this._menuTypeChangeHandler);
    });
  }
}
