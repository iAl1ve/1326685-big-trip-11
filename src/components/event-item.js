import AbstractComponent from "./abstract-component.js";
import {MAX_OFFERS_OPTION, POINTS_TYPE_ACTIVITY} from "../const.js";
import {formatTime, formatDate, formatTimeDuration, upperCaseFirst} from "../utils/common.js";

const createTripEventOffersMarkup = (offer) => {
  return (
    `<li class="event__offer">
       <span class="event__offer-title">${offer.text}</span>
       &plus;
       &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>`
  );
};

export const createTripEventItemTemplate = (tripEvent) => {
  const {type, city, price, offers, startDate, endDate} = tripEvent;
  const typePrefix = POINTS_TYPE_ACTIVITY.some((it) => type === it) ? `in` : `to`;
  const offersMarkup = offers.map((it) => createTripEventOffersMarkup(it)).slice(0, MAX_OFFERS_OPTION).join(`\n`);

  const startDateTime = startDate ? formatDate(startDate, `datetime`) : ``;
  const startEventTime = startDate ? formatTime(startDate) : ``;
  const endDateTime = endDate ? formatDate(endDate, `datetime`) : ``;
  const endEventTime = endDate ? formatTime(endDate) : ``;
  const timeDuration = formatTimeDuration(endDate, startDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${upperCaseFirst(type)} ${typePrefix} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDateTime}">${startEventTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDateTime}">${endEventTime}</time>
          </p>
          <p class="event__duration">${timeDuration}</p>
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

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createTripEventItemTemplate(this._event);
  }

  setEditButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
  }
}
