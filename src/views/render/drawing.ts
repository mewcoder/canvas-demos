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
  const width = 12;
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

enum InteractionMode {
  Idle,
  Draw,
  Move,
  Resize,
}

export class Drawing {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private interactionMode: InteractionMode = InteractionMode.Idle;
  private rects: Rectangle[] = [];
  private startPoint: Point = { x: 0, y: 0 };
  private offsetPoint: Point = { x: 0, y: 0 };

  private drawingRect: any = null;
  private selectedId: string = "";
  private selectedRect: Rectangle | null = null;

  private draggingHandle: any = null;
  private startResizeRect: any = null;
  private resizeHandles: Rectangle[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.rects = [];
    this.interactionMode = InteractionMode.Idle;
    this.addEvents();
  }

  private changeMode(mode: InteractionMode = InteractionMode.Idle) {
    this.interactionMode = mode;
  }

  private drawingStrategy = {
    start: () => {
      this.drawingRect = null;
      this.changeCursor("crosshair");
    },
    move: (e: MouseEvent) => {
      this.drawingRect = {
        x: this.startPoint.x,
        y: this.startPoint.y,
        width: e.offsetX - this.startPoint.x,
        height: e.offsetY - this.startPoint.y,
      };
      this.draw();
    },
    end: (e: MouseEvent) => {
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
      this.drawingRect = null;
    },
  };
  private movingStrategy = {
    start: () => {
      this.changeCursor("move");
      this.offsetPoint.x = this.startPoint.x - this.selectedRect!.x;
      this.offsetPoint.y = this.startPoint.y - this.selectedRect!.y;
      this.draw();
    },
    move: (e: MouseEvent) => {
      this.selectedRect!.x = e.offsetX - this.offsetPoint.x;
      this.selectedRect!.y = e.offsetY - this.offsetPoint.y;
      this.draw();
    },
    end: () => {
      this.selectedRect = null;
    },
  };

  private resizingStrategy = {
    start: () => {
      this.startResizeRect = { ...this.selectedRect };
    },
    move: (e: MouseEvent) => {
      this.resizeSelectRect(
        e.offsetX - this.startPoint.x,
        e.offsetY - this.startPoint.y
      );
      this.draw();
    },
    end: () => {
      this.selectedRect = null;
      this.draggingHandle = null;
    },
  };

  private onMouseDown = (e: MouseEvent) => {
    this.startPoint.x = e.offsetX;
    this.startPoint.y = e.offsetY;

    const containerRect = this.checkPointInRect(this.startPoint);

    if (!containerRect) {
      this.changeMode(InteractionMode.Draw);
      this.drawingStrategy.start();
    } else {
      const handle = this.checkPointInHandle(this.startPoint, containerRect);
      if (handle) {
        this.draggingHandle = handle;
        this.interactionMode = InteractionMode.Resize;
        this.resizingStrategy.start();
      } else {
        this.interactionMode = InteractionMode.Move;
        this.movingStrategy.start();
      }
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    const action = this.getInteractionAction("move");
    action && action(e);
  };

  private onMouseUp = (e: MouseEvent) => {
    const action = this.getInteractionAction("end");
    action && action(e);
    this.changeCursor();
    this.changeMode();
  };

  private getInteractionAction(
    stage: "start" | "move" | "end"
  ): ((e: MouseEvent) => void) | null {
    switch (this.interactionMode) {
      case InteractionMode.Draw:
        return this.drawingStrategy[stage];
      case InteractionMode.Move:
        return this.movingStrategy[stage];
      case InteractionMode.Resize:
        return this.resizingStrategy[stage];
      default:
        return null;
    }
  }

  private resizeSelectRect(moveX: number, moveY: number) {
    if (!this.draggingHandle || !this.selectedRect) return;
    switch (this.draggingHandle.id) {
      case "tl": {
        this.changeCursor("nwse-resize");
        this.selectedRect.x = this.startResizeRect.x + moveX;
        this.selectedRect.y = this.startResizeRect.y + moveY;
        this.selectedRect.width = this.startResizeRect.width - moveX;
        this.selectedRect.height = this.startResizeRect.height - moveY;
        break;
      }
      case "tr": {
        this.changeCursor("nesw-resize");
        this.selectedRect.y = this.startResizeRect.y + moveY;
        this.selectedRect.width = this.startResizeRect.width + moveX;
        this.selectedRect.height = this.startResizeRect.height - moveY;
        break;
      }
      case "bl": {
        this.changeCursor("nesw-resize");
        this.selectedRect.x = this.startResizeRect.x + moveX;
        this.selectedRect.width = this.startResizeRect.width - moveX;
        this.selectedRect.height = this.startResizeRect.height + moveY;
        break;
      }
      case "br": {
        this.changeCursor("nwse-resize");
        this.selectedRect.width = this.startResizeRect.width + moveX;
        this.selectedRect.height = this.startResizeRect.height + moveY;
        break;
      }
    }
  }

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

  private checkPointInRect(point: Point) {
    let containerRect = null;

    containerRect = this.rects.find((rect) => pointInRect(point, rect)) || null;

    if (this.selectedId && this.resizeHandles.length) {
      const handle = this.resizeHandles.find((handle) =>
        pointInRect(point, handle)
      );
      if (handle) {
        containerRect =
          this.rects.find((rect) => rect.id === this.selectedId) || null;
      }
    }
    this.selectedRect = containerRect;
    this.selectedId = containerRect?.id || "";
    return containerRect;
  }

  private checkPointInHandle(point: Point, rect: Rectangle) {
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

  public destroy() {
    this.offEvents();
    this.rects = [];
    this.drawingRect = null;
    this.selectedRect = null;
    this.selectedId = "";
  }
}
