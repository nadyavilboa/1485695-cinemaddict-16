import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import {
  countHour,
  countMinutes,
  getTextStatistics,
  colorToHex,
  getStatisticsGenres,
  isDateRange,
  getEmptyStatistics,
} from '../utils/statistics.js';
import SmartView from './smart-view';
import { StatisticsPeriods, Color, TimeValues } from '../const.js';

const BAR_HEIGHT = 50;

const renderFilmsChart = (statisticCtx, films) => {
  const statisticsGenres = getStatisticsGenres(films);
  const genresTitles = Object.keys(statisticsGenres);
  const genresAmount = Object.values(statisticsGenres);

  statisticCtx.height = BAR_HEIGHT * genresTitles.length;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresTitles,
      datasets: [{
        data: genresAmount,
        backgroundColor: colorToHex[Color.YELLOW],
        hoverBackgroundColor: colorToHex[Color.YELLOW],
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: colorToHex[Color.WHITE],
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: colorToHex[Color.WHITE],
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (films, userRank, currentPeriod) => {
  const textStatistics = films.length ? getTextStatistics(films) : getEmptyStatistics();
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      ${StatisticsPeriods.map((period) => `
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-${period.value}"
        value="${period.value}"
        ${period.value === currentPeriod ? 'checked': ''}>
      <label
        for="statistic-${period.value}"
        class="statistic__filters-label">
          ${period.text}
      </label>`)
    .join(' ')}

    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${textStatistics.countWatched} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${countHour(textStatistics.timeFilms)} <span class="statistic__item-description">h</span> ${countMinutes(textStatistics.timeFilms)} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${textStatistics.topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000" height="1000"></canvas>
    </div>

  </section>`;
};

export default class StatisticsView extends SmartView {
  #filmsChart = null;

  #userRank = null;
  #currentPeriod = null;

  constructor (films, userRank, currentPeriod) {
    super();

    this._data = {
      films,
      dateFrom: dayjs().subtract(TimeValues.AMOUNT_YEARS_PROGRAM, 'year').toDate(),
      dateTo: dayjs().toDate(),
    };

    this.#userRank = userRank;
    this.#currentPeriod = currentPeriod;
  }

  get template() {
    const filmsInCurrentPeriod = this.#filterFilmsDateRange();
    return createStatisticsTemplate(filmsInCurrentPeriod, this.#userRank, this.#currentPeriod);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#filmsChart) {
      this.#filmsChart.destroy();
      this.#filmsChart = null;
    }
  }

  render = () => {
    this.#setChart();
    this.#setInnerHandlers();
  }

  restoreHandlers = () => {
    this.#setChart();
    this.#setInnerHandlers();
  }

  #filterFilmsDateRange = () => {
    const {films, dateFrom, dateTo} = this._data;
    const period = dayjs(dateTo).diff(dayjs(dateFrom), 'day', true);
    const resultArray = films.filter((film) => isDateRange(film, period));
    return resultArray;
  };

  #setInnerHandlers = () => {
    const inputsPeriod = this.element.querySelectorAll('.statistic__filters-input');
    inputsPeriod.forEach((inputPeriod) => (
      inputPeriod.addEventListener('change', this.#inputPeriodClickHandler))
    );
  }

  #inputPeriodClickHandler = (evt) => {
    evt.preventDefault();
    this.#currentPeriod = evt.target.value;
    let newDateFrom = null;
    switch (this.#currentPeriod) {
      case 'all-time':
        newDateFrom = dayjs().subtract(TimeValues.AMOUNT_YEARS_PROGRAM, 'year').toDate();
        break;
      case 'today':
        newDateFrom = dayjs().toDate();
        break;
      case 'week':
        newDateFrom = dayjs().subtract(TimeValues.AMOUNT_DAYS_IN_WEEK, 'day').toDate();
        break;
      case 'month':
        newDateFrom = dayjs().subtract(TimeValues.AMOUNT_DAYS_IN_MONTH, 'day').toDate();
        break;
      case 'year':
        newDateFrom = dayjs().subtract(TimeValues.AMOUNT_DAYS_IN_YEAR, 'day').toDate();
        break;
      default:
        throw new Error(`Unknown period type ${this.#currentPeriod}`);
    }
    this.updateData({...this._data, dateFrom: newDateFrom});
  }

  #setChart = () => {
    const statisticCtx = document.querySelector('.statistic__chart');
    const filmsInCurrentPeriod = this.#filterFilmsDateRange();
    this.#filmsChart = renderFilmsChart(statisticCtx, filmsInCurrentPeriod);
  }
}

