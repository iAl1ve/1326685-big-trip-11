import {getEventsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Tasks {
  constructor() {
    this._events = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  getEventsAll() {
    return this._events;
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateEvent(id, task) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }
    task.id = id;
    this._events = [].concat(this._events.slice(0, index), task, this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addEvent(event) {
    event.id = String(new Date() + Math.random());
    this._events = [].concat(event, this._events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(cb) {
    this._filterChangeHandlers.push(cb);
  }

  setDataChangeHandler(cb) {
    this._dataChangeHandlers.push(cb);
  }

  _callHandlers(cb) {
    cb.forEach((handler) => handler());
  }
}
