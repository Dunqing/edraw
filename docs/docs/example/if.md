---
sidebar_position: 1
---

# 动态控制是否需要绘制

```ts live

function () {
  setTimeout(() => {

    new EDraw({
      width: 500,
      height: 500,
      el: "#edraw-canvas1",
    }).drawByConfig(
      [
        {
          type: 'group',
          width: 200,
          height: 200,
          columns: [
            {
              type: 'rect',
              x: 100,
              y: 50,
              radius: '50%',
              isolation: false,
              if: () => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve(Math.random() > 0.5 ? true : false)
                  }, 500)
                })
              }
            },
            {
              type: 'image',
              x: 100,
              y: 50,
              width: 200,
              height: 200,
              url: 'https://avatars.githubusercontent.com/u/29533304?s=200&v=4',
            }
          ],
        }
      ]
    )
  })
  return <canvas id="edraw-canvas1" />
}

```
