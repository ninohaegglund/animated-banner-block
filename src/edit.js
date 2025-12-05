(function(wp) {
  var el = wp.element.createElement;
  var Fragment = wp.element.Fragment;

  var InspectorControls = wp.blockEditor.InspectorControls || wp.editor.InspectorControls;
  var MediaUpload = wp.blockEditor.MediaUpload || wp.editor.MediaUpload;
  var MediaUploadCheck = wp.blockEditor.MediaUploadCheck || wp.editor.MediaUploadCheck;

  var PanelBody = wp.components.PanelBody;
  var TextControl = wp.components.TextControl;
  var ToggleControl = wp.components.ToggleControl;
  var RangeControl = wp.components.RangeControl;
  var SelectControl = wp.components.SelectControl;
  var Button = wp.components.Button;
  var NumberControl = wp.components.__experimentalNumberControl || wp.components.TextControl; // fallback if NumberControl not available

  wp.blocks.registerBlockType('custom/animated-banner', {
    edit: function(props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;

      var headline = attributes.headline || 'HF Agency i siffror';
      var subheadline = attributes.subheadline || 'Vår sammanfattning av nyckeltal';
      var backgroundImage = attributes.backgroundImage || '';
      var animateOnce = !!attributes.animateOnce;
      var showMarquee = attributes.showMarquee !== undefined ? !!attributes.showMarquee : true;
      var marqueeSpeed = attributes.marqueeSpeed !== undefined ? attributes.marqueeSpeed : 20;
      var marqueeDirection = attributes.marqueeDirection || 'left';
      var metrics = Array.isArray(attributes.metrics) ? attributes.metrics : [];

      function updateMetric(index, patch) {
        var next = metrics.slice();
        next[index] = Object.assign({}, next[index] || {}, patch);
        setAttributes({ metrics: next });
      }

      function addMetric() {
        setAttributes({
          metrics: metrics.concat([{
            icon: '⭐',
            label: 'Ny etikett',
            number: 10,
            suffix: '',
            sub: '',
            decimals: 0
          }])
        });
      }

      function removeMetric(index) {
        var next = metrics.slice();
        next.splice(index, 1);
        setAttributes({ metrics: next });
      }

      function moveMetric(index, dir) {
        var next = metrics.slice();
        var newIndex = index + dir;
        if (newIndex < 0 || newIndex >= next.length) return;
        var item = next.splice(index, 1)[0];
        next.splice(newIndex, 0, item);
        setAttributes({ metrics: next });
      }

      function numberInput(label, value, onChange) {
        if (NumberControl && NumberControl !== TextControl) {
          return el(NumberControl, { label: label, value: value, onChange: function(val){ onChange(Number(val) || 0);} });
        }
        return el(TextControl, { label: label, type: 'number', value: value, onChange: function(val){ onChange(Number(val) || 0);} });
      }

      return el(Fragment, null,
        el(InspectorControls, null,
          el(PanelBody, { title: 'Innehåll', initialOpen: true },
            el(TextControl, {
              label: 'Rubrik',
              value: headline,
              onChange: function(v){ setAttributes({ headline: v }); }
            }),
            el(TextControl, {
              label: 'Underrubrik',
              value: subheadline,
              onChange: function(v){ setAttributes({ subheadline: v }); }
            }),
            el(MediaUploadCheck, null,
              el(MediaUpload, {
                onSelect: function(media){ setAttributes({ backgroundImage: (media && media.url) ? media.url : '' }); },
                allowedTypes: ['image'],
                render: function(obj){
                  return el(Button, { variant: 'secondary', onClick: obj.open },
                    backgroundImage ? 'Byt bakgrundsbild' : 'Välj bakgrundsbild'
                  );
                }
              })
            ),
            el(ToggleControl, {
              label: 'Animera endast en gång',
              checked: animateOnce,
              onChange: function(checked){ setAttributes({ animateOnce: checked }); }
            })
          ),
          el(PanelBody, { title: 'Marquee-rad', initialOpen: false },
            el(ToggleControl, {
              label: 'Visa marquee',
              checked: showMarquee,
              onChange: function(checked){ setAttributes({ showMarquee: checked }); }
            }),
            el(RangeControl, {
              label: 'Hastighet (sekunder per loop)',
              value: marqueeSpeed,
              onChange: function(v){ setAttributes({ marqueeSpeed: v }); },
              min: 5, max: 60
            }),
            el(SelectControl, {
              label: 'Riktning',
              value: marqueeDirection,
              options: [
                { label: 'Vänster', value: 'left' },
                { label: 'Höger', value: 'right' }
              ],
              onChange: function(v){ setAttributes({ marqueeDirection: v }); }
            })
          ),
          el(PanelBody, { title: 'Mätvärden', initialOpen: false },
            el(Button, { variant: 'primary', onClick: addMetric }, 'Lägg till mätvärde'),
            metrics.map(function(m, i){
              return el('div', { key: i, style: { borderTop: '1px solid #ddd', marginTop: '12px', paddingTop: '12px' } },
                el('div', { style: { display: 'flex', gap: '8px' } },
                  el(Button, { onClick: function(){ moveMetric(i, -1); }, disabled: i === 0 }, '↑ Flytta upp'),
                  el(Button, { onClick: function(){ moveMetric(i, +1); }, disabled: i === metrics.length - 1 }, '↓ Flytta ner'),
                  el(Button, { variant: 'secondary', isDestructive: true, onClick: function(){ removeMetric(i); } }, 'Ta bort')
                ),
                el(TextControl, {
                  label: 'Ikon (emoji eller text)',
                  value: m.icon || '',
                  onChange: function(v){ updateMetric(i, { icon: v }); }
                }),
                el(TextControl, {
                  label: 'Etikett',
                  value: m.label || '',
                  onChange: function(v){ updateMetric(i, { label: v }); }
                }),
                numberInput('Nummer (målvärde)', m.number || 0, function(val){ updateMetric(i, { number: val }); }),
                numberInput('Decimaler', m.decimals || 0, function(val){ updateMetric(i, { decimals: val }); }),
                el(TextControl, {
                  label: 'Suffix (t.ex. % eller text efter siffra)',
                  value: m.suffix || '',
                  onChange: function(v){ updateMetric(i, { suffix: v }); }
                }),
                el(TextControl, {
                  label: 'Undertext',
                  value: m.sub || '',
                  onChange: function(v){ updateMetric(i, { sub: v }); }
                })
              );
            })
          )
        ),
        // Editor canvas preview
        el('div', {
          className: 'animated-banner-block',
          style: {
            backgroundImage: backgroundImage ? 'url(' + backgroundImage + ')' : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }
        },
          el('div', { className: 'animated-banner-content' },
            el('h2', null, headline),
            el('p', null, subheadline),
              showMarquee && el('div', { className: 'abb-viewport', 'aria-hidden': 'true' },
                el('div', {
                  className: 'abb-track',
                  'data-speed': String(marqueeSpeed),
                  'data-direction': marqueeDirection
                },
                  el('span', { className: 'abb-item' }, 'Partner 1'),
                  el('span', { className: 'abb-item' }, 'Partner 2'),
                  el('span', { className: 'abb-item' }, 'Partner 3')
              )
            ),
            metrics && metrics.length > 0 && el('div', { className: 'ab-metrics', role: 'group', 'aria-label': 'Nyckeltal' },
              metrics.map(function(m, i){
                return el('div', { className: 'ab-metric', key: i },
                  m.icon ? el('div', { className: 'ab-icon', 'aria-hidden': 'true' }, m.icon) : null,
                  m.label ? el('p', { className: 'ab-label' }, m.label) : null,
                  el('p', { className: 'ab-number' },
                    el('span', {
                      'data-count-to': m.number || 0,
                      'data-decimals': m.decimals || 0,
                      'data-suffix': m.suffix || ''
                    }, '0')
                  ),
                  m.sub ? el('p', { className: 'ab-sub' }, m.sub) : null
                );
              })
            )
          )
        )
      );
    },
    save: function() {
      return null;
    }
  });
})(window.wp);