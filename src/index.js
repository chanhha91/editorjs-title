/**
 * Build styles
 */
require('./index.css').toString();

/**
 * Base Title Block for the Editor.js.
 * Represents simple title for article
 *
 * @author chanhha (chanhqh.dev@gmail.com)
 * @copyright Chanh Ha 2020
 * @license The MIT License (MIT)
 */

/**
 * @typedef {object} TitleConfig
 * @property {string} placeholder - placeholder for the empty title
 * @property {boolean} preserveBlank - Whether or not to keep blank title when saving editor data
 */

/**
 * @typedef {Object} TitleData
 * @description Tool's input and output data format
 * @property {String} text — Title's content.
 */
class Title {
  /**
   * Default placeholder for Title Tool
   *
   * @return {string}
   * @constructor
   */
  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  constructor({ data, config, api }) {
    this.api = api;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-title'
    };

    this._placeholder = config.placeholder ? config.placeholder : Title.DEFAULT_PLACEHOLDER;
    this._data = {};
    this._element = this.drawView();
    this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;

    this.data = data;
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let h1 = document.createElement('h1');

    h1.classList.add(this._CSS.wrapper, this._CSS.block);
    h1.contentEditable = true;
    h1.dataset.placeholder = this.api.i18n.t(this._placeholder);

    return h1;
  }

  /**
   * Return Tool's view
   * @returns {HTMLH1Element}
   * @public
   */
  render() {
    return this._element;
  }

  /**
   * Validate Title block data:
   * - check for emptiness
   *
   * @param {TitleData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    if (savedData.text.trim() === '' && !this._preserveBlank) {
      return false;
    }

    return true;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLH1Element} toolsContent - Title tools rendered view
   * @returns {TitleData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: toolsContent.innerHTML
    };
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML
    };

    this.data = data;
  }

  /**
   * Enable Conversion Toolbar. Title can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: 'text', // to convert Title to other block, use 'text' property of saved data
      import: 'text' // to covert other block's exported string to Title, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {}
    };
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle only H1 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['H1'],
    };
  }

  /**
   * Get current Tools`s data
   * @returns {TitleData} Current data
   * @private
   */
  get data() {
    let text = this._element.innerHTML;

    this._data.text = text;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {TitleData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    this._element.innerHTML = this._data.text || '';
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['H1']
    };
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: require('../assets/icon.svg').default,
      title: 'Title'
    };
  }
}

module.exports = Title;