项目地址 [yimian/echarts](https://github.com/yimian/echarts)
## 新增功能
1. proportion, summation 两种 magicType；
2. 获取当前 magicType；
3. 设置默认 magicType；
4. 设置 y轴 可读性格式；
5. 设置当前 magicType;
6. showLoading, showError

### proportion, summation 两种 magicType
1. proportion
![proportion](https://attachments.tower.im/tower/fa9b554fbdce417190b3eb889082663a?filename=yimian_echarts_001.png)
> proportion 即占比图表，用于展示单个数据项在所在系列数据中所占百分比

上图中 1 为 proportion 的 icon；2 为图表纵坐标的百分比显示；3 为数据项标签，包含数据项所属系列名称、数据项名称、数据项绝对值、数据项占比。


2. summation
![summation](https://attachments.tower.im/tower/2945dc0898ae40b9a203df9805b79138?filename=yimian_echarts_002.png)
> summation 即累计图表，用于展示系列数据中当前数据项累计值

上图中 1 为 summation 的 icon；2 为图表纵坐标的可读性格式（参见4）；3 为数据项标签，包含数据项所属系列名称、数据项名称、数据项绝对值。

### 获取当前 magicType
> echartsInstance.getCurrentMagicType()

### 设置默认 magicType
示例如下，此设置中默认 magicType 为 summation
```
    var option = {
      toolbox: {
        feature: {
          magicType: {
            defaultType: 'summation', // 默认 magicType
            type: ['bar', 'line', 'stack', 'tiled', 'proportion', 'summation'],
          },
        }
      },
    }
```

### 设置 y轴 可读性格式
```
    var option = {
      yAxis: {
        axisLabel: {
          formatter: {
            humanReadable: true, // 是否开启可读性格式，如不设置， 则不生效
            locale: 'en-US', // 可读性本地语言设置，默认为 'en-US'
            unit: '', // 单位
          },
        }
      },
    }
```
P.S.
locale 目前支持：
en-US -> ['k', 'm', 'b', 't']
zh-CN -> ['万', '亿']

### 设置当前 magicType
```
echartsInstance.setCurrentMagicType(type, isStack, isPercentage)
```
1. type 为 magicType： [summation, proportion, bar, line, stack, tiled]
2. isStack：为 true 时显示堆叠（即再应用 stack）， 否则正常平铺（即再应用 tiled）
3. isPercentage： 为 true 时， 相当于对当前 type 再叠加 proportion 的效果， 否则正常展示绝对值；

### showLoading, showError
增加 showLoading，在 theme 中或者 option 中设置 loading.refresh， 当为 true 时， loading 效果不中断；
showError 效果如图：
![yimian_echarts_003](https://attachments.tower.im/tower/33bdd4b7bef242fcabf2ae2532f5554d?filename=yimian_echarts_003.png)

showLoading(type, opts)
> (type?: string, opts?: Object)
显示加载动画效果。可以在加载数据前手动调用改接口显示加载动画，在数据加载完成后调用 hideLoading 隐藏加载动画。
参数：
type: 可选，加载动画类型， 默认为 'default'
opts: 可选，加载动画配置项，跟type有关，下面是默认配置项：
```
default: {
  text: 'loading',
  color: '#c23531',
  textColor: '#000',
  maskColor: 'rgba(255, 255, 255, 0.8)',
  zlevel: 0
}
```

showError(type, opts)
> (type?: string, opts?: Object)
显示加载错误效果。可以在加载数据出错时前手动调用改接口显示加载错误的动画，在数据重新加载完成后调用 hideLoading 隐藏加载错误的动画。
参数：
type: 可选，加载动画类型， 默认为 'error'
opts: 可选，加载动画配置项，跟type有关，下面是默认配置项：
```
default: {
  text: '加载数据失败， 请刷新重试',
  color: '#c23531',
  textColor: '#aaa',
  maskColor: '#fff',
  zlevel: 0
}
```
