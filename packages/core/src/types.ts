import type Draw from './edraw'

export interface DrawInstanceOptions {
  /**
   * canvas的宽
   */
  width: number
  /**
   * canvas的高
   */
  height: number
  /**
   * 放大倍数, 多倍图
   * @default 1
   */
  dpr?: number
  /**
   * 通用的字体参数
   */
  fontOptions?: StyleOptions

  /**
   * canvas元素
   */
  el?: HTMLCanvasElement | string | null
}
export interface LayoutOptions {
  /**
   * 距离左边距离
   */
  x: number
  /**
   * 距离顶部距离
   */
  y: number
  /**
   * 宽度
   */
  width?: number
  /**
   * 宽度
   */
  height?: number
  /**
   * 内边距
   * @default 0
   * all
   * [horizontal, vertical]
   * [top, right, bottom, left]
   */
  padding?: number | [number, number] | [number, number, number, number]
  radius?: number | `${number}%`

  /**
   * drawText 使用
   * 是否外层包裹一个Rect
   * @default false
   */
  wrap?: false | Omit<DrawOptions, 'x' | 'y'>
  /**
   * 背景色
   */
  backgroundColor?: string

  /**
   * 校验，false，则不绘制
   */
  if?: boolean | (() => boolean) | Promise<boolean> | (() => Promise<boolean>)

  /**
   *
   */

  /**
   * 是否隔离绘制
   *
   * @default true
   * @description
   * 开始前执行save | 结束后执行restore
   */
  isolation?: boolean
  /**
   * 边框线
   */
  border?: LayoutBorderOptions
}

export type LayoutBorderOptions = {
  color?: string
  width?: number
  lineDash?: number[]
  lineDashOffset?: number
}

export interface StyleOptions {
  /**
   * 字体
   * @default 'system-ui'
   */
  fontFamily?: string
  /**
   * 行高
   * @default 1.2
   */
  lineHeight?: number
  /**
   * 字体大小
   * @default 13
   */
  fontSize?: number
  /**
   * 字体颜色
   * @default #333
   */
  color?: string
  /**
   * 对其方式
   * @default left
   */
  textAlign?: CanvasTextAlign
  /**
   * 对其方式
   */
  textBaseline?: CanvasTextBaseline
  /**
   * 加粗
   * @default 'normal'
   */
  bold?: string

  /**
   * 最大宽度
   * 超过最大宽度会自动换行
   */
  maxWidth?: number
  /**
   * 多行文本省略
   * 根据maxWidth计算超长省略
   * @default 0
   */
  ellipse?: number
}

export interface DrawRoundOptions {
  x: number
  y: number
  width: number
  height: number
  radius: number | `${number}%`
  backgroundColor?: string
}

export interface DrawOptions extends LayoutOptions, StyleOptions {}

export interface DrawImageOptions extends LayoutOptions {
  type: 'image'
  url?: string
  /**
   * 可使用url或image
   */
  image?: HTMLImageElement
  /**
   * 图片加载失败时渲染
   */
  errorImage?: string | HTMLImageElement
  /**
   * 图片加载失败，重试次数
   * @default 3
   */
  retryCount?: number
}

export interface DrawTextOptions extends DrawOptions {
  type: 'text'
  text: string
}

export interface DrawRectOptions extends LayoutOptions {
  type: 'rect'
}

export interface DrawGroupOptions
  extends UnionOmit<DrawOptions, 'x' | 'y'>,
    Partial<Pick<DrawOptions, 'x' | 'y'>> {
  /**
   * 一组绘制，可以使用偏移量等绘制
   * 可以在此设置相同的属性如color, lineHeight, fontSize, fontFamily
   */
  type: 'group'
  columns: DrawGroupColumnsItem[]
}

export interface DrawCustomOptions {
  /**
   * 自定义绘制，能拿到draw实例
   */
  type: 'custom'
  /**
   * 自定义绘制，可以使用this
   */

  draw: (this: Draw) => Promise<any>
}

/**
 * contain-width 包含上一个元素宽度的x
 * contain-height 包含上一个元素高度的y
 * contain 包含上一个元素宽度高度的x, y
 * normal 不包含 offsetX + x, offsetY + y
 */
export type DrawGroupColumnsMode =
  | 'contain-width'
  | 'contain-height'
  | 'contain'
  | 'normal'

export type UnionOmit<
  T extends Record<string, any>,
  K extends string
> = T extends unknown ? Omit<T, K> : never

export type DrawGroupColumnsItem = UnionOmit<DrawCanvasItem, 'x' | 'y'> & {
  /**
   * 偏移X
   * @default 0
   */
  offsetX?: number
  /**
   * 偏移Y
   * @default 0
   */
  offsetY?: number
  /**
   * @default normal
   */
  mode?: DrawGroupColumnsMode
  /**
   * 有值时直接使用给定值，不计算x
   */
  x?: number
  /**
   * 有值时直接使用给定值，不计算y
   */
  y?: number
}

export type DrawCanvasItem =
  | DrawTextOptions
  | DrawRectOptions
  | DrawImageOptions
  | DrawGroupOptions
  | DrawCustomOptions

export type DrawCanvasConfig = DrawCanvasItem[]
