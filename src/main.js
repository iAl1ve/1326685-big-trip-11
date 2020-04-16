import TripInfoComponent from "./components/info.js";
import CostsComponent from "./components/cost.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import SortComponent from "./components/sort.js";
import EventEditComponent from "./components/event-edit.js";
import DaysComponent from "./components/days.js";
import DayComponent from "./components/day-item.js";
import EventListComponent from "./components/events-list.js";
import EventComponent from "./components/event-item.js";
import {getSumPrice, formatTime, render, RenderPosition} from "./utils.js";
import {FILTERS_NAME, SORTS_NAME, MENU_ITEMS, KEY_ESC, KEY_ESC_CODE} from "./const.js";
import {generateTripEvents} from "./mock/trip-event.js";

const renderEvent = (tripEventsList, event) => {
  const replaceEventToEdit = () => {
    tripEventsList.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceEditToEvent = () => {
    tripEventsList.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
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
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new EventEditComponent(event);
  const editForm = eventEditComponent.getElement();
  const cancelForm = eventEditComponent.getElement().querySelector(`.event__reset-btn`);

  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    closeEditEvent();
  });

  cancelForm.addEventListener(`click`, () => {
    closeEditEvent();
  });

  render(tripEventsList, eventComponent.getElement());
};

const EVENTS_COUNT = 20;

const allTripEvents = generateTripEvents(EVENTS_COUNT);

const sortTripEvents = allTripEvents.slice().sort((a, b) => a.startDate - b.startDate);

// Получим уникальные дни, месяцев путешествий и ВСЕ посещенные города в сгененированных моках
const daysEvent = [...new Set(sortTripEvents.map((elem) => elem.startDate.getDate()))];
const monthsEvent = [...new Set(sortTripEvents.map((elem) => elem.startDate.getMonth()))];
const citiesEvent = [...sortTripEvents.map((elem) => elem.city)];

const tripPrice = getSumPrice(sortTripEvents);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const menuElement = tripControlsElement.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripMainElement, new TripInfoComponent(daysEvent, monthsEvent, citiesEvent).getElement(), RenderPosition.AFTERBEGIN);

const tripCost = document.querySelector(`.trip-info__cost`);

render(tripCost, new CostsComponent(tripPrice).getElement());
render(menuElement, new MenuComponent(MENU_ITEMS).getElement(), RenderPosition.AFTEREND);
render(tripControlsElement, new FilterComponent(FILTERS_NAME).getElement());
render(tripEvents, new SortComponent(SORTS_NAME).getElement());

// Отобразим первый объект для редактирования
// render(tripEvents, createTripEventEditTemplate(sortTripEvents.shift()));

render(tripEvents, new DaysComponent().getElement());

for (let day = 0; day < daysEvent.length; day++) {
  // Отфильтруем событий по дате
  const eventsByDays = sortTripEvents.filter((elem) => elem.startDate.getDate() === daysEvent[day]);

  const dateEvent = [...new Set(eventsByDays.map((elem) => formatTime(elem.startDate, `dayitem`)))];

  render(tripEvents, new DayComponent(day + 1, dateEvent).getElement());

  const tripDaysItem = tripEvents.querySelectorAll(`.trip-days__item`);
  render(tripDaysItem[tripDaysItem.length - 1], new EventListComponent().getElement());

  const tripEventsList = tripEvents.querySelectorAll(`.trip-events__list`);

  eventsByDays.forEach((event) => renderEvent(tripEventsList[tripEventsList.length - 1], event));
}
