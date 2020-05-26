import CostsComponent from "../components/cost.js";
import {getSumPrice} from "../utils/common.js";
import {render, replace} from "../utils/render.js";

export default class MainCostController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._costsComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const sortEvents = this._eventsModel.getEventsAll();
    const container = this._container;
    const oldCostsComponent = this._costsComponent;

    const tripPrice = getSumPrice(sortEvents);

    this._costsComponent = new CostsComponent(tripPrice);

    if (oldCostsComponent) {
      replace(this._costsComponent, oldCostsComponent);
    } else {
      render(container, this._costsComponent);
    }
  }

  _onDataChange() {
    this.render();
  }
}
