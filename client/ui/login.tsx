/** @jsxImportSource https://esm.sh/preact */

import { login } from '/client/actions/login.ts';

export const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const form = event.target as HTMLFormElement;
          const username = (form.elements[0] as HTMLInputElement).value;

          if (username.length > 16 || username.length < 4) {
            console.log('Invalid username');
            return;
          }

          const file = (form.elements[1] as HTMLInputElement).files?.[0];

          if (!file) {
            console.log('No file selected');
            return;
          }

          const token = await login(username, file);
          console.log(token || 'Failed to login');
        }}
      >
        <input type='text' placeholder='Username' />
        <br />
        <input type='file' accept='.pem' />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};
