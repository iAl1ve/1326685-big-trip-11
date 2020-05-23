export default class Event {
  constructor(item) {
    this.id = item[`id`];
    this.type = item[`type`];
    this.destination = item[`destination`];
    this.price = item[`base_price`];
    this.startDate = new Date(item[`date_from`]);
    this.endDate = new Date(item[`date_to`]);
    this.offers = item[`offers`];
    this.isFavorite = Boolean(item[`is_favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "destination": this.destination,
      "base_price": this.price,
      "date_from": this.startDate.toJSON(),
      "date_to": this.endDate.toJSON(),
      "offers": this.offers,
      "is_favorite": this.isFavorite,
    };
  }

  static parseEvent(item) {
    return new Event(item);
  }

  static parseEvents(items) {
    return items.map(Event.parseEvent);
  }

  static clone(item) {
    return new Event(item.toRAW());
  }
}
