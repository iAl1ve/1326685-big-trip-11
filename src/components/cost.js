export const createTripCostTemplate = (cost) => {
  return (
    `Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>`
  );
};
