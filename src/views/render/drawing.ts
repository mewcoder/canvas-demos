import { Point, Rectangle } from "./types";

export class Drawing {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private startPoint: Point = { x: 0, y: 0 };
  private drawingRect: any = null;
  private rects: Rectangle[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.rects = [];
    this.addEvents();
  }

  onMouseDown = (e: MouseEvent) => {
    this.startPoint.x = e.offsetX;
    this.startPoint.y = e.offsetY;
    this.drawingRect = this.drawingRect || {};
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.drawingRect) return;
    const { x, y } = this.startPoint;
    this.drawingRect = {
      x,
      y,
      width: e.offsetX - x,
      height: e.offsetY - y,
    };

    this.draw();
  };

  onMouseUp = (e: MouseEvent) => {
    if (!this.drawingRect) return;
    this.drawingRect = null;
    const width = Math.abs(e.offsetX - this.startPoint.x);
    const height = Math.abs(e.offsetY - this.startPoint.y);
    if (width < 1 || height < 1) return;
    const x = Math.min(this.startPoint.x, e.offsetX);
    const y = Math.min(this.startPoint.y, e.offsetY);

    const newRect = {
      x,
      y,
      width,
      height,
    };

    this.rects.push(newRect);
  };

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.rects.forEach((rect) => {
      this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    });

    if (!this.drawingRect) return;

    const { x, y, width, height } = this.drawingRect;
    this.ctx.strokeRect(x, y, width, height);
  }

  addEvents() {
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
  }

  offEvents() {
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mouseup", this.onMouseUp);
  }

  destroy() {
    this.offEvents();
  }
}
