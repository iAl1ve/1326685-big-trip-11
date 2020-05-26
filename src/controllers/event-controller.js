import Event from "../models/event.js";
import EventEditComponent from "../components/event-edit.js";
import EventComponent from "../components/event.js";
import {KEY_ESC, KEY_ESC_CODE, POINT_TRANSFER_TYPES, Shake, ProcessingButton, DefaultButton} from "../const.js";
import {getCurrentDateFromValue, switchFormStatus} from "../utils/common.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";

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
    if (this._mode === Mode.ADDING) {
      remove(this._eventEditComponent);
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
      this._eventEditComponent.reset();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt, id) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._offers, this._destinations);
      data.id = id || String(new Date() + Math.random());

      this._eventEditComponent.setData({
        SAVE_BUTTON_TEXT: ProcessingButton.SAVE_BUTTON_TEXT,
      });
      switchFormStatus(this._eventEditComponent.getElement(), true);
      this._eventEditComponent.removeFlatpickr();

      this._onDataChange(this, this._event, data);

      this._closeEditEvent();
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const newEvent = Event.clone(this._event);
      newEvent.isFavorite = !newEvent.isFavorite;
      this._onDataChange(this, this._event, newEvent, `favorite`);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._eventEditComponent.setData({
        DELETE_BUTTON_TEXT: ProcessingButton.DELETE_BUTTON_TEXT,
      });
      switchFormStatus(this._eventEditComponent.getElement(), true);

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
    this._eventEditComponent.getElement().style = Shake.STYLE;
    this._eventEditComponent.getElement().style.animation = `shake ${Shake.ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._eventEditComponent.getElement().style = ``;
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventEditComponent.setData(DefaultButton);
      switchFormStatus(this._eventEditComponent.getElement(), false);
    }, Shake.ANIMATION_TIMEOUT);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KEY_ESC || evt.keyCode === KEY_ESC_CODE;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this.destroy();
        this._onViewChange();
      }
      this._closeEditEvent();
    }
  }

  _closeEditEvent() {
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  type: POINT_TRANSFER_TYPES[0],
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
