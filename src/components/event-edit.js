import AbstractSmartComponent from "./abstract-smart-component.js";
import {POINTS_TYPE_TRANSFER, POINTS_TYPE_ACTIVITY, CITIES, offers as listOffers} from "../const.js";
import {upperCaseFirst, formatDate, getCurrentDateFromValue} from "../utils/common.js";
import {getRandomDescriptions, createOffers, createPhotos} from "../utils/data.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const createFavoriteMarkup = (isFavorite) => {
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
  );
};

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

const createDescriptionMarkup = (description, images) => {
  let imageMarkup;
  if (images) {
    imageMarkup = images.map((it) => createImageMarkup(it)).join(`\n`);
  }

  return (
    `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description ? description : ``}.</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${imageMarkup}
            </div>
          </div>
        </section>`
  );
};

const createTripEventEditTemplate = (tripEvent, options) => {
  let {id, price, images, startDate, endDate, isFavorite} = tripEvent;
  const {type, offers, destination, description} = options;

  const favoriteMarkup = (id) ? createFavoriteMarkup(isFavorite) : ``;
  const resetButtonText = (id) ? `Delete` : `Cancel`;
  const transferMarkup = POINTS_TYPE_TRANSFER.map((it) => createTypeMarkup(it, type)).join(`\n`);
  const activityMarkup = POINTS_TYPE_ACTIVITY.map((it) => createTypeMarkup(it, type)).join(`\n`);
  const cityMarkup = CITIES.map((it) => createCityMarkup(it)).join(`\n`);
  const descriptionMarkup = description === `` ? ` ` : createDescriptionMarkup(description, images);


  startDate = startDate ? formatDate(startDate) : ``;
  endDate = endDate ? formatDate(endDate) : ``;

  let offersMarkup;

  if (offers) {
    offersMarkup = listOffers.map((it) => createOffersMarkup(it, offers)).join(`\n`);
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination : ``}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${cityMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price ? price : `0`}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${resetButtonText}</button>
        ${favoriteMarkup}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>
        ${descriptionMarkup}
      </section>
    </form>`
  );
};

const parseFormData = (formData) => {
  const dateStart = getCurrentDateFromValue(formData.get(`event-start-time`));
  const dateEnd = getCurrentDateFromValue(formData.get(`event-end-time`));

  return {
    type: formData.get(`event-type`),
    destination: formData.get(`event-destination`),
    price: formData.get(`event-price`),
    offers: createOffers(),
    startDate: dateStart ? new Date(dateStart) : null,
    endDate: dateEnd ? new Date(dateEnd) : null,
  };
};

const checkDestinationValue = (value, component) => {
  if (CITIES.indexOf(value) === -1) {
    component.setCustomValidity(`Select destination from data-list`);
    return false;
  }
  component.setCustomValidity(``);
  return true;
};

const checkDateValue = (startDate, endDate, component) => {
  startDate = new Date(getCurrentDateFromValue(startDate));
  endDate = new Date(getCurrentDateFromValue(endDate));

  if (endDate < startDate) {
    component.setCustomValidity(`Travel end date cannot be less than the start date`);
    return false;
  }
  component.setCustomValidity(``);
  return true;
};

const checkPriceValue = (value, component) => {
  if (value < 0) {
    component.setCustomValidity(`Enter the correct event price`);
    return false;
  }
  component.setCustomValidity(``);
  return true;
};


export default class EventEdit extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;
    this._currentType = event.type;
    this._currentOffers = event.offers;
    this._currentDestination = event.destination;
    this._currentDescription = event.description;

    this._flatpickr = null;
    this._submitHandler = null;
    this._setCloseButtonClickHandler = null;
    this._setFavoritesButtonClickHandler = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTripEventEditTemplate(this._event, {
      type: this._currentType,
      offers: this._currentOffers,
      destination: this._currentDestination,
      description: this._currentDescription,
    });
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseButtonClickHandler(this._setCloseButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._setFavoritesButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;

    this._currentType = event.type;
    this._currentOffers = event.offers;
    this._currentDestination = event.destination;
    this._currentDescription = event.description;

    this.rerender();
  }

  getData() {
    const formData = new FormData(this.getElement());

    return parseFormData(formData);
  }

  setCloseButtonClickHandler(cb) {
    const closeButton = this.getElement().querySelector(`.event__rollup-btn`);

    if (closeButton) {
      closeButton.addEventListener(`click`, cb);
      this._setCloseButtonClickHandler = cb;
    }
  }

  setDeleteButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, cb);

    this._deleteButtonClickHandler = cb;
  }

  setSubmitHandler(cb) {
    this.getElement().addEventListener(`submit`, cb);
    this._submitHandler = cb;
  }

  setFavoritesButtonClickHandler(cb) {
    const favoriteButton = this.getElement().querySelector(`.event__favorite-btn`);
    if (favoriteButton) {
      favoriteButton.addEventListener(`click`, cb);
      this._setFavoritesButtonClickHandler = cb;
    }
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateElement = this.getElement().querySelectorAll(`.event__input--time`);
    const listDateProcessing = [this._event.startDate, this._event.endDate];

    dateElement.forEach((elem, index) => {
      this._flatpickr = flatpickr(elem, {
        enableTime: true,
        dateFormat: `d/m/y H:i`,
        allowInput: true,
        defaultDate: listDateProcessing[index] || `today`,
      });
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const typeGroup = element.querySelectorAll(`.event__type-group`);

    typeGroup.forEach((it) =>
      it.addEventListener(`change`, (evt) => {
        this._currentType = evt.target.value;
        this._currentOffers = createOffers();
        this.rerender();
      })
    );

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      if (checkDestinationValue(evt.target.value, evt.target)) {
        this._currentDestination = evt.target.value;
        this._currentDescription = getRandomDescriptions();
        // Потом удалю напрямую сгенерированные изображения, когда переведу на работу с данными от сервера
        this._event.images = createPhotos();

        this.rerender();
      }
    });

    const dateGroup = element.querySelectorAll(`.event__input--time`);

    dateGroup.forEach((dateTime) =>
      dateTime.addEventListener(`change`, () => {
        const startDate = element.querySelector(`#event-start-time-1`).value;
        const endDateElement = element.querySelector(`#event-end-time-1`);

        checkDateValue(startDate, endDateElement.value, endDateElement);
      })
    );

    element.querySelector(`#event-price-1`).addEventListener(`change`, (evt) => {
      checkPriceValue(evt.target.value, evt.target);
    });
  }
}
