export default class AbstractObservable {
  #observers = new Set();

  addObserver(observer) {
    this.#observers.add(observer);
  }

  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  _notify(event, payload, parameter = null) {
    this.#observers.forEach((observer) => observer(event, payload, parameter));
  }
}
