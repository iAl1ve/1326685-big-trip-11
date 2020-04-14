import {MAX_OFFERS_OPTION, POINTS_TYPE_ACTIVITY} from "../const.js";
import {formatTime, formatTimeDuration} from "../utils.js";

const createTripEventOffersMarkup = (it) => {
  return (
    `<li class="event__offer">
       <span class="event__offer-title">${it.text}</span>
       &plus;
       &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
    </li>`
  );
};

export const createTripEventItemTemplate = (tripEvent) => {
  const {type, city, price, offers, startDate, endDate} = tripEvent;
  const isTypeActivity = POINTS_TYPE_ACTIVITY.some((it) => type === it) ? `in` : `to`;
  const offersMarkup = offers.map((it) => createTripEventOffersMarkup(it)).slice(0, MAX_OFFERS_OPTION).join(`\n`);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${isTypeActivity} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatTime(startDate, `datetime`)}">${formatTime(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatTime(endDate, `datetime`)}">${formatTime(endDate)}</time>
          </p>
          <p class="event__duration">${formatTimeDuration(endDate - startDate)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
