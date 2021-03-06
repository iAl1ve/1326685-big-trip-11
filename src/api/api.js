import Event from "../models/event.js";
import {StatusCode, URL} from "../const.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status < StatusCode.INFORMATIONAL && response.status > StatusCode.REDIRECTION) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response;
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: URL.POINTS})
      .then((response) => response.json())
      .then(Event.parseItems);
  }

  getOffers() {
    return this._load({url: URL.OFFERS})
      .then((response) => response.json());
  }

  getDestinations() {
    return this._load({url: URL.DESTINATIONS})
      .then((response) => response.json());
  }

  sync(data) {
    return this._load({
      url: `${URL.POINTS}/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  updateEvent(id, event) {
    return this._load({
      url: `${URL.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(Event.parseItem);
  }

  createEvent(event) {
    return this._load({
      url: URL.POINTS,
      method: Method.POST,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parseItem);
  }

  deleteEvent(id) {
    return this._load({url: `${URL.POINTS}/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
