<script lang="ts" setup>
const { tm, t } = useI18n();
const year = new Date().getFullYear();

const bandwidthQuoteIndex = ref<number>(-1);
const quotes = computed(() => tm<string>('footer.bandwidthRaccoonQuotes') as string[]);
const totalBandwidthQuotes = computed(() => quotes.value.length);
const currentQuote = computed(() => t(`footer.bandwidthRaccoonQuotes[${Math.max(0, bandwidthQuoteIndex.value)}]`));

watch([totalBandwidthQuotes], () => {
	bandwidthQuoteIndex.value = -1;
});

function bandwidthClickHandler() {
	if (bandwidthQuoteIndex.value + 1 >= totalBandwidthQuotes.value) {
		bandwidthQuoteIndex.value = 0;
	} else {
		bandwidthQuoteIndex.value++;
	}
}
</script>

<template>
  <footer>
    <div>
      <svg
        class="logotype"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 39.876"
        preserveAspectRatio="xMinYMin meet"
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
      <p>Copyright {{ year }}</p>
      <p>
        Site by <a
          href="https://mrjvs.com/"
          target="_blank"
        >mrjvs</a>, <a
          href="https://jipfr.nl/"
          target="_blank"
        >jipfr</a> & <a
          href="https://limes.pink/"
          target="_blank"
        >pinklimes</a>
      </p>
    </div>
    <div>
      <h1>{{ $t("footer.socials") }}</h1>
      <a
        href="https://twitter.com/PretendoNetwork/"
        target="_blank"
      >Twitter</a>
      <a
        href="https://mastodon.pretendo.network/@pretendo"
        target="_blank"
        rel="me"
      >Mastodon</a>
      <a
        href="https://discord.gg/pretendo"
        target="_blank"
      >Discord</a>
      <a
        href="https://github.com/PretendoNetwork"
        target="_blank"
      >GitHub</a>
      <a
        href="https://bsky.app/profile/pretendo.network"
        target="_blank"
      >Bluesky</a>
    </div>
    <div>
      <h1>{{ $t("footer.usefulLinks") }}</h1>
      <a href="/terms/privacy">Privacy Policy</a>
      <!-- TODO - Add this to weblate.Quick and dirty for now, just to get something out the door -->
      <a href="/docs">{{ $t("nav.docs") }}</a>
      <a href="/#faq">{{ $t("nav.faq") }}</a>
      <a href="/progress">{{ $t("nav.progress") }}</a>
      <a href="/blog">{{ $t("nav.blog") }}</a>
      <a href="/account">{{ $t("nav.account") }}</a>
      <a href="/account/upgrade">{{ $t("nav.donate") }}</a>
    </div>
    <!-- TODO - Create a "Legal" section here -->
    <div class="discord-server-card-wrapper">
      <div class="discord-server-card">
        <h1>{{ $t("footer.widget.captions[0]") }}</h1>
        <h2>{{ $t("footer.widget.captions[1]") }}</h2>
        <a href="https://discord.gg/pretendo">
          <Icon
            name="ph:arrow-right"
            size="24"
          />
          {{ $t("footer.widget.button") }}
        </a>
      </div>
      <div :class="{ 'bandwidth-raccoon-wrapper': true, 'speak': bandwidthQuoteIndex !== -1 }">
        <div class="text-bubble">
          <p>{{ currentQuote }}</p>
        </div>
        <img
          src="/assets/images/bandwidth.svg"
          class="bandwidth-raccoon"
          @click="bandwidthClickHandler()"
        >
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, fit-content(100%)) 1fr;
	gap: min(48px, 7.7vw);
	color: var(--text-shade-1);
	margin-top: 120px;
	position: relative;
	padding: 60px 0;
}

footer::after {
	content: "";
	width: 400vw;
	height: 100%;
	position: absolute;
	top: 0;
	left: -50vw;
	background: var(--bg-shade-0);
	z-index: -1;
}

footer div {
	display: flex;
	flex-flow: column;
	width: fit-content;
}

footer svg.logotype {
	height: 56px;
	margin: -10px 0 24px -10px;
}

footer p {
	margin: 0;
}

footer h1 {
	font-size: 20px;
	margin-top: 0;
	color: var(--text-shade-3);
}

footer a {
	color: var(--text-shade-1);
	text-decoration: none;
	width: fit-content;
}

footer a:hover {
	color: var(--text-shade-3);
	text-decoration: underline;
}

footer div.discord-server-card-wrapper {
	z-index: 2;
	justify-self: end;
	position: relative;
}

footer div.discord-server-card {
	background: var(--bg-shade-2);
	border-radius: 12px;
	padding: 30px 90px 30px 36px;
}

footer div.discord-server-card h1 {
	font-size: 25px;
	margin: 0;
}

footer div.discord-server-card h2 {
	color: var(--text-shade-3);
	font-size: 22px;
	margin: 0;
}

footer div.discord-server-card a {
	display: flex;
	align-items: center;
	color: var(--accent-shade-3);
	font-size: 22px;
	text-decoration: none;
	width: fit-content;
	margin-left: -2px;
	margin-top: 12px;
}

footer div.discord-server-card a:hover {
	text-decoration: underline;
}

footer div.discord-server-card svg {
	height: 24px;
	stroke-width: 3px;
	margin-right: 4px;
}

footer div.discord-server-card-wrapper .bandwidth-raccoon-wrapper {
	position: absolute;
	top: -120px;
	right: 0px;
	z-index: -1;
}

footer div.discord-server-card-wrapper img.bandwidth-raccoon {
	width: 192px;
	height: 192px;
	cursor: pointer;
	transform: none;
	transition: transform 150ms;
}

footer div.bandwidth-raccoon-wrapper.speak img.bandwidth-raccoon {
	transform: rotate(12deg) translateY(-12px);
}

footer .bandwidth-raccoon-wrapper .text-bubble {
	position: absolute;
	right: 0;
	margin: 0 auto;
	top: -24px;
	max-width: min(200%, 90vw);
	width: max-content;
	background: var(--bg-shade-3);
	padding: 18px;
	align-self: center;
	margin-bottom: 12px;
	border-radius: 12px;
	box-sizing: border-box;
	transform: translateY(-100%);
	opacity: 0;
	pointer-events: none;
	transition: opacity 250ms;
}

footer .bandwidth-raccoon-wrapper.speak .text-bubble {
	opacity: 1;
}

footer .bandwidth-raccoon-wrapper .text-bubble:after {
	content: "";
	position: absolute;
	display: block;
	width: 0;
	z-index: 1;
	border-style: solid;
	border-color: var(--bg-shade-3) transparent;
	border-width: 12px 12px 0;
	bottom: -9px;
	right: 60px;
	margin-left: -10px;
}
</style>

<style lang="scss">
@media screen and (max-width: 900px) {
	#root {
		footer {
			margin-top: 100px;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(2, fit-content(100%));
		}

		footer div {
			justify-self: center;
		}

		footer div.discord-server-card-wrapper {
			grid-column: 1 / span 4;
			width: 100%;
			justify-self: normal;
		}

		footer div.discord-server-card-wrapper::before {
			content: "";
			width: 100%;
			height: 60px;
			position: absolute;
			bottom: -60px;
			left: 0;
			background: var(--bg-shade-0);
			z-index: 2;
		}

		footer div.discord-server-card-wrapper .bandwidth-raccoon-wrapper {
			bottom: -72px;
			top: unset;
			z-index: 0;
		}

		footer div.discord-server-card {
			box-sizing: border-box;
			width: 100%;
			overflow: hidden;
		}
	}
}

@media screen and (max-width: 580px) {
	#root {
		footer {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(4, fit-content(100%));
		}

		footer div {
			justify-self: start;
		}

		footer div.discord-server-card-wrapper {
			grid-column: 1 / span 1;
		}

		footer div.discord-server-card {
			padding: 30px;
			overflow: visible;
		}

		footer div.discord-server-card-wrapper .bandwidth-raccoon-wrapper {
			bottom: unset;
			top: -120px;
			z-index: -1;
		}
	}
}

@media screen and (max-width: 320px) {
	#root {
		footer div.discord-server-card-wrapper .bandwidth-raccoon-wrapper {
			display: none;
		}
	}
}
</style>
