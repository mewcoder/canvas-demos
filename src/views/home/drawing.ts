// 定义一个点的类型和绘图矩形信息的接口
export type Point = {
  x: number;
  y: number;
};

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 创建一个类来存储绘图的逻辑
export class Drawing {
  private ctx: CanvasRenderingContext2D;
  private rects: Rect[] = [];
  private drawingRect: Rect | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public addRect(rect: Rect) {
    this.rects.push(rect);
  }

  public setDrawingRect(rect: Rect | null) {
    this.drawingRect = rect;
  }

  public draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // 将画布清空
    this.ctx.strokeStyle = "red";
    this.rects.forEach((rect) => {
      this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    });
    if (this.drawingRect) {
      this.ctx.strokeRect(
        this.drawingRect.x,
        this.drawingRect.y,
        this.drawingRect.width,
        this.drawingRect.height
      );
    }
  }
}
