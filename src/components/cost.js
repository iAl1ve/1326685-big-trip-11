import {createElement} from "../utils.js";

const createTripCostTemplate = (cost) => {
  return (
    `Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>`
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
