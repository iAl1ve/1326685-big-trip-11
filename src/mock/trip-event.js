import {POINTS_TYPE_TRANSFER, POINTS_TYPE_ACTIVITY, CITIES, price} from "../const.js";
import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate} from "../utils/common.js";
import {getRandomDescriptions, createPhotos, createOffers} from "../utils/data.js";

const generateEvent = () => {
  const startDate = getRandomDate(new Date());
  let endDate = getRandomDate(startDate);

  while (endDate < startDate) {
    endDate = getRandomDate(startDate);
  }

  return {
    id: String(new Date() + Math.random()),
    type: getRandomArrayItem(POINTS_TYPE_TRANSFER.concat(POINTS_TYPE_ACTIVITY)),
    destination: getRandomArrayItem(CITIES),
    description: getRandomDescriptions(),
    price: getRandomIntegerNumber(price.MIN, price.MAX),
    offers: createOffers(),
    images: createPhotos(),
    startDate,
    endDate,
    isFavorite: Math.random() >= 0.5,
  };
};

export const generateTripEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};
