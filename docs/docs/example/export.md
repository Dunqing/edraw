---
sidebar_position: 1
---

# 导出图片

:::tip
支持导出 jpg,png,webp
:::

```ts live

function () {
  const onClick = () => {
    new EDraw({
      width: 500,
      height: 500,
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
              backgroundColor: '#eee'
            },
            {
              type: 'image',
              width: 200,
              height: 200,
              url: 'https://avatars.githubusercontent.com/u/29533304?s=200&v=4',
            }
          ],
        }
      ]
    ).then((instance) => {
      instance.exportImage('webp', 'EDraw')
    })
  }

  return <button onClick={onClick}>导出图片</button>
}

```
