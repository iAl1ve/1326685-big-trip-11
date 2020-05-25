import AbstractComponent from "./abstract-component.js";

const createTripCostTemplate = (cost = 0) => {
  return (
    `<p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span></p>`
  );
};

export default class Costs extends AbstractComponent {
  constructor(cost) {
    super();
    this._cost = cost;
  }

  getTemplate() {
    return createTripCostTemplate(this._cost);
  }
}
