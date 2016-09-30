define(function(require) {
    'use strict';

    var zrUtil = require('zrender/core/util');

    function MagicType(model) {
        this.model = model;
    }

    MagicType.defaultOption = {
        show: true,
        type: [],
        // Icon group
        icon: {
            line: 'M4.1,28.9h7.1l9.3-22l7.4,38l9.7-19.7l3,12.8h14.9M4.1,58h51.4',
            bar: 'M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7',
            stack: 'M8.2,38.4l-8.4,4.1l30.6,15.3L60,42.5l-8.1-4.1l-21.5,11L8.2,38.4z M51.9,30l-8.1,4.2l-13.4,6.9l-13.9-6.9L8.2,30l-8.4,4.2l8.4,4.2l22.2,11l21.5-11l8.1-4.2L51.9,30z M51.9,21.7l-8.1,4.2L35.7,30l-5.3,2.8L24.9,30l-8.4-4.1l-8.3-4.2l-8.4,4.2L8.2,30l8.3,4.2l13.9,6.9l13.4-6.9l8.1-4.2l8.1-4.1L51.9,21.7zM30.4,2.2L-0.2,17.5l8.4,4.1l8.3,4.2l8.4,4.2l5.5,2.7l5.3-2.7l8.1-4.2l8.1-4.2l8.1-4.1L30.4,2.2z', // jshint ignore:line
            tiled: 'M2.3,2.2h22.8V25H2.3V2.2z M35,2.2h22.8V25H35V2.2zM2.3,35h22.8v22.8H2.3V35z M35,35h22.8v22.8H35V35z',
            proportion: 'M27,54 C41.9116882,54 54,41.9116882 54,27 C54,12.0883118 41.9116882,0 27,0 C12.0883118,0 0,12.0883118 0,27 C0,41.9116882 12.0883118,54 27,54 Z M35.6603774,44.8301887 C39.0366087,44.8301887 41.7735849,42.0932124 41.7735849,38.7169811 C41.7735849,35.3407498 39.0366087,32.6037736 35.6603774,32.6037736 C32.2841461,32.6037736 29.5471698,35.3407498 29.5471698,38.7169811 C29.5471698,42.0932124 32.2841461,44.8301887 35.6603774,44.8301887 Z M18.3396226,21.3962264 C21.7158539,21.3962264 24.4528302,18.6592502 24.4528302,15.2830189 C24.4528302,11.9067876 21.7158539,9.16981132 18.3396226,9.16981132 C14.9633913,9.16981132 12.2264151,11.9067876 12.2264151,15.2830189 C12.2264151,18.6592502 14.9633913,21.3962264 18.3396226,21.3962264 Z M34.7270687,14.4910018 L18.4251819,38.943832 L19.2729313,39.5089982 L35.5748181,15.056168 L34.7270687,14.4910018 Z',
            summation: 'M12.7,17.1H0v-1.1l6.8-7.8L0.2,1.1V0h12v0.9h-11L8,8.2l-7,8.1h11.6V17.1z M19.1,12.6h0.8V8.5H24V7.7h-4.1V3.6 h-0.8v4.1H15v0.8h4.1V12.6z M0,23v1h24v-1H0z',
        },
        title: {
            line: '切换为折线图',
            bar: '切换为柱状图',
            stack: '切换为堆叠',
            tiled: '切换为平铺',
            proportion: '切换为比例图',
            summation: '切换为累计',
        },
        option: {},
        seriesIndex: {}
    };

    var proto = MagicType.prototype;

    proto.getIcons = function () {
        var model = this.model;
        var availableIcons = model.get('icon');
        var icons = {};
        zrUtil.each(model.get('type'), function (type) {
            if (availableIcons[type]) {
                icons[type] = availableIcons[type];
            }
        });
        return icons;
    };

    var seriesOptGenreator = {
        'summation': function (seriesType, seriesId, seriesModel, model) {
            if (seriesType === 'bar' || seriesType === 'line') {
                var sum_array = [];
                var data = seriesModel.get('data');
                for (var i=1; i<=data.length;i++) {
                  sum_array.push(data.slice(0, i).reduce(function (a, b) { return a + b; }, 0));
                }
                return zrUtil.merge({
                    id: seriesId,
                    type: 'bar',
                    // Preserve data related option
                    data: sum_array,
                    stack: seriesModel.get('stack'),
                    markPoint: seriesModel.get('markPoint'),
                    markLine: seriesModel.get('markLine'),
                }, model.get('option.proportion') || {}, true);
            }
        },
        'proportion': function (seriesType, seriesId, seriesModel, model) {
            if (seriesType === 'bar' || seriesType === 'line') {
                var sum = seriesModel.get('data').reduce(function (a, b) { return a + b; }, 0);
                return zrUtil.merge({
                    id: seriesId,
                    type: 'bar',
                    // Preserve data related option
                    data: seriesModel.get('data').map(function (d) { return (d * 100) / sum; }),
                    stack: seriesModel.get('stack'),
                    markPoint: seriesModel.get('markPoint'),
                    markLine: seriesModel.get('markLine'),
                }, model.get('option.proportion') || {}, true);
            }
        },
        'line': function (seriesType, seriesId, seriesModel, model) {
            if (seriesType === 'bar') {
                return zrUtil.merge({
                    id: seriesId,
                    type: 'line',
                    // Preserve data related option
                    data: seriesModel.get('data'),
                    stack: seriesModel.get('stack'),
                    markPoint: seriesModel.get('markPoint'),
                    markLine: seriesModel.get('markLine')
                }, model.get('option.line') || {}, true);
            }
        },
        'bar': function (seriesType, seriesId, seriesModel, model) {
            if (seriesType === 'line') {
                return zrUtil.merge({
                    id: seriesId,
                    type: 'bar',
                    // Preserve data related option
                    data: seriesModel.get('data'),
                    stack: seriesModel.get('stack'),
                    markPoint: seriesModel.get('markPoint'),
                    markLine: seriesModel.get('markLine')
                }, model.get('option.bar') || {}, true);
            }
        },
        'stack': function (seriesType, seriesId, seriesModel, model) {
            if (seriesType === 'line' || seriesType === 'bar') {
                return zrUtil.merge({
                    id: seriesId,
                    stack: '__ec_magicType_stack__'
                }, model.get('option.stack') || {}, true);
            }
        },
        'tiled': function (seriesType, seriesId, seriesModel, model) {
            if (seriesType === 'line' || seriesType === 'bar') {
                return zrUtil.merge({
                    id: seriesId,
                    stack: ''
                }, model.get('option.tiled') || {}, true);
            }
        }
    };

    var radioTypes = [
        ['line', 'bar'],
        ['stack', 'tiled'],
        ['proportion', 'bar', 'line'],
    ];

    proto.onclick = function (ecModel, api, type) {
        var model = this.model;
        var seriesIndex = model.get('seriesIndex.' + type);
        // Not supported magicType
        if (!seriesOptGenreator[type]) {
            return;
        }
        var newOption = {
            series: []
        };
        if (type === 'proportion') {
          newOption.yAxis = [
            {
              type: 'value',
              axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value} %'
              }
            }
          ];
          newOption.tooltip = {
            trigger: 'axis',
            formatter: function (params) {
              var result = '';
              params.map(function (param) {
                result += param.seriesName + '<br>' + param.name + ' : ' + param.data + '%' + '<br>';
              });
              return result;
            }
          }
        }
        var generateNewSeriesTypes = function (seriesModel) {
            var seriesType = seriesModel.subType;
            var seriesId = seriesModel.id;
            var newSeriesOpt = seriesOptGenreator[type](
                seriesType, seriesId, seriesModel, model
            );
            if (newSeriesOpt) {
                // PENDING If merge original option?
                zrUtil.defaults(newSeriesOpt, seriesModel.option);
                newOption.series.push(newSeriesOpt);
            }
            // Modify boundaryGap
            var coordSys = seriesModel.coordinateSystem;
            if (coordSys && coordSys.type === 'cartesian2d' && (type === 'line' || type === 'bar')) {
                var categoryAxis = coordSys.getAxesByScale('ordinal')[0];
                if (categoryAxis) {
                    var axisDim = categoryAxis.dim;
                    var axisType = axisDim + 'Axis';
                    var axisModel = ecModel.queryComponents({
                        mainType: axisType,
                        index: seriesModel.get(name + 'Index'),
                        id: seriesModel.get(name + 'Id')
                    })[0];
                    var axisIndex = axisModel.componentIndex;

                    newOption[axisType] = newOption[axisType] || [];
                    for (var i = 0; i <= axisIndex; i++) {
                        newOption[axisType][axisIndex] = newOption[axisType][axisIndex] || {};
                    }
                    newOption[axisType][axisIndex].boundaryGap = type === 'bar' ? true : false;
                }
            }
        };

        zrUtil.each(radioTypes, function (radio) {
            if (zrUtil.indexOf(radio, type) >= 0) {
                zrUtil.each(radio, function (item) {
                    model.setIconStatus(item, 'normal');
                });
            }
        });

        model.setIconStatus(type, 'emphasis');

        ecModel.eachComponent(
            {
                mainType: 'series',
                query: seriesIndex == null ? null : {
                    seriesIndex: seriesIndex
                }
            }, generateNewSeriesTypes
        );
        api.dispatchAction({
            type: 'changeMagicType',
            currentType: type,
            newOption: newOption
        });
    };

    var echarts = require('../../../echarts');
    echarts.registerAction({
        type: 'changeMagicType',
        event: 'magicTypeChanged',
        update: 'prepareAndUpdate'
    }, function (payload, ecModel) {
        ecModel.mergeOption(payload.newOption);
    });

    require('../featureManager').register('magicType', MagicType);

    return MagicType;
});
