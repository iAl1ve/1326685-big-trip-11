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

const EVENTS_COUNT = 3;
const DAYS_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const menuElement = tripControlsElement.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripCost = document.querySelector(`.trip-info__cost`);

render(tripCost, createTripCostTemplate());
render(menuElement, createMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate());
render(tripEvents, createTripSortTemplate());
render(tripEvents, createTripEventEditTemplate());
render(tripEvents, createTripDaysTemplate());

for (let day = 1; day <= DAYS_COUNT; day++) {
  render(tripEvents, createTripDaysItemTemplate(day));

  const tripDaysItem = tripEvents.querySelectorAll(`.trip-days__item`);
  render(tripDaysItem[tripDaysItem.length - 1], createTripEventListTemplate());

  const tripEventsList = tripEvents.querySelectorAll(`.trip-events__list`);

  for (let i = 0; i < EVENTS_COUNT; i++) {
    render(tripEventsList[tripEventsList.length - 1], createTripEventItemTemplate());
  }
}


