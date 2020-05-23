import moment from "moment";

// Стоимость поездки без опций (offers)
export const getSumPrice = (array) => {
  return array.reduce((total, elem) => total + elem.price, 0);
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDate = (date, mode = `show`) => {
  let result = ``;
  switch (mode) {
    case `datetime` :
      result = `YYYY-MM-DD-THH:mm`;
      break;
    case `dayitem` :
      result = `YYYY-MM-DD`;
      break;
    default:
      result = `DD/MM/YYYY HH:mm`;
      break;
  }
  return moment(date).format(result);
};

export const formatTimeDuration = (date) => {
  const day = moment(date).format(`D`) - 1;
  const hours = moment(date).format(`H`);
  const minutes = moment(date).format(`mm`);

  return `${day > 0 ? day + `D` : ``} ${hours > 0 ? hours + `H` : ``} ${minutes > 0 ? minutes + `M` : ``}`;
};

export const upperCaseFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getCurrentDateFromValue = (value) => {
  const [day, month, shortYear, hours, minutes] = value.split(/[.,\/ - :]/);
  const dateString = `20${shortYear}-${month}-${day}T${hours}:${minutes}`;
  return dateString;
};

export const activateElement = (activeCurrentElement, container, activeClass) => {
  const activeElement = container.querySelector(`.${activeClass}`);

  if (activeElement) {
    activeElement.classList.remove(activeClass);
    activeCurrentElement.classList.add(activeClass);
  }
};
