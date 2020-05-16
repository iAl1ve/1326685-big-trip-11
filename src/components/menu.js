import AbstractComponent from "./abstract-component.js";
import {upperCaseFirst} from "../utils/common.js";

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

export default class Menu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      item.checked = true;
    }
  }

  setOnChange(cb) {
    this.getElement().addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const menuItem = evt.target.id;

      cb(menuItem);
    });
  }
}
