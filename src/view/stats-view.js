import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { countHour, countMinutes, getTextStatistics } from '../utils/statistics.js';
import SmartView from './smart-view';

const renderColorsChart = (statisticCtx) => {

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: ['Sci-Fi', 'Animation', 'Fantasy', 'Comedy', 'TV Series'],
      datasets: [{
        data: [11, 8, 7, 4, 3],
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
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
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
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
  return myChart;
};

const createStatisticsTemplate = (films) => {
  const textStatistics = getTextStatistics(films);
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${textStatistics.userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${textStatistics.countWatched} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${countHour(textStatistics.timeFilms) ? countHour(textStatistics.timeFilms) : ''} <span class="statistic__item-description">h</span> ${countMinutes(textStatistics.timeFilms) ? countMinutes(textStatistics.timeFilms) : ''} <span class="statistic__item-description">m</span></p>
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
  #statisticsChart = null;
  #colorsChart = null;

  #films = null;

  constructor (films) {
    super();

    this.#films = films;

    this.#setChart();
    this.#setInnerHandlers();
  }

  get template() {
    return createStatisticsTemplate(this.#films);
  }

  restoreHandlers = () => {
    this.#setChart();
    //this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    const inputsPeriod = this.element.querySelectorAll('.statistic__filters-input');
    inputsPeriod.forEach((inputPeriod) => (
      inputPeriod.addEventListener('click', this.#inputPeriodClickHandler))
    );
  }

  #setChart = () => {
    //эта часть не работает, код черновой, пока задача, чтобы график запустился
    const BAR_HEIGHT = 50 * 9;
    const statisticCtx = document.querySelector('.statistic__chart');

    //statisticCtx.setAttribute('height', BAR_HEIGHT);

    //this.#colorsChart = renderColorsChart(statisticCtx);

  }

  #inputPeriodClickHandler = (evt) => {
    evt.preventDefault();
    console.log(evt.target);
  }
}

