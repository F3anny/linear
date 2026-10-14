# Linear Form Lab

A React Native / Expo student form demonstration.

## Run

```sh
npm install
npm start
```

Scan the QR code with Expo Go, or run `npm run web` for a browser presentation.

## Demonstrate

1. Submit the empty form to show required-field validation.
2. Fill in your name, email, a password of at least eight characters, and a course.
3. Try the radio buttons, multiple interests, switch, slider, star rating, color selection, and date/time inputs.
4. Attach photos or documents. Multiple files are supported, with a 10 MB limit per file. Images have previews and every attachment can be removed.
5. Accept the declaration and submit to see a confirmation message.
6. Click **Log form details** to inspect the snapshot in the development console (browser developer tools on web). Passwords are deliberately redacted.
7. Click **Reset all fields** to start again.

Submission is a local demonstration. No database, server upload, account creation, or notification service is configured. Attachments and form values are held in memory and clear when the app reloads.
