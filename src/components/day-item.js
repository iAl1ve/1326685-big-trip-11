export const createTripDaysItemTemplate = (day, month = 3, year = 2020) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${year}-${month}-${day}">MAR ${day}</time>
      </div>
    </li>`
  );
};
