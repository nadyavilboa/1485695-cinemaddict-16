import AbstractObservable from '../utils/abstract-observable.js';
import { MenuItem } from '../const.js';

export default class FilterModel extends AbstractObservable {
  #filter = MenuItem.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
