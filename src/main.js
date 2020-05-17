import TripController from "./controllers/trip-controller.js";
import MenuComponent from "./components/menu.js";
import FilterController from "./controllers/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import {MenuItem} from "./const.js";
import EventsModel from "./models/events.js";
import {generateTripEvents} from "./mock/trip-event.js";

const EVENTS_COUNT = 20;

const allTripEvents = generateTripEvents(EVENTS_COUNT);
const eventsModel = new EventsModel();
allTripEvents.sort((a, b) => a.startDate - b.startDate)
eventsModel.setEvents(allTripEvents);

const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const menuElement = tripControlsElement.querySelector(`h2`);
const menuComponent = new MenuComponent(MenuItem);

render(menuElement, menuComponent, RenderPosition.AFTEREND);
const filterController = new FilterController(tripControlsElement, eventsModel);
filterController.render();

const tripController = new TripController(eventsModel, filterController, newEventButton);
tripController.render();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      tripController.render();
      break;
  }
});

newEventButton.addEventListener(`click`, () => {
  tripController.createEvent();
});

