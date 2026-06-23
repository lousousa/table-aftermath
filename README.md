# Table Aftermath

[![react](https://badges.aleen42.com/src/react.svg)](https://badges.aleen42.com/src/react.svg) [![typescript](https://badges.aleen42.com/src/typescript.svg)](https://badges.aleen42.com/src/typescript.svg) [![tailwindcss](https://badges.aleen42.com/src/tailwindcss.svg)](https://badges.aleen42.com/src/tailwindcss.svg)

## Overview

I developed this application inspired by a real-life scenario where I had to split a bar bill among several people, taking into account the different items ordered by each individual. The app operates by receiving a detailed list of items paid for by each person, presented in a user-friendly matrix of checkboxes. It then displays the proportional division of the total bill. Additionally, it offers optional functionalities, such as adding a 10% surcharge to the total and providing a feature to copy both the calculated results and the itemized list to the clipboard in a straightforward, plain text format.

## Featured stack:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Redux](https://react-redux.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Preview

![demo](https://user-images.githubusercontent.com/2921281/227338261-fd9b708b-ecd5-4a0c-a545-69bd6c405caf.gif)

## Getting Started

First, run the development server:

```bash
yarn install
```

```bash
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Google authentication

The calculator remains available without logging in. Google login is available for features that require an authenticated account.

1. Create a Google OAuth Client ID for a web application in Google Cloud Console.
2. Add this redirect URI to the OAuth client:

```text
http://localhost:3000/api/auth/callback/google
```

3. Copy `.env.example` to `.env` and fill in:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

4. Copy `config/allowed-google-accounts.example.json` to `config/allowed-google-accounts.json` and add the Gmail accounts that are allowed to log in:

```json
[
  "person@gmail.com",
  "another.person@gmail.com"
]
```

Accounts that are not listed will be redirected back to the app with a login warning.

## That's it

I initially created this tool for my personal convenience, aiming to streamline the process of calculating and splitting bills at bars and restaurants. However, I welcome anyone to fork this project and tailor it to their specific requirements – or even use it as is, if it suits your needs! I hope you find it as enjoyable and useful as I do.
