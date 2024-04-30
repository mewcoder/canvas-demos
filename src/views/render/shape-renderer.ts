import type { Rectangle, Circle, Line, Polygon } from "./types";

interface Options {
  strokeStyle: string;
  lineWidth: number;
}

type StokeOption = Partial<Options>;

export class ShapeRenderer {
  private ctx: CanvasRenderingContext2D;

  private options: Options;

  constructor(ctx: CanvasRenderingContext2D, options?: Options) {
    this.ctx = ctx;
    this.options = {
      strokeStyle: options?.strokeStyle ?? "black",
      lineWidth: options?.lineWidth ?? 1,
    };
  }

  private drawStroke(options?: StokeOption, draw = true) {
    this.ctx.strokeStyle = options?.strokeStyle ?? this.options.strokeStyle;
    this.ctx.lineWidth = options?.lineWidth ?? this.options.lineWidth;
    draw && this.ctx.stroke();
  }

  // 绘制矩形
  renderRectangles(rectangles: Rectangle[], options?: StokeOption) {
    this.ctx.beginPath();
    rectangles.forEach((rect) => {
      this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
    });
    this.drawStroke(options);
  }

  // 绘制多边形
  renderPolygons(polygons: Polygon[], options?: StokeOption) {
    this.ctx.beginPath();
    polygons.forEach((polygon) => {
      polygon.points.forEach((point, index) => {
        if (index === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          this.ctx.lineTo(point.x, point.y);
        }
      });
      this.ctx.closePath();
    });
    this.drawStroke(options);
  }

  // 绘制线段
  renderLines(lines: Line[], options?: StokeOption) {
    this.ctx.beginPath();
    lines.forEach((line) => {
      this.ctx.moveTo(line.x1, line.y1);
      this.ctx.lineTo(line.x2, line.y2);
    });
    this.drawStroke(options);
  }

  // 绘制圆
  renderCircles(circles: Circle[], options?: StokeOption) {
    this.drawStroke(options, false);
    circles.forEach((circle) => {
      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    });
  }
}
