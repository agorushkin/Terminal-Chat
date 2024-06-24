/** @jsxImportSource https://esm.sh/preact */

import { login } from '/client/actions/login.ts';
import { log } from '/client/types.d.ts';

export const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={async (event) => {
          try {
          event.preventDefault();

          const form = event.target as HTMLFormElement;
          const username = (form.elements[0] as HTMLInputElement).value;

          log('wow');
          localStorage.setItem('token', 'mow');
          log(localStorage.getItem('token'));

          if (username.length > 16 || username.length < 4) {
            log('Invalid username');
            return;
          }

          const file = (form.elements[1] as HTMLInputElement).files?.[0];

          if (!file) {
            log('No file selected');
            return;
          }

          const token = await login(username, file);

          if (!token) log('Failed to login');
          else localStorage.setItem('token', token);
        } catch (e) { log(e) }
        }}
      >
        <input type='text' placeholder='Username' value='agorushkin' />
        <br />
        <input type='file' accept='.pem' />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};
