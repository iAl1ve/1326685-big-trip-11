import {POINTS_TYPE_TRANSFER, POINTS_TYPE_ACTIVITY, CITIES, offers, price} from "../const.js";
import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate} from "../utils.js";

const descriptionsCount = {
  MIN: 1,
  MAX: 5,
};

const photosCount = {
  MIN: 1,
  MAX: 5,
};

const offersCount = {
  MIN: 0,
  MAX: 5,
};

const descriptionsItem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const createOffers = () => {
  const currentOffers = [];

  for (let i = 0; i < getRandomIntegerNumber(offersCount.MIN, offersCount.MAX); i++) {
    currentOffers.push(offers[i]);
  }

  return currentOffers;
};

const createPhotos = () => {
  const count = getRandomIntegerNumber(photosCount.MIN, photosCount.MAX);
  const photos = [];

  for (let i = 0; i < count; i++) {
    photos
      .push({
        src: `http://picsum.photos/248/152?r=${Math.random()}`,
        alt: `alt-${Math.random()}`,
      });
  }

  return photos;
};

const generateEvent = () => {
  const startDate = getRandomDate(new Date());

  return {
    type: getRandomArrayItem(POINTS_TYPE_TRANSFER.concat(POINTS_TYPE_ACTIVITY)),
    city: getRandomArrayItem(CITIES),
    description: descriptionsItem.split(`.`, getRandomIntegerNumber(descriptionsCount.MIN, descriptionsCount.MAX)).join(`.`),
    price: getRandomIntegerNumber(price.MIN, price.MAX),
    offers: createOffers(),
    images: createPhotos(),
    startDate,
    endDate: getRandomDate(startDate),
  };
};

export const generateTripEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};
