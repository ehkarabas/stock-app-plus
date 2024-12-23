<div align=center>
	<h1>Stock APP Plus</h1>
</div>

<div align="center">
      <p>Live API (seperated from frontend for representation)</p>
	<a href="https://stock-api-wupload-ehkarabas.onrender.com/api/documents/swagger/">
		<img src="https://img.shields.io/badge/live-%23.svg?&style=for-the-badge&logo=www&logoColor=white%22&color=black">
	</a>
	<hr>
</div>

<div align="center">
      <p>Live Stock APP+ (API + Client)</p>
	<a href="https://stock-app-plus-ehkarabas.vercel.app/">
		<img src="https://img.shields.io/badge/live-%23.svg?&style=for-the-badge&logo=www&logoColor=white%22&color=black">
	</a>
	<hr>
</div>

<div align="center">
      <p>You can check presentation as video from below</p>
</div>

[![Go To The Presentation Video](https://i.hizliresim.com/pd9m2n4.png)](https://youtu.be/D9ncKthQex8)

<hr>

## Description

A comprehensive stock tracking application featuring a full-featured authentication system including social authentication, utilizing both Classic Tokens and JWTs simultaneously, with the frontend capable of automatically refreshing JWTs using interceptors. It includes the ability to send transactional emails, a type-based custom rate limiter for use in sensitive routes, a captcha system that successfully operates through synchronization between the front-end and back-end, an image upload feature that processes images by adding watermarks and resizing them, and accurately reflects purchase and sale entries in the product's stock status and overall profit.

**IMPORTANT NOTE:** _This repository contains a much more rudimentary version of both the frontend and backend source code. It does not include the advanced authentication system, as well as related features such as captcha, transactional emails, and custom rate limiting mentioned in the content. Instead, it consists solely of structures focused entirely on the application's functionality. In terms of application functionality, the source code in the repository closely matches what is described here. The explanatory and the presentation video are part of the application's closed-source version._

## Backend Goals

The backend was primarily designed to make the authentication system compatible with those found in modern real-world applications. By integrating AWS SES with my own mail server, I configured transactional emails to be sent from that mailbox, thereby eliminating some of the delivery issues experienced during deployment on Render.com. In addition to customizing express-rate-limit, I developed a custom rate limiter that operates based on types (such as password and email) rather than being route-based, specifically for sensitive routes. This ensures that malicious users cannot bypass rate limits by using different endpoints to increase the rate limit capacity when attempting password or email attacks.

Furthermore, I implemented a captcha system to block script bots that do not integrate AI, ensuring it works seamlessly with the custom rate limiter. To allow end-users to upload their own images, I utilized Multer and Sharp. When a document is deleted, the associated static file is also removed. Images are processed with Sharp to add watermarks and resize them. The edited version is presented to the user, while the raw version remains stored as a static file on the server until the document is deleted.

A social authentication option is also offered; when a user logs in for the first time with an email not already in the system via social auth, the user is also registered in the system. If desired, the user can later disconnect social auth connections from the profile page. From the profile page, users can perform actions such as changing their password, email, and username, or deleting their account using codes sent via transactional emails. From the sign-in page, users can reset their password without authentication and resend their activation code. The application's core functionality ensures that product stocks increase with purchases and decrease with sales, and stock levels do not fall below zero.

## Frontend Goals

The main challenge in the frontend was to establish catch mechanisms capable of intercepting captchas from the backend in a timely manner. Thanks to these mechanisms, the captcha is displayed to the user in the frontend precisely when it needs to be submitted, and the user is required to complete the form accordingly. If desired, the end-user can regenerate the captcha. The remaining time for entering transaction codes and captchas is actively displayed.

Additionally, when an end-user visits the page for the first time, a health check is performed, which requires access to both the UI and the database. If access is not achieved within one minute, the process can be restarted. However, once access to both is established, the application launches successfully.

A dashboard was designed with charts and KPIs, allowing users to monitor total profit based on the overall status of purchases and sales. Filtering and sorting features were added for listings, enabling multiple filters and sorts to be added or removed. This allows the latest dataset to be displayed in varying orders. A responsive design was implemented to ensure optimal user experience across different devices.

## Technologies

Backend:

- NodeJS
- Express
- PassportJS
- Swagger & Redoc
- Transaction mails via mail server (own mail server on mailcow)
- Multer & Sharp (w watermarking)
- Type based own rate limiter
- Captcha system integrated with own rate limiter

Frontend:

- React (w React Helmet)
- React Router v5
- Material UI (w modals, theme customization in assistance of Tailwind and so on)
- Tailwind (w layer overrides)
- Redux (w persist, slices, async thunk and extra reducers)
- JWT refreshing via interceptors
- Query String
- Formik & Yup
- Custom Hooks
- Axios (w instances in a custom hook)
- Toastify

## Installation

To run this app on your local, run commands below on the terminal:

1. Clone the repo on your local.

   ```bash
   $ git clone https://github.com/ehkarabas/stock-app-plus.git
   ```

2. On this repo, open terminal in ./backend for the backend and:

   2.1. Make sure you've installed node and added node to the system path.

   2.2. Install packages of this repo.

   ```bash
   $ yarn install
   ```

   2.3. Run the server on your browser.

   ```bash
   $ yarn nodemon
   ```

3. On this repo, open terminal in ./frontend for the frontend and:

   3.1. Install node modules to this repo.

   ```bash
   $ yarn install
   ```

   3.2. Run the app on your browser.

   ```bash
   $ yarn start
   ```

## Resource Structure

```
stock_app_plus(folder)
│
├── README.md
├── be
│   ├── erdStockAPI.png
│   ├── erdStockAPI2.png
│   ├── index.js
│   ├── package.json
│   ├── public
│   │   ├── _redirect
│   │   └── index.html
│   ├── readme.md
│   ├── src
│   │   ├── configs
│   │   │   ├── dbConnection.js
│   │   │   ├── dbConnection_old.js
│   │   │   └── swagger.json
│   │   ├── controllers
│   │   │   ├── auth.js
│   │   │   ├── brand.js
│   │   │   ├── category.js
│   │   │   ├── firm.js
│   │   │   ├── product.js
│   │   │   ├── purchase.js
│   │   │   ├── sale.js
│   │   │   ├── token.js
│   │   │   └── user.js
│   │   ├── errors
│   │   │   └── customError.js
│   │   ├── helpers
│   │   │   ├── emailFieldValidator.js
│   │   │   ├── logFolderCreate.js
│   │   │   ├── loginCredentialsGenerator.js
│   │   │   ├── modelDateTimeOffset.js
│   │   │   ├── passwordEncrypt.js
│   │   │   ├── projectNameGenerator.js
│   │   │   ├── refreshAccessToken.js
│   │   │   ├── swaggerAutogen.js
│   │   │   └── sync.js
│   │   ├── middlewares
│   │   │   ├── authentication.js
│   │   │   ├── combinedAuthentication.js
│   │   │   ├── cookieAuthentication.js
│   │   │   ├── errorHandler.js
│   │   │   ├── fsLogging.js
│   │   │   ├── idValidation.js
│   │   │   ├── logger.js
│   │   │   ├── morganLogging.js
│   │   │   ├── permissions.js
│   │   │   ├── queryHandler.js
│   │   │   └── tokenAuthentication.js
│   │   ├── models
│   │   │   ├── brand.js
│   │   │   ├── category.js
│   │   │   ├── firm.js
│   │   │   ├── product.js
│   │   │   ├── purchase.js
│   │   │   ├── sale.js
│   │   │   ├── token.js
│   │   │   └── user.js
│   │   └── routes
│   │       ├── auth.js
│   │       ├── brand.js
│   │       ├── category.js
│   │       ├── document.js
│   │       ├── firm.js
│   │       ├── index.js
│   │       ├── product.js
│   │       ├── purchase.js
│   │       ├── sale.js
│   │       ├── token.js
│   │       └── user.js
│   └── yarn.lock
└── fe
    ├── README.md
    ├── package.json
    ├── public
    │   ├── _redirects
    │   ├── favicon.ico
    │   ├── faviconAlt.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    ├── src
    │   ├── App.js
    │   ├── app
    │   │   └── store.jsx
    │   ├── assets
    │   │   ├── loading.gif
    │   │   └── result.svg
    │   ├── components
    │   │   ├── BrandCard.jsx
    │   │   ├── Charts.jsx
    │   │   ├── DataFetchMsg.jsx
    │   │   ├── FirmCard.jsx
    │   │   ├── KpiCards.jsx
    │   │   ├── LoginForm.jsx
    │   │   ├── MenuListItems.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── RegisterForm.jsx
    │   │   ├── Theme
    │   │   │   ├── ThemeProviderWrapper.jsx
    │   │   │   └── ThemeToggle.jsx
    │   │   └── modals
    │   │       ├── BrandModal.jsx
    │   │       ├── FirmModal.jsx
    │   │       ├── ProductModal.jsx
    │   │       ├── PurchaseModal.jsx
    │   │       └── SaleModal.jsx
    │   ├── features
    │   │   ├── authSlice.jsx
    │   │   ├── stockSlice.jsx
    │   │   └── themeSlice.jsx
    │   ├── helper
    │   │   ├── ErrorCatch.js
    │   │   ├── RefreshCheck.js
    │   │   └── ToastNotify.js
    │   ├── hooks
    │   │   ├── useAuthCall.jsx
    │   │   ├── useAxios.jsx
    │   │   ├── useAxios_old.jsx
    │   │   └── useStockCall.jsx
    │   ├── index.css
    │   ├── index.js
    │   ├── pages
    │   │   ├── Brands.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Firms.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Products.jsx
    │   │   ├── Purchases.jsx
    │   │   ├── Register.jsx
    │   │   └── Sales.jsx
    │   ├── router
    │   │   ├── AppRouter.jsx
    │   │   └── PrivateRouter.jsx
    │   └── styles
    │       └── globalStyles.js
    ├── stockapi_fields.txt
    ├── tailwind.config.js
    └── yarn.lock
```
