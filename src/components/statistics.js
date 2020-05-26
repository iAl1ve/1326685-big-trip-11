import AbstractComponent from "./abstract-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {BAR_HEIGHT, POINT_ACTIVITY_TYPES, EventEmoji, ChartType} from "../const.js";
import {formatTimeDuration} from "../utils/common.js";

const formatDataForChart = (events, chartType) => {
  const copyEvents = Object.assign({}, events);
  const chartEvents = [];
  switch (chartType) {
    case ChartType.TRANSPORT:
      POINT_ACTIVITY_TYPES.forEach((type) => delete copyEvents[type]);
      for (const key in copyEvents) {
        if (copyEvents.hasOwnProperty(key)) {
          chartEvents.push([key, copyEvents[key].length]);
        }
      }
      break;

    case ChartType.MONEY:
      for (const key in copyEvents) {
        if (copyEvents.hasOwnProperty(key)) {
          chartEvents.push([key, copyEvents[key].reduce((total, item) => {
            return total + parseInt(item.price, 10);
          }, 0)]);
        }
      }
      break;

    case ChartType.TIME:
      for (const key in copyEvents) {
        if (copyEvents.hasOwnProperty(key)) {
          chartEvents.push([key, copyEvents[key].reduce((total, item) => {
            const durationTime = item.endDate.getTime() - item.startDate.getTime();

            return total + durationTime;
          }, 0)]);
        }
      }
      break;
  }
  return chartEvents.sort((a, b) => b[1] - a[1]);
};

const formatterDataLabelsChart = (val, chartType) => {
  let result = ``;
  switch (chartType) {
    case ChartType.TRANSPORT:
      result = `${val}x`;
      break;
    case ChartType.MONEY:
      result = `€ ${val}`;
      break;
    case ChartType.TIME:
      result = `${formatTimeDuration(val)}`;
      break;
  }
  return result;
};

const viewDataChart = (elementCtx, items, chartType) => {
  const events = formatDataForChart(items, chartType);
  const eventLabels = events.map((type) => {
    const eventEmoji = EventEmoji[type[0] === `check-in` ? `CHECKIN` : [type[0].toUpperCase()]];
    return `${eventEmoji} ${type[0].toUpperCase()}`;
  });
  const eventCosts = events.map((type) => type[1]);

  elementCtx.height = BAR_HEIGHT * eventLabels.length + 1;

  return new Chart(elementCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventLabels,
      datasets: [{
        data: eventCosts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${formatterDataLabelsChart(val, chartType)}`
        }
      },
      title: {
        display: true,
        text: `${chartType}`,
        fontColor: `#000000`,
        padding: 35,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },

        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },

        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const groupTripEventsByType = (items) =>
  items.reduce((total, item) => {
    const resultKey = item[`type`];

    if (total[resultKey] === undefined) {
      total[resultKey] = [];
    }
    total[resultKey].push(item);

    return total;
  }, {});

export default class Statistics extends AbstractComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

  }

  getTemplate() {
    return createStatTemplate();
  }

  show() {
    super.show();

    this.rerender(this._eventsModel);
  }

  rerender() {
    this._renderCharts();
  }

  _renderCharts() {
    const events = this._eventsModel.getItemsAll();
    const groupedItems = groupTripEventsByType(events);

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = viewDataChart(moneyCtx, groupedItems, ChartType.MONEY);
    this._transportChart = viewDataChart(transportCtx, groupedItems, ChartType.TRANSPORT);
    this._timeChart = viewDataChart(timeSpendCtx, groupedItems, ChartType.TIME);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
