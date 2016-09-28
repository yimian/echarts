define(function (require) {

    var graphic = require('../util/graphic');
    var zrUtil = require('zrender/core/util');
    var PI = Math.PI;
    /**
     * @param {module:echarts/ExtensionAPI} api
     * @param {Object} [opts]
     * @param {string} [opts.text]
     * @param {string} [opts.color]
     * @param {string} [opts.textColor]
     * @return {module:zrender/Element}
     */
    return function (api, opts) {
        opts = opts || {};
        zrUtil.defaults(opts, {
            text: '',
            color: '#c23531',
            textColor: '#000',
            maskColor: '#E7E7E7',
            zlevel: 0
        });
        var mask = new graphic.Rect({
            style: {
                stroke: '#ccc',
                fill: opts.maskColor
            },
            zlevel: opts.zlevel,
            z: 10000
        });

        var image = new graphic.Image({
          style: {
            x: api.getWidth() / 5,
            y: api.getHeight() / 10,
            image: './images/load-error.png',
          },
          silent: true,
          z: 10002,
        });

        var labelRect = new graphic.Rect({
            style: {
                fill: 'none',
                text: opts.text,
                textSize: 40,
                textPosition: 'inside',
                textDistance: 10,
                textFill: opts.textColor
            },
            zlevel: opts.zlevel,
            z: 10001
        });

        var group = new graphic.Group();
        group.add(image);
        group.add(labelRect);
        group.add(mask);
        // Inject resize
        group.resize = function () {
            var cx = api.getWidth() / 2;
            var cy = api.getHeight() / 2;
            var r = 10;
            labelRect.setShape({
                x: cx - r,
                y: cy - r,
                width: r * 2,
                height: r * 2
            });

            mask.setShape({
                x: 0,
                y: 0,
                width: api.getWidth(),
                height: api.getHeight()
            });
        };
        group.resize();
        return group;
    };
});
