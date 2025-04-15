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
	// eslint-disable-next-line no-undef
	window.addEventListener('scroll', () => {
		// eslint-disable-next-line no-undef
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
        <svg
          width="32"
          height="32"
          viewBox="0 0 256 256"
        >
          <path
            fill="currentColor"
            d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8ZM40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16Zm176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Z"
          />
        </svg>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M166.5 192.8a7.8 7.8 0 0 1 .6 8.3a8.1 8.1 0 0 1-7.1 4.3H16a8.1 8.1 0 0 1-7.1-4.3a7.8 7.8 0 0 1 .6-8.3a95.5 95.5 0 0 1 45.3-34.9a60 60 0 1 1 66.4 0a95.5 95.5 0 0 1 45.3 34.9Zm81.6 0a96.3 96.3 0 0 0-45.4-34.9A59.9 59.9 0 0 0 169.5 48a64 64 0 0 0-16.3 2.2a8.2 8.2 0 0 0-5.4 5.2a8 8 0 0 0 1.2 7.3a75.8 75.8 0 0 1 3.8 84.9a8.1 8.1 0 0 0 2.1 10.6q4.5 3.5 8.7 7.2l.5.5a112.6 112.6 0 0 1 25.5 34.9a7.9 7.9 0 0 0 7.2 4.6h44.7a8.1 8.1 0 0 0 7.1-4.3a8 8 0 0 0-.5-8.3Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("nav.credits") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.credits") }}</p>
              </div>
            </a>
            <a href="/#about">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24Zm-2 48a12 12 0 1 1-12 12a12 12 0 0 1 12-12Zm10 112h-8a8 8 0 0 1-8-8v-48a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8v48a8 8 0 0 1 0 16Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("nav.about") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.about") }}</p>
              </div>
            </a>
            <a href="/#faq">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24Zm0 168a12 12 0 1 1 12-12a12 12 0 0 1-12 12Zm8-48.9v.9a8 8 0 0 1-16 0v-8a8 8 0 0 1 8-8a20 20 0 1 0-20-20a8 8 0 0 1-16 0a36 36 0 1 1 44 35.1Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("nav.faq") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.faq") }}</p>
              </div>
            </a>
            <a href="/blog">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M216 48H56a16 16 0 0 0-16 16v120a8 8 0 0 1-16 0V88a8 8 0 0 0-16 0v96a24 24 0 0 0 24 24h176a24.1 24.1 0 0 0 24-24V64a16 16 0 0 0-16-16Zm-40 104H96a8 8 0 0 1 0-16h80a8 8 0 0 1 0 16Zm0-32H96a8 8 0 0 1 0-16h80a8 8 0 0 1 0 16Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("nav.blog") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.blog") }}</p>
              </div>
            </a>
            <a href="/progress">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M96 8a8 8 0 0 1 8-8h48a8 8 0 0 1 0 16h-48a8 8 0 0 1-8-8Zm128 120a96 96 0 1 1-96-96a96.2 96.2 0 0 1 96 96Zm-50.7-45.3a8.1 8.1 0 0 0-11.4 0l-39.6 39.6a8.1 8.1 0 0 0 0 11.4a8.2 8.2 0 0 0 11.4 0l39.6-39.6a8.1 8.1 0 0 0 0-11.4Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("nav.progress") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.blog") }}</p>
              </div>
            </a>
            <a href="/docs">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M74.3 85.7a8.1 8.1 0 0 1 11.4-11.4l34.3 34.4V24a8 8 0 0 1 16 0v84.7l34.3-34.4a8.1 8.1 0 0 1 11.4 11.4l-48 48a8.2 8.2 0 0 1-11.4 0ZM240 136v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h52.4a3.6 3.6 0 0 1 2.8 1.2L111 145a24.1 24.1 0 0 0 34 0l23.8-23.8a3.6 3.6 0 0 1 2.8-1.2H224a16 16 0 0 1 16 16Zm-40 32a12 12 0 1 0-12 12a12 12 0 0 0 12-12Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("docs.quickLinks.links[0].header") }}</p>
                <p class="caption">{{ $t("docs.quickLinks.links[0].caption") }}</p>
              </div>
            </a>
            <a href="/docs/search">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M236.7 188L148.8 36a24 24 0 0 0-41.6 0L19.3 188A23.9 23.9 0 0 0 40 224h176a23.9 23.9 0 0 0 20.7-36ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"
                  />
                </svg>
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
            <svg
              width="71"
              height="55"
              viewBox="0 0 71 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0)">
                <path
                  d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                  fill="#ffffff"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect
                    width="71"
                    height="55"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a
            href="https://twitter.com/PretendoNetwork"
            target="_blank"
            aria-label="A link to our Twitter account"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Twitter</title>
              <path
                fill="currentColor"
                d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
              />
            </svg>
          </a>
          <a
            href="https://github.com/PretendoNetwork"
            target="_blank"
            aria-label="A link to our GitHub organization"
          >
            <svg
              data-prefix="fab"
              data-icon="github"
              class="svg-inline--fa fa-github fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
            >
              <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              />
            </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-heart"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M166.5 192.8a7.8 7.8 0 0 1 .6 8.3a8.1 8.1 0 0 1-7.1 4.3H16a8.1 8.1 0 0 1-7.1-4.3a7.8 7.8 0 0 1 .6-8.3a95.5 95.5 0 0 1 45.3-34.9a60 60 0 1 1 66.4 0a95.5 95.5 0 0 1 45.3 34.9Zm81.6 0a96.3 96.3 0 0 0-45.4-34.9A59.9 59.9 0 0 0 169.5 48a64 64 0 0 0-16.3 2.2a8.2 8.2 0 0 0-5.4 5.2a8 8 0 0 0 1.2 7.3a75.8 75.8 0 0 1 3.8 84.9a8.1 8.1 0 0 0 2.1 10.6q4.5 3.5 8.7 7.2l.5.5a112.6 112.6 0 0 1 25.5 34.9a7.9 7.9 0 0 0 7.2 4.6h44.7a8.1 8.1 0 0 0 7.1-4.3a8 8 0 0 0-.5-8.3Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("nav.credits") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.credits") }}</p>
              </div>
            </a>
            <a href="/#about">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24Zm-2 48a12 12 0 1 1-12 12a12 12 0 0 1 12-12Zm10 112h-8a8 8 0 0 1-8-8v-48a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8v48a8 8 0 0 1 0 16Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("nav.about") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.about") }}</p>
              </div>
            </a>
            <a href="/#faq">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24Zm0 168a12 12 0 1 1 12-12a12 12 0 0 1-12 12Zm8-48.9v.9a8 8 0 0 1-16 0v-8a8 8 0 0 1 8-8a20 20 0 1 0-20-20a8 8 0 0 1-16 0a36 36 0 1 1 44 35.1Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("nav.faq") }}</p>
                <p class="caption">{{ $t("nav.dropdown.captions.faq") }}</p>
              </div>
            </a>
            <a href="/blog">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M216 48H56a16 16 0 0 0-16 16v120a8 8 0 0 1-16 0V88a8 8 0 0 0-16 0v96a24 24 0 0 0 24 24h176a24.1 24.1 0 0 0 24-24V64a16 16 0 0 0-16-16Zm-40 104H96a8 8 0 0 1 0-16h80a8 8 0 0 1 0 16Zm0-32H96a8 8 0 0 1 0-16h80a8 8 0 0 1 0 16Z"
                  />
                </svg>
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
              <svg
                width="71"
                height="55"
                viewBox="0 0 71 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0)">
                  <path
                    d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                    fill="#ffffff"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect
                      width="71"
                      height="55"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </a>
            <a
              href="https://twitter.com/PretendoNetwork"
              target="_blank"
              aria-label="A link to our Twitter account"
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Twitter</title>
                <path
                  fill="currentColor"
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>
            <a
              href="https://github.com/PretendoNetwork"
              target="_blank"
              aria-label="A link to our GitHub organization"
            >
              <svg
                data-prefix="fab"
                data-icon="github"
                class="svg-inline--fa fa-github fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
              >
                <path
                  fill="currentColor"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                />
              </svg>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M74.3 85.7a8.1 8.1 0 0 1 11.4-11.4l34.3 34.4V24a8 8 0 0 1 16 0v84.7l34.3-34.4a8.1 8.1 0 0 1 11.4 11.4l-48 48a8.2 8.2 0 0 1-11.4 0ZM240 136v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h52.4a3.6 3.6 0 0 1 2.8 1.2L111 145a24.1 24.1 0 0 0 34 0l23.8-23.8a3.6 3.6 0 0 1 2.8-1.2H224a16 16 0 0 1 16 16Zm-40 32a12 12 0 1 0-12 12a12 12 0 0 0 12-12Z"
                  />
                </svg>
              </div>
              <div>
                <p class="title">{{ $t("docs.quickLinks.links[0].header") }}</p>
                <p class="caption">{{ $t("docs.quickLinks.links[0].caption") }}</p>
              </div>
            </a>
            <a href="/docs/search">
              <div class="icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M236.7 188L148.8 36a24 24 0 0 0-41.6 0L19.3 188A23.9 23.9 0 0 0 40 224h176a23.9 23.9 0 0 0 20.7-36ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"
                  />
                </svg>
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
          <svg
            role="img"
            aria-label="Toggle Language List"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-globe"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <line
              x1="2"
              y1="12"
              x2="22"
              y2="12"
            />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
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
          <svg
            role="img"
            aria-label="Login"
            width="32"
            height="32"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M232 128a104 104 0 1 0-174.2 76.7l1.3 1.2a104 104 0 0 0 137.8 0l1.3-1.2A103.7 103.7 0 0 0 232 128Zm-192 0a88 88 0 1 1 153.8 58.4a79.2 79.2 0 0 0-36.1-28.7a48 48 0 1 0-59.4 0a79.2 79.2 0 0 0-36.1 28.7A87.6 87.6 0 0 1 40 128Zm56-8a32 32 0 1 1 32 32a32.1 32.1 0 0 1-32-32Zm-21.9 77.5a64 64 0 0 1 107.8 0a87.8 87.8 0 0 1-107.8 0Z"
            />
          </svg>
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
