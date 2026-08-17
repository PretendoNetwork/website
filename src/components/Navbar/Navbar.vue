<script lang="ts" setup>
import {
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuRoot,
	NavigationMenuTrigger,
	NavigationMenuViewport
} from 'reka-ui';
import { Popover } from 'reka-ui/namespaced';
import type { LocaleObject } from '@nuxtjs/i18n';
const { locales, setLocale, locale } = useI18n();

// en-US first, other en locales next, alphabetically sorted locales third, conlangs/other stuff last.
function scoreLocale(cObj: LocaleObject): number {
	const c = cObj.code;
	if (c == 'en-US') {
		return 0;
	} else if (c.startsWith('en-')) {
		return 1;
	} else if (c.includes('@')) {
		return 3;
	} else {
		return 2;
	}
}

const sortedLocales = computed(() => {
	const sorted = [...locales.value];
	sorted.sort((a, b) => {
		const sA = scoreLocale(a);
		const sB = scoreLocale(b);

		return sA - sB || (a?.name || '').localeCompare(b?.name || '', locale.value);
	});

	return sorted;
});

const me = useMeStore();
const authUtils = useAuthUtils();
const user = computed(() => me.user);

const currentTrigger = ref('');

const scrollY = ref<number>(0);

onMounted(() => {
	window.addEventListener('scroll', () => {
		scrollY.value = window.scrollY;
	});
});
</script>

<template>
  <header :class="{ transparent: scrollY === 0 }">
    <NavigationMenuRoot
      v-model="currentTrigger"
      class="nav-menu-root"
    >
      <NavigationMenuList class="left-section">
        <NavigationMenuItem>
          <NavigationMenuTrigger class="nav-menu-trigger mobile">
            <Icon
              name="ph:list"
              size="32"
              mode="svg"
            />
          </NavigationMenuTrigger>
          <NavigationMenuContent class="nav-menu-content mobile">
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
                  <p class="caption">
                    {{ $t("nav.dropdown.captions.credits") }}
                  </p>
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
                  <p class="caption">
                    {{ $t("nav.dropdown.captions.about") }}
                  </p>
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
                  <p class="caption">
                    {{ $t("nav.dropdown.captions.blog") }}
                  </p>
                </div>
              </a>
              <a href="/progress">
                <div class="icon">
                  <Icon
                    name="ph:timer-fill"
                    size="32"
                    mode="svg"
                  />
                </div>
                <div>
                  <p class="title">
                    {{ $t("nav.progress") }}
                  </p>
                  <p class="caption">
                    {{ $t("nav.dropdown.captions.progress") }}
                  </p>
                </div>
              </a>
              <a href="https://forum.pretendo.network">
                <div class="icon">
                  <Icon
                    name="ph:chats-fill"
                    size="32"
                    mode="svg"
                  />
                </div>
                <div>
                  <p class="title">
                    {{ $t("nav.forum") }}
                  </p>
                  <p class="caption">
                    {{ $t("nav.dropdown.captions.forum") }}
                  </p>
                </div>
              </a>

              <a href="/docs">
                <div class="icon">
                  <Icon
                    name="ph:download-simple-fill"
                    size="32"
                    mode="svg"
                  />
                </div>
                <div>
                  <p class="title">
                    {{ $t("docs.quickLinks.links[0].header") }}
                  </p>
                  <p class="caption">
                    {{ $t("docs.quickLinks.links[0].caption") }}
                  </p>
                </div>
              </a>
              <a href="/docs/errors">
                <div class="icon">
                  <Icon
                    name="ph:warning-fill"
                    size="32"
                    mode="svg"
                  />
                </div>
                <div>
                  <p class="title">
                    {{ $t("docs.quickLinks.links[1].header") }}
                  </p>
                  <p class="caption">
                    {{ $t("docs.quickLinks.links[1].caption") }}
                  </p>
                </div>
              </a>
              <a
                href="/account/upgrade"
                class="donate"
              >
                <div class="icon">
                  <Icon
                    name="ph:heart-fill"
                    size="32"
                    mode="svg"
                  />
                </div>
                <div>
                  <p class="title">
                    {{ $t("nav.donate") }}
                  </p>
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
                  name="fa7-brands:discord"
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
                  name="fa7-brands:twitter"
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
                  name="fa7-brands:github"
                  size="32"
                  mode="svg"
                />
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink as-child>
            <NuxtLink
              to="/"
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
            </NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger class="nav-menu-trigger desktop">
            {{ $t("nav.about") }}
          </NavigationMenuTrigger>
          <NavigationMenuContent class="nav-menu-content">
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
                  <p class="caption">
                    {{ $t("nav.dropdown.captions.credits") }}
                  </p>
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
                  <p class="caption">
                    {{ $t("nav.dropdown.captions.about") }}
                  </p>
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
                  <p class="caption">
                    {{ $t("nav.dropdown.captions.blog") }}
                  </p>
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
                  name="fa7-brands:discord"
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
                  name="fa7-brands:twitter"
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
                  name="fa7-brands:github"
                  size="32"
                  mode="svg"
                />
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger class="nav-menu-trigger desktop">
            {{ $t("nav.docs") }}
          </NavigationMenuTrigger>
          <NavigationMenuContent class="nav-menu-content">
            <div class="top">
              <a href="/docs">
                <div class="icon">
                  <Icon
                    name="ph:download-simple-fill"
                    size="32"
                    mode="svg"
                  />
                </div>
                <div>
                  <p class="title">
                    {{ $t("docs.quickLinks.links[0].header") }}
                  </p>
                  <p class="caption">
                    {{ $t("docs.quickLinks.links[0].caption") }}
                  </p>
                </div>
              </a>
              <a href="/docs/errors">
                <div class="icon">
                  <Icon
                    name="ph:warning-fill"
                    size="32"
                    mode="svg"
                  />
                </div>
                <div>
                  <p class="title">
                    {{ $t("docs.quickLinks.links[1].header") }}
                  </p>
                  <p class="caption">
                    {{ $t("docs.quickLinks.links[1].caption") }}
                  </p>
                </div>
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink as-child>
            <NuxtLink
              to="/progress"
              class="nav-menu-link desktop"
            >
              {{ $t("nav.progress") }}
            </NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink as-child>
            <NuxtLink
              to="https://forum.pretendo.network"
              class="nav-menu-link desktop"
            >
              {{ $t("nav.forum") }}
            </NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink as-child>
            <NuxtLink
              to="/account/upgrade"
              class="nav-menu-link donate"
            >
              <Icon
                name="ph:heart-fill"
                size="32"
                mode="svg"
              />
              <span>{{ $t("nav.donate") }}</span>
            </NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuIndicator class="nav-menu-indicator">
          <div class="nav-menu-arrow" />
        </NavigationMenuIndicator>
      </NavigationMenuList>

      <div class="nav-viewport-wrapper">
        <NavigationMenuViewport class="nav-menu-viewport" />
      </div>
    </NavigationMenuRoot>

    <div class="right-section">
      <div>
        <Popover.Root
          v-slot="{ close }"
          as="div"
        >
          <Popover.Trigger
            as="button"
            class="locale-dropdown-toggle"
          >
            <Icon
              name="ph:translate"
              aria-label="Toggle Language List"
              size="32"
              mode="svg"
            />
          </Popover.Trigger>

          <Popover.Content
            as="div"
            align="end"
            side="bottom"
            :side-offset="16"
            class="locale-dropdown"
          >
            <button
              v-for="l in sortedLocales"
              :key="l.code"
              class="option"
              @click="
                setLocale(l.code);
                close();
              "
            >
              {{ l.name }}
            </button>
          </Popover.Content>
        </Popover.Root>
      </div>

      <div
        v-if="user"
        class="user-widget-wrapper logged-in"
      >
        <Popover.Root as="div">
          <Popover.Trigger
            as="div"
            class="user-widget-toggle"
          >
            <img
              :src="user.mii?.imageUrl ?? '#'"
              :alt="user.mii?.name ?? ''"
            >
          </Popover.Trigger>
          <Popover.Content
            as="div"
            align="end"
            side="bottom"
            :side-offset="16"
            class="navbar-user-widget"
          >
            <div class="user-avatar">
              <img
                :src="user.mii?.imageUrl ?? '#'"
                :alt="user.mii?.name ?? ''"
              >
            </div>
            <div class="user-info">
              <div
                v-if="user.mii"
                class="mii-name"
              >
                {{ user.mii.name }}
              </div>
              <div class="pnid">
                {{ user.username }}
              </div>
            </div>
            <div class="buttons">
              <a href="/account">
                <button class="button primary">
                  {{ $t("nav.accountWidget.settings") }}
                </button>
              </a>
              <button
                class="button logout"
                @click="authUtils.logout()"
              >
                {{ $t("nav.accountWidget.logout") }}
              </button>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>

      <div
        v-if="!user"
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

<style>
header {
	position: fixed;
	top: 0;
	left: 2.5%;
	display: flex;
	align-items: center;
	width: 95%;
	margin-top: 35px;
	z-index: 60;
	transition:
		box-shadow 180ms,
		background 180ms;
}

header * {
	z-index: 3;
}

.logo-link {
	display: flex;
	align-items: center;
	margin-right: 40px;
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

header:has(.nav-menu-viewport[data-state="open"]),
header:has(.locale-dropdown-toggle[data-state="open"]),
header:has(.user-widget-toggle[data-state="open"]) {
	box-shadow: 0 0 0 600vw rgba(27, 31, 59, 0.8);
	background: rgba(27, 31, 59, 1);;
}

header.transparent:has(.nav-menu-viewport[data-state="open"]),
header.transparent:has(.locale-dropdown-toggle[data-state="open"]),
header.transparent:has(.user-widget-toggle[data-state="open"]) {
	background: rgba(27, 31, 59, 0.8) !important;
}

header.transparent,
header.transparent::before {
	background: rgba(27, 31, 59, 0) !important;
}

header button {
	all: unset;
	box-sizing: border-box;
}

header .left-section {
	position: relative;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	list-style: none;
	padding: 0;
	margin: 0;
}

.nav-menu-viewport * {
	box-sizing: border-box;
}

.nav-menu-trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2px;
}

.nav-menu-trigger,
.nav-menu-link {
	color: var(--text-shade-1);
	margin: 0 17px;
	padding: 0;
	cursor: pointer;
	text-decoration: none;
}

.nav-menu-trigger:hover,
.nav-menu-trigger:focus,
.nav-menu-trigger[data-state="open"],
.nav-menu-link:hover,
.nav-menu-link:focus {
	background: none;
	color: var(--text-shade-3);
}

.nav-menu-trigger.mobile {
	display: none;
	transform: rotate(0);
	transition: all ease 250ms;
}

.nav-menu-trigger.mobile[data-state="open"] {
	transform: rotate(90deg);
}

.nav-menu-link.donate {
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

.nav-menu-link.donate svg {
	height: 1rem;
	width: 1rem;
}

.nav-menu-link.donate:hover {
	background: var(--accent-shade-0);
	color: var(--text-shade-3);
}

.nav-menu-content {
	position: absolute;
	top: 0;
	left: 0;
	min-width: 420px;
	background: var(--bg-shade-3);
	border-radius: 8px;
	animation-duration: 250ms;
	animation-timing-function: ease;
}

.nav-menu-content .top {
	background: var(--bg-shade-3);
	width: 100%;
	padding: 18px;
}

.nav-menu-content .top a {
	position: relative;
	display: grid;
	grid-auto-flow: column;
	gap: 16px;
	text-decoration: none;
	justify-content: start;
	align-items: center;
	color: var(--text-shade-1);
	padding: 16px;
	border-radius: 8px;
}

.nav-menu-content .top a .icon {
	background: var(--bg-shade-2);
	color: var(--accent-shade-3);
	height: 56px;
	width: 56px;
	border-radius: 8px;
}

.nav-menu-content .top a:hover .icon {
	background: #151b44;
	color: var(--accent-shade-1);
}

.nav-menu-content .top a .icon svg {
	width: 32px;
	height: 32px;
	margin: 12px;
}

.nav-menu-content .top a .title {
	margin: 0;
	font-weight: bold;
	color: var(--text-shade-3);
}

.nav-menu-content .top a .caption {
	margin: 0;
}

.nav-menu-content .top a:hover {
	background: var(--bg-shade-2-5);
}

.nav-menu-content .top a:hover::after {
	content: "";
	position: absolute;
	top: 0;
	right: 18px;
	width: 24px;
	height: 100%;
	background: no-repeat center url("/assets/images/arrow-right.svg");
	/* garbage to make it look the same color */
	filter: brightness(0) invert(60%) sepia(70%) saturate(453%) hue-rotate(208deg)
		brightness(113%) contrast(97%);
}

.nav-menu-content .top a:hover .title {
	color: var(--accent-shade-3);
}

.nav-menu-content .bottom {
	display: grid;
	grid-auto-flow: column;
	justify-content: center;
	gap: 24px;
	background: var(--bg-shade-3-5);
	padding: 22px;
	width: 100%;
}

.nav-menu-content .bottom a {
	width: 48px;
	height: 48px;
	background: var(--bg-shade-3);
	color: var(--text-shade-3);
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.nav-menu-content .bottom a:hover {
	background: var(--bg-shade-2);
}

.nav-menu-content .bottom a svg {
	width: 24px;
	height: auto;
}

.nav-menu-content[data-motion="from-start"] {
	animation-name: enterFromLeft;
}
.nav-menu-content[data-motion="from-end"] {
	animation-name: enterFromRight;
}
.nav-menu-content[data-motion="to-start"] {
	animation-name: exitToLeft;
}
.nav-menu-content[data-motion="to-end"] {
	animation-name: exitToRight;
}

.nav-menu-content.mobile .donate {
	display: none;
}

.nav-menu-indicator {
	position: absolute;
	left: 0;
	transform: translateX(
		calc(
			var(--reka-navigation-menu-indicator-position) +
				(var(--reka-navigation-menu-indicator-size) / 2) - 50%
		)
	);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 10px;
	top: 100%;
	overflow: hidden;
	z-index: 1;
	transition:
		width,
		transform 250ms ease;
}
.nav-menu-indicator[data-state="visible"] {
	animation: fadeIn 200ms ease;
}
.nav-menu-indicator[data-state="hidden"] {
	animation: fadeOut 200ms ease;
}

.nav-menu-viewport,
.locale-dropdown,
.navbar-user-widget {
	position: relative;
	transform-origin: top center;
	margin-top: 10px;
	width: 420px;
	background-color: var(--bg-shade-3);
	border-radius: 8px;
	overflow: hidden;
	box-shadow:
		hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
		hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
	height: var(--reka-navigation-menu-viewport-height);
	transition:
		width,
		height,
		300ms ease;
}

.navbar-user-widget {
	width: fit-content;
}

.nav-menu-viewport[data-state="open"],
.locale-dropdown[data-state="open"],
.navbar-user-widget[data-state="open"] {
	animation: scaleIn 200ms ease;
}
.nav-menu-viewport[data-state="closed"],
.locale-dropdown[data-state="closed"],
.navbar-user-widget[data-state="closed"] {
	animation: scaleOut 200ms ease;
}

.nav-viewport-wrapper {
	position: absolute;
	display: flex;
	justify-content: left;
	width: 100%;
	top: 100%;
	padding-left: 160px;
	box-sizing: border-box;
	perspective: 2000px;
}

.nav-menu-arrow {
	position: relative;
	top: 70%;
	background-color: var(--bg-shade-3);
	width: 10px;
	height: 10px;
	transform: rotate(45deg);
	border-top-left-radius: 2px;
}

@keyframes enterFromRight {
	from {
		opacity: 0;
		transform: translateX(200px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes enterFromLeft {
	from {
		opacity: 0;
		transform: translateX(-200px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes exitToRight {
	from {
		opacity: 1;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(200px);
	}
}

@keyframes exitToLeft {
	from {
		opacity: 1;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(-200px);
	}
}

@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes scaleOut {
	from {
		opacity: 1;
		transform: scale(1);
	}
	to {
		opacity: 0;
		transform: scale(0.95);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes fadeOut {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
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

.locale-dropdown-toggle {
	width: fit-content;
	height: 24px;
	width: 24px;
	padding: 0;
	margin: auto;
	transition: color 150ms;
	color: inherit;
	cursor: pointer;
}

.locale-dropdown-toggle:hover,
.locale-dropdown-toggle.active {
	color: var(--text-shade-3);
	background: none;
}

.user-widget-wrapper {
	height: auto;
}

.user-widget-wrapper a.login-link {
	color: var(--text-shade-1);
	text-decoration: none;
	display: block;
	height: 32px;
	transition: color 150ms;
}

.user-widget-wrapper a.login-link:hover {
	color: var(--text-shade-3);
}

.user-widget-wrapper.logged-in {
	position: relative;
	width: 32px;
	height: 32px;
}

.user-widget-wrapper.logged-in .user-widget-toggle {
	width: 32px;
	height: 32px;
	background: var(--text-shade-0);
	border-radius: 50%;
	overflow: hidden;
	cursor: pointer;
}

.user-widget-wrapper .user-widget-toggle img,
.navbar-user-widget .user-avatar img {
	width: 100%;
	height: 100%;
}

.navbar-user-widget,
.locale-dropdown {
	box-sizing: border-box;
	transition:
		max-height 300ms,
		padding 200ms,
		opacity 150ms;

	background: var(--bg-shade-2);
	border-radius: 8px;
	text-align: center;

	margin-top: 0;
}

.navbar-user-widget {
	padding: 24px;
}

.navbar-user-widget .user-avatar {
	width: 128px;
	height: 128px;
	margin: auto;
	background: var(--text-shade-0);
	border-radius: 50%;
	overflow: hidden;
}

.navbar-user-widget .user-info {
	color: var(--text-shade-1);
	margin-top: 12px;
}

.navbar-user-widget .user-info .mii-name {
	color: var(--text-shade-3);
}

.navbar-user-widget .buttons {
	margin-top: 12px;
}

.navbar-user-widget .button {
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

.locale-dropdown {
	display: flex;
	flex-flow: column;
	gap: 2px;
	width: min(90vw, 240px);
	max-height: min(90vh, 20rem);
	overflow-y: scroll;
	background-color: var(--bg-shade-2);
}

.locale-dropdown .option {
	all: unset;
	font: inherit;
	color: var(--text-shade-2);
	padding: 12px 15px;
	cursor: pointer;
	text-align: left;
	border-radius: 5px;
}

.locale-dropdown .option:hover {
	background: var(--bg-shade-4);
}

.navbar-user-widget .button.logout {
	background: var(--bg-shade-3);
	color: var(--text-shade-3);
}

@media screen and (max-width: 900px) {
	header {
		position: relative;
	}
	.nav-menu-viewport {
		position: relative;
		width: 100vw !important;
	}

	.nav-menu-content {
		box-sizing: border-box;
		width: 100%;
	}
	.nav-viewport-wrapper {
		padding: 0 !important;
	}
	.nav-menu-trigger.mobile {
		display: flex;
	}
	.nav-menu-link.desktop,
	.nav-menu-trigger.desktop {
		display: none;
	}

	header .left-section li:has(.logo-link) {
		margin-right: auto;
	}

	nav {
		flex: 1;
	}
}

@media screen and (max-width: 600px) {
	.nav-menu-content {
		min-width: 0;
	}
	.nav-menu-content .top,
	.nav-menu-content .top a {
		padding: 8px;
	}
	.nav-menu-content .top a {
		gap: 8px;
	}
	.nav-menu-content .top a .icon svg {
		width: 24px;
		height: 24px;
	}
	.nav-menu-content .top a .icon {
		width: 48px;
		height: 48px;
		margin: 6px;
	}
}

@media screen and (max-width: 480px) {
	.nav-menu-content .top,
	.nav-menu-content .top a {
		padding: 4px;
	}
	.nav-menu-content .top a .icon svg {
		width: 24px;
		height: 24px;
		margin: 6px;
	}
	.nav-menu-content .top a .icon {
		width: 36px;
		height: 36px;
		margin: 6px;
	}
	.nav-menu-link.donate {
		display: none;
	}
	.nav-menu-content.mobile .donate {
		display: grid;
	}
	header .right-section {
		gap: 12px;
	}
	.nav-menu-trigger {
		margin-left: 0;
		margin-right: 12px;
	}
	header .left-section li:has(.logo-link) {
		margin-right: -24px;
	}
}
</style>
