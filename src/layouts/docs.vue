<script setup lang="ts">
const { te, t, tm } = useI18n();

const path = useRoute().fullPath;

const isSidebarOpen = ref(false);

useHead({
	titleTemplate: (titleChunk) => {
		return titleChunk
			? `${titleChunk} | Docs | Pretendo Network`
			: "Docs | Pretendo Network";
	},
});
</script>

<template>
	<div id="root" class="main-body">
		<div class="docs-wrapper">
			<a href="/" class="logo-link">
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
						<g id="logo" transform="translate(553 467)">
							<rect
								id="XMLID_158_"
								width="39.876"
								height="39.876"
								fill="#9d6ff3"
								opacity="0"
							/>
							<g id="XMLID_6_" transform="translate(8.222 1.418)">
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
							<tspan x="0" y="0">Pretendo</tspan>
						</text>
					</g>
				</svg>
			</a>

			<div class="header-wrapper">
				<button
					id="openSidebar"
					class="nostyle"
					@click="() => (isSidebarOpen = !isSidebarOpen)"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather feather-menu"
					>
						<line x1="3" y1="12" x2="21" y2="12" />
						<line x1="3" y1="6" x2="21" y2="6" />
						<line x1="3" y1="18" x2="21" y2="18" />
					</svg>
				</button>
				<Navbar />
			</div>

			<div :class="{ sidebar: true, open: isSidebarOpen }">
				<div class="section">
					<h5>{{ $t("docs.sidebar.getting_started") }}</h5>

					<a
						v-for="link in [
							{ n: $t('docs.sidebar.welcome'), l: '/docs/welcome' },
							{ n: $t('docs.sidebar.install_extended'), l: '/docs/install' },
							{ n: $t('docs.sidebar.search'), l: '/docs/errors' },
						]"
						:key="link.l"
						:class="{ active: path === link.l }"
						:href="link.l"
						>{{ link.n }}</a
					>
				</div>

				<div class="section">
					<h5>{{ $t("docs.sidebar.install") }}</h5>
					<a
						v-for="link in [
							{ n: 'Wii U', l: '/docs/install/wiiu' },
							{ n: '3DS', l: '/docs/install/3ds' },
							{ n: 'Cemu', l: '/docs/install/cemu' },
							{ n: 'Azahar', l: '/docs/install/azahar' },
							{ n: 'Miiverse', l: '/docs/install/juxt' },
							{ n: 'Submit network dumps', l: '/docs/network-dumps' },
						]"
						:key="link.l"
						:class="{ active: path === link.l }"
						:href="link.l"
						>{{ link.n }}</a
					>
				</div>
			</div>

			<div :class="{ content: true, 'open-sidebar': isSidebarOpen }">
				<slot />
			</div>
		</div>
	</div>
</template>

<style scoped>
html,
body,
div.main-body {
	height: 100vh;
	background: var(--bg-shade-0);
}

a.logo-link {
	margin: auto;
	margin-left: 36px;
	height: 40px;
	text-decoration: none;
}

button#openSidebar {
	display: none;
}

.docs-wrapper .header-wrapper {
	width: 100%;
}

.docs-wrapper :deep(.content-inner:not(.search)) a {
	text-decoration: none;
	font-weight: bold;
	color: var(--accent-shade-1);
}

.docs-wrapper :deep(header) {
	position: relative;
	box-sizing: border-box;
	margin: 20px;
	left: 0 !important;
}

.docs-wrapper :deep(header) #mobile-button,
.docs-wrapper :deep(header) .logo-link {
	display: none !important;
}

.docs-wrapper header::before {
	content: none;
	background: none;
	pointer-events: none;
}
.docs-wrapper header a.logo-link {
	display: none;
}
.docs-wrapper header nav a:first-child {
	margin-left: 0;
}

.docs-wrapper {
	display: grid;
	grid-template-columns: fit-content(100%) auto;
	grid-template-rows: fit-content(100%) auto;
	height: 100%;
}

.docs-wrapper .sidebar {
	display: flex;
	flex-flow: column;
	align-items: center;
	width: clamp(270px, 25vw, 500px);
	overflow-y: scroll;
	overflow-x: hidden;
	min-height: 100%;
}
.docs-wrapper .sidebar .section {
	display: flex;
	flex-flow: column;
	width: 200px;
	margin-left: clamp(60px, 10vw, 138px);
	margin-bottom: 72px;
}
.docs-wrapper .sidebar .section:first-child {
	margin-top: 72px;
}
.docs-wrapper .sidebar .section h5 {
	margin: 0;
	font-weight: normal;
	text-transform: uppercase;
	color: var(--text-shade-0);
	margin-bottom: 12px;
}
.docs-wrapper .sidebar .section a {
	position: relative;
	text-decoration: none;
	color: var(--text-shade-1);
	width: fit-content;
	margin-bottom: 12px;
}
.docs-wrapper .sidebar .section a.active,
.docs-wrapper .sidebar .section a:hover {
	color: var(--text-shade-3);
}
.docs-wrapper .sidebar .section a.active::before {
	/* This filter thing is jank, if anyone knows a better way to do this please fix */
	filter: invert(51%) sepia(12%) saturate(2930%) hue-rotate(218deg)
		brightness(99%) contrast(92%);
	position: absolute;
	left: -30px;
	content: url(/assets/images/docs/arrow-right.svg);
}

.docs-wrapper :deep(.content) {
	background: var(--bg-shade-1);
	padding: 72px;
	max-height: 100%;
	overflow-y: scroll;
	border-top-left-radius: 8px;
}
.docs-wrapper :deep(.content-inner) {
	max-width: 900px;
}
.docs-wrapper :deep(.content) p {
	color: var(--text-shade-1);
}
.docs-wrapper :deep(.content) h1:first-child {
	margin-top: 0;
}
.docs-wrapper :deep(.content) .quick-links-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 24px;
	margin-bottom: 60px;
}
.docs-wrapper :deep(.content) .quick-links-grid a {
	text-decoration: none;
	background: var(--bg-shade-2);
	border-radius: 6px;
	color: var(--text-shade-1);
	display: flex;
	align-items: center;
	padding: 20px;
}
.docs-wrapper :deep(.content) .quick-links-grid svg:first-child {
	height: 36px;
	margin-right: 24px;
	margin-left: 4px;
	color: var(--accent-shade-2);
}
.docs-wrapper :deep(.content) .quick-links-grid p.header {
	font-size: 22px;
	font-weight: 600;
	color: var(--text-shade-3);
	margin: 0;
}
.docs-wrapper :deep(.content) .quick-links-grid p {
	margin: 0;
}
.docs-wrapper :deep(.content) .quick-links-grid svg:last-child {
	height: 36px;
	margin-left: auto;
}

.docs-wrapper :deep(.content) .content-inner div.tip {
	position: relative;
	width: 100%;
	padding: 36px;
	background: var(--bg-shade-2);
	border-radius: 8px;
	overflow: hidden;
	border: var(--accent-shade-2);
	margin: 24px 0;
	box-sizing: border-box;
}

.docs-wrapper :deep(.content) .content-inner div.tip::after {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 12px;
	background: var(--accent-shade-2);
	opacity: 1;
}
.docs-wrapper :deep(.content) .content-inner div.tip.yellow::after {
	background: var(--yellow-shade-1);
}
.docs-wrapper :deep(.content) .content-inner div.tip.red::after {
	background: var(--red-shade-1);
}
.docs-wrapper :deep(.content) .content-inner div.tip.green::after {
	background: var(--green-shade-1);
}

.docs-wrapper :deep(.content) .content .missing-in-locale-notice {
	background: var(--bg-shade-2);
	padding: 24px;
	border-radius: 6px;
}

:deep(.content) .platform-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 24px;
	margin-top: 36px;
}

.docs-wrapper :deep(.content) .platform-grid a {
	text-decoration: none;
	background: var(--bg-shade-3);
	border-radius: 12px;
	color: var(--text-shade-4) !important;
	display: grid;
	grid-template-rows: auto fit-content(100%);
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 36px;
	padding-bottom: 24px;
	gap: 24px;
}

:deep(.content) .platform-grid a img {
	width: 180px;
	max-width: 100%;
	height: auto;
}
:deep(.content) .platform-grid a span {
	margin-top: auto;
	font-size: 1.2rem;
}

@media screen and (max-width: 1296px) {
	.docs-wrapper :deep(.content) {
		padding: 48px;
	}
}

@media screen and (max-width: 1080px) {
	.docs-wrapper .header-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		width: 100vw;
	}

	button#openSidebar {
		display: block;
		padding: 0;
		margin: 0;
		margin-left: 20px;
		background: none;
	}

	.docs-wrapper header {
		margin-left: 20px;
		width: 100%;
		left: 0;
	}

	.docs-wrapper {
		margin-top: 80px;
		height: calc(100% - 80px);
	}

	a.logo-link {
		display: none;
	}
	.docs-wrapper header a.logo-link {
		display: block;
		height: 40px;
		margin: 0;
		margin-right: 34px;
	}

	.docs-wrapper .sidebar {
		grid-column: 1 / span 1;
		grid-row: 2 / span 1;
		width: 0;
		transition: width 250ms;
	}

	.docs-wrapper .sidebar.open {
		width: min(300px, 100vw);
	}

	.docs-wrapper :deep(.content) {
		width: 100vw;
		box-sizing: border-box;
		border-top-left-radius: 0;
		grid-column: 2 / span 1;
		grid-row: 2 / span 1;
	}
	.docs-wrapper :deep(.content.open-sidebar) {
		border-top-left-radius: 8px;
	}
	.docs-wrapper :deep(.content) .content-inner {
		max-width: none;
	}
}

@media screen and (max-width: 900px) {
	.docs-wrapper header button.dropdown-button#mobile-button {
		display: none;
	}
	.docs-wrapper header .logo-link svg text {
		display: block;
	}
	.docs-wrapper header .logo-link svg {
		width: 120px;
	}
}

@media screen and (max-width: 820px) {
	.docs-wrapper :deep(.content) .quick-links-grid,
	.platform-grid {
		grid-template-columns: 1fr;
		grid-auto-rows: 1fr;
	}

	.docs-wrapper header a.logo-link {
		margin-right: 6px;
	}
}

@media screen and (max-width: 576px) {
	.docs-wrapper header div.dropdown {
		left: calc(-39.876px - 6px - 30px - 40px);
	}
}

@media screen and (max-width: 492px) {
	.docs-wrapper :deep(.content) {
		padding: 36px;
	}

	header .logo-link svg text {
		display: none;
	}
	header .logo-link svg {
		width: 39.876px;
	}
	.docs-wrapper header a.logo-link {
		margin-right: 0;
	}
}

@media screen and (max-width: 360px) {
	.docs-wrapper :deep(.content) {
		padding: 24px;
	}
}

/* Scrollbar styling 'cause it's fancy */
.docs-wrapper .sidebar::-webkit-scrollbar,
.docs-wrapper :deep(.content::-webkit-scrollbar),
.docs-wrapper :deep(.content) pre code::-webkit-scrollbar,
:deep(.content) .search .input-wrapper .matches::-webkit-scrollbar {
	width: 12px;
	height: 12px;
}
.docs-wrapper .sidebar::-webkit-scrollbar-track,
.docs-wrapper :deep(.content::-webkit-scrollbar-track),
.docs-wrapper :deep(.content) pre code::-webkit-scrollbar-track,
:deep(.content) .search .input-wrapper .matches::-webkit-scrollbar-track {
	background: none;
}
.docs-wrapper .sidebar::-webkit-scrollbar-thumb,
.docs-wrapper :deep(.content::-webkit-scrollbar-thumb),
.docs-wrapper :deep(.content) pre code::-webkit-scrollbar-thumb,
:deep(.content) .search .input-wrapper .matches::-webkit-scrollbar-thumb {
	background-color: var(--text-shade-0);
	border-radius: 24px;
	border: 3px solid var(--bg-shade-0);
}
.docs-wrapper :deep(.content::-webkit-scrollbar-thumb) {
	border: 3px solid var(--bg-shade-1);
}
.docs-wrapper :deep(.content) pre code::-webkit-scrollbar-thumb,
:deep(.content) .search .input-wrapper .matches::-webkit-scrollbar-thumb {
	border: 3px solid var(--bg-shade-2);
}

.docs-wrapper .sidebar,
:deep(.content) .search .input-wrapper .matches {
	scrollbar-width: thin;
	scrollbar-color: var(--text-shade-0) var(--bg-shade-1);
}
.docs-wrapper :deep(.content) {
	scrollbar-width: thin;
	scrollbar-color: var(--text-shade-0) var(--bg-shade-1);
}
.docs-wrapper :deep(.content) pre code {
	scrollbar-width: thin;
	scrollbar-color: var(--text-shade-0) var(--bg-shade-0);
}

:deep(.content) table {
	border-radius: 4px;
	border-collapse: collapse;
	background: var(--bg-shade-3);
	margin-bottom: 30px;
	overflow: hidden;
}

:deep(.content) table th {
	padding: 8px 12px;
	/* background: var(--bg-shade-4); */
	color: var(--text-shade-3);
}

:deep(.content) table td {
	padding: 8px 12px;
	vertical-align: top;
	border-radius: inherit;
}

:deep(.content) table tr:nth-child(even) {
	background: var(--bg-shade-2);
}
</style>
