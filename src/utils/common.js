const MAX_DAY_GENERATION = 3;

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

// Стоимость поездки без опций (offers)
export const getSumPrice = (array) => {
  return array.reduce((total, elem) => total + elem.price, 0);
};

export const getRandomDate = (date) => {
  const targetDate = new Date(date);
  const diffDays = getRandomIntegerNumber(0, MAX_DAY_GENERATION);
  const diffMinutes = getRandomIntegerNumber(0, 60);

  targetDate.setDate(targetDate.getDate() + diffDays);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date, mode = `show`) => {
  const years = castTimeFormat(date.getUTCFullYear()) % 2000;
  const month = castTimeFormat(date.getMonth());
  const monthStr = castTimeFormat(date.getMonth() + 1);
  const days = castTimeFormat(date.getDate());
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  let result;
  switch (mode) {
    case `datetime` :
      result = `${date.getUTCFullYear()}-${month}-${days}-T${hours}:${minutes}`;
      break;
    case `dayitem` :
      result = `${date.getUTCFullYear()}-${month}-${days}`;
      break;
    case `eventtime` :
      result = `${hours}:${minutes}`;
      break;
    default:
      result = `${days}/${monthStr}/${years} ${hours}:${minutes}`;
      break;
  }
  return result;
};

export const formatTimeDuration = (duration) => {
  const time = Math.floor((duration) / 60000);
  const minutes = time % 60;
  const days = Math.round((time - minutes) / 1440);
  const hours = Math.round((time - minutes) / 60 - days * 24);

  return `${days > 0 ? days + `D` : ``} ${hours > 0 ? hours + `H` : ``} ${minutes > 0 ? minutes + `M` : ``}`;
};

export const ucFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

