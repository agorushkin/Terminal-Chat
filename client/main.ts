import { navigate, webview } from './core/webview.ts';

import config from '/client.json' with { type: 'json' };

const html = await Deno.readTextFile('bundle/dist/app.html');

navigate(html);
webview.run();

export { config };
