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

export const HIDDEN_CLASS = `visually-hidden`;
export const MAX_OFFERS_OPTION = 3;
export const KEY_ESC = `Escape`;
export const KEY_ESC_CODE = 27;
export const BAR_HEIGHT = 55;

export const EventEmoji = {
  TAXI: `🚕`,
  BUS: `🚌`,
  TRAIN: `🚂`,
  SHIP: `🛳`,
  TRANSPORT: `🚊`,
  DRIVE: `🚗`,
  FLIGHT: `✈`,
  CHECKIN: `🏨`,
  SIGHTSEEING: `🏛`,
  RESTAURANT: `🍴`,
};

export const ChartType = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPENT`
};

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
