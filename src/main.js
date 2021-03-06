import API from "./api/api.js";
import TripController from "./controllers/trip-controller.js";
import ListLoading from "./components/list-loading.js";
import MainInfoController from "./controllers/main-info-controller.js";
import MainCostController from "./controllers/main-cost-controller.js";
import MenuComponent from "./components/menu.js";
import TripInfoContainer from "./components/trip-info-container";
import FilterController from "./controllers/filter-controller.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {MenuItem} from "./const.js";
import EventsModel from "./models/events.js";
import Statistics from "./components/statistics.js";

const AUTHORIZATION = `Basic adE1ycLo45VNmd63iSZe3`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const eventsModel = new EventsModel();

const listLoadingComponent = new ListLoading();
const statisticsComponent = new Statistics(eventsModel);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const menuElement = tripControlsElement.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripMainElement = document.querySelector(`.trip-main`);
const menuComponent = new MenuComponent(MenuItem);

const tripInfoContainer = new TripInfoContainer();
render(tripMainElement, tripInfoContainer, RenderPosition.AFTERBEGIN);

render(menuElement, menuComponent, RenderPosition.AFTEREND);
render(tripEvents, statisticsComponent, RenderPosition.AFTEREND);
render(tripEvents, listLoadingComponent);
const filterController = new FilterController(tripControlsElement, eventsModel);
filterController.render();

const tripMainInfoElement = document.querySelector(`.trip-main__trip-info`);
const mainInfoController = new MainInfoController(tripMainInfoElement, eventsModel);
const mainCostController = new MainCostController(tripMainInfoElement, eventsModel);
mainInfoController.render();
mainCostController.render();

const tripController = new TripController(eventsModel, tripEvents, apiWithProvider, filterController, newEventButton);
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

apiWithProvider.getEvents()
  .then((events) => {
    eventsModel.setItems(events.sort((a, b) => a.startDate - b.startDate));
    apiWithProvider.getOffers()
      .then((offers) => {
        eventsModel.setOffers(offers);
        apiWithProvider.getDestinations()
          .then((destination) => {
            eventsModel.setDestinations(destination);
            tripController.render();
            remove(listLoadingComponent);
          });
      });
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});


window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
