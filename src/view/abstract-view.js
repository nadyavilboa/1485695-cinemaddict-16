import { createElement } from '../utils/render.js';
import { SHAKE_TIME }  from '../const.js';

export default class AbstractView {
  #element = null;
  _callback = {};

  constructor () {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }

  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_TIME / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_TIME);
  }
}
