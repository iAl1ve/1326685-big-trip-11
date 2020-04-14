import {POINTS_TYPE_TRANSFER, POINTS_TYPE_ACTIVITY, CITIES, offers as listOffers} from "../const.js";
import {formatTime} from "../utils.js";

const createTypeMarkup = (type) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`
  );
};

const createCityMarkup = (city) => {
  return (
    `<option value="${city}"></option>`
  );
};

const createOffersMarkup = (elem, tripOffer) => {
  const {type, text, price} = elem;
  const isSelectOffer = tripOffer.some((it) => type === it.type) ? `checked` : ``;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" ${isSelectOffer}>
      <label class="event__offer-label" for="event-offer-${type}-1">
        <span class="event__offer-title">${text}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createImageMarkup = (image) => {
  return (
    `<img class="event__photo" src="${image.src}" alt="${image.alt}">`
  );
};

export const createTripEventEditTemplate = (tripEvent) => {
  const {type, city, description, price, offers, images, startDate, endDate} = tripEvent;
  const transferMarkup = POINTS_TYPE_TRANSFER.map((it) => createTypeMarkup(it)).join(`\n`);
  const activityMarkup = POINTS_TYPE_ACTIVITY.map((it) => createTypeMarkup(it)).join(`\n`);
  const cityMarkup = CITIES.map((it) => createCityMarkup(it)).join(`\n`);
  let offersMarkup;
  let imageMarkup;
  if (offers) {
    offersMarkup = listOffers.map((it) => createOffersMarkup(it, offers)).join(`\n`);
  }
  if (images) {
    imageMarkup = images.map((it) => createImageMarkup(it)).join(`\n`);
  }

  const isTypeActivity = POINTS_TYPE_ACTIVITY.some((it) => type === it) ? `in` : `to`;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type ? type.toLowerCase() : ``}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferMarkup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type ? type : ``} ${isTypeActivity ? isTypeActivity : ``}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city ? city : ``}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${cityMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate ? formatTime(startDate) : ``}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate ? formatTime(endDate) : ``}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price ? price : ``}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description ? description : ``}.</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${imageMarkup}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};
