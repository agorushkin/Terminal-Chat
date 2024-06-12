import { Matrix } from '/client/ui/matrix.ts';

type Renderer = (matrix: Matrix, canvas: Canvas) => void;

export class Canvas {
  matrix: Matrix = new Matrix(0, 0);
  renderers: [number, Renderer][] = [];
  fps: number;
  interval?: number;

  constructor(fps = 1000 / 60) {
    const { rows, columns } = Deno.consoleSize();

    this.fps = fps;
    this.matrix = new Matrix(columns, rows);
  }

  addRenderer = (renderer: Renderer, z: number = 0) =>
    this.renderers.push([z, renderer]);

  clearRenderers = () => this.renderers.length = 0;

  render = () => {
    const { rows, columns } = Deno.consoleSize();
    this.matrix = new Matrix(columns, rows);

    this.renderers.sort((a, b) => a[0] - b[0]);
    for (const [, render] of this.renderers) render(this.matrix, this);

    console.clear();
    console.log(this.matrix.toString());
  };

  start = () => {
    this.render();
    // this.interval = setInterval(() => {
    //   this.render();
    // }, this.fps);
  };

  stop = () => {
    if (this.interval) clearInterval(this.interval);
  };
}
