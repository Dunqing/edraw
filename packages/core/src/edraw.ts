import { getPadding } from "./utils";
import { getHtmlImageElement } from "./helper";
import {
  defaultOptions,
  fontOptions,
  layoutOptions,
  defaultBorder,
  defaultBeforeDrawOptions,
} from "./options";
import { getCanvasByElement } from "./helper/getCanvas";
import { exportAnything } from "./helper/export";
import { logError } from "./helper/log";
import type { DrawCustomOptions, DrawRectOptions } from ".";
import type {
  DrawGroupOptions,
  DrawCanvasConfig,
  DrawImageOptions,
  DrawInstanceOptions,
  DrawOptions,
  DrawRoundOptions,
  DrawTextOptions,
  LayoutBorderOptions,
  StyleOptions,
  DrawGroupColumnsItem,
  DrawCanvasItem,
} from "./types";

export default class Draw {
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  options: DrawInstanceOptions;
  fontOptions: StyleOptions;

  constructor(options: DrawInstanceOptions = defaultOptions) {
    const canvas = getCanvasByElement(options.el);
    this.canvas = canvas;

    this.context = canvas.getContext("2d")!;
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.fontOptions = {
      ...fontOptions,
      ...options.fontOptions,
    };
    this.initCanvas();
  }

  /**
   * Returns a Big number whose value is the value of this Big number times n.
   */
  public times(value: number | number[] | any) {
    const dpr = this.options.dpr!;
    if (typeof value === "number") {
      return value * dpr;
    }
    return value;
  }

  private async callDrawByType(
    type: DrawCanvasItem["type"],
    options: DrawCanvasItem
  ) {
    const ifField = (options as DrawOptions).if;

    if (
      typeof ifField !== "undefined" &&
      (ifField === false ||
        (typeof ifField === "function" && (await ifField()) === false))
    ) {
      return {};
    }

    if (type === "text") {
      return await this.drawText(options as DrawTextOptions);
    } else if (type === "image") {
      return await this.drawImage(options as DrawImageOptions);
    } else if (type === "rect") {
      return await this.drawRect(options as DrawRectOptions);
    } else if (type === "group") {
      return await this.drawGroup(options as DrawGroupOptions);
    } else if (type === "custom") {
      return await (options as DrawCustomOptions).draw.call(this);
    }
    return Promise.resolve({} as any);
  }

  async drawByConfig(config: DrawCanvasConfig) {
    for (const item of config) {
      await this.callDrawByType(item.type, item);
    }

    return this;
  }

  async drawGroup(options: DrawGroupOptions) {
    let beforeDrawOptions: {
      x: number;
      y: number;
      width: number;
      height: number;
    } = {
      ...defaultBeforeDrawOptions,
      ...options,
      ...options.columns?.[0],
    } as Required<DrawGroupOptions>;

    const getNextDrawOptions = <T extends DrawGroupColumnsItem>(
      _options: T
    ) => {
      const newOptions = {
        ...options,
        ...beforeDrawOptions,
        ..._options,
      } as T;

      const { x, y, offsetX = 0, offsetY = 0, mode = "normal" } = _options;

      newOptions.x = beforeDrawOptions.x + offsetX;
      newOptions.y = beforeDrawOptions.y + offsetY;

      if (["contain", "contain-width"].includes(mode)) {
        newOptions.x += beforeDrawOptions.width;
      }
      if (["contain", "contain-height"].includes(mode)) {
        newOptions.y += beforeDrawOptions.height;
      }

      if (x) newOptions.x = x;
      if (y) newOptions.y = y;

      return newOptions;
    };

    for (const col of options.columns) {
      const nextOptions = getNextDrawOptions(col);
      beforeDrawOptions = await this.callDrawByType(
        col.type,
        nextOptions as DrawCanvasItem
      );
    }
    return beforeDrawOptions;
  }

  initCanvas() {
    const { width, height } = this.options;
    this.canvas.width = this.times(width);
    this.canvas.height = this.times(height);
    this.context.scale(this.times(1), this.times(1));
  }

  measureText(text: string, styleOptions: Partial<DrawOptions> = {}) {
    const { fontFamily, fontSize, bold, lineHeight } =
      this.getOptions(styleOptions);
    const div = document.createElement("DIV");
    div.id = "__textMeasure";
    div.innerHTML = text;
    div.style.position = "absolute";
    div.style.top = "-500px";
    div.style.left = "0";
    div.style.fontFamily = fontFamily;
    div.style.fontWeight = bold;
    div.style.fontSize = fontSize + "px";
    if (lineHeight < 4) {
      div.style.lineHeight = `${lineHeight}em`;
    } else {
      div.style.lineHeight = `${lineHeight}px`;
    }
    document.body.appendChild(div);

    const cssSize = { width: div.offsetWidth, height: div.offsetHeight },
      cssInfo = window.getComputedStyle(div, null),
      fontSizePx = parseFloat(cssInfo.fontSize);

    document.body.removeChild(div);

    this.setFontStyle(styleOptions);

    const metrics = this.context.measureText(text),
      lineGap =
        cssSize.height -
        (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent),
      advMetrics = {
        width: metrics.width,
        cssHeight: cssSize.height,
        cssFontSizePx: fontSizePx,
        fontAscent: metrics.fontBoundingBoxAscent,
        fontDescent: metrics.fontBoundingBoxDescent,
        actualAscent: metrics.actualBoundingBoxAscent,
        actualDescent: metrics.actualBoundingBoxDescent,
        lineHeight: cssSize.height,
        lineGap: lineGap,
        lineGapTop: lineGap / 2,
        lineGapBottom: lineGap / 2,
      };

    return advMetrics;
  }

  private callDraw<T extends (...args: any) => any>(
    run: T,
    isolation?: boolean
  ) {
    let result: ReturnType<T>;
    if (isolation) {
      this.context.save();
      result = run();
      this.context.restore();
    } else {
      result = run();
    }
    return result;
  }

  private getOptions<T extends Partial<DrawOptions>>(_options?: T) {
    const options = {
      ...layoutOptions,
      ...this.fontOptions,
      ..._options,
    } as Required<T>;

    return options;
  }

  private setFontStyle(styleOptions: Partial<DrawOptions>) {
    const options = this.getOptions(styleOptions);
    this.context.font = `${options.bold} ${options.fontSize!}px ${
      options.fontFamily
    }`;
    this.context.textAlign = options.textAlign;
    this.context.textBaseline = options.textBaseline;
    this.context.fillStyle = options.color!;
  }

  public roundPath(options: DrawRoundOptions) {
    const { x, y, width, height, radius: _radius } = options;
    let radius: number = _radius as number;
    if (typeof _radius === "string" && _radius.endsWith("%")) {
      radius = (Math.min(width, height) * parseFloat(_radius)) / 100;
    }
    this.context.beginPath();
    this.context.moveTo(x, y + radius);
    this.context.arcTo(x, y, x + width - radius, y, radius);
    this.context.arcTo(x + width, y, x + width, y + radius, radius);
    this.context.arcTo(
      x + width,
      y + height,
      x + width - radius,
      y + height,
      radius
    );
    this.context.arcTo(x, y + height, x, y + height - radius, radius);
    this.context.lineTo(x, y + radius);
    this.context.closePath();
  }

  public async drawRect(_options: DrawOptions) {
    const options = this.getOptions(_options);
    return this.callDraw(() => {
      const { x, y, width, height } = options;
      if (options.radius) {
        this.roundPath(options);
        this.context.clip();
      } else {
        this.context.rect(x, y, width, height);
      }

      if (options.backgroundColor) {
        this.context.fillStyle = options.backgroundColor;
        this.context.fillRect(x, y, width, height);
      }

      if (options.border) {
        this.strokeBorder(options.border);
      }

      return options;
    }, options.isolation);
  }

  strokeBorder(_border: LayoutBorderOptions) {
    this.callDraw(() => {
      const { width, color, lineDash, lineDashOffset } = {
        ...defaultBorder,
        ..._border,
      } as Required<LayoutBorderOptions>;

      this.context.lineWidth = width;
      this.context.strokeStyle = color;
      this.context.setLineDash(lineDash);
      this.context.lineDashOffset = lineDashOffset;
      this.context.stroke();
    }, true);
  }

  async drawImage(options: Omit<DrawImageOptions, "type">) {
    const image = await getHtmlImageElement(options.url).catch((err) => {
      logError(err);
      return null;
    });

    if (!image) return;

    const { x, y, width, height } = this.getOptions(options);
    this.context.drawImage(image, x, y, width, height);

    return {
      x,
      y,
      width,
      height,
    };
  }

  /**
   * 根据最大宽度获取一行能展示的文字
   */
  getLineTextByMaxWidth(text: string, options: DrawOptions) {
    const { maxWidth, ellipse } = this.getOptions(options);

    this.setFontStyle(options);
    const measureInfo = this.measureText(text, options);

    if (maxWidth && measureInfo.width > maxWidth) {
      let max = false;
      const letterWidth = measureInfo.width / text.length;
      const overWidth = measureInfo.width - maxWidth;
      let textLength = text.length - Math.floor(overWidth / letterWidth);

      while (true) {
        const ellipseText =
          text.substr(0, textLength) + (ellipse === 1 ? "..." : "");
        const ellipseTextMeasureInfo = this.measureText(ellipseText, options);

        if (ellipseTextMeasureInfo.width > maxWidth) {
          max = true;
          textLength--;
          continue;
        }

        if (ellipseTextMeasureInfo.width < maxWidth && !max) {
          textLength++;
          continue;
        }

        return [
          ellipseText,
          text.substring(textLength),
          ellipseTextMeasureInfo,
        ] as const;
      }
    }
    return [text, "", measureInfo] as const;
  }

  async drawText(
    options: Omit<DrawTextOptions, "type"> = {
      text: "",
      x: 0,
      y: 0,
    }
  ) {
    const { text, x, y, isolation, ellipse, maxWidth } =
      this.getOptions(options);
    return this.callDraw(async () => {
      this.setFontStyle(options);
      const measureInfo = this.measureText(text, options);

      let drawText = "",
        otherText = text,
        drawTextMeasureInfo = measureInfo,
        line = 0;

      while (otherText !== "" && ++line && (ellipse ? line <= ellipse : true)) {
        [drawText, otherText, drawTextMeasureInfo] = this.getLineTextByMaxWidth(
          otherText,
          {
            ...options,
            ellipse: line === ellipse ? 1 : 0,
          }
        );

        const yNumber =
          y +
          (drawTextMeasureInfo.lineHeight * 0.75 * line +
            (line - 1) * 0.25 * drawTextMeasureInfo.lineHeight);

        // /**
        //  * 以文字的行高和总宽度绘制边框线
        //  * 作用
        //  * 看文字的位置
        //  */
        // this.drawRect({
        //   border: {
        //     color: '#3178c6',
        //     width: 1,
        //   },
        //   x,
        //   color: '#bbb',
        //   y: y + (line - 1) * drawTextMeasureInfo.lineHeight,
        //   width: maxWidth || drawTextMeasureInfo.width,
        //   height: drawTextMeasureInfo.lineHeight,
        // });

        this.context.fillText(drawText!, x, yNumber);
      }

      this.callDraw(async () => {
        if (options.wrap) {
          const { left, right, top, bottom } = getPadding(
            options.wrap?.padding
          );
          this.drawRect({
            ...options.wrap,
            x: x - left,
            y: y - top,
            width: measureInfo.width + left + right,
            height: measureInfo.cssHeight + top + bottom,
          });
        }
      }, true);

      return {
        x: x,
        y: y,
        width: maxWidth ?? drawTextMeasureInfo.width,
        height: drawTextMeasureInfo.cssHeight,
      };
    }, isolation);
  }

  public async canvasToBlob() {
    return new Promise<Blob>((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob === null) {
          return reject(new Error("canvasToBlob error"));
        }
        resolve(blob);
      });
    });
  }
  /**
   *
   * @param type
   * @param filename 不包含后缀
   * @returns
   */
  public async exportImage(
    type: "png" | "jpeg" | "webp" = "png",
    filename: string
  ) {
    return this.canvasToBlob().then((blob) => {
      exportAnything({
        value: blob,
        type,
        filename: `${filename}.${type}`,
      });
    });
  }
}
