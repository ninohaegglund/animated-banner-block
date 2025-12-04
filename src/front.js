(function() {
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutQuad(t) { return t * (2 - t); }

  function countTo(el, toValue, options) {
    options = options || {};
    var duration = Math.max(200, parseInt(options.duration || 1200, 10));
    var prefix = options.prefix || '';
    var suffix = options.suffix || '';
    var decimals = parseInt(options.decimals || 0, 10);

    if (prefersReduced) {
      el.textContent = prefix + toValue.toFixed(decimals) + suffix;
      return Promise.resolve();
    }

    var start = performance.now();
    var fromValue = parseFloat((el.textContent || '0').replace(/[^\d.-]/g, '')) || 0;
    var delta = toValue - fromValue;

    return new Promise(function(resolve) {
      function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = easeOutQuad(t);
        var current = fromValue + delta * eased;
        el.textContent = prefix + current.toFixed(decimals) + suffix;
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + toValue.toFixed(decimals) + suffix;
          resolve();
        }
      }
      requestAnimationFrame(tick);
    });
  }

  function initTrack(track) {
    var speed = parseFloat(track.getAttribute('data-speed')) || 20;
    var direction = track.getAttribute('data-direction') === 'right' ? 'right' : 'left';

    var item = track.querySelector('.abb-item');
    if (!item) return;

    Array.prototype.slice.call(track.querySelectorAll('.abb-clone')).forEach(function(n){ n.remove(); });

    var viewport = track.closest('.abb-viewport') || track.parentElement;
    var vw = viewport.offsetWidth;
    var contentWidth = track.scrollWidth;

    var clones = 0;
    while (contentWidth < vw * 2) {
      var c = item.cloneNode(true);
      c.classList.add('abb-clone');
      track.appendChild(c);
      contentWidth = track.scrollWidth;
      clones++;
      if (clones > 50) break;
    }

    var distance = contentWidth;
    track.style.setProperty('--abb-distance', distance + 'px');
    track.style.setProperty('--abb-duration', speed + 's');

    if (prefersReduced) {
      track.style.animation = 'none';
      track.style.transform = 'translateX(0)';
    } else {
      track.style.animation = (direction === 'left')
        ? 'abb-scroll-left var(--abb-duration) linear infinite'
        : 'abb-scroll-right var(--abb-duration) linear infinite';
    }
  }

  var styleId = 'abb-scroll-keyframes';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = '\
    @keyframes abb-scroll-left {\
      from { transform: translateX(0); }\
      to   { transform: translateX(calc(-1 * var(--abb-distance))); }\
    }\
    @keyframes abb-scroll-right {\
      from { transform: translateX(calc(-1 * var(--abb-distance))); }\
      to   { transform: translateX(0); }\
    }';
    document.head.appendChild(style);
  }

  function initNumbers(banner) {
    var nums = banner.querySelectorAll('[data-count-to]');
    Array.prototype.forEach.call(nums, function(num){
      var to = parseFloat(num.getAttribute('data-count-to')) || 0;
      var prefix = num.getAttribute('data-prefix') || '';
      var suffix = num.getAttribute('data-suffix') || '';
      var decimals = parseInt(num.getAttribute('data-decimals') || '0', 10);

      num.textContent = prefersReduced ? (prefix + to.toFixed(decimals) + suffix) : (prefix + (0).toFixed(decimals) + suffix);
      num.__cfg = { to: to, prefix: prefix, suffix: suffix, decimals: decimals };
    });
    return nums;
  }

  function runNumbers(nums) {
    var jobs = Array.prototype.map.call(nums, function(num){
      return countTo(num, num.__cfg.to, num.__cfg);
    });
    return Promise.all(jobs);
  }

  function observeBanner(banner) {
    var animateOnce = banner.getAttribute('data-animate-once') === 'true';
    var hasAnimated = false;

    var nums = initNumbers(banner);

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          banner.classList.add('is-inview');
          Array.prototype.forEach.call(banner.querySelectorAll('.abb-track'), function(track){
            initTrack(track);
            track.style.animationPlayState = 'running';
          });

          if (!hasAnimated || !animateOnce) {
            runNumbers(nums).then(function(){ hasAnimated = true; });
          }
        } else {
          Array.prototype.forEach.call(banner.querySelectorAll('.abb-track'), function(track){
            track.style.animationPlayState = 'paused';
          });
          if (!animateOnce) {
            banner.classList.remove('is-inview');
            nums = initNumbers(banner);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    observer.observe(banner);
  }

  function initAll() {
    var banners = document.querySelectorAll('.animated-banner-block');
    Array.prototype.forEach.call(banners, observeBanner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  var resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      document.querySelectorAll('.animated-banner-block.is-inview .abb-track').forEach(initTrack);
    }, 150);
  });

  if (window.wp && wp.domReady) {
    wp.domReady(function() {
      initAll();
    });
  }
})();