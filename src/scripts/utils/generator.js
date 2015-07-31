/**
 * Generate prefixes
 *
 * @param {string} defaultPrefix
 *
 * @class Generator
 * */


class Generator {
  constructor(defaultPrefix) {
    this.defaultPrefix = defaultPrefix;
    //cache generator state per perfix
    this.idHash = {};
  }

  /**
   * This method is used to generate a unique id for a given prefix
   *
   * @return {string}  the next available unique ID
   */
  getNextId(prefix) {
    prefix = prefix || this.defaultPrefix;

    if (!this.idHash[prefix]) {
      this.idHash[prefix] = 1;
    }
    return [prefix, this.idHash[prefix]++].join("");
  }

  /**
   * This method is used to reset generator for a given prefix
   *
   * @return {void}
   */
  reset(prefix) {
    prefix = prefix || this.defaultPrefix;

    this.idHash [prefix] = null;

  }
}

export default Generator
