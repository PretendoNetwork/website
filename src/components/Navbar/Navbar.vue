<script lang="ts" setup>
const { locales, setLocale } = useI18n();

const openDropdown = ref<boolean | string>(false);
const loggedIn = ref(false);
function handleDropdownButton(dropdown: boolean | string) {
	if (!openDropdown.value) {
		openDropdown.value = dropdown;
	} else if (openDropdown.value === dropdown) {
		openDropdown.value = false;
	} else {
		openDropdown.value = dropdown;
	}
}

const scrollY = ref<number>(0);

onMounted(() => {
	// eslint-disable-next-line no-undef -- we're in on mounted so it should be fine
	window.addEventListener('scroll', () => {
		// eslint-disable-next-line no-undef -- same here
		scrollY.value = window.scrollY;
	});
});
</script>

<template>
  <header :class="{ 'transparent': scrollY === 0 }">
    <div class="left-section">
      <button
        :class="{ 'dropdown-button': true, 'hide-on-desktop': true, active: openDropdown === 'mobile' }"
        @click="handleDropdownButton('mobile')"
      >
        <Icon
          name="ph:list"
          size="32"
        />
      </button>
      <a
        href="/"
        class="logo-link"
      >
        <svg
          role="img"
          aria-label="Pretendo"
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="39.876"
        >
          <g
            id="logo_type"
            data-name="logo type"
            transform="translate(-553 -467)"
          >
            <g
              id="logo"
              transform="translate(553 467)"
            >
              <rect
                id="XMLID_158_"
                width="39.876"
                height="39.876"
                fill="#9d6ff3"
                opacity="0"
              />
              <g
                id="XMLID_6_"
                transform="translate(8.222 1.418)"
              >
                <path
                  id="XMLID_15_"
                  d="M69.149,28.312c-1.051.553-.129,2.139.922,1.585a12.365,12.365,0,0,1,8.794-.571,10.829,10.829,0,0,1,6.342,4.166c.645,1,2.231.074,1.585-.922C83.308,27.169,74.7,25.436,69.149,28.312Z"
                  transform="translate(-64.246 -23.389)"
                  fill="#9d6ff3"
                />
                <path
                  id="XMLID_14_"
                  d="M82.64,14.608A15.565,15.565,0,0,0,73.5,8.45a17.535,17.535,0,0,0-12.647.9c-1.051.553-.129,2.139.922,1.585,3.411-1.788,7.6-1.714,11.209-.719,3.1.848,6.268,2.544,8.038,5.309C81.681,16.543,83.267,15.622,82.64,14.608Z"
                  transform="translate(-57.476 -7.693)"
                  fill="#9d6ff3"
                />
                <path
                  id="XMLID_9_"
                  d="M55.68,47.8a10.719,10.719,0,0,0-6.71,2.3H45.983A1.336,1.336,0,0,0,44.6,51.376V75.84a1.431,1.431,0,0,0,1.383,1.383h3.023a1.367,1.367,0,0,0,1.309-1.383V68.392A10.993,10.993,0,1,0,55.68,47.8Zm0,17.182a6.213,6.213,0,1,1,6.213-6.213A6.216,6.216,0,0,1,55.68,64.982Z"
                  transform="translate(-44.6 -40.406)"
                  fill="#9d6ff3"
                />
              </g>
            </g>
            <text
              id="Pretendo"
              transform="translate(593 492)"
              fill="#fff"
              font-size="17"
              font-family="Poppins-Bold, Poppins"
              font-weight="700"
            >
              <tspan
                x="0"
                y="0"
              >Pretendo</tspan>
            </text>
          </g>
        </svg>
      </a>
      <div
        v-if="openDropdown === 'mobile'"
        class="dropdown"
      >
        <div
          class="dropdown-content"
          @click="handleDropdownButton(false)"
        >
          <div class="top">
            <a href="/#credits">
              <div class="icon">
                <Icon
                  name="ph:users-four-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.credits") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.credits") }}</p>
              </div>
            </a>
            <a href="/#about">
              <div class="icon">
                <Icon
                  name="ph:info-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.about") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.about") }}</p>
              </div>
            </a>
            <a href="/#faq">
              <div class="icon">
                <Icon
                  name="ph:question-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.faq") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.faq") }}</p>
              </div>
            </a>
            <a href="/blog">
              <div class="icon">
                <Icon
                  name="ph:newspaper-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.blog") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.blog") }}</p>
              </div>
            </a>
            <a href="/progress">
              <div class="icon">
                <Icon
                  name="ph:wrench-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.progress") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.blog") }}</p>
              </div>
            </a>
            <a href="/docs">
              <div class="icon">
                <Icon
                  name="ph:download-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("docs.quickLinks.links[0].header") }}</p>
                <p class="caption">{{ $t("docs.quickLinks.links[0].caption") }}</p>
              </div>
            </a>
            <a href="/docs/search">
              <div class="icon">
                <Icon
                  name="ph:warning-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("docs.quickLinks.links[1].header") }}</p>
                <p class="caption">{{ $t("docs.quickLinks.links[1].caption") }}</p>
              </div>
            </a>
          </div>
        </div>

        <div class="bottom">
          <a
            href="https://invite.gg/pretendo"
            target="_blank"
            aria-label="A link to our Discord server"
          >
            <Icon
              name="ph:discord-logo-fill"
              size="32"
              mode="svg"
            />
          </a>
          <a
            href="https://twitter.com/PretendoNetwork"
            target="_blank"
            aria-label="A link to our Twitter account"
          >
            <Icon
              name="ph:twitter-logo-fill"
              size="32"
              mode="svg"
            />
          </a>
          <a
            href="https://github.com/PretendoNetwork"
            target="_blank"
            aria-label="A link to our GitHub organization"
          >
            <Icon
              name="ph:github-logo-fill"
              size="32"
              mode="svg"
            />
          </a>
        </div>
      </div>
    </div>

    <nav>
      <div class="dropdown-button-wrapper hide-on-mobile">
        <button
          :class="{ 'dropdown-button': true, active: openDropdown === 'about' }"
          @click="handleDropdownButton('about')"
        >
          {{ $t("nav.about") }}
        </button>
        <button
          :class="{ 'dropdown-button': true, active: openDropdown === 'docs' }"
          @click="handleDropdownButton('docs')"
        >
          {{ $t("nav.docs") }}
        </button>
      </div>
      <a
        href="/progress"
        class="hide-on-mobile"
      >
        <button>{{ $t("nav.progress") }}</button>
      </a>
      <a
        href="https://forum.pretendo.network"
        class="hide-on-mobile"
      >
        <button>Forum</button> <!-- TODO - Translate this -->
      </a>
      <a
        href="/account/upgrade"
        class="donate"
      >
        <button>
          <Icon
            name="ph:heart-fill"
            size="32"
            mode="svg"
          />
          <span>{{ $t("nav.donate") }}</span>
        </button>
      </a>

      <div class="dropdown">
        <div
          v-if="openDropdown === 'about'"
          class="dropdown-content"
          @click="handleDropdownButton(false)"
        >
          <div class="top">
            <a href="/#credits">
              <div class="icon">
                <Icon
                  name="ph:users-four-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.credits") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.credits") }}</p>
              </div>
            </a>
            <a href="/#about">
              <div class="icon">
                <Icon
                  name="ph:info-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.about") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.about") }}</p>
              </div>
            </a>
            <a href="/#faq">
              <div class="icon">
                <Icon
                  name="ph:question-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.faq") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.faq") }}</p>
              </div>
            </a>
            <a href="/blog">
              <div class="icon">
                <Icon
                  name="ph:newspaper-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("nav.blog") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.blog") }}</p>
              </div>
            </a>
          </div>

          <div class="bottom">
            <a
              href="https://invite.gg/pretendo"
              target="_blank"
              aria-label="A link to our Discord server"
            >
              <Icon
                name="ph:discord-logo-fill"
                size="32"
                mode="svg"
              />
            </a>
            <a
              href="https://twitter.com/PretendoNetwork"
              target="_blank"
              aria-label="A link to our Twitter account"
            >
              <Icon
                name="ph:twitter-logo-fill"
                size="32"
                mode="svg"
              />
            </a>
            <a
              href="https://github.com/PretendoNetwork"
              target="_blank"
              aria-label="A link to our GitHub organization"
            >
              <Icon
                name="ph:github-logo-fill"
                size="32"
                mode="svg"
              />
            </a>
          </div>
        </div>
        <div
          v-if="openDropdown === 'docs'"
          class="dropdown-content"
          @click="handleDropdownButton(false)"
        >
          <div class="top">
            <a href="/docs">
              <div class="icon">
                <Icon
                  name="ph:download-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("docs.quickLinks.links[0].header") }}</p>
                <p class="caption">{{ $t("docs.quickLinks.links[0].caption") }}</p>
              </div>
            </a>
            <a href="/docs/search">
              <div class="icon">
                <Icon
                  name="ph:warning-fill"
                  size="32"
                  mode="svg"
                />
              </div>
              <div>
                <p class="title">{{ $t("docs.quickLinks.links[1].header") }}</p>
                <p class="caption">{{ $t("docs.quickLinks.links[1].caption") }}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="right-section">
      <div
        class="locale-dropdown"
        data-dropdown
      >
        <button
          class="locale-dropdown-toggle"
          aria-controls="toggable-languages"
          @click="handleDropdownButton('locale')"
        >
          <Icon
            name="ph:translate"
            aria-label="Toggle Language List"
            size="32"
            mode="svg"
          />
        </button>

        <div
          v-if="openDropdown === 'locale'"
          class="options-container"
        >
          <button
            v-for="locale in locales"
            :key="locale.code"
            class="option"
            @click="setLocale(locale.code); handleDropdownButton(false)"
          >
            {{ locale.name }}
          </button>
        </div>
      </div>

      <div
        v-if="loggedIn"
        class="user-widget-wrapper logged-in"
      >
        <div class="user-widget-toggle">
          <img
            src="url"
            alt="name"
          >
        </div>
        <div class="user-widget">
          <div class="user-avatar">
            <img
              src=""
              alt="miiname"
            >
          </div>
          <div class="user-info">
            <div class="mii-name">
              miiname
            </div>
            <div class="pnid">
              pnid
            </div>
          </div>
          <div class="buttons">
            <a href="/account">
              <button class="button primary">
                {{ $t("nav.accountWidget.settings") }}
              </button>
            </a>
            <a href="/account/logout">
              <button class="button logout">
                {{ $t("nav.accountWidget.logout") }}
              </button>
            </a>
          </div>
        </div>
      </div>

      <div
        v-if="!loggedIn"
        class="user-widget-wrapper"
      >
        <a
          class="login-link"
          href="/account/login"
        >
          <Icon
            name="ph:user-circle-fill"
            size="32"
            mode="svg"
            aria-label="Login"
          />
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
	position: fixed;
	top: 0;
	left: 2.5%;
	display: flex;
	align-items: center;
	width: 95%;
	margin-top: 35px;
	z-index: 60;
	transition: box-shadow 180ms, background 180ms;
}

header * {
	z-index: 1;
}

header::before {
	content: "";
	position: absolute;
	top: -35px;
	left: -10vw;
	width: 120vw;
	height: calc(100% + 35px + 35px);
	background: rgba(27, 31, 59, 0.98);
	transition: background 180ms;
}

header.transparent,
header.transparent::before {
	background: rgba(27, 31, 59, 0);
}

header.dropdown-active {
	background: rgba(27, 31, 59, 0.98);
	box-shadow: 0 0 0 600vw rgba(27, 31, 59, 0.8);
}

header .dropdown-arrow {
	opacity: 0;
	position: absolute;
	width: 0;
	border-style: solid;
	border-color: var(--bg-shade-3) transparent;
	border-width: 0 14px 14px;
	bottom: -26px;
	margin-left: -10px;
	margin-bottom: -10px;
	transition: left 180ms, margin-bottom 180ms, opacity 180ms;
	pointer-events: none;
}

header.dropdown-active .dropdown-arrow {
	opacity: 1;
	display: block;
	margin-bottom: 0;
}

header a {
	text-decoration: none;
}

header .logo-link,
header .logo-link svg {
	display: block;
}

header div.left-section {
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
}

header nav {
	position: relative;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	margin-left: 40px;
}

header button.dropdown-button.hide-on-desktop {
	display: none;
	background: none;
	padding: 0;
	margin-right: 12px;
	transition: transform 200ms;
	width: 32px;
	height: 32px;
}

header button.dropdown-button.hide-on-desktop.active {
	transform: rotate(90deg);
}

header div.dropdown-button-wrapper {
	position: relative;
	display: flex;
	flex-flow: row nowrap;
}

/* these are safezones where the dropdown will not close */
header div.dropdown-button-wrapper::before {
	content: "";
	position: absolute;
	top: -16px;
	bottom: 100%;
	left: 0;
	right: -12px;
}

header div.dropdown-button-wrapper::after {
	content: "";
	position: absolute;
	top: 100%;
	bottom: -32px;
	left: 0;
	right: -12px;
}

header nav button {
	background: none;
	color: var(--text-shade-1);
	margin: 0 17px;
	padding: 0;
}

header nav button.active {
	background: none;
	color: var(--text-shade-3);
}

header nav a.donate button {
	display: grid;
	grid-auto-flow: column;
	align-items: center;
	gap: 4px;
	font-weight: bold;
	background: #332b61;
	color: var(--accent-shade-3);
	padding: 2px 12px;
	border-radius: 24px;
}

header nav a.donate button svg {
	height: 1rem;
	width: 1rem;
}

header nav a.donate button:hover {
	background: var(--accent-shade-0);
	color: #fff;
}

header nav button.dropdown-button.active::after {
	transform: scaleY(-1);
	filter: none;
}

header div.dropdown {
	position: absolute;
	top: 100%;
	margin-top: 24px;
	left: 0;
	background: var(--bg-shade-3);
	border-radius: 8px;

	width: 420px;
	height: fit-content;
	overflow: hidden;
}

header div.dropdown * {
	box-sizing: border-box;
}

header div.dropdown-content {
	width: 100%;
	height: auto;
	pointer-events: auto;
	transition: opacity 180ms;
}

header div.dropdown .top {
	background: var(--bg-shade-3);

	padding: 32px 18px;
}

header div.dropdown .top a {
	position: relative;
	display: grid;
	grid-auto-flow: column;
	gap: 16px;
	justify-content: start;
	align-items: center;
	color: var(--text-shade-1);
	padding: 16px;
	border-radius: 8px;
}

header div.dropdown .top a .icon {
	background: var(--bg-shade-2);
	color: var(--accent-shade-3);
	height: 56px;
	width: 56px;
	border-radius: 8px;
}

header div.dropdown .top a:hover .icon {
	background: #151b44;
	color: var(--accent-shade-1);
}

header div.dropdown .top a .icon svg {
	width: 32px;
	height: 32px;
	margin: 12px;
}

header div.dropdown .top a .title {
	margin: 0;
	font-weight: bold;
	color: var(--text-shade-3);
}

header div.dropdown .top a .caption {
	margin: 0;
}

header div.dropdown .top a:hover {
	background: var(--bg-shade-2-5);
}

header div.dropdown .top a:hover::after {
	content: "";
	position: absolute;
	top: 0;
	right: 24px;
	width: 24px;
	height: 100%;
	background: no-repeat center url("/assets/images/arrow-right.svg");
	/* garbage to make it look the same color */
	filter: brightness(0) invert(60%) sepia(70%) saturate(453%) hue-rotate(208deg) brightness(113%) contrast(97%);
}

header div.dropdown .top a:hover .title {
	color: var(--accent-shade-3);
}

header div.dropdown .bottom {
	display: grid;
	grid-auto-flow: column;
	justify-content: center;
	gap: 24px;
	background: var(--bg-shade-3-5);
	padding: 22px;
	width: 100%;
	box-sizing: border-box;
}

header div.dropdown .bottom a {
	width: 48px;
	height: 48px;
	background: var(--bg-shade-3);
	color: var(--text-shade-3);
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

header div.dropdown .bottom a:hover {
	background: var(--bg-shade-2);
}

header div.dropdown .bottom a svg {
	width: 24px;
	height: auto;
}

header div.dropdown .top a.show-on-mobile {
	display: none;
}

header .right-section {
	display: grid;
	grid-auto-flow: column;
	align-items: center;
	gap: 24px;
	margin-left: auto;
	z-index: 2;
	color: var(--text-shade-1);
}

header .locale-dropdown-toggle {
	width: fit-content;
	height: 24px;
	width: 24px;
	padding: 0;
	margin: auto;
	transition: color 150ms;
	color: inherit;
	cursor: pointer;
}

header .locale-dropdown-toggle:hover,
header .locale-dropdown-toggle.active {
	color: var(--text-shade-3);
}

header .user-widget-wrapper {
	height: auto;
}

header .user-widget-wrapper a.login-link {
	color: var(--text-shade-1);
	text-decoration: none;
	display: block;
	height: 32px;
	transition: color 150ms;
}

header .user-widget-wrapper a.login-link:hover {
	color: var(--text-shade-3);
}

header .user-widget-wrapper.logged-in {
	position: relative;
	width: 32px;
	height: 32px;
}

header .user-widget-wrapper.logged-in .user-widget-toggle {
	width: 32px;
	height: 32px;
	background: var(--text-shade-0);
	border-radius: 50%;
	overflow: hidden;
	cursor: pointer;
}

header .user-widget-wrapper .user-widget-toggle img,
header .user-widget .user-avatar img {
	width: 100%;
	height: 100%;
}

header .user-widget {
	max-height: 0;
	overflow: hidden;

	box-sizing: border-box;
	transition: max-height 300ms, padding 200ms, opacity 150ms;

	position: absolute;
	right: 0;
	top: 48px;
	padding: 0;
	background: var(--bg-shade-2);
	border-radius: 8px;
	text-align: center;
	opacity: 0;

	box-shadow: 0 0 10px -2px var(--bg-shade-0);
}

header .user-widget.active {
	max-height: 100vh;
	padding: 36px;
	opacity: 1;
}

header .user-widget .user-avatar {
	width: 128px;
	height: 128px;
	margin: auto;
	background: var(--text-shade-0);
	border-radius: 50%;
	overflow: hidden;
}

header .user-widget .user-info {
	margin-top: 12px;
}

header .user-widget .user-info .mii-name {
	color: var(--text-shade-3);
}

header .user-widget .buttons {
	margin-top: 12px;
}

header .user-widget .button {
	margin-top: 12px;
	width: 100%;
	padding: 8px 60px;
	cursor: pointer;
}

.locale-dropdown-toggle {
	appearance: none;
	background: none;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	padding: 0;
	margin: 0;
	transition: color 150ms;
	cursor: pointer;
}

.locale-dropdown-toggle:hover,
.locale-dropdown-toggle.active {
	color: var(--text-shade-3);
}

.options-container {
	position: absolute;
	top: 100%;
	right: 0;

	display: flex;
	flex-flow: column;
	gap: 2px;
	width: min(90vw, 240px);
	max-height: min(90vh, 20rem);
	overflow-y: scroll;

	margin-top: 24px;

	border-radius: 5px;
	background-color: var(--bg-shade-3);
	order: 1;
}

.option {
	all: unset;
	font: inherit;
	color: var(--text-shade-2);
	padding: 12px 15px;
	cursor: pointer;
	border-radius: 5px;
}

.option:hover {
	background: var(--bg-shade-4);
}

.locale-dropdown {
	position: relative;
	width: min-content;
	height: fit-content
}

header .user-widget .button.logout {
	background: var(--bg-shade-3);
	color: var(--text-shade-3);
}
</style>

<style>
@media screen and (max-width: 900px) {
	header {
		position: relative !important;
		justify-content: flex-end !important;
		width: 90% !important;
		left: 5% !important;
	}

	header .left-section {
		margin-right: auto !important;
	}

	header .right-section {
		margin-left: 24px !important;
	}

	header nav a.donate button {
		margin: 0 !important;
	}

	header .dropdown {
		left: 0 !important;
		width: 90vw !important;
	}

	header div.dropdown .top {
		display: grid !important;
		grid-template-columns: 1fr 1fr !important;
	}
}

@media screen and (max-width: 600px) {
	header div.dropdown .top {
		grid-template-columns: 1fr !important;
	}

	header div.dropdown .top {
		padding: 16px 9px !important;
	}
}

@media screen and (max-width: 500px) {
	header nav a.donate button span {
		display: none;
	}

	header nav a.donate button {
		padding: 6px !important;
	}
}

@media screen and (max-width: 420px) {
	header nav a.donate button {
		display: none !important;
	}

	header .right-section {
		margin-left: 0 !important;
	}

	header div.dropdown {
		right: -80px;
	}

	header div.dropdown .top a {
		padding: 8px;
	}

	header div.dropdown .top a .icon {
		height: 40px;
		width: 40px;
	}

	header div.dropdown .top a .icon svg {
		width: 24px;
		height: 24px;
		margin: 8px;
	}
}

@media screen and (max-width: 330px) {
	header .logo-link svg text {
		display: none;
	}

	header .logo-link svg {
		width: 39.876px;
	}

	header .logo-link {
		margin-right: 6px;
	}
}
</style>
