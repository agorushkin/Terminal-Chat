import { Style } from '/client/ui/style.ts';
import { Matrix } from '/client/ui/matrix.ts';

const FRAME_CHAR_MAP = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
};

export class Frame {
  matrix: Matrix;
  style: Style;
  state: keyof Style;
  positioner: (matrix: Matrix) => [number, number];

  constructor(
    width: number,
    height: number,
    style?: Style,
    state?: keyof Style,
  ) {
    this.matrix = new Matrix(width, height);
    this.style = { base: (string: string) => string, ...style };
    this.state = state ?? 'base';
    this.positioner = () => [0, 0];
  }

  render = (matrix: Matrix) => {
    const style = this.style[this.state] ?? this.style.base!;

    this.matrix.data[0].fill(style(FRAME_CHAR_MAP.horizontal));
    this.matrix.data[this.matrix.height - 1].fill(
      style(FRAME_CHAR_MAP.horizontal),
    );
    for (let i = 1; i < this.matrix.height - 1; i++) {
      this.matrix.data[i][0] = style(FRAME_CHAR_MAP.vertical);
      this.matrix.data[i][this.matrix.width - 1] = style(
        FRAME_CHAR_MAP.vertical,
      );
    }

    this.matrix.data[0][0] = style(FRAME_CHAR_MAP.topLeft);
    this.matrix.data[0][this.matrix.width - 1] = style(FRAME_CHAR_MAP.topRight);
    this.matrix.data[this.matrix.height - 1][0] = style(
      FRAME_CHAR_MAP.bottomLeft,
    );
    this.matrix.data[this.matrix.height - 1][this.matrix.width - 1] = style(
      FRAME_CHAR_MAP.bottomRight,
    );

    matrix.overlay(this.matrix, this.positioner(matrix));
  };
}
