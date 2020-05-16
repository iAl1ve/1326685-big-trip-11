import {getRandomIntegerNumber} from "./utils/common.js";

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`,
};

export const SortItem = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const SORTS_NAME = [`Event`, `Time`, `Price`];

export const MAX_OFFERS_OPTION = 3;
export const KEY_ESC = `Escape`;
export const KEY_ESC_CODE = 27;

export const CITIES = [`London`, `Edinburg`, `Amsterdam`, `Geneva`, `Milan`, `Chamonix`];

export const POINTS_TYPE_TRANSFER = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

export const POINTS_TYPE_ACTIVITY = [`check-in`, `sightseeing`, `restaurant`];

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
