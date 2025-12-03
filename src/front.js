(function() {
  function initTrack(track) {
    // Read settings
    var speed = parseFloat(track.getAttribute('data-speed')) || 20; // seconds per loop
    var direction = track.getAttribute('data-direction') === 'right' ? 'right' : 'left';

    // Build content: duplicate items until width covers 2x viewport to loop seamlessly
    var item = track.querySelector('.abb-item');
    if (!item) return;

    // Clear previous clones
    Array.from(track.querySelectorAll('.abb-clone')).forEach(function(n){ n.remove(); });

    var viewport = track.closest('.abb-viewport');
    var vw = viewport.offsetWidth;
    var contentWidth = track.scrollWidth;

    // Clone until at least 2x viewport width
    var clones = 0;
    while (contentWidth < vw * 2) {
      var c = item.cloneNode(true);
      c.classList.add('abb-clone');
      track.appendChild(c);
      contentWidth = track.scrollWidth;
      clones++;
      if (clones > 50) break; // safety
    }

    // Animation via CSS variable and keyframes
    var distance = contentWidth; // px to move per loop
    track.style.setProperty('--abb-distance', distance + 'px');
    track.style.setProperty('--abb-duration', speed + 's');
    track.style.animation = (direction === 'left')
      ? 'abb-scroll-left var(--abb-duration) linear infinite'
      : 'abb-scroll-right var(--abb-duration) linear infinite';
  }

  function initAll(container) {
    var tracks = (container || document).querySelectorAll('.abb-track');
    tracks.forEach(initTrack);
  }

  // Add keyframes once
  var styleId = 'abb-scroll-keyframes';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
    @keyframes abb-scroll-left {
      from { transform: translateX(0); }
      to   { transform: translateX(calc(-1 * var(--abb-distance))); }
    }
    @keyframes abb-scroll-right {
      from { transform: translateX(calc(-1 * var(--abb-distance))); }
      to   { transform: translateX(0); }
    }
    `;
    document.head.appendChild(style);
  }

  // Init on load and on editor updates
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ initAll(); });
  } else {
    initAll();
  }

  // Re-init on resize for responsive distance
  window.addEventListener('resize', function(){ initAll(); });

  // Gutenberg editor: refresh when blocks change
  if (window.wp && wp.domReady) {
    wp.domReady(function() {
      initAll(document);
    });
  }
})();
