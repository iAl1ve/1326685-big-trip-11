import {createElement} from "../utils.js";

const createTripCostTemplate = (cost) => {
  return (
    `<p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost ? cost : 0}</span></p>`
  );
};

export default class Costs {
  constructor(cost) {
    this._cost = cost;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._cost);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
