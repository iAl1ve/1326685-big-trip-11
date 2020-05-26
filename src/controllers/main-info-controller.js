import TripInfoComponent from "../components/trip-info.js";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class MainInfoController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const sortEvents = this._eventsModel.getItemsAll();
    const oldTripInfoComponent = this._tripInfoComponent;

    // Получим уникальные дни, месяцев путешествий и ВСЕ посещенные города в полученных данных
    const days = [...new Set(sortEvents.map((elem) => elem.startDate.getDate()))];
    const months = [...new Set(sortEvents.map((elem) => elem.startDate.getMonth()))];
    const destinations = [...sortEvents.map((elem) => elem.destination)];

    this._tripInfoComponent = new TripInfoComponent(days, months, destinations);

    if (oldTripInfoComponent) {
      replace(this._tripInfoComponent, oldTripInfoComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
