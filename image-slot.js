/*
 * image-slot (production build)
 * -----------------------------
 * The authoring version of <image-slot> ships a drag-and-drop editor: a hidden
 * file <input>, "Replace / Edit" affordances, and a click handler that calls
 * this._input.click() during setup. On the live site that editor is dead
 * weight - it is what put Replace/Edit controls in front of visitors and what
 * threw "Cannot read properties of null (reading 'click')" on load.
 *
 * This file defines the same tag with the same attributes, renders a plain
 * <img>, and does nothing else. Swap it in for image-slot.js in any
 * production bundle.
 */
(function () {
  if (window.customElements && customElements.get('image-slot')) return;

  var RADIUS = { rect: '0', rounded: '10px', circle: '50%', pill: '999px' };

  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['src', 'alt', 'fit', 'shape', 'radius', 'position', 'placeholder'];
    }
    connectedCallback() { this._render(); }
    attributeChangedCallback() { if (this._img) this._render(); }
    // No-op kept so any host code calling it cannot throw.
    openFilePicker() {}

    _render() {
      var src = this.getAttribute('src') || '';
      var shape = this.getAttribute('shape') || 'rect';
      var radius = this.getAttribute('radius') || RADIUS[shape] || '0';
      this.style.display = 'block';
      this.style.overflow = 'hidden';
      this.style.borderRadius = radius;
      if (!this._img) {
        this._img = document.createElement('img');
        this._img.decoding = 'async';
        this._img.style.display = 'block';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this.appendChild(this._img);
      }
      this._img.style.objectFit = this.getAttribute('fit') || 'cover';
      this._img.style.objectPosition = this.getAttribute('position') || 'center';
      this._img.alt = this.getAttribute('alt') || '';
      if (src && this._img.getAttribute('src') !== src) this._img.setAttribute('src', src);
      if (!src) this._img.removeAttribute('src');
    }
  }

  customElements.define('image-slot', ImageSlot);
})();
