# Pretendo website

This repository contains the source code for [our website](https://pretendo.network).

# Running locally for development

Prerequisites:
- Clone the repository
- Have Docker Desktop installed (or Docker engine)
- Have NodeJS 24 or higher installed

Then follow these steps:
- Run `docker compose up -d` inside `/.docker`
- Create a file called `.env` in the root, fill it with the contents of `example.env`
- Install dependencies with `npm i`
- Run the app with `npm run dev`

# Translation

If you'd like to help localize Pretendo Network, you can contribute to the translations on our project on [Weblate](https://hosted.weblate.org/engage/pretendonetwork/).

# Configuration

The application can be configured with environment variables. `.env` files are available for development.
There are no fully required configuration variables, the app can runs minimally without any configuration:

| Feature                      | Variable                               | Description                                   | Default                      |
| ---------------------------- | -------------------------------------- | --------------------------------------------- | ---------------------------- |
| Core                         | `PN_WEBSITE_PUBLIC_BASE_URL`           | Base URL of the app                           | `https://pretendo.network`   |
|                              | `PN_WEBSITE_PUBLIC_CDN_BASE_URL`       | Base URL for the CDN                          | `https://r2-cdn.pretendo.cc` |
|                              | `PN_WEBSITE_PUBLIC_COOKIE_SECURE`      | Should Secure be enabled for auth cookies     | `true`                       |
|                              |                                        |                                               |                              |
| Authentication               | `PN_WEBSITE_GRPC_HOST`                 | Account server GRPC host + port               | -                            |
|                              | `PN_WEBSITE_GRPC_API_KEY`              | Account server GRPC API key                   | -                            |
|                              | `PN_WEBSITE_API_BASE`                  | Base URL of the account server                | `https://api.pretendo.cc`    |
|                              | `PN_WEBSITE_API_BASE_HOST`             | Hostname of the account server                | `api.pretendo.cc`            |
|                              |                                        |                                               |                              |
| Progress tracking            | `PN_WEBSITE_GITHUB_API_TOKEN`          | Github API token                              | -                            |
|                              |                                        |                                               |                              |
| Discord                      | `PN_WEBSITE_DISCORD_BOT_TOKEN`         | Discord bot token                             | -                            |
|                              | `PN_WEBSITE_DISCORD_CLIENT_ID`         | Discord OAuth client ID                       | -                            |
|                              | `PN_WEBSITE_DISCORD_CLIENT_SECRET`     | Discord OAuth client secret                   | -                            |
|                              | `PN_WEBSITE_DISCORD_GUILD_ID`          | Discord server ID for role linking            | -                            |
|                              | `PN_WEBSITE_DISCORD_TESTER_ROLE_ID`    | Role to give for tester access                | (No role)                    |
|                              | `PN_WEBSITE_DISCORD_SUPPORTER_ROLE_ID` | Role to give for supporter access             | (No role)                    |
|                              |                                        |                                               |                              |
| Payments                     | `PN_WEBSITE_STRIPE_SECRET_KEY`         | Stripe secret key                             | -                            |
| (Requires `discord` feature) | `PN_WEBSITE_STRIPE_WEBHOOK_SECRET`     | Stripe webhook signing key                    | -                            |
|                              | `PN_WEBSITE_STRIPE_NOTIFICATION_EMAIL` | Email address to send stripe notifications to | (No notifications)           |
|                              | `PN_WEBSITE_MONGO_CONNECTION_STRING`   | MongoDB connection string for account server  | -                            |
|                              | `PN_WEBSITE_SMTP_HOST`                 | Host for the SMTP server                      | -                            |
|                              | `PN_WEBSITE_SMTP_PORT`                 | Port for the SMTP server                      | `587`                        |
|                              | `PN_WEBSITE_SMTP_SECURE`               | Use a secure SMTP connection                  | `true`                       |
|                              | `PN_WEBSITE_SMTP_USER`                 | Username for the SMTP server                  | (No SMTP auth)               |
|                              | `PN_WEBSITE_SMTP_PASSWORD`             | Password for the SMTP server                  | (No SMTP auth)               |
|                              | `PN_WEBSITE_SMTP_FROM_EMAIL`           | Email to sent emails from                     | -                            |
|                              | `PN_WEBSITE_SMTP_FROM_NAME`            | Display of the FROM email adress              | -                            |
|                              |                                        |                                               |                              |
| Captcha                      | `PN_WEBSITE_HCAPTCHA_SECRET_KEY`       | HCaptcha secret key                           | -                            |
|                              | `PN_WEBSITE_PUBLIC_HCAPTCHA_SITE_KEY`  | HCaptcha site key                             | -                            |
|                              |                                        |                                               |                              |
| Discourse SSO                | `PN_WEBSITE_DISCOURSE_SSO_SECRET`      | Discourse SSO secret                          | -                            |


# Website refactor

The website is currently in a refactor, here is what is still left on the frontend:
- [x] Styling for progress page
- [x] Styling for progress on main page
- [X] Account: Mii editor
- [X] Account: View account
- [X] Account: Delete account
- [X] Account: Link discord account
- [X] Account: Edit server environment
- [ ] Account: Edit account info
- [X] Donations: stripe checkout frontend
- [x] Auth: Login
- [x] Auth: Logout
- [x] Auth: Register
- [x] Auth: Forgot password flow
- [X] Content: Term pages
- [X] April fools'
- [X] Content: Documentation pages
- [x] Content: Blog

And the tasks left on the backend:
- [x] Registration (with captchas)
- [x] Logout
- [x] Login
- [x] Password forgot flow
- [x] Stripe webhook emails
- [x] Stripe webhook database updates
- [x] Discord integration (add/remove roles on link and subscription changes)
- [x] Creation of stripe subscriptions
- [x] Account editing (mii saving, server environment changes)
- [x] Delete account
- [x] Discourse SSO
- [x] HCaptcha support
- [x] RSS feed

Miscellanous tasks:
- [x] Merge upstream changes into refactor branch
- [x] Security testing
- [x] Document configuration
- [x] Backend testing
  - [x] Github progress tracking
  - [x] Discord linking
  - [x] Discord role syncing
  - [x] Login/logout
  - [x] Register
  - [x] Discourse SSO
  - [x] HCaptcha
  - [x] RSS feed
  - [x] Stripe checkout
  - [x] Stripe donation progress
  - [x] Stripe webhooks (+ mailing)
  - [x] Forgot password flow
  - [x] Delete account
  - [x] server environment changing
  - [x] Mii edits saving
  - [x] Auth cookies

Testing findings:
- [X] progress total percentage not rounded properly
- [X] faq open first by default
- [X] fix github icon size on team
- [X] click out of bandwidth doesn't close bandwidth (use vueuse onclickoutside)
- [X] fix hover and clickaway on navbar
- [X] fix locale list not having the same layout, no clickaway
- [X] progress is a wrench?

- [X] rss feed wrong content type

- [X] progress page has no mobile layout (jvs you suck)
- [X] progress seems to sometimes not load for jvs?

idk jvs, seems to work on my machine... and yours too now???

- [X] docs errors page, ironically, gives an error
- [X] docs headings are very purple
- [X] docs codeblocks *not* very purple
- [X] docs index page redirect should be in config, not as a page

- [X] upgrade: progress numbers not bold
- [X] upgrade: align perk text with icon

- [X] miieditor logs serverside
- [?] just move as much stuff as possible to renderside really

- [X] account shows beta switch even if it's disabled
- [X] if user has beta access they should be able to change back to prod
- [X] add dev server env button
- [X] discord link success/fail toast

- [X] forgot password shows success toast even w no captcha (doesn't actually submit)
- [ ] signup birthdate editor

- [X] need error page
- [X] need 404 page

- [ ] error handling