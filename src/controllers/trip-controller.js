import NoEventsComponent from "../components/no-events.js";
import SortComponent from "../components/sort.js";
import DaysComponent from "../components/days.js";
import DayComponent from "../components/day-item.js";
import EventListComponent from "../components/events-list.js";
import EventController, {Mode as EventControllerMode, EmptyEvent} from "./event-controller.js";
import TripInfoComponent from "../components/info.js";
import CostsComponent from "../components/cost.js";
import {formatDate, getSumPrice} from "../utils/common.js";
import {render, RenderPosition} from "../utils/render.js";
import {SortItem} from "../const.js";

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
    eventController.render(event, EventControllerMode.DEFAULT);
    return eventController;
  });
};

export default class TripController {
  constructor(eventsModel, tripEvents, filterController, newEventButton) {
    this._eventsModel = eventsModel;
    this._tripEvents = tripEvents;
    this._filterController = filterController;
    this._newEventButton = newEventButton;

    this._showedEventControllers = [];
    this._daysComponent = new DaysComponent();
    this._container = this._daysComponent.getElement();
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent(SortItem);

    this._newEvent = null;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    render(this._tripEvents, this._daysComponent);

    const sortEvents = this._eventsModel.getEvents();

    // Получим уникальные дни, месяцев путешествий и ВСЕ посещенные города в сгененированных моках
    const daysEvent = [...new Set(sortEvents.map((elem) => elem.startDate.getDate()))];
    const monthsEvent = [...new Set(sortEvents.map((elem) => elem.startDate.getMonth()))];
    const destinationEvent = [...sortEvents.map((elem) => elem.destination)];

    const tripPrice = getSumPrice(sortEvents);
    const tripMainElement = document.querySelector(`.trip-main`);

    render(tripMainElement, new TripInfoComponent(daysEvent, monthsEvent, destinationEvent), RenderPosition.AFTERBEGIN);

    const tripCost = tripMainElement.querySelector(`.trip-info`);
    render(tripCost, new CostsComponent(tripPrice));


    if (sortEvents.length === 0) {
      render(this._tripEvents, this._noEventsComponent);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFORBEGIN);

    this._renderEvents(sortEvents);
  }

  _renderEvents(events, sortType = `sort-event`) {
    let eventController = [];
    if (sortType === `sort-event`) {
      const daysEvent = [...new Set(events.map((elem) => elem.startDate.getDate()))];
      for (let day = 0; day < daysEvent.length; day++) {
        // Отфильтруем событий по дате
        const eventsByDays = events.filter((elem) => elem.startDate.getDate() === daysEvent[day]);
        const dateEvent = [...new Set(eventsByDays.map((elem) => formatDate(elem.startDate, `dayitem`)))];
        const dayComponent = new DayComponent(day + 1, dateEvent);

        eventController = eventController.concat(getGroupedEvents(this._container, dayComponent, eventsByDays, this._onDataChange, this._onViewChange));
      }
    } else {
      const dayComponent = new DayComponent();

      eventController = eventController.concat(getGroupedEvents(this._container, dayComponent, events, this._onDataChange, this._onViewChange));
    }

    this._showedEventControllers = eventController;
  }

  createEvent() {
    if (this._newEvent) {
      return;
    }
    // Закрываем открытые формы для редактирования и сбрасываем сортировку и фильтр
    this._onViewChange();
    this._sortComponent.reset();
    this._filterController.reset();

    // Добавляем после сортировки новый элемент
    const positionNewElement = this._sortComponent ? this._sortComponent.getElement() : this._tripEvents.querySelector(`h2`);
    this._newEvent = new EventController(positionNewElement, this._onDataChange, this._onViewChange);
    this._newEvent.render(EmptyEvent, EventControllerMode.ADDING);

    this._newEventButton.setAttribute(`disabled`, `disabled`);
  }

  _removeEvents() {
    this._showedEventControllers.forEach((eventController) => eventController.destroy());
    this._showedEventControllers = [];
    this._newEventButton.removeAttribute(`disabled`);
    // Пока через очистку контейнера, иначе не очищаются дни
    this._container.innerHTML = ``;
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);
    this._removeEvents();

    this._renderEvents(sortedEvents, sortType);
  }

  _updateEvents() {
    this._removeEvents();

    this._renderEvents(this._eventsModel.getEvents());
  }

  _onDataChange(eventController, oldData, newData, favorite) {
    if (oldData === EmptyEvent) {
      this._newEvent = null;

      if (newData === null) {
        // Удаляем новый
        eventController.destroy();
        this._updateEvents();
      } else {
        // Добавляем новый
        this._eventsModel.addEvent(newData);
        this._newEventButton.removeAttribute(`disabled`);
        // Перерисовываю элемент в общей структуре событий, ибо не понятно куда вставлять новый элемент
        eventController.destroy();
        this._updateEvents();

        this._showedEventControllers = [].concat(eventController, this._showedEventControllers);
      }
    } else if (newData === null) {
      // Удаляем существующий
      this._eventsModel.removeEvent(oldData.id);
      this._updateEvents();
    } else {
      // Обновляем существующий
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        if (!favorite) {
          eventController.render(newData, EventControllerMode.DEFAULT);
        }

      }
    }
  }

  _onViewChange() {
    this._showedEventControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._sortComponent.reset();
    this._updateEvents();
  }

  show() {
    this._tripEvents.classList.remove(`trip-events--hidden`);
    this._filterController.reset();
  }

  hide() {
    this._tripEvents.classList.add(`trip-events--hidden`);
    this._filterController.reset();
  }
}
