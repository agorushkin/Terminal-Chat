import crayon from 'x/crayon';

import { Canvas } from '/client/ui/components/canvas.ts';
import { Frame } from '/client/ui/components/frame.ts';

const canvas = new Canvas(1000 / 60);
const frame = new Frame(48, 8, {
  base: crayon.white.bgBlack,
});

canvas.addRenderer(frame.render, 1);

frame.positioner = (matrix) => {
  const x = Math.floor((matrix.width - frame.matrix.width) / 2);
  const y = Math.floor((matrix.height - frame.matrix.height) / 2);

  return [x, y];
};

canvas.start();
