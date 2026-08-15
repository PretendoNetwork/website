<script lang="ts" setup>
useHead({
	/* if my adobe subscription ever expires we'll be in trouble */
	link: [{ rel: 'stylesheet', href: 'https://use.typekit.net/gok5tsu.css' }]
});

</script>

<template>
  <div>
    <div class="announcement-hero new-font">
      <p><span class="pretendo">Pretendo Network</span> is now</p>
      <h1 class="new-font">
        Nintendo Switch Online<br>+<br>Legacy Pack!
      </h1>
    </div>

    <div class="subscribe bro-what new-font">
      <h1>
        Power up now with one easy click!
        <a href="#footnote-1">
          <sup>1</sup>
        </a>
      </h1>

      <a
        href="https://youtu.be/2Gc5cuekQto?t=10"
        class="buy-now"
        target="_blank"
      >
        <button class="button primary">
          Buy now
        </button>
      </a>
    </div>

    <div class="bro-what new-font">
      <h1>What is Nintendo Switch Online + Legacy Pack?</h1>
      <p>
        Nintendo Switch Online + Legacy Pack is the new membership that gives you access to all first-party online servers for Nintendo Wii U and Nintendo 3DS, with no added costs
        <a href="#footnote-2">
          <sup>2</sup>
        </a>
        !
      </p>

      <p>
        Experience the Nintendo Wii U's infinite
        <a href="#footnote-3">
          <sup>3</sup>
        </a>
        library of first party games like never before, with fan-favorite titles such as Mario Kart 8 and Super Mario Maker making a return, and challenge your friends on the go with the Nintendo 3DS's Super Smash Bros. and Miitopia!
      </p>
    </div>

    <div class="bro-what dotted-bg new-font">
      <h1>Why subscribe to Nintendo Switch Online + Legacy Pack when the online servers are still up and most first-party games have already been ported to the Nintendo Switch?</h1>
      <p>Uhhhhhhhhhhhhhhhhh next question.</p>
    </div>

    <div class="bro-what new-font">
      <h1>Is this an April Fools' joke?</h1>
      <p>
        No.
        <a href="#footnote-4">
          <sup>4</sup>
        </a>
        <br>
        We've been working closely with Nintendo behind the scenes for quite some time
        <a href="#footnote-5">
          <sup>5</sup>
        </a>
        , and today's date was chosen completely at random. You can check out Nintendo's announcement in the latest Nintendo Direct here: <a
          href="https://youtu.be/yPYZpwSpKmA"
          target="_blank"
        >What you need to know about the new Nintendo Switch Online + Legacy Pack membership plan.</a>
      </p>
    </div>

    <div class="bro-what footnotes new-font">
      <p id="footnote-1">
        <sup>1</sup> May require signing your soul over to Nintendo Co., Ltd.
      </p>
      <p id="footnote-2">
        <sup>2</sup> Excluding costs for other subscriptions required to use the Nintendo Switch Online + Legacy Pack subscription plan. Required subscriptions include but are not limited to: Nintendo Switch Online, Nintendo Switch Online + Expansion Pack, Nintendo Switch Online + Rumble Pak, Nintendo Switch Online + Offline Play Pack, Nintendo Switch Online + Yet Another Port Pack, Nintendo Switch Online + Dr. Kawashima's Brain Training / Brain Age "You Really Liked The Nintendo Wii U Virtual Console Title, So We're Bringing It Back" Pack. Total costs (Excl. Tax) $299.99 billed twice every 2 months.
      </p>
      <p id="footnote-3">
        <sup>3</sup> Statement not legally binding. Rounding up.
      </p>
      <p id="footnote-4">
        <sup>4</sup> For legal reasons, that's a joke.
      </p><p id="footnote-5">
        <sup>5</sup> Pretendo Network is in no way associated with Nintendo Co., Ltd. or any of its subsidiaries.
      </p>
      <p>Nintendo, Nintendo Wii U, Nintendo 3DS, Mario Kart 8, Super Mario Maker, Super Smash Bros., Miitopia, Nintendo Switch, Nintendo Switch Online, Nintendo Switch Online +, Nintendo Switch Online + Expansion Pack, and Rumble Pak are copyrights of Nintendo Co., Ltd. and/or its subsidiaries.<br>Happy April Fools'!</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.new-font {
	font-family: museo-sans, 'Poppins', sans-serif;
}

.pretendo {
	font-family: Poppins, Arial, Helvetica, sans-serif;
	font-weight: 700;
}

.announcement-hero {
	position: relative;
	text-align: center;
	padding: 96px 0;
	margin: 115px 0 24px;
}
.announcement-hero p {
	font-size: 24px;
	margin: 0;
	margin-bottom: 24px;
}
.announcement-hero h1 {
	font-size: 450%;
	margin: 0;
}
.announcement-hero::before {
	content: "";
	position: absolute;
	width: 500vw;
	height: 100%;
	top: 0;
	left: -50vw;
	background: var(--accent-shade-0);
	z-index: -1;
}

.bro-what.subscribe {
	padding-top: 0;
	display: flex;
}
.bro-what.subscribe h1 {
	margin: 0;
	margin-right: 12px;
	width: fit-content;
}
.buy-now {
	margin-left:auto;
}
.buy-now button {
	cursor: pointer;
	width: max-content;
	height: 100%;
}

.bro-what {
	padding: 48px;
}
.bro-what a {
	color: inherit;
	text-decoration: none;
	font-weight: 700;
}

.dotted-bg {
	position: relative;
}
.dotted-bg::before {
	content: "";
	position: absolute;
	width: 500vw;
	height: 100%;
	top: 0;
	left: -50vw;
	background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='6' height='6' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform=''%3E%3Crect width='100%25' height='100%25' fill='rgba(27, 31, 59,1)'/%3E%3Ccircle cx='20' cy='20' r='11' fill='rgba(103, 61, 182,0.4)'/%3E%3Cpath d='M9 20aInfinityInfinity 0 0 0InfinityNaNaInfinityInfinity 0 0 0-InfinityNaN' fill='%23ecc94b'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ");
	z-index: -1;
}

.footnotes {
	color: var(--text-shade-1);
}

@media screen and (max-width: 946px) {
	.announcement-hero {
		margin-top: 36px;
	}
	header nav a:not(.keep-on-mobile) {
		display: none;
	}

	.announcement-hero h1 {
		font-size: 350%;
	}
}

@media screen and (max-width: 724px) {
	header .logo-link svg text {
		display: none;
	}

	header .logo-link svg {
		width: 39.876px;
	}

	header .logo-link {
		margin-right: 10px;
	}
	header nav a {
		margin: 0 10px;
	}

	.announcement-hero h1 {
		font-size: 250%;
	}
	.announcement-hero p {
		font-size: 18px;
	}
}

@media screen and (max-width: 600px) {
	.bro-what.subscribe {
		flex-flow: column;
	}

	.bro-what a,
	.buy-now button {
		width: 100%;
	}

	.bro-what a {
		margin-top: 24px;
	}

	.announcement-hero {
		padding: 72px 0;
	}
}

@media screen and (max-width: 480px) {
	.bro-what {
		padding: 36px 0;
	}
}
</style>
