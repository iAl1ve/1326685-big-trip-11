import {offers} from "../const.js";
import {getRandomIntegerNumber} from "./common.js";

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

export const getRandomDescriptions = () => {
  return descriptionsItem.split(`.`, getRandomIntegerNumber(descriptionsCount.MIN, descriptionsCount.MAX)).join(`.`);
};


export const createOffers = () => {
  const currentOffers = [];

  for (let i = 0; i < getRandomIntegerNumber(offersCount.MIN, offersCount.MAX); i++) {
    currentOffers.push(offers[i]);
  }

  return currentOffers;
};

export const createPhotos = () => {
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
