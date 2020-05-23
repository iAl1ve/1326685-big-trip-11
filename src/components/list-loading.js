import AbstractComponent from "./abstract-component.js";

const createListLoadingTemplate = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export default class ListLoading extends AbstractComponent {
  getTemplate() {
    return createListLoadingTemplate();
  }
}
