import Event from "../models/event-item.js";
import EventEditComponent from "../components/event-edit.js";
import EventComponent from "../components/event-item.js";
import {KEY_ESC, KEY_ESC_CODE, POINTS_TYPE_TRANSFER, SHAKE_ANIMATION_TIMEOUT} from "../const.js";
import {getCurrentDateFromValue} from "../utils/common.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
  NEW: `new`,
};

export const EmptyEvent = {
  type: POINTS_TYPE_TRANSFER[0],
  destination: {
    name: ``,
    description: [],
    photo: []
  },
  price: 0,
  offers: [],
  images: ``,
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false,
};

const parseFormData = (formData, allOffers, allDestinations) => {
  const currentType = formData.get(`event-type`);
  const dateStart = getCurrentDateFromValue(formData.get(`event-start-time`));
  const dateEnd = getCurrentDateFromValue(formData.get(`event-end-time`));

  const typeOffers = allOffers.find((it) => it.type.toString() === currentType).offers;
  const offersFromForm = formData.getAll(`event-offer`);
  const checkedOffers = typeOffers.filter((offer) => offersFromForm.some((formOffer) => offer.title === formOffer));

  const city = formData.get(`event-destination`);
  const currentDestination = allDestinations.find((it)=> it.name === city);

  return new Event({
    "type": currentType,
    "destination": currentDestination,
    "base_price": Number(formData.get(`event-price`)),
    "offers": checkedOffers,
    "date_from": dateStart ? new Date(dateStart) : null,
    "date_to": dateEnd ? new Date(dateEnd) : null,
    "is_favorite": Boolean(formData.get(`event-favorite`)),
  });
};

export default class EventController {
  constructor(container, offers, destinations, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._offers = offers;
    this._destinations = destinations;
    this._mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._event = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    this._event = event;
    this._mode = mode;
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(this._event);
    this._eventEditComponent = new EventEditComponent(this._event, this._offers, this._destinations);

    this._setItemHandlers();

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTEREND);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _setItemHandlers() {
    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._offers, this._destinations);

      data.id = this._event.id;
      this._onDataChange(this, this._event, data);

      this._closeEditEvent();
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const newEvent = Event.clone(this._event);
      newEvent.isFavorite = !newEvent.isFavorite;
      this._onDataChange(this, this._event, newEvent, `favorite`);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, this._event, null);
    });

    this._eventEditComponent.setCloseButtonClickHandler(() => {
      this._closeEditEvent();
    });
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  shake() {
    this._eventEditComponent.shake(SHAKE_ANIMATION_TIMEOUT);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KEY_ESC || evt.keyCode === KEY_ESC_CODE;

    if (isEscKey) {
      this._closeEditEvent();
    }
  }

  _closeEditEvent() {
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}