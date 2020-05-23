import TripController from "./controllers/trip-controller.js";
import ListLoading from "./components/list-loading.js";
import MenuComponent from "./components/menu.js";
import FilterController from "./controllers/filter.js";
import API from "./api/api.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {MenuItem} from "./const.js";
import EventsModel from "./models/events.js";
import Statistics from "./components/statistics.js";

const AUTHORIZATION = `Basic adECucLoRuVNmd63iSZe3`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();

const listLoadingComponent = new ListLoading();
const statisticsComponent = new Statistics(eventsModel);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const menuElement = tripControlsElement.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);
const menuComponent = new MenuComponent(MenuItem);

render(menuElement, menuComponent, RenderPosition.AFTEREND);
render(tripEvents, statisticsComponent, RenderPosition.AFTEREND);
render(tripEvents, listLoadingComponent);
const filterController = new FilterController(tripControlsElement, eventsModel);
filterController.render();


const tripController = new TripController(eventsModel, tripEvents, api, filterController, newEventButton);
statisticsComponent.hide();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});

newEventButton.addEventListener(`click`, () => {
  tripController.createEvent();
});

api.getEvents()
  .then((events) => {
    eventsModel.setEvents(events.sort((a, b) => a.startDate - b.startDate));
    api.getOffers()
      .then((offers) => {
        eventsModel.setOffers(offers);
        api.getDestinations()
          .then((destination) => {
            eventsModel.setDestinations(destination);
            tripController.render();
            remove(listLoadingComponent);
          });
      });
  });
