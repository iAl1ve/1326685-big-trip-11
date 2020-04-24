import AbstractComponent from "./abstract-component.js";

const createMenuItem = (name, isChecked) => {
  return (
    `<a class="trip-tabs__btn  ${isChecked ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`
  );
};

const createMenuTemplate = (menuItems) => {
  const menuMarkup = menuItems.map((it, i) => createMenuItem(it, i === 0)).join(`\n`);

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
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }
}
