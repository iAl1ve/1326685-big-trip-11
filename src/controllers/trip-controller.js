import NoEventsComponent from "../components/no-events.js";
import SortingComponent from "../components/sort.js";
import DaysComponent from "../components/days.js";
import DayComponent from "../components/day.js";
import EventListComponent from "../components/events-list.js";
import EventController, {Mode as EventControllerMode, EmptyEvent} from "./event-controller.js";
import {formatDate} from "../utils/common.js";
import {render, RenderPosition} from "../utils/render.js";
import {SortItem, FormElementState} from "../const.js";

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];

  switch (sortType) {
    case `sort-${SortItem.PRICE}`:
      sortedEvents = events.slice().sort((a, b) => b.price - a.price);
      break;
    case `sort-${SortItem.TIME}`:
      sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
      break;
    case `sort-${SortItem.EVENT}`:
      sortedEvents = events;
      break;
  }

  return sortedEvents;
};

const getGroupedEvents = (daysComponent, dayComponent, events, offers, destinations, onDataChange, onViewChange) => {
  render(daysComponent, dayComponent);

  const eventListComponent = new EventListComponent();
  render(dayComponent.getElement(), eventListComponent);

  return events.map((event) => {
    const eventController = new EventController(eventListComponent.getElement(), offers, destinations, onDataChange, onViewChange);
    eventController.render(event, EventControllerMode.DEFAULT);
    return eventController;
  });
};

export default class TripController {
  constructor(eventsModel, tripEventsСontainer, api, filterController, newEventButton) {
    this._eventsModel = eventsModel;
    this._tripEventsСontainer = tripEventsСontainer;
    this._api = api;
    this._filterController = filterController;
    this._newEventButton = newEventButton;

    this._showedEventControllers = [];
    this._daysComponent = new DaysComponent();
    this._container = this._daysComponent.getElement();
    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent(SortItem);

    this._newEvent = null;
    this._offers = null;
    this._destinations = null;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._sortingComponent.setTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    render(this._tripEventsСontainer, this._daysComponent);

    const sortEvents = this._eventsModel.getItems();

    this._offers = this._eventsModel.getOffers();
    this._destinations = this._eventsModel.getDestinations();

    if (sortEvents.length === 0) {
      render(this._tripEventsСontainer, this._noEventsComponent);
      return;
    }

    render(this._container, this._sortingComponent, RenderPosition.BEFORBEGIN);

    this._renderEvents(sortEvents);
  }

  _renderEvents(events, sortType = `sort-${SortItem.EVENT}`) {
    let eventControllers = [];
    if (sortType === `sort-${SortItem.EVENT}`) {
      const days = [...new Set(events.map((elem) => elem.startDate.getDate()))];
      for (let day = 0; day < days.length; day++) {
        // Отфильтруем событий по дате
        const eventsByDays = events.filter((elem) => elem.startDate.getDate() === days[day]);
        const dateEvent = [...new Set(eventsByDays.map((elem) => formatDate(elem.startDate, `dayitem`)))];
        const dayComponent = new DayComponent(day + 1, dateEvent);

        eventControllers = eventControllers.concat(getGroupedEvents(this._container, dayComponent, eventsByDays, this._offers, this._destinations, this._onDataChange, this._onViewChange));
      }
    } else {
      const dayComponent = new DayComponent();

      eventControllers = eventControllers.concat(getGroupedEvents(this._container, dayComponent, events, this._offers, this._destinations, this._onDataChange, this._onViewChange));
    }

    this._showedEventControllers = eventControllers;
  }

  createEvent() {
    if (this._newEvent) {
      return;
    }
    // Закрываем открытые формы для редактирования и сбрасываем сортировку и фильтр
    this._onViewChange();
    this._sortingComponent.reset();
    this._filterController.reset();

    // Добавляем после сортировки новый элемент
    const positionNewElement = this._sortingComponent ? this._sortingComponent.getElement() : this._tripEventsСontainer.querySelector(`h2`);
    this._newEvent = new EventController(positionNewElement, this._offers, this._destinations, this._onDataChange, this._onViewChange);
    this._newEvent.render(EmptyEvent, EventControllerMode.ADDING);

    this._newEventButton.setAttribute(FormElementState.DISABLED, FormElementState.DISABLED);
  }

  _removeEvents() {
    this._showedEventControllers.forEach((eventController) => eventController.destroy());
    this._showedEventControllers = [];
    this._newEventButton.removeAttribute(FormElementState.DISABLED);
    // Очищаем контейнер, иначе не очищаются дни
    this._container.innerHTML = ``;
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._eventsModel.getItems(), sortType);

    this._removeEvents();

    this._renderEvents(sortedEvents, sortType);
  }

  _updateEvents() {
    this._removeEvents();

    this._renderEvents(this._eventsModel.getItems());
  }

  _onDataChange(eventController, oldData, newData, favorite) {
    if (oldData === EmptyEvent) {
      this._newEvent = null;

      if (newData === null) {
        // Удаляем новый
        eventController.destroy();
        this._updateEvents();
      } else {
        this._api.createEvent(newData)
          .then((eventModel) => {
            // Добавляем новый
            this._eventsModel.addItem(eventModel);
            this._newEventButton.removeAttribute(FormElementState.DISABLED);
            // Перерисовываю элемент в общей структуре событий, ибо не понятно куда вставлять новый элемент
            eventController.destroy();
            this._updateEvents();

            this._showedEventControllers = [].concat(eventController, this._showedEventControllers);
          })
          .catch(() => {
            eventController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          // Удаляем существующий
          this._eventsModel.removeItem(oldData.id);
          this._updateEvents();
        })
        .catch(() => {
          eventController.shake();
        });
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((eventModel) => {
          // Обновляем существующий
          const isSuccess = this._eventsModel.updateItem(oldData.id, eventModel);

          if (isSuccess) {
            if (!favorite) {
              eventController.render(newData, EventControllerMode.DEFAULT);
              this._updateEvents();
            }
          }
        })
        .catch(() => {
          eventController.shake();
        });
    }
  }

  _onViewChange() {
    this._showedEventControllers.forEach((it) => it.setDefaultView());
    this._newEventButton.removeAttribute(FormElementState.DISABLED);
    this._newEvent = null;

  }

  _onFilterChange() {
    this._sortingComponent.reset();
    this._updateEvents();
  }

  show() {
    this._tripEventsСontainer.classList.remove(`trip-events--hidden`);
    this._filterController.reset();
  }

  hide() {
    this._tripEventsСontainer.classList.add(`trip-events--hidden`);
    this._filterController.reset();
  }
}
