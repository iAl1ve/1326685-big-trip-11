import NoEventsComponent from "../components/no-events.js";
import SortComponent from "../components/sort.js";
import EventEditComponent from "../components/event-edit.js";
import DayComponent from "../components/day-item.js";
import EventListComponent from "../components/events-list.js";
import EventComponent from "../components/event-item.js";
import TripInfoComponent from "../components/info.js";
import CostsComponent from "../components/cost.js";
import {formatTime, getSumPrice} from "../utils/common.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {SORTS_NAME, KEY_ESC, KEY_ESC_CODE} from "../const.js";

const renderEvent = (tripEventsList, event) => {
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const closeEditEvent = () => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === KEY_ESC || evt.keyCode === KEY_ESC_CODE;

    if (isEscKey) {
      closeEditEvent();
    }
  };

  const eventComponent = new EventComponent(event);

  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new EventEditComponent(event);

  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    closeEditEvent();
  });

  eventEditComponent.setCloseButtonClickHandler(() => {
    closeEditEvent();
  });

  render(tripEventsList, eventComponent);
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const showingEvents = events.slice();

  switch (sortType) {
    case `sort-price`:
      sortedEvents = showingEvents.sort((a, b) => b.price - a.price);
      break;
    case `sort-time`:
      sortedEvents = showingEvents.sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
      break;
    case `sort-event`:
      sortedEvents = showingEvents;
      break;
  }

  return sortedEvents;
};

const renderEvents = (daysComponent, events, sortType = `sort-event`) => {
  if (sortType === `sort-event`) {
    const daysEvent = [...new Set(events.map((elem) => elem.startDate.getDate()))];
    for (let day = 0; day < daysEvent.length; day++) {
      // Отфильтруем событий по дате
      const eventsByDays = events.filter((elem) => elem.startDate.getDate() === daysEvent[day]);

      const dateEvent = [...new Set(eventsByDays.map((elem) => formatTime(elem.startDate, `dayitem`)))];
      const dayComponent = new DayComponent(day + 1, dateEvent);

      render(daysComponent, dayComponent);

      const eventListComponent = new EventListComponent();
      render(dayComponent.getElement(), eventListComponent);

      eventsByDays.forEach((event) => renderEvent(eventListComponent.getElement(), event));
    }
  } else {
    const dayComponent = new DayComponent();
    render(daysComponent, dayComponent);

    const eventListComponent = new EventListComponent();
    render(dayComponent.getElement(), eventListComponent);

    events.forEach((event) => renderEvent(eventListComponent.getElement(), event));
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent(SORTS_NAME);
  }

  render(events) {
    const daysComponent = this._container.getElement();
    const sortTripEvents = events.slice().sort((a, b) => a.startDate - b.startDate);

    // Получим уникальные дни, месяцев путешествий и ВСЕ посещенные города в сгененированных моках
    const daysEvent = [...new Set(sortTripEvents.map((elem) => elem.startDate.getDate()))];
    const monthsEvent = [...new Set(sortTripEvents.map((elem) => elem.startDate.getMonth()))];
    const citiesEvent = [...sortTripEvents.map((elem) => elem.city)];

    const tripPrice = getSumPrice(sortTripEvents);
    const tripMainElement = document.querySelector(`.trip-main`);

    render(tripMainElement, new TripInfoComponent(daysEvent, monthsEvent, citiesEvent), RenderPosition.AFTERBEGIN);

    const tripCost = tripMainElement.querySelector(`.trip-info`);
    render(tripCost, new CostsComponent(tripPrice));

    const tripEvents = document.querySelector(`.trip-events`);
    if (events.length === 0) {
      render(tripEvents, this._noEventsComponent);
      return;
    }

    render(daysComponent, this._sortComponent, RenderPosition.BEFORBEGIN);

    renderEvents(daysComponent, sortTripEvents);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(sortTripEvents, sortType);
      daysComponent.innerHTML = ``;

      renderEvents(daysComponent, sortedEvents, sortType);
    });
  }


}
