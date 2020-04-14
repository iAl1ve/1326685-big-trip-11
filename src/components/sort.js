const createTripSortMarkup = (name, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-${name.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name.toLowerCase()}"
      ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${name.toLowerCase()}">${name}</label>
    </div>`
  );
};

export const createTripSortTemplate = (sorts) => {
  const sortsMarkup = sorts.map((it, i) => createTripSortMarkup(it, i === 0)).join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortsMarkup}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};
