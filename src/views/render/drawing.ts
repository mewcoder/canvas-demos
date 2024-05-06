import { Point, Rectangle } from "./types";
import { generateId } from "./utils";
function pointInRect({ x, y }: Point, rect: Rectangle) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}

function getHandles(rect: Rectangle) {
  let width = 12;
  return [
    {
      id: "tl",
      x: rect.x - width / 2,
      y: rect.y - width / 2,
      width,
      height: width,
    },
    {
      id: "tr",
      x: rect.x + rect.width - width / 2,
      y: rect.y - width / 2,
      width,
      height: width,
    },
    {
      id: "bl",
      x: rect.x - width / 2,
      y: rect.y + rect.height - width / 2,
      width,
      height: width,
    },
    {
      id: "br",
      x: rect.x + rect.width - width / 2,
      y: rect.y + rect.height - width / 2,
      width,
      height: width,
    },
  ];
}

export class Drawing {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rects: Rectangle[] = [];
  private startPoint: Point = { x: 0, y: 0 };
  private offsetPoint: Point = { x: 0, y: 0 };
  private handleOffset: Point = { x: 0, y: 0 };
  private drawingRect: any = null;
  private selectedId: string = "";
  private selectedRect: Rectangle | null = null;

  private draggingHandle: any = null;
  private resizeRect: any = null;
  private resizeHandles: Rectangle[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.rects = [];
    this.addEvents();
  }

  private onMouseDown = (e: MouseEvent) => {
    const x = (this.startPoint.x = e.offsetX);
    const y = (this.startPoint.y = e.offsetY);

    // select rect
    this.selectRectAt(this.startPoint);

    if (this.selectedRect) {
      const handle = this.pointInHandles(this.startPoint, this.selectedRect);

      if (handle) {
        this.draggingHandle = handle;
        this.handleOffset.x = x - handle.x;
        this.handleOffset.y = y - handle.y;
        this.resizeRect = { ...this.selectedRect };
        return;
      } else {
        this.draggingHandle = null;
      }
    }

    if (this.selectedRect) {
      this.draw();
      this.offsetPoint.x = x - this.selectedRect.x;
      this.offsetPoint.y = y - this.selectedRect.y;
    } else {
      this.draw();
      this.drawingRect = this.drawingRect || {};
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.drawingRect) {
      this.changeCursor("crosshair");
      const { x, y } = this.startPoint;
      this.drawingRect = {
        x,
        y,
        width: e.offsetX - x,
        height: e.offsetY - y,
      };

      this.draw();
    } else if (this.selectedRect) {
      if (this.draggingHandle) {
        const { x, y } = this.startPoint;
        const moveX = e.offsetX - x;
        const moveY = e.offsetY - y;

        this.handleResize(moveX, moveY);
        this.draw();
        return;
      }
      this.changeCursor("move");
      this.selectedRect.x = e.offsetX - this.offsetPoint.x;
      this.selectedRect.y = e.offsetY - this.offsetPoint.y;
      this.draw();
    }
  };

  private handleResize(moveX: number, moveY: number) {
    if (!this.draggingHandle || !this.selectedRect) return;
    switch (this.draggingHandle.id) {
      case "tl": {
        this.changeCursor("nwse-resize");
        this.selectedRect.x = this.resizeRect.x + moveX;
        this.selectedRect.y = this.resizeRect.y + moveY;
        this.selectedRect.width = this.resizeRect.width - moveX;
        this.selectedRect.height = this.resizeRect.height - moveY;
        break;
      }
      case "tr": {
        this.changeCursor("nesw-resize");
        this.selectedRect.y = this.resizeRect.y + moveY;
        this.selectedRect.width = this.resizeRect.width + moveX;
        this.selectedRect.height = this.resizeRect.height - moveY;
        break;
      }
      case "bl": {
        this.changeCursor("nesw-resize");
        this.selectedRect.x = this.resizeRect.x + moveX;
        this.selectedRect.width = this.resizeRect.width - moveX;
        this.selectedRect.height = this.resizeRect.height + moveY;
        break;
      }
      case "br": {
        this.changeCursor("nwse-resize");
        this.selectedRect.width = this.resizeRect.width + moveX;
        this.selectedRect.height = this.resizeRect.height + moveY;
        break;
      }
    }
    this.draw();
    return;
  }

  private onMouseUp = (e: MouseEvent) => {
    this.changeCursor();
    if (this.drawingRect) {
      this.drawingRect = null;

      const width = Math.abs(e.offsetX - this.startPoint.x);
      const height = Math.abs(e.offsetY - this.startPoint.y);

      if (width < 1 || height < 1) return;

      const x = Math.min(this.startPoint.x, e.offsetX);
      const y = Math.min(this.startPoint.y, e.offsetY);

      const newRect = {
        id: generateId(),
        x,
        y,
        width,
        height,
      };

      this.rects.push(newRect);
    } else if (this.selectedRect) {
      this.selectedRect = null;
    }
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      if (this.selectedId) {
        // 找到并删除选中的矩形
        const index = this.rects.findIndex(
          (rect) => rect.id === this.selectedId
        );
        if (index !== -1) {
          this.rects.splice(index, 1); // 从数组中移除
          this.draw(); // 重新绘制canvas以反映删除
          this.selectedRect = null;
          this.selectedId = ""; // 清空选中状态
        }
      }
    }
  };

  private draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    this.rects.forEach((rect) => {
      this.ctx.strokeStyle = rect.id === this.selectedId ? "green" : "red";
      this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    });

    if (this.drawingRect) {
      const { x, y, width, height } = this.drawingRect;
      this.ctx.strokeStyle = "red";
      this.ctx.strokeRect(x, y, width, height);
    }

    if (this.selectedRect) {
      this.resizeHandles = getHandles(this.selectedRect);
      this.ctx.fillStyle = "red";
      this.resizeHandles.forEach((handle) => {
        this.ctx.fillRect(handle.x, handle.y, handle.width, handle.height);
      });
    }

    this.ctx.restore();
  }

  private addEvents() {
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("keydown", this.onKeyDown);
  }

  private offEvents() {
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("keydown", this.onKeyDown);
  }

  private selectRectAt(point: Point) {
    if (this.selectedId && this.resizeHandles.length) {
      const handle = this.resizeHandles.find((handle) =>
        pointInRect(point, handle)
      );
      if (handle) {
        this.selectedRect =
          this.rects.find((rect) => rect.id === this.selectedId) || null;
        return;
      }
    }

    this.selectedRect =
      this.rects.find((rect) => pointInRect(point, rect)) || null;

    this.selectedId = this.selectedRect?.id || "";
  }

  private pointInHandles(point: Point, rect: Rectangle) {
    const handles = getHandles(rect);
    if (!handles) return;

    for (const handle of handles) {
      if (pointInRect(point, handle)) {
        return handle;
      }
    }
  }

  private changeCursor(style = "default") {
    this.canvas.style.cursor = style;
  }

  public destroy() {
    this.offEvents();
    this.rects = [];
    this.drawingRect = null;
    this.selectedRect = null;
    this.selectedId = "";
  }
}
