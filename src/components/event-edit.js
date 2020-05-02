import AbstractSmartComponent from "./abstract-smart-component.js";
import {POINTS_TYPE_TRANSFER, POINTS_TYPE_ACTIVITY, CITIES, offers as listOffers} from "../const.js";
import {formatTime, upperCaseFirst} from "../utils/common.js";
import {getRandomDescriptions, createOffers} from "../utils/data.js";

const createTypeMarkup = (elem, tripType) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${elem}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${elem}" ${elem === tripType ? `checked` : ``} >
      <label class="event__type-label  event__type-label--${elem}" for="event-type-${elem}-1">${upperCaseFirst(elem)}</label>
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

const createTripEventEditTemplate = (tripEvent) => {
  const {type, city, description, price, offers, images, startDate, endDate, isFavorite} = tripEvent;
  const transferMarkup = POINTS_TYPE_TRANSFER.map((it) => createTypeMarkup(it, type)).join(`\n`);
  const activityMarkup = POINTS_TYPE_ACTIVITY.map((it) => createTypeMarkup(it, type)).join(`\n`);
  const cityMarkup = CITIES.map((it) => createCityMarkup(it)).join(`\n`);
  let offersMarkup;
  let imageMarkup;
  if (offers) {
    offersMarkup = listOffers.map((it) => createOffersMarkup(it, offers)).join(`\n`);
  }
  if (images) {
    imageMarkup = images.map((it) => createImageMarkup(it)).join(`\n`);
  }

  const typePrefix = POINTS_TYPE_ACTIVITY.some((it) => type === it) ? `in` : `to`;

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
            ${type ? upperCaseFirst(type) : ``} ${typePrefix ? typePrefix : ``}
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
        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
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

export default class EventEdit extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;

    this._submitHandler = null;
    this._setCloseButtonClickHandler = null;
    this._setFavoritesButtonClickHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTripEventEditTemplate(this._event);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseButtonClickHandler(this._setCloseButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._setFavoritesButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this.rerender();
  }

  setCloseButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, cb);
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
    this._setCloseButtonClickHandler = cb;
  }

  setSubmitHandler(cb) {
    this.getElement().addEventListener(`submit`, cb);
    this._submitHandler = cb;
  }

  setFavoritesButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, cb);
    this._setFavoritesButtonClickHandler = cb;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const typeGroup = element.querySelectorAll(`.event__type-group`);

    typeGroup.forEach((it) =>
      it.addEventListener(`change`, (evt) => {
        this._event.type = evt.target.value;
        this._event.offers = createOffers();
        this.rerender();
      })
    );

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      this._event.city = evt.target.value;
      this._event.description = getRandomDescriptions();

      this.rerender();
    });
  }
}
