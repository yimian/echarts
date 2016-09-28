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
            text: '加载数据失败， 请刷新重试',
            color: '#c23531',
            textColor: '#aaa',
            maskColor: '#fff',
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

        var circle = new graphic.Circle({
          style: {
            stroke: '#ccc',
            lineWidth: 8,
            fill: 'rgba(250, 250, 250, 0.8)',
          },
          z: 10003,
        });

        var line = new graphic.Line({
          style: {
            lineWidth: 8,
            stroke: '#ccc',
            fill: '#ccc',
          },
          z: 10003,
        });

        var smallCircle = new graphic.Circle({
          style: {
            fill: '#ccc',
          },
          z: 10003,
        });

        var labelRect = new graphic.Rect({
            style: {
                fill: 'none',
                text: opts.text,
                fontSize: 40,
                textPosition: 'bottom',
                textDistance: 10,
                textFill: opts.textColor
            },
            zlevel: opts.zlevel,
            z: 10006
        });

        var group = new graphic.Group();
        // group.add(image);
        group.add(labelRect);
        group.add(circle);
        group.add(line);
        group.add(smallCircle);
        group.add(mask);
        // Inject resize
        group.resize = function () {
            var cx = api.getWidth() / 2;
            var cy = api.getHeight() / 2;
            var r = 50;
            circle.setShape({
              cx: cx,
              cy: cy,
              r: r,
            });

            line.setShape({
              x1: cx,
              y1: cy-25,
              x2: cx,
              y2: cy+15,
            });

            smallCircle.setShape({
              cx: cx,
              cy: cy + r - 20,
              r: r / 10,
            });

            labelRect.setShape({
                x: cx,
                y: cy + r*1.5,
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
