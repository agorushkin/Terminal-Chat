import { Webview } from 'x/webview';
export const webview = new Webview();

webview.bind('alert', console.log);

export const navigate = (html: string) => {
  webview.navigate(`data:text/html,${encodeURIComponent(html)}`);
};
