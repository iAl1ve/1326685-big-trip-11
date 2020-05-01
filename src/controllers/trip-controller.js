import NoEventsComponent from "../components/no-events.js";
import SortComponent from "../components/sort.js";
import DayComponent from "../components/day-item.js";
import EventListComponent from "../components/events-list.js";
import EventController from "./event-controller.js";
import TripInfoComponent from "../components/info.js";
import CostsComponent from "../components/cost.js";
import {formatTime, getSumPrice} from "../utils/common.js";
import {render, RenderPosition} from "../utils/render.js";
import {SORTS_NAME} from "../const.js";

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];

  switch (sortType) {
    case `sort-price`:
      sortedEvents = events.slice().sort((a, b) => b.price - a.price);
      break;
    case `sort-time`:
      sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
      break;
    case `sort-event`:
      sortedEvents = events.slice();
      break;
  }

  return sortedEvents;
};

const getGroupedEvents = (daysComponent, dayComponent, events, onDataChange, onViewChange) => {
  render(daysComponent, dayComponent);

  const eventListComponent = new EventListComponent();
  render(dayComponent.getElement(), eventListComponent);

  return events.map((event) => {
    const eventController = new EventController(eventListComponent.getElement(), onDataChange, onViewChange);
    eventController.render(event);
    return eventController;
  });
};

const renderEvents = (daysComponent, events, onDataChange, onViewChange, sortType = `sort-event`) => {
  let eventController = [];
  if (sortType === `sort-event`) {
    const daysEvent = [...new Set(events.map((elem) => elem.startDate.getDate()))];
    for (let day = 0; day < daysEvent.length; day++) {
      // Отфильтруем событий по дате
      const eventsByDays = events.filter((elem) => elem.startDate.getDate() === daysEvent[day]);

      const dateEvent = [...new Set(eventsByDays.map((elem) => formatTime(elem.startDate, `dayitem`)))];
      const dayComponent = new DayComponent(day + 1, dateEvent);

      eventController = eventController.concat(getGroupedEvents(daysComponent, dayComponent, eventsByDays, onDataChange, onViewChange));
    }
  } else {
    const dayComponent = new DayComponent();

    eventController = eventController.concat(getGroupedEvents(daysComponent, dayComponent, events, onDataChange, onViewChange));
  }
  return eventController;
};

export default class TripController {
  constructor(container) {
    this._container = container.getElement();

    this._events = [];
    this._sortEvents = [];
    this._showedEventControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent(SORTS_NAME);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events;
    this._sortEvents = this._events.slice().sort((a, b) => a.startDate - b.startDate);

    // Получим уникальные дни, месяцев путешествий и ВСЕ посещенные города в сгененированных моках
    const daysEvent = [...new Set(this._sortEvents.map((elem) => elem.startDate.getDate()))];
    const monthsEvent = [...new Set(this._sortEvents.map((elem) => elem.startDate.getMonth()))];
    const citiesEvent = [...this._sortEvents.map((elem) => elem.city)];

    const tripPrice = getSumPrice(this._sortEvents);
    const tripMainElement = document.querySelector(`.trip-main`);

    render(tripMainElement, new TripInfoComponent(daysEvent, monthsEvent, citiesEvent), RenderPosition.AFTERBEGIN);

    const tripCost = tripMainElement.querySelector(`.trip-info`);
    render(tripCost, new CostsComponent(tripPrice));

    const tripEvents = document.querySelector(`.trip-events`);
    if (this._events.length === 0) {
      render(tripEvents, this._noEventsComponent);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFORBEGIN);

    this._showedEventControllers = renderEvents(this._container, this._sortEvents, this._onDataChange, this._onViewChange);
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._sortEvents, sortType);
    this._container.innerHTML = ``;

    this._showedEventControllers = renderEvents(this._container, sortedEvents, this._onDataChange, this._onViewChange, sortType);
  }

  _onDataChange(eventController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    eventController.render(this._events[index]);
  }

  _onViewChange() {
    this._showedEventControllers.forEach((it) => it.setDefaultView());
  }
}
