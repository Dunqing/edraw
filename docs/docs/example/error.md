---
sidebar_position: 5
---

# 图片获取失败的处理

:::tip
EDraw 会先获取你的所有图片 url，然后加载图片这样做会更快的绘制完，不用等待图片一张一张的获取。
:::

```ts live

function () {

  const urlList = [
    'https://img2.baidu.com/it/u=3886895525,3764775842&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    'https://img0.baidu.com/it/u=4117713405,2961605581&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    'https://img2.baidu.com/it/u=2930577551,1726145327&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    'https://img1.baidu.com/it/u=2716398045,2043787292&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800',
    'https://xxx.asdasdasdasdasda.com/qweqweqweqweqwe',
    'https://img2.baidu.com/it/u=3804069081,3968854353&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    'https://img0.baidu.com/it/u=661161858,172661768&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    'https://img1.baidu.com/it/u=1925715390,133119052&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    'https://img0.baidu.com/it/u=1791194990,4113139263&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
  ]

  useEffect(() => {
    new EDraw({
      width: 138 * 3,
      height: 138 * 3,
      el: "#edraw-canvas"
    }).drawByConfig(
      [
        {
          type: 'group',
          columns: urlList.map((url, index) => {
            return {
              url,
              width: 138,
              height: 138,
              type: "image",
              x: ((index) % 3) * 138,
              y: Math.floor(index / 3) * 138,
              errorImage: 'https://img2.baidu.com/it/u=3653323714,2959362204&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            }
          }),
        }
      ]
    )
  }, [])

  return <canvas id="edraw-canvas" />
}

```
