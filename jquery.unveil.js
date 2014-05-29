/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(opts) {

    var $w = $(window),
        $c = opts.container || $w,
        th = opts.threshold || 0,
        wh = $w.height(),
        retina = window.devicePixelRatio > 1,
        attrib = retina ? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      if (opts.custom) return;
      var $img = $(this), src = $img.attr(attrib);
      src = src || $img.attr("data-src");
      if (src) $img.attr("src", src).trigger("unveiled");
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + wh,
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    function resize() {
      wh = $w.height();
      unveil();
    }

    function debounce(fn) {
      var timer;
      return function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(fn, opts.debounce || 0);
      };
    }

    $c.on({
      "resize.unveil": debounce(resize),
      "scroll.unveil": debounce(unveil),
      "lookup.unveil": unveil
    });

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
