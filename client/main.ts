import { Tui } from 'x/tui';
import { HorizontalLayout, VerticalLayout } from 'x/tui/mod.ts';
import { Box } from 'x/tui/src/components/box.ts';
import { Input } from 'x/tui/src/components/input.ts';
import { SocketPayload } from '../shared/payloads/socketPayload.ts';

import { handleInput } from 'x/tui/src/input.ts';
import {
  handleKeyboardControls,
  handleMouseControls,
} from 'x/tui/src/controls.ts';

const socket = new WebSocket('ws://localhost:8080/connect');

socket.addEventListener('open', () => {
  socket.send(new SocketPayload({ type: 'join', room: 'test' }).toString());
});

socket.addEventListener('message', (event) => {
  const payload = SocketPayload.fromString(event.data);

  if (!payload) return;

  switch (payload.type) {
    case 'heartbeat':
      socket.send(new SocketPayload({ type: 'heartbeat' }).toString());
      break;

    case 'message':
      console.log(payload.message);
      break;

    default:
      break;
  }
});

import crayon from 'x/crayon';

const canvas = new Tui({
  style: crayon.bgBlack,
  refreshRate: 1000 / 60,
});

handleInput(canvas);
handleKeyboardControls(canvas);
handleMouseControls(canvas);

canvas.dispatch();
canvas.run();

// const hpattern = ['b', 'm', 'm', 'm', 'm'];
// const horizontal = new HorizontalLayout({
//   pattern: hpattern,
//   rectangle: canvas.rectangle,
//   gapX: 2,
// });

// new Box({
//   parent: canvas,
//   rectangle: horizontal.element('b'),
//   theme: {
//     base: crayon.bgCyan,
//   },
//   zIndex: 1,
// });

const pattern = ['t', 't', 't', 't', 't', 't', 't', 'i'];
const layout = new VerticalLayout({
  pattern,
  rectangle: canvas.rectangle,
});

const inputRectangle = layout.element('i');

new Box({
  parent: canvas,
  rectangle: layout.element('t'),
  theme: {
    base: crayon.bgGreen,
  },
  zIndex: 1,
});

const input = new Input({
  parent: canvas,
  rectangle: inputRectangle as any,
  theme: {
    base: crayon.bgHex(0xC25B5D),
    focused: crayon.bgHex(0xD9686A),
    cursor: { base: crayon.invert.blink },
  },
  zIndex: 0,
  text: 'Meow',
});

input.rectangle.value.height = 1;

input.on('keyPress', ({ key }) => {
  if (key === 'return') {
    input.text.value = '';
    input.cursorPosition.value = 0;
  }
});
