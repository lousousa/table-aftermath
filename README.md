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
APP_MODE=production
NEXT_PUBLIC_DISPLAY_LANGUAGE=pt-br
NEXT_PUBLIC_DISPLAY_CURRENCY=BRL
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=
OPENAI_RECEIPT_MODEL=gpt-4o-mini
RECEIPT_EXTRACTION_MOCK_VARIANT=matching-total
```

4. Copy `config/allowed-google-accounts.example.json` to `config/allowed-google-accounts.json` and add the Gmail accounts that are allowed to log in:

```json
[
  "person@gmail.com",
  "another.person@gmail.com"
]
```

Accounts that are not listed will be redirected back to the app with a login warning.

## Display language and currency

The app display language and currency are configured independently so each server/build can choose its own combination.

```env
# Valid values: pt-br, en-us
NEXT_PUBLIC_DISPLAY_LANGUAGE=pt-br

# Valid values: BRL, USD
NEXT_PUBLIC_DISPLAY_CURRENCY=BRL
```

For example, you can use `NEXT_PUBLIC_DISPLAY_LANGUAGE=en-us` with `NEXT_PUBLIC_DISPLAY_CURRENCY=BRL`.

Display text lives in:

- `app/i18n/pt-br.json`
- `app/i18n/en-us.json`

## Receipt image import

Authenticated users can import items from a restaurant or bar receipt image after setting the number of payers.

- Supported image types: JPG, PNG, and WEBP.
- The image is sent to OpenAI from the server API route and is not stored by the app.
- `OPENAI_API_KEY` is required for this feature.
- `OPENAI_RECEIPT_MODEL` is optional and defaults to `gpt-4o-mini`.

If the image does not look like a receipt, the app shows a warning instead of adding items. Imported items are added to the existing item list with all payer checkboxes unchecked.

### Receipt import dev mode

To test the receipt import UI without spending OpenAI credits, set:

```env
APP_MODE=dev
RECEIPT_EXTRACTION_MOCK_VARIANT=matching-total
```

When `APP_MODE=dev`, uploaded images are still validated as image files, but the app skips the OpenAI request and returns one of the local mock JSON files from `mocks/receipt-extraction`.

Available variants:

- `matching-total` → valid items with a matching receipt total.
- `mismatched-total` → valid items where the item sum does not match the total.
- `not-detected` → invalid result where no receipt/items are detected.

To change the mocked response, edit the corresponding JSON file. To add another variant, create a new `mocks/receipt-extraction/<variant-name>.json` file and set `RECEIPT_EXTRACTION_MOCK_VARIANT=<variant-name>`. Restart `npm run dev` after changing `.env`.

## That's it

I initially created this tool for my personal convenience, aiming to streamline the process of calculating and splitting bills at bars and restaurants. However, I welcome anyone to fork this project and tailor it to their specific requirements – or even use it as is, if it suits your needs! I hope you find it as enjoyable and useful as I do.
