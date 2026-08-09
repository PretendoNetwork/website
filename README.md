# Pretendo website

This repository contains the source code for [our website](https://pretendo.network).

# Running locally for development

Prerequisites:
- Clone the repository
- Have NodeJS 24 or higher installed

Run the following in your terminal:
```bash
npm i
npm run dev
```

# Translation

If you'd like to help localize Pretendo Network, you can contribute to the translations on our project on [Weblate](https://hosted.weblate.org/engage/pretendonetwork/).

# Website refactor

The website is currently in a refactor, here is what is still left on the frontend:
- [ ] Term pages (nuxt content)
- [ ] Docs (nuxt content)
- [ ] Styling for progress page
- [ ] Styling for progress on main page
- [ ] Donation tier page
- [ ] Mii editor
- [ ] Account page

And the tasks left on the backend:
- [ ] Registration (with captchas)
- [ ] Logout
- [x] Login
- [ ] Password forgot flow
- [x] Stripe webhook emails
- [x] Stripe webhook database updates
- [x] Discord integration (add/remove roles on link and subscription changes)
- [ ] Creation of stripe subscriptions
- [ ] Account editing (mii saving, server environment changes)
- [ ] Delete account
- [x] Discourse SSO

Miscellanous tasks:
- [ ] Merge upstream changes into refactor branch
- [ ] Security testing
