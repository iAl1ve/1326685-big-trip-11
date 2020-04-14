const createMenuItem = (name, isChecked) => {
  return (
    `<a class="trip-tabs__btn  ${isChecked ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`
  );
};

export const createMenuTemplate = (menuItems) => {
  const menuMarkup = menuItems.map((it, i) => createMenuItem(it, i === 0)).join(`\n`);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkup}
    </nav>`
  );
};
