export class Matrix {
  data: string[][];
  width: number;
  height: number;

  constructor(width: number, height: number, filler = ' ') {
    this.width = width;
    this.height = height;
    this.data = [...filler.repeat(height)].map(() => [...filler.repeat(width)]);
  }

  overlay = (matrix: Matrix, offset: [number, number] = [0, 0]) => {
    for (let i = 0; i < matrix.data.length; i++) {
      for (let j = 0; j < matrix.data[i].length; j++) {
        const x = i + offset[0];
        const y = j + offset[1];

        if (
          x >= 0 && x < this.data.length &&
          y >= 0 && y < this.data[x].length
        ) this.data[x][y] = matrix.data[i][j];
      }
    }
  };

  toString = () => {
    return this.data.map((row) => row.join('')).join('\n');
  };
}
