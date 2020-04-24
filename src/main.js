import TripController from "./controllers/trip-controller.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import DaysComponent from "./components/days.js";
import {render, RenderPosition} from "./utils/render.js";
import {FILTERS_NAME, MENU_ITEMS} from "./const.js";
import {generateTripEvents} from "./mock/trip-event.js";

const EVENTS_COUNT = 20;

const allTripEvents = generateTripEvents(EVENTS_COUNT);

const tripControlsElement = document.querySelector(`.trip-controls`);
const menuElement = tripControlsElement.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);

render(menuElement, new MenuComponent(MENU_ITEMS), RenderPosition.AFTEREND);
render(tripControlsElement, new FilterComponent(FILTERS_NAME));
const daysComponent = new DaysComponent();
render(tripEvents, daysComponent);

const tripController = new TripController(daysComponent);
tripController.render(allTripEvents);

