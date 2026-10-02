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
  // Framing chosen in the editor (scale s, pan x/y in frame-%), baked in so
  // the live site crops every slot exactly as it was placed.
  var VIEWS = {"loc-brt-lanes":{"s":1.1456,"x":7.281,"y":-2.657},"loc-brt-skytrain":{"s":1.3042,"x":8.374,"y":-4.649},"loc-brt-station":{"s":1.1292,"x":6.458,"y":6.547},"loc-map":{"s":1.0648,"x":3.64,"y":3.238},"hero-location":{"s":1,"x":0,"y":-41.547},"dev-p2":{"s":1.0779,"x":3.897,"y":39.394},"hero-amenities":{"s":1,"x":0,"y":21.689},"hero-floorplans":{"s":1,"x":0,"y":12.554},"hero-homes":{"s":1,"x":0,"y":-6.195},"hero-developer":{"s":1,"x":0,"y":-26.174},"hero-faq":{"s":1,"x":0,"y":13.86},"home-slide-2":{"s":1,"x":0,"y":-0.434},"home-slide-1":{"s":1,"x":0,"y":-9.379},"home-slide-0":{"s":1.1156,"x":-2.817,"y":-5.781},"homes-finishes":{"s":1.2887,"x":-7.187,"y":-3.753},"home-slide-5":{"s":1,"x":-3.653,"y":0},"home-slide-3":{"s":1,"x":0,"y":0.607},"home-slide-4":{"s":1,"x":0,"y":-9.699},"home-hero":{"s":1,"x":0,"y":-11.233},"dev-p12":{"s":1.0948,"x":7.288,"y":4.738},"amen-7":{"s":1,"x":0,"y":-0.676},"amen-8":{"s":1,"x":-5.5,"y":0},"amen-1":{"s":1,"x":2.348,"y":0},"amen-2":{"s":1,"x":-17.786,"y":0},"amen-3":{"s":1,"x":17.786,"y":0},"dev-p7":{"s":1.3268,"x":-14.573,"y":-8.478},"dev-p10":{"s":1.2686,"x":-12.948,"y":-21.922},"dev-p3":{"s":1.13,"x":-6.5,"y":-18.202},"dev-p4":{"s":1.1435,"x":5.549,"y":1.723},"dev-p11":{"s":1.1119,"x":0.324,"y":-3.478},"dev-p5":{"s":1.1631,"x":-1.254,"y":8.156},"home-hero-evening":{"s":1,"x":0,"y":-11.233},"home-hero-latemorning":{"s":1,"x":0,"y":-11.233},"home-hero-afternoon":{"s":1,"x":0,"y":-11.233},"home-hero-lateafternoon":{"s":1,"x":0,"y":-11.233}};

  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['src', 'alt', 'fit', 'shape', 'radius', 'position', 'placeholder'];
    }
    connectedCallback() {
      this._render();
      var self = this;
      if (!this._ro && window.ResizeObserver) {
        this._ro = new ResizeObserver(function () { self._frame(); });
        this._ro.observe(this);
      }
    }
    disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } }
    attributeChangedCallback() { if (this._img) this._render(); }
    openFilePicker() {}

    _render() {
      var src = this.getAttribute('src') || '';
      var shape = this.getAttribute('shape') || 'rect';
      var radius = this.getAttribute('radius') || RADIUS[shape] || '0';
      this.style.display = 'block';
      this.style.overflow = 'hidden';
      this.style.position = this.style.position || 'relative';
      // The host must own its box: an absolutely positioned <img> no longer
      // props it open, so fill the slot's container like the editor does.
      if (!this.style.width) this.style.width = '100%';
      if (!this.style.height) this.style.height = '100%';
      this.style.borderRadius = radius;
      if (!this._img) {
        var self = this;
        this._img = document.createElement('img');
        this._img.decoding = 'async';
        this._img.style.display = 'block';
        this._img.addEventListener('load', function () { self._frame(); });
        this.appendChild(this._img);
      }
      this._img.alt = this.getAttribute('alt') || '';
      if (src && this._img.getAttribute('src') !== src) this._img.setAttribute('src', src);
      if (!src) this._img.removeAttribute('src');
      this._frame();
    }

    _frame() {
      var img = this._img; if (!img) return;
      var v = VIEWS[this.id];
      var contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      var iw = img.naturalWidth, ih = img.naturalHeight, fw = this.clientWidth, fh = this.clientHeight;
      if (!v || !iw || !ih || !fw || !fh) {
        img.style.position = ''; img.style.left = ''; img.style.top = ''; img.style.transform = ''; img.style.maxWidth = '';
        img.style.width = '100%'; img.style.height = '100%';
        img.style.objectFit = contain ? 'contain' : 'cover';
        img.style.objectPosition = this.getAttribute('position') || 'center';
        return;
      }
      var base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      var k = base * v.s;
      var mx = Math.max(0, (iw * k / fw - 1) * 50), my = Math.max(0, (ih * k / fh - 1) * 50);
      var x = Math.max(-mx, Math.min(mx, v.x)), y = Math.max(-my, Math.min(my, v.y));
      img.style.position = 'absolute';
      img.style.maxWidth = 'none';
      img.style.objectFit = '';
      img.style.width = (iw * k / fw * 100) + '%';
      img.style.height = (ih * k / fh * 100) + '%';
      img.style.left = (50 + x) + '%';
      img.style.top = (50 + y) + '%';
      img.style.transform = 'translate(-50%,-50%)';
    }
  }

  customElements.define('image-slot', ImageSlot);
})();
