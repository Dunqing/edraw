import type {
  LayoutBorderOptions,
  DrawInstanceOptions,
  StyleOptions,
} from './types'

export const defaultBeforeDrawOptions = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
}
export const defaultOptions: DrawInstanceOptions = {
  width: 300,
  height: 200,
  dpr: 1,
}

export const defaultBorder: LayoutBorderOptions = {
  width: 1,
  color: '#000',
  lineDash: [],
  lineDashOffset: 0,
}

export const layoutOptions = {
  isolation: true,
  ellipse: 0,
}

export const fontOptions: StyleOptions = {
  fontFamily: 'system-ui',
  lineHeight: 1.2,
  fontSize: 13,
  color: '#333',
  textAlign: 'left',
  textBaseline: 'alphabetic',
  bold: 'normal',
}
