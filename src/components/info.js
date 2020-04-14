import {MONTHS} from "../const.js";

export const createTripInfoTemplate = (days, months, cities) => {
  let tripTitle = ``;
  let tripDates = `${days[0]}&nbsp;&mdash;&nbsp;${days[days.length - 1]}`;
  if (cities.length < 3) {
    cities.forEach((city, index) => {
      tripTitle += index < cities.length ? `${tripTitle} + &mdash;` : `${tripTitle}`;
    });
  } else {
    tripTitle = `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>

        <p class="trip-info__dates">${MONTHS[months[0]]} ${tripDates}</p>
      </div>

      <p class="trip-info__cost"></p>
    </section>`
  );
};
