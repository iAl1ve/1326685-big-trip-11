import {getRandomIntegerNumber} from "./utils.js";

export const FILTERS_NAME = [`Everything`, `Future`, `Past`];
export const SORTS_NAME = [`Event`, `Time`, `Price`];
export const MENU_ITEMS = [`Table`, `Stats`];
export const MAX_OFFERS_OPTION = 3;

export const CITIES = [`London`, `Edinburg`, `Amsterdam`, `Geneva`, `Milan`, `Chamonix`];

export const POINTS_TYPE_TRANSFER = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];

export const POINTS_TYPE_ACTIVITY = [`Check-in`, `Sightseeing`, `Restaurant`];

export const MONTHS = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUN`,
  `JUL`,
  `AUG`,
  `SEP`,
  `OCT`,
  `NOV`,
  `DEC`
];

export const price = {
  MIN: 10,
  MAX: 300,
};

export const offers = [
  {
    type: `luggage`,
    text: `Add luggage`,
    price: getRandomIntegerNumber(price.MIN, price.MAX)
  },
  {
    type: `comfort`,
    text: `Switch to comfort class`,
    price: getRandomIntegerNumber(price.MIN, price.MAX)
  },
  {
    type: `meal`,
    text: `Add meal`,
    price: getRandomIntegerNumber(price.MIN, price.MAX)
  },
  {
    type: `seats`,
    text: `Choose seats`,
    price: getRandomIntegerNumber(price.MIN, price.MAX)
  },
  {
    type: `train`,
    text: `Travel by train`,
    price: getRandomIntegerNumber(price.MIN, price.MAX)
  }
];
