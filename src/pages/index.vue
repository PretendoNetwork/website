<script lang="ts" setup>
const { messages, te, t, tm } = useI18n();

const fallbackLocale = messages.value['en-US'];

const nOfQAs = computed(() => tm<string>('faq.QAs') as string[]).value.length;
const maxCoreStaffIndex = computed(() => tm<string>('credits.people') as string[]).value.length - 1;
const maxContributorsIndex = computed(() => tm<string>('specialThanks.people') as string[]).value.length - 1;

function array(n: number) {
	return Array.from({ length: n + 1 }, (_, i) => i);
}

function odd(n: number) {
	return array(n).filter(i => i % 2 === 1);
}

function even(n: number) {
	return array(n).filter(i => i % 2 === 0);
}

function titleSuffixHandler(path: string) {
	return te(path) ? t(path) : null;
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <section class="hero">
      <div class="hero-meta">
        <h3 class="subtitle">
          {{ $t("hero.subtitle") }}
        </h3>
        <h1
          class="title dot"
          :data-title-suffix="titleSuffixHandler('hero.titlesuffix')"
        >
          {{ $t("hero.title") }}
        </h1>
        <p class="text">
          {{ $t("hero.text") }}
        </p>
        <div class="buttons">
          <a
            href="/#about"
            class="do-button-margin"
          >
            <button class="button primary">
              {{ $t("hero.buttons.readMore") }}
            </button>
          </a>
          <a
            href="https://discord.gg/pretendo"
            class="do-button-margin"
            target="_blank"
            aria-label="Open Discord"
          >
            <button
              class="button secondary discord icon-btn"
              focusable="false"
            >
              <svg
                alt=""
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
            </button>
          </a>
          <a
            href="https://github.com/PretendoNetwork/"
            class="do-button-margin"
            target="_blank"
            aria-label="Open Github"
          >
            <button
              class="button secondary github icon-btn"
              focusable="false"
            >
              <svg
                alt=""
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
            </button>
          </a>
          <a
            href="/account/upgrade"
            target="_blank"
            aria-label="Upgrade account"
          >
            <button
              class="button secondary github icon-btn"
              focusable="false"
            >
              <svg
                alt=""
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
            </button>
          </a>
        </div>
      </div>
      <div class="hero-image">
        <div class="light-purple-circle">
          <img
            class="n2ds"
            src="/assets/images/n2ds.png"
            alt=""
          >
          <div class="deco">
            <svg
              alt=""
              xmlns="http://www.w3.org/2000/svg"
              width="839.371"
              height="893.406"
              viewBox="0 0 839.371 893.406"
            >
              <g
                id="deco"
                transform="translate(-1064.958 -142.958)"
              >
                <g
                  id="Ellipse_12"
                  data-name="Ellipse 12"
                  transform="translate(1314 265)"
                  fill="none"
                  stroke="#9d6ff3"
                  stroke-width="26"
                >
                  <circle
                    cx="56"
                    cy="56"
                    r="56"
                    stroke="none"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="69"
                    fill="none"
                  />
                </g>
                <g
                  id="Ellipse_22"
                  data-name="Ellipse 22"
                  transform="translate(1361 771)"
                  fill="none"
                  stroke="#59c9a5"
                  stroke-width="26"
                >
                  <circle
                    cx="77"
                    cy="77"
                    r="77"
                    stroke="none"
                  />
                  <circle
                    cx="77"
                    cy="77"
                    r="90"
                    fill="none"
                  />
                </g>
                <g
                  id="Ellipse_13"
                  data-name="Ellipse 13"
                  transform="translate(1801.405 273.601) rotate(1)"
                  fill="none"
                  stroke="#9d6ff3"
                  stroke-width="26"
                >
                  <circle
                    cx="23"
                    cy="23"
                    r="23"
                    stroke="none"
                  />
                  <circle
                    cx="23"
                    cy="23"
                    r="36"
                    fill="none"
                  />
                </g>
                <g
                  id="Ellipse_23"
                  data-name="Ellipse 23"
                  transform="matrix(0.839, -0.545, 0.545, 0.839, 1651.184, 609.237)"
                  fill="none"
                  stroke="#25224f"
                  stroke-width="26"
                >
                  <circle
                    cx="78.5"
                    cy="78.5"
                    r="78.5"
                    stroke="none"
                  />
                  <circle
                    cx="78.5"
                    cy="78.5"
                    r="91.5"
                    fill="none"
                  />
                </g>
                <circle
                  id="Ellipse_15"
                  class="animateDot"
                  data-name="Ellipse 15"
                  cx="23"
                  cy="23"
                  r="23"
                  transform="translate(1586.473 353) rotate(-45)"
                  fill="#9d6ff3"
                />
                <ellipse
                  id="Ellipse_21"
                  class="animateDot"
                  data-name="Ellipse 21"
                  cx="11"
                  cy="10.5"
                  rx="11"
                  ry="10.5"
                  transform="translate(1588.958 188.514) rotate(-45)"
                  fill="#9d6ff3"
                />
                <ellipse
                  id="Ellipse_25"
                  data-name="Ellipse 25"
                  cx="11"
                  cy="10.5"
                  rx="11"
                  ry="10.5"
                  transform="translate(1143.958 1021.514) rotate(-45)"
                  fill="#9d6ff3"
                />
                <ellipse
                  id="Ellipse_26"
                  data-name="Ellipse 26"
                  cx="11"
                  cy="10.5"
                  rx="11"
                  ry="10.5"
                  transform="translate(1064.958 158.514) rotate(-45)"
                  fill="#9d6ff3"
                />
                <circle
                  id="Ellipse_16"
                  class="animateDot"
                  data-name="Ellipse 16"
                  cx="23"
                  cy="23"
                  r="23"
                  transform="translate(1169.473 524) rotate(-45)"
                  fill="#59c9a5"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div class="misc">
        <div class="purple-circle" />
      </div>
    </section>

    <section class="progress column-2">
      <div class="left sect">
        <div class="left-meta">
          <h2
            id="about"
            class="dot title"
            :data-title-suffix="titleSuffixHandler('aboutUs.titleSuffix')"
          >
            {{ $t("aboutUs.title") }}
          </h2>
          <p
            v-for="i in computed(() => tm<string>('aboutUs.paragraphs') as string[]).value.length - 1"
            :key="i"
            class="text"
          >
            {{ $t(`aboutUs.paragraphs[${i}]`) }}
          </p>
        </div>
      </div>
      <div class="right sect">
        <h2 class="title">
          <a href="/progress">{{ $t("progress.title") }}</a>
        </h2>
        <!--{{> progress-list data=featuredFeatureList purple=true") }}-->
      </div>
    </section>

    <section class="faq">
      <div class="sect-top sect">
        <h2
          id="faq"
          class="dot title"
          :data-title-suffix="titleSuffixHandler('faq.titleSuffix')"
        >
          {{ $t("faq.title") }}
        </h2>
        <p class="text">
          {{ $t("faq.text") }}
        </p>
      </div>
      <div class="questions column-2">
        <div class="left questions-left">
          <details
            v-for="i in even(nOfQAs)"
            :key="i"
            class="question-and-answer"
          >
            <summary>
              {{ $t(`faq.QAs[${i}].question`) }}
            </summary>
            <p class="text">
              {{ $t(`faq.QAs[${i}].answer`) }}
            </p>
          </details>
        </div>

        <div class="right questions-right">
          <details
            v-for="i in odd(nOfQAs)"
            :key="i"
            class="question-and-answer"
          >
            <summary>
              {{ $t(`faq.QAs[${i}].question`) }}
            </summary>
            <p class="text">
              {{ $t(`faq.QAs[${i}].answer`) }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <section class="showcase">
      <div class="sect-top sect">
        <h2
          id="showcase"
          class="dot title"
          :data-title-suffix="titleSuffixHandler('showcase.titleSuffix')"
        >
          {{ $t("showcase.title") }}
        </h2>
        <p class="text">
          {{ $t("showcase.text") }}
        </p>
      </div>
      <div class="grid">
        <div class="item highlight">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="server"
            class="svg-inline--fa fa-server fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M480 160H32c-17.673 0-32-14.327-32-32V64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z"
            />
          </svg>
          <h1>{{ $t("showcase.cards.0.title") }}</h1>
          <p>{{ $t("showcase.cards.0.caption") }}</p>
        </div>
        <div class="item">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="users"
            class="svg-inline--fa fa-users fa-w-20"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          >
            <path
              fill="currentColor"
              d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"
            />
          </svg>
          <h1>{{ $t("showcase.cards.1.title") }}</h1>
          <p>{{ $t("showcase.cards.1.caption") }}</p>
        </div>
        <div class="item">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="gamepad"
            class="svg-inline--fa fa-gamepad fa-w-20"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          >
            <path
              fill="currentColor"
              d="M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"
            />
          </svg>
          <h1>{{ $t("showcase.cards.2.title") }}</h1>
          <p>{{ $t("showcase.cards.2.caption") }}</p>
        </div>
      </div>
    </section>

    <section class="team">
      <div class="sect-top sect team-top">
        <h2
          id="credits"
          class="dot title"
          :data-title-suffix="titleSuffixHandler('credits.titleSuffix')"
        >
          {{ $t("credits.title") }}
        </h2>
        <p class="text">
          {{ $t("credits.text") }}
        </p>
      </div>
      <div class="team-cards">
        <div
          v-for="i in array(maxCoreStaffIndex)"
          :key="i"
          class="card"
        >
          <div class="card-left">
            <img
              :src="$t(`credits.people[${i}].picture`)"
              class="pfp"
              alt=""
            >
          </div>
          <div class="card-core">
            <span
              v-if="$te(`credits.people[${i}].special`)"
              class="sub"
            >{{ $t(`credits.people[${i}].special`) }}</span>
            <h3 class="title">
              <span>{{ $t(`credits.people[${i}].name`) }}</span>
              <a
                :href="$t(`credits.people[${i}].github`)"
                class="github"
                target="_blank"
                aria-label="Open Github"
              >
                <svg
                  alt=""
                  data-prefix="fab"
                  data-icon="github"
                  class="svg-inline--fa fa-github fa-w-16"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                ><path
                  fill="currentColor"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                /></svg>
              </a>
            </h3>
            <p class="text">
              {{ $t(`credits.people[${i}].caption`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="team-helpers">
      <div class="sect-top sect">
        <h2
          id="special-thanks"
          class="dot title"
          :data-title-suffix="titleSuffixHandler('specialThanks.titleSuffix')"
        >
          {{ $t("specialThanks.title") }}
        </h2>
        <p class="text">
          {{ $t("specialThanks.text") }}
        </p>
      </div>
      <div class="animation-wrapper">
        <div class="row first">
          <div class="team-helpers-cards">
            <a
              v-for="i in [...even(maxContributorsIndex), ...even(maxContributorsIndex)]"
              :key="i"
              :href="$te(`specialThanks.people[${i}].github`) ? $t(`specialThanks.people[${i}].github`) : undefined"
              target="_blank"
              :class="{'helper-card': true, 'special': $te(`specialThanks.people[${i}].special`)}"
            >
              <div class="img-wrapper">
                <img
                  :src="$t(`specialThanks.people[${i}].picture`)"
                  class="pfp"
                  alt=""
                >
              </div>
              <span>{{ $t(`specialThanks.people[${i}].name`) }}</span>
              <p>{{ $t(`specialThanks.people[${i}].caption`) }}</p>
            </a>
          </div>
        </div>
        <div class="row second">
          <div class="team-helpers-cards">
            <a
              v-for="i in [...odd(maxContributorsIndex), ...odd(maxContributorsIndex)]"
              :key="i"
              :href="$te(`specialThanks.people[${i}].github`) ? $t(`specialThanks.people[${i}].github`) : undefined"
              target="_blank"
              :class="{'helper-card': true, 'special': $te(`specialThanks.people[${i}].special`)}"
            >
              <div class="img-wrapper">
                <img
                  :src="$t(`specialThanks.people[${i}].picture`)"
                  class="pfp"
                  alt=""
                >
              </div>
              <span>{{ $t(`specialThanks.people[${i}].name`) }}</span>
              <p>{{ $t(`specialThanks.people[${i}].caption`) }}</p>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="update-signup">
      <div class="sect hero-meta reduced-margin">
        <svg
          alt=""
          xmlns="http://www.w3.org/2000/svg"
          width="48.87"
          height="71.093"
          viewBox="0 0 48.87 71.093"
        >
          <g
            id="XMLID_6_"
            transform="translate(0)"
          >
            <path
              id="XMLID_15_"
              d="M69.581,29.593c-2.029,1.068-.249,4.129,1.78,3.061,5.162-2.67,11.463-2.6,16.981-1.1,4.735,1.282,9.5,3.845,12.246,8.045,1.246,1.922,4.307.142,3.061-1.78C96.921,27.386,80.3,24.04,69.581,29.593Z"
              transform="translate(-60.112 -20.086)"
              fill="#9d6ff3"
            />
            <path
              id="XMLID_14_"
              d="M103.359,21.045c-3.951-6.159-10.751-10-17.657-11.89C77.763,6.948,68.721,7.019,61.281,10.9c-2.029,1.068-.249,4.129,1.78,3.061,6.586-3.453,14.667-3.311,21.644-1.388,5.981,1.638,12.1,4.913,15.521,10.252C101.507,24.783,104.569,23,103.359,21.045Z"
              transform="translate(-54.766 -7.693)"
              fill="#9d6ff3"
            />
            <path
              id="XMLID_9_"
              d="M65.995,47.8a20.7,20.7,0,0,0-12.958,4.45H47.27a2.579,2.579,0,0,0-2.67,2.456v47.239a2.763,2.763,0,0,0,2.67,2.67h5.838a2.639,2.639,0,0,0,2.528-2.67V87.564A21.228,21.228,0,1,0,65.995,47.8Zm0,33.178a12,12,0,1,1,12-12A12,12,0,0,1,65.995,80.978Z"
              transform="translate(-44.6 -33.522)"
              fill="#9d6ff3"
            />
          </g>
        </svg>
        <h2
          id="discord-join"
          class="dot title"
          :data-title-suffix="titleSuffixHandler('discordJoin.titleSuffix')"
        >
          {{ $t("discordJoin.title") }}
        </h2>
        <p class="text">
          {{ $t("discordJoin.text") }}
        </p>
      </div>
      <div class="floating-serverjoin">
        <p>{{ $t("discordJoin.widget.text") }}</p>
        <a
          href="https://discord.gg/pretendo"
          target="_blank"
        >{{ $t("discordJoin.widget.button") }}</a>
      </div>
      <div class="circle" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.animateDot {
	animation: dotAnimation 10s infinite;
}

@keyframes dotAnimation {
	0% {
		cx: 0;
		cy: 0;
	}

	50% {
		cx: 10px;
		cy: 10px;
	}

	100% {
		cx: 0;
		cy: 0;
	}
}

.wrapper {
	width: 95%;
	max-width: 1590px;
	margin: 48px auto 0;
}

h1.dot:not([data-title-suffix]):after,
h2.dot:not([data-title-suffix]):after {
	content: ".";
	display: inline-block;
	color: var(--accent-shade-1);
}

h1.dot[data-title-suffix]:after,
h2.dot[data-title-suffix]:after {
	content: attr(data-title-suffix);
	display: inline-block;
	color: var(--accent-shade-1);
}

/* Misc */
.purple-circle {
	position: absolute;
	z-index: -2;
	width: 2100px;
	height: 1700px;
	background: var(--bg-shade-0);
	border-radius: 50%;
	top: -250px;
	right: -1420px;
}

.light-purple-circle {
	background: var(--accent-shade-3);
	width: 500px;
	height: 500px;
	position: relative;
	top: 60%;
	left: 50%;
	transform: translate(calc(-50% - 35px), -50%);
	border-radius: 50%;
	z-index: -1;
	/* Tmp */
	display: flex;
	justify-content: center;
	align-items: center;
}

.light-purple-circle .n2ds {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	margin-left: -40px;
	z-index: 1;
}

.light-purple-circle .deco {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, calc(-50% + 70px));
	z-index: -2;
}

/* Twemoji */

img.emoji {
	height: 1em;
	width: 1em;
	margin: 0 .05em 0 .1em;
	vertical-align: -0.1em;
}

/* Title business */
.sect .title[id] {
	padding-top: 100px;
	margin-top: -100px;
}

/* Hero */
.hero {
	/* height: 775px; /* To line it up with the design */
	display: grid;
	align-items: center;
	grid-template-columns: 1fr 1fr;
}

.progress-hero {
	width: 100%;
	display: flex;
	justify-items: center;
	align-items: center;
	text-align: center;
}

.progress-hero svg {
	width: 3rem;
	height: 3rem;
}

.progress-hero .text {
	max-width: 423px;
}

.progress-hero .text a {
	color: var(--accent-shade-1);
	text-decoration: none;
	font-weight: bold;
}

.progress-hero .text a:hover {
	text-decoration: underline;
}

.hero-meta {
	margin-top: 25vh;
}

.hero-meta.reduced-margin {
	margin: 10vh 0;
	width: 100%;
}

.hero-meta.reduced-margin h1 {
	width: 100%;
}

.hero-meta.reduced-margin p {
	margin: 0 auto;
}

.hero-image {
	position: relative;
	height: 100%;
}

.hero .title,
.hero .subtitle {
	margin: 0;
}

.hero .subtitle {
	font-size: 1.9rem;
	font-weight: 300;
	margin-bottom: -0.5em;
}

.hero .title {
	font-size: 4rem;
}

.text {
	font-size: 1rem;
	color: var(--text-shade-1);
	width: 86%;
	line-height: 1.8;
	margin: 0;
	margin-top: 0.5rem;
}

/*
	BUTTONS
*/
.hero .buttons {
	margin-top: 40px;
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
}

.hero .buttons a {
	text-decoration: none;
}

.hero .button.secondary {
	padding: 0;
}

.button.secondary.discord svg {
	margin-bottom: -1px;
}

.do-button-margin {
	margin-bottom: 15px;
	margin-right: 15px;
}

/* Non-hero sections */
.sect .title {
	font-size: 3.125rem;
}

section.progress {
	margin-top: 400px;
}

.column-2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
}

.sect .title {
	margin: 0;
}

.sect .text {
	margin: 22px 0;
	width: 64%;
	line-height: 1.7;
}

section.progress .left,
section.progress .right {
	padding: 50px 0;
}

section.progress .right {
	position: relative;
	padding-left: 80px;
	background: var(--accent-shade-0);
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}

section.progress .right .title a {
	text-decoration: none;
	color: var(--text-shade-3);
}

section.progress .right .title a:hover {
	text-decoration: underline;
}

section.progress .right:before {
	content: "";
	width: 300vw;
	position: absolute;
	height: 100%;
	background: yellow;
	left: 90%;
	margin-top: -50px;
	background: var(--accent-shade-0);
	z-index: -1;
}

section.faq {
	margin-top: 200px;
}

.questions {
	margin-top: 30px;
	grid-gap: 30px;
}

.questions>div>*+* {
	margin-top: 15px;
}

.question-and-answer summary {
	font-size: 1.5625rem;
	color: var(--text-shade-2);
}

.question-and-answer[open] summary {
	color: var(--text-shade-3);
}

.question-and-answer summary:hover {
	color: var(--text-shade-3);
	text-decoration: underline;
	cursor: pointer;
}

.question-and-answer .text {
	margin: 5px 0;
	line-height: 1.85;
	color: var(--text-shade-0);
}

.question-and-answer .text a {
	color: var(--accent-shade-1);
	text-decoration: none;
	font-weight: bold;
}

.question-and-answer .text a:hover {
	text-decoration: underline;
}

section.showcase {
	position: relative;
	margin-top: 160px;
	padding: 220px 0;
}

section.showcase::before {
	content: "";
	width: 400vw;
	margin-left: -50vw;
	background: linear-gradient(180deg, rgba(19, 22, 36, 0) 0%, var(--bg-shade-0) 100%);
	position: absolute;
	top: 0;
	bottom: 0;
	z-index: -1;
}

section.showcase .text {
	max-width: 504px;
	margin-bottom: 132px;
}

section.showcase .grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 24px;
}

section.showcase .grid .item {
	background: var(--bg-shade-2);
	border-radius: 10px;
	padding: 42px 36px;
}

section.showcase .grid .item.highlight {
	border: 2px solid var(--accent-shade-1);
}

section.showcase .grid .item svg {
	height: 36px;
	color: var(--accent-shade-1);
}

section.showcase .grid .item h1 {
	margin-top: 14px;
	margin-bottom: 6px;
	font-weight: 600;
}

section.showcase .grid .item p {
	margin: 0;
	color: var(--text-shade-1)
}

section.team {
	margin-top: 220px;
}

.team .team-top {
	text-align: center;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.team .team-top .text {
	width: 24%;
	margin: 0;
	margin-top: 6px;
}

.team .team-top .title {
	width: 100%;
}

.team-cards {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin: -10px;
	margin-top: 80px;
}

.team-cards .card {
	margin: 10px;
}

.card {
	width: calc(100% - 54px);
	min-width: 100px;
	max-width: 460px;
	padding: 18px 27px;
	display: grid;
	grid-template-columns: 110px 1fr;
	grid-gap: 20px;
	background: var(--bg-shade-0);
	grid-column: span 2;
	border-radius: 10px;
	align-items: center;
}

.card .card-left {
	background: white;
	border-radius: 12px;
}

.card .pfp {
	width: 100%;
	border-radius: 10px;
	display: block;
}

.card .text,
.card .title {
	margin: 0;
}

.card .sub {
	color: var(--green-shade-1);
	font-size: .875rem;
}

.card .title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 5px;
}

.card .github {
	text-decoration: none;
	color: inherit;
}

.card .github svg {
	width: 1.5em;
	height: 1.5em;
	display: block;
}

.card .text {
	color: var(--text-shade-1);
}

section.team-helpers {
	position: relative;
	margin-top: 160px;
	overflow: hidden;
}

section.team-helpers .text {
	max-width: 504px;
	margin-bottom: 132px;
}

section.team-helpers .team-helpers-cards {
	display: inline-grid;
	grid-template-columns: repeat(21, 1fr);
	grid-gap: 20px;
	margin-right: 20px;
	color: var(--text-shade-1);
	width: max-content;
}

section.team-helpers .row {
	width: fit-content;
}

section.team-helpers .row.first {
	animation: infiniteScrollRow1 25s linear infinite;
}

section.team-helpers .row.second {
	animation: infiniteScrollRow2 25s linear infinite;
}

@keyframes infiniteScrollRow1 {
	0% {
		transform: translate3d(0);
	}

	100% {
		transform: translate3d(calc(100% / -3), 0, 0);
	}
}

@keyframes infiniteScrollRow2 {
	0% {
		transform: translate3d(calc(100% / -3), 0, 0);
	}

	100% {
		transform: translate3d(0, 0, 0);
	}
}

section.team-helpers .animation-wrapper {
	transform: rotate(-5deg);
	position: relative;
	top: -90px;
	padding: 20px;
	/* Needed for the star not to get cut off */
}

section.team-helpers .animation-wrapper::after {
	content: "";
	position: absolute;
	top: 0;
	width: 101%;
	/* If set to 100% it doesn't cover it completely */
	left: -0.5%;
	height: 100%;
	background: linear-gradient(90deg, var(--bg-shade-1) 0%, rgba(27, 31, 59, 0) 20%, rgba(27, 31, 59, 0) 80%, var(--bg-shade-1) 100%);
	z-index: 1;
	pointer-events: none;
}

/* This fixes overflow-x: hidden; not working correctly on Firefox (https://i.imgur.com/TpM0CEB.png)
 * and WebKit (https://i.imgur.com/290nYsb.png) */
section.team-helpers .animation-wrapper .row-wrapper {
	position: relative;
	padding: 20px;
	width: 100%;
	height: 100%;
}

section.team-helpers .animation-wrapper .row-wrapper::before {
	content: "";
	position: absolute;
	top: 0;
	width: 100%;
	left: calc(-100% - 20px);
	height: 100%;
	background: var(--bg-shade-1);
	z-index: 2;
	pointer-events: none;
}

section.team-helpers .animation-wrapper .row-wrapper::after {
	content: "";
	position: absolute;
	top: 0;
	width: 100%;
	left: calc(100% - 20px);
	height: 100%;
	background: var(--bg-shade-1);
	z-index: 2;
	pointer-events: none;
}

section.team-helpers .animation-wrapper .row {
	white-space: nowrap;
}

section.team-helpers .animation-wrapper .row.second {
	margin-top: 20px;
}

section.team-helpers .helper-card {
	text-decoration: none;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 14px 24px;
	background: var(--bg-shade-0);
	border-radius: 12px;
	min-width: 480px;
}

section.team-helpers .helper-card:hover {
	background: var(--bg-shade-2);
	transition: 200ms;
}

section.team-helpers .helper-card.special {
	position: relative;
	box-shadow: 0px 0px 0px 2px rgba(211, 225, 87, 0.6) inset;
}

section.team-helpers .helper-card.special::after {
	content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='31.571' height='30.218' viewBox='0 0 31.571 30.218'%3E%3Cpath id='Icon_awesome-star' data-name='Icon awesome-star' d='M15.533,1.05,11.68,8.863,3.058,10.12a1.889,1.889,0,0,0-1.044,3.222L8.251,19.42,6.776,28.006A1.887,1.887,0,0,0,9.514,30l7.713-4.054L24.94,30a1.889,1.889,0,0,0,2.738-1.989L26.2,19.42l6.237-6.078A1.889,1.889,0,0,0,31.4,10.12L22.774,8.863,18.92,1.05a1.89,1.89,0,0,0-3.387,0Z' transform='translate(-1.441 0.001)' fill='%23d3e848'/%3E%3C/svg%3E%0A");
	position: absolute;
	width: 30px;
	height: 30px;
	top: -13px;
	right: -13px;
}

section.team-helpers .row.second .helper-card {
	position: relative;
	left: calc(-250% - 50px);
}

section.team-helpers .helper-card .img-wrapper {
	background: #fff;
	border-radius: 100%;
	margin-right: 14px;
	width: 48px;
	height: 48px;
}

section.team-helpers .helper-card .pfp {
	border-radius: 100%;
	width: 48px;
	height: 48px;
}

section.team-helpers .helper-card span {
	color: var(--text-shade-3);
	font-weight: 600;
	margin-right: 0.6ch;
}

section.team-helpers .helper-card p {
	color: var(--text-shade-1);
}

section.update-signup {
	position: relative;
	width: 100%;
	display: flex;
	flex-flow: column;
	justify-items: center;
	align-items: center;
	text-align: center;
	margin-top: 160px;
	padding-top: 240px;
	padding-bottom: 300px;
}

section.update-signup svg {
	width: 4rem;
	height: 4rem;
	margin-bottom: 42px;
}

section.update-signup .text {
	margin-top: 8px;
	max-width: 423px;
}

section.update-signup .floating-serverjoin {
	display: grid;
	grid-template-columns: repeat(2, auto);
	gap: 18px;
	width: 100%;
	max-width: 576px;

	background: var(--bg-shade-0);
	border-radius: 6px;
	padding: 18px;

	overflow-x: hidden;
}

section.update-signup .floating-serverjoin p {
	color: var(--text-shade-1);
	margin: auto;
	margin-left: 0;
}

section.update-signup .floating-serverjoin a {
	color: var(--text-shade-3);
	text-decoration: none;
	background: var(--accent-shade-0);
	margin: 0;
	margin-left: auto;
	padding: 9px 18px;
	border-radius: 5px;
	width: fit-content;
	height: fit-content;
}

section.update-signup div.circle {
	display: block;
	background: var(--bg-shade-2);
	/* the next 4 lines make it so the circle is always the same aspect ratio and covers enough of the screen */
	width: 2591px;
	height: 1454px;
	min-width: 145vw;
	min-height: 13vw;
	/* yes, this is supposed to be in vw */
	border-radius: 100%;
	position: absolute;
	top: 0;
	z-index: -1;
}
</style>

<style lang="scss">
@media screen and (min-width: 701px) and (max-width: 1500px) {
	#root {
		.light-purple-circle {
			width: 400px;
			height: 400px;
		}

		img.n2ds {
			width: 432px;
		}

		.deco svg {
			transform: scale(0.8);
			/* :/ */
		}

		.purple-circle {
			right: auto;
			left: 60vw;
		}
	}
}

@media screen and (max-width: 900px) {
	#root {
		.all-progress-lists {
			grid-template-columns: 100%;
		}

		.feature-list-wrapper {
			grid-template-columns: 100%;
		}

		.donation-progress {
			grid-column: span 1;
			padding: 50px 20px;
		}

		.hero-meta {
			margin-top: 100px;
		}

		.wrapper {
			width: 90%;
		}

		.hero-image {
			display: none;
		}

		.hero .text {
			width: 100%;
		}

		.misc {
			display: none;
		}

		.column-2,
		.hero {
			grid-template-columns: 100%;
			grid-gap: 15px;
		}

		.button.primary {
			padding: 8px 27px;
		}

		.button.secondary.icon-btn {
			width: 41px !important;
			height: 41px !important;
		}

		.button.icon-btn svg {
			min-width: 30px;
			width: 30px;
			min-height: 30px;
			height: 30px;
		}

		section.progress {
			margin-top: 100px;
		}

		section.progress .right:before {
			content: none;
		}

		section.progress .right {
			padding: 50px 20px;
			border-radius: 10px;
		}

		.sect .text {
			width: 100%;
		}

		.question-and-answer summary {
			font-size: 1.1rem;
		}

		section.showcase {
			margin-top: 0;
		}

		section.showcase .grid {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(3, 1fr);
		}

		section.team,
		section.team-helpers {
			margin-top: 100px;
		}

		.team .team-top .text {
			width: 100%;
		}

		section.team-helpers .sect-top {
			text-align: center;
		}

		section.team-helpers .sect-top .text {
			width: 100%;
			max-width: none;
		}

		section.team-helpers .animation-wrapper {
			transform: none;
			overflow-x: visible;
			margin-left: -10vw;
			/* Fixes the loop being visible */
		}

		section.team-helpers .animation-wrapper::after {
			background: none;
		}

		/* Hides workaround on mobile */
		section.team-helpers .animation-wrapper .row-wrapper::before,
		section.team-helpers .animation-wrapper .row-wrapper::after {
			content: none;
		}

		section.update-signup {
			margin-top: 0;
			padding-top: 90px;
			padding-bottom: 90px;
		}

		.text {
			width: 100%;
		}
	}
}

@media screen and (max-width: 580px) {
	#root {
		.sect .title {
			font-size: 2rem;
		}

		h1.dot:not([data-title-suffix]):after,
		h2.dot:not([data-title-suffix]):after {
			width: 0.5rem;
			height: 0.5rem;
		}

		.hero .title {
			font-size: 2.5rem;
		}

		.hero .subtitle {
			font-size: 1.5rem;
		}

		section.showcase {
			padding: 160px 0;
		}

		section.showcase p.text {
			margin-bottom: 82px;
		}

		section.showcase .grid .item {
			padding: 24px 24px;
		}

		.team .team-top {
			text-align: left;
		}

		.team-cards .card {
			grid-template-columns: 60px 1fr;
			width: calc(95vw - 36px);
			margin-left: -1vw;
			margin-right: -1vw;
			padding: 18px;
			max-width: none;
		}

		section.team-helpers .team-helpers-cards {
			grid-gap: 12px;
			margin-right: 12px;
		}

		section.team-helpers .animation-wrapper .helper-card {
			padding: 7px 18px;
		}

		section.team-helpers .animation-wrapper .row.second {
			margin-top: 12px;
		}

		section.update-signup .floating-serverjoin {
			width: calc(100% - 36px);
			grid-template-columns: 1fr;
			grid-template-rows: repeat(2, fit-content(100%));
		}

		section.update-signup .floating-serverjoin>* {
			margin: auto !important;
		}
	}
}

@media screen and (min-width: 2256px) {
	#root {
		.purple-circle {
			display: none;
		}
	}
}
</style>
