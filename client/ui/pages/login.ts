import {
  handleInput,
  handleKeyboardControls,
  handleMouseControls,
  Signal,
  Tui,
} from 'x/tui';

import { Frame } from 'x/tui/src/components/frame.ts';
import { Label } from 'x/tui/src/components/label.ts';
import { Input } from 'x/tui/src/components/input.ts';
import { Button } from 'x/tui/src/components/button.ts';

import crayon from 'x/crayon';
import { centered } from '/client/ui/centered.ts';
import { getMargins } from '/client/ui/getMargins.ts';

const canvas = new Tui({
  style: crayon.bgBlack,
  refreshRate: 1000 / 60,
});

handleInput(canvas);
handleMouseControls(canvas);
handleKeyboardControls(canvas);

const frameMargins = [new Signal(0), new Signal(0)];

const calculateFrameMargins = () => {
  const margins = getMargins(48, 8);

  frameMargins[0].value = margins.x;
  frameMargins[1].value = margins.y;
};

calculateFrameMargins();
Deno.addSignalListener('SIGWINCH', calculateFrameMargins);

const frame = new Frame({
  parent: canvas,
  rectangle: centered(-24, -4, 48, 8),
  charMap: 'rounded',
  theme: {
    base: crayon.white.bgBlack,
  },
  zIndex: 1,
});

new Label({
  parent: frame,
  align: {
    horizontal: 'center',
    vertical: 'center',
  },
  rectangle: centered(-23, -5, 1, 0),
  text: 'Choose Account',
  theme: {
    base: crayon.bgBlack.white.bold,
  },
  zIndex: 2,
});

new Label({
  parent: frame,
  align: {
    horizontal: 'center',
    vertical: 'center',
  },
  rectangle: centered(-23, -3, 1, 0),
  text: 'Username',
  theme: {
    base: crayon.bgBlack.white,
  },
  zIndex: 2,
});

const input = new Input({
  parent: canvas,
  rectangle: centered(-23, -2, 16, 0),
  theme: {
    base: crayon.bgLightBlack,
    active: crayon.bgLightBlack.invert,
    cursor: {
      base: crayon.bgLightBlack,
    },
  },
  placeholder: '...',
  validator: /^[a-zA-Z0-9_]$/,
  zIndex: 2,
});

const button = new Button({
  parent: frame,
  rectangle: centered(14, -4, 10, 8),
  label: { text: 'Log In\n===>' },
  theme: {
    base: crayon.bgLightBlack.invert,
    disabled: crayon.bgLightBlack,
  },
  zIndex: 2,
});

let destroy = () => {};

input.on('keyPress', () => {
  destroy();
  destroy = () => {};
  if (input.text.value.length < 5) {
    const errorLabel = new Label({
      parent: frame,
      align: {
        horizontal: 'center',
        vertical: 'center',
      },
      rectangle: centered(-23, -1, 100, 10),
      text: '..............................................',
      theme: {
        base: crayon.red,
      },
      zIndex: 2,
    });

    destroy = errorLabel.destroy;
  }

  if (input.text.value.length > 15) {
    input.text.value = input.text.value.slice(0, 15);
    input.cursorPosition.value--;
  }
});

button.on('mouseEvent', () => {
  if (input.text.value.length === 0) {
    return;
  }
});

canvas.run();
canvas.dispatch();
