import {createTripInfoTemplate} from "./components/info.js";
import {createTripCostTemplate} from "./components/cost.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createTripSortTemplate} from "./components/sort.js";
import {createTripEventEditTemplate} from "./components/event-edit.js";
import {createTripDaysTemplate} from "./components/days.js";
import {createTripDaysItemTemplate} from "./components/day-item.js";
import {createTripEventListTemplate} from "./components/events-list.js";
import {createTripEventItemTemplate} from "./components/event-item.js";
import {getSumPrice, formatTime} from "./utils.js";
import {FILTERS_NAME, SORTS_NAME, MENU_ITEMS} from "./const.js";
import {generateTripEvents} from "./mock/trip-event.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
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

render(tripMainElement, createTripInfoTemplate(daysEvent, monthsEvent, citiesEvent), `afterbegin`);

const tripCost = document.querySelector(`.trip-info__cost`);

render(tripCost, createTripCostTemplate(tripPrice));
render(menuElement, createMenuTemplate(MENU_ITEMS), `afterend`);
render(tripControlsElement, createFilterTemplate(FILTERS_NAME));
render(tripEvents, createTripSortTemplate(SORTS_NAME));

// Отобразим первый объект для редактирования
render(tripEvents, createTripEventEditTemplate(sortTripEvents.shift()));

render(tripEvents, createTripDaysTemplate());

for (let day = 0; day < daysEvent.length; day++) {
  // Отфильтруем событий по дате
  const eventsByDays = sortTripEvents.filter((elem) => elem.startDate.getDate() === daysEvent[day]);

  const dateEvent = [...new Set(eventsByDays.map((elem) => formatTime(elem.startDate, `dayitem`)))];

  render(tripEvents, createTripDaysItemTemplate(day + 1, dateEvent));

  const tripDaysItem = tripEvents.querySelectorAll(`.trip-days__item`);
  render(tripDaysItem[tripDaysItem.length - 1], createTripEventListTemplate());

  const tripEventsList = tripEvents.querySelectorAll(`.trip-events__list`);


  eventsByDays.forEach((event) => render(tripEventsList[tripEventsList.length - 1], createTripEventItemTemplate(event)));
}
