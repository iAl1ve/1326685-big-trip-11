import {MONTHS} from "../const.js";

export const createTripDaysItemTemplate = (index, date) => {
  const str = /(\d{1,4})-(\d{2})-(\d{2})/;
  const dateMonth = str.exec(date);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${date}">${MONTHS[parseInt(dateMonth[2], 10)]} ${dateMonth[3]}</time>
      </div>
    </li>`
  );
};
