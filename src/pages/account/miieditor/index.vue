<script setup lang="ts">
import Mii from '@pretendonetwork/mii-js';
import { decode } from 'base64-arraybuffer';
// we don't want the navbar or the footer
import type { Subtab, Tab } from '@/utils/miieditor';
// eslint-disable-next-line import/no-unresolved -- i genuinely don't know why this errors
import BirthdaySetter from '@/components/BirthdaySetter/BirthdaySetter.vue';
// eslint-disable-next-line import/no-unresolved -- i genuinely don't know why this errors either
import { miiEditorJSON } from '@/utils/miieditor';

const { t } = useI18n();

definePageMeta({
	layout: 'slot-only'
});

useHead({
	title: 'Mii Editor | Pretendo Network'
});

// TODO: literally all the backend stuff
const fallbackMiiData =
	'AwAAQAv2wynGR3Ey3nx8x0TUPW1ZpQAAqV1LAGkAcAAAAAAAAAAAAAAAAAAAAH9GCABlCTFmYxgzY0QUhhAIZg0AACkAUmVRbABpAG0AZQBzAC4AcABpAG4AawAAAI7q';
const miiDataString: string = fallbackMiiData;

// keeps track of tabs and pagination
const activeTab = ref<string>('save');
const activeSubTab = ref<string>('info');
const activeSubPage = ref<number>(0);
// mii rendering business
const mii = ref<any>(null);
const miiCanvas = ref<any>(null);
const miiFaceUrl = ref<string>('');
const miiBodyUrl = ref<string>('');
const loadingCanvas = ref<boolean>(false);
// these are used in the save modal
const saving = ref<boolean>(false);
let oldMii: Mii | null = null;
const oldMiiNeutralUrl = computed(() => {
	return oldMii?.studioUrl({
		width: 512,
		bgColor: '13173300'
	});
});
const oldMiiSorrowUrl = computed(() => {
	return oldMii?.studioUrl({
		width: 512,
		bgColor: '13173300',
		expression: 'sorrow'
	});
});
const newMiiNeutralUrl = computed(() => {
	return mii.value.studioUrl({
		width: 512,
		bgColor: '13173300'
	});
});
const newMiiSmileUrl = computed(() => {
	return mii.value.studioUrl({
		width: 512,
		bgColor: '13173300',
		expression: 'smile'
	});
});

// this initalizes a mii for editing
// returns true if mii data was parsed successfully
function initializeMiiData(encodedUserMiiData: string) {
	console.group('initalizing Mii data');
	console.log('encoded mii data:', encodedUserMiiData);

	// We initialize the Mii object
	try {
		console.log('attempting to parse mii data');
		// @ts-expect-error -- this works just fine
		const tempMii = new Mii(decode(miiDataString));
		mii.value = tempMii;
		// we also initialize the old mii variable, which will be used to render the miis in the save dialogue
		oldMii = tempMii;
	} catch (err) {
		console.error('failed to decode mii data', err);
		console.groupEnd();
		return false;
	}

	console.log('initialization complete');
	console.groupEnd();
	return true;
}

// is valid mii data
const validMiiData = initializeMiiData(miiDataString);
if (!validMiiData) {
	const shouldContinue = window.confirm(t('miiEditor.corruptedData'));
	if (!shouldContinue) {
		navigateTo('/account');
	}
	initializeMiiData(fallbackMiiData);
}

function loadImageAsync(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = url;
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('failed to load image'));
	});
}

// this renders the mii to canvas
async function renderMii(_e?: Event, sizeChange?: boolean) {
	if (!miiCanvas.value) {
		console.log('[ERROR]: nocanvas');
		return;
	}

	const build = mii.value.build;
	const height = mii.value.height;

	// if this is a sizeChange, we use the cached urls for the face and the body, to avoid unnecessary network requests and provide an instant feedback.
	if (!sizeChange || !miiFaceUrl.value || !miiBodyUrl.value) {
		// we blur the canvas, unless the current subtab is the one with the build and height sliders
		loadingCanvas.value = activeSubTab.value !== 'size';

		miiFaceUrl.value = mii.value.studioUrl({
			width: 512,
			type: 'face_only',
			splitMode: 'both' // this will be twice the height (huge thanks to https://github.com/ariankordi for suggesting this in https://github.com/PretendoNetwork/website/pull/367)
		});
		miiBodyUrl.value = mii.value.studioAssetUrlBody();
	}

	const miiFaceImg = await loadImageAsync(miiFaceUrl.value);
	const miiBodyImg = await loadImageAsync(miiBodyUrl.value);

	// misc calculations
	const bodyWidth = (build * 1.7 + 220) * (0.003 * height + 0.6);
	const bodyHeight = height * 3.5 + 227;
	const bodyXPos = (miiCanvas.value.width - bodyWidth) / 2;
	const bodyYPos = miiCanvas.value.height - bodyHeight;
	const headYPos = bodyYPos - 408;

	const ctx = miiCanvas.value.getContext('2d');

	ctx.clearRect(0, 0, miiCanvas.value.width, miiCanvas.value.height);

	// in mii studio split depth mode, the back half is on the top
	// and the front half is on the bottom
	// the back half needs to be drawn, then the body, then the front
	// (again thx to ariankordi)
	const halfHeight = miiFaceImg.height / 2;
	// top half of the image / back half of the head
	ctx.drawImage(
		miiFaceImg,
		0,
		0,
		miiFaceImg.width,
		halfHeight,
		0,
		headYPos,
		miiFaceImg.width,
		halfHeight
	);

	// draw body on top
	ctx.drawImage(miiBodyImg, bodyXPos, bodyYPos, bodyWidth, bodyHeight);

	// draw bottom half of the image / front half of the head
	ctx.drawImage(
		miiFaceImg,
		0,
		halfHeight,
		miiFaceImg.width,
		halfHeight,
		0,
		headYPos,
		miiFaceImg.width,
		halfHeight
	);

	loadingCanvas.value = false;
}

onMounted(() => {
	renderMii();
});

// given the subtab name this finds the appropriate icon
function getSpriteNameFromSubTab(subtab: Subtab) {
	if (subtab.type === 'color' || subtab.name.toLowerCase().includes('color')) {
		return 'subtab-color';
	}

	if (subtab.name.toLowerCase().includes('position')) {
		return 'subtab-position';
	}

	return `subtab-${subtab.name}`;
}

// given the subtab name this finds the appropriate icon
function getSpriteNameFromSlider(slider: string) {
	if (slider.includes('XPosition')) {
		return 'xPosition';
	} else if (slider.includes('YPosition')) {
		return 'yPosition';
	} else if (slider.includes('Scale')) {
		return 'scale';
	} else if (slider.includes('Rotation')) {
		return 'rotation';
	} else if (slider.includes('Spacing')) {
		return 'spacing';
	} else if (
		slider.includes('HorizontalStretch') ||
		slider.includes('VerticalStretch')
	) {
		// nope, not a mistake.
		return 'verticalStretch';
	} else {
		return slider;
	}
}

function setActiveTab(newTab: string) {
	if (newTab === activeTab.value) {
		return;
	}

	// open the subtab with the selected element in it
	setActiveSubTab(
		miiEditorJSON.tabs.filter(t => t.name === newTab)[0].subTabs?.[0].name ||
		'',
		newTab
	);
	activeTab.value = newTab;
}

function setActiveSubTab(newSubTab: string, newTab: string) {
	if (newSubTab === activeSubTab.value) {
		return;
	}

	console.log(mii.value);

	// open the subpage at which the selected value is located
	activeSubPage.value = getSubPageFromValue(
		mii.value?.[newSubTab],
		newSubTab,
		newTab
	);
	activeSubTab.value = newSubTab;
}

// takes the value of a property, as well as the tab and subtab on which it's located, and finds the subpage in which it is found. Used to open the subpage with the selected element
function getSubPageFromValue(value: string, newSubTab: string, newTab: string) {
	const tab = miiEditorJSON.tabs.filter(t => t.name === newTab)[0];
	const subTab = tab?.subTabs?.filter(s => s.name === newSubTab)[0];
	let subpageIndex = 0;

	// tabs with sliders only have one subpage so it's safe to fall back to 0
	if (subTab?.type === 'slider') {
		return 0;
	}

	subTab?.values?.map((a, i) => {
		try {
			if (a?.find(e => e === value)) {
				subpageIndex = i;
			}
		} catch (e) {
			console.log(e);
			return 0;
		}
	});

	return subpageIndex;
}

async function handleSave() {
	saving.value = true;

	console.log('TODO: logic', mii.value);

	setTimeout(() => {
		// TODO - Make this prettier
		alert(t('miiEditor.miiSaved'));

		navigateTo('/account');
	}, 5000);
}
</script>

<template>
  <!--<ClientOnly
    fallback-tag="span"
  >-->
  <div :class="{ 'miieditor-wrapper': true, saving: saving }">
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

    <div class="canvas-wrapper">
      <canvas
        id="miiCanvas"
        ref="miiCanvas"
        width="512"
        height="1080"
        :class="{ loading: loadingCanvas }"
      >
        {{ $t("miiEditor.noCanvas") }}
      </canvas>
    </div>

    <div class="params-wrapper">
      <div class="params-resizer">
        <div class="tabs">
          <button
            v-for="tab in miiEditorJSON.tabs"
            :id="tab.name"
            :key="tab.name"
            :class="{ tabbtn: true, active: tab.name === activeTab }"
            @click="
              () => {
                setActiveTab(tab.name);
              }
            "
          >
            <svg view-box="0 0 32 32">
              <use
                :href="`/assets/images/miieditor_symbols.svg#tab-${tab.name}`"
              />
            </svg>
          </button>
        </div>

        <form class="params">
          <div
            v-for="tab in miiEditorJSON.tabs.filter(
              (t: Tab) => t.name === activeTab,
            )"
            :id="tab.name"
            :key="tab.name"
            :class="{ tab: true, active: tab.name === activeTab }"
          >
            <div class="subtabs-wrapper">
              <div class="subtabs">
                <button
                  v-for="subtab in tab.subTabs"
                  :id="`${subtab.name}-subtabbtn`"
                  :key="subtab.name"
                  :class="{
                    subtabbtn: true,
                    active: subtab.name === activeSubTab,
                  }"
                  @click.prevent="setActiveSubTab(subtab.name, tab.name)"
                >
                  <svg view-box="0 0 32 32">
                    <use
                      :href="`/assets/images/miieditor_symbols.svg#${getSpriteNameFromSubTab(
                        subtab,
                      )}`"
                    />
                  </svg>
                </button>
              </div>
              <div
                v-for="subtab in tab.subTabs?.filter(s => s.name === activeSubTab && s.type !== 'slider')?.filter(s => (s?.values?.length || 0) > 1)"
                :key="subtab.name"
                class="pagination"
              >
                <button
                  :class="{
                    previous: true,
                    'page-btn': true,
                    disabled: activeSubPage === 0,
                  }"
                  :disabled="activeSubPage === 0"
                  @click.prevent="activeSubPage--"
                >
                  <Icon
                    name="ph:caret-circle-left-fill"
                    size="32"
                  />
                </button>
                <span>
                  <span class="current-page-index">{{
                    activeSubPage + 1
                  }}</span>
                  /
                  <span class="total-page-index">{{
                    subtab?.values?.length
                  }}</span>
                </span>
                <button
                  :class="{
                    next: true,
                    'page-btn': true,
                    disabled:
                      (subtab?.values?.length || 0) - 1 === activeSubPage,
                  }"
                  :disabled="
                    (subtab?.values?.length || 0) - 1 === activeSubPage
                  "
                  @click.prevent="activeSubPage++"
                >
                  <Icon
                    name="ph:caret-circle-right-fill"
                    size="32"
                  />
                </button>
              </div>
            </div>

            <fieldset
              v-for="subtab in tab.subTabs?.filter(
                (t: Subtab) => t.name === activeSubTab,
              )"
              :key="subtab.name"
              :class="`subtab active ${subtab.name}`"
            >
              <template v-if="subtab.type === 'component'">
                <template v-if="subtab.name === 'info'">
                  <div class="full-width">
                    <label for="miiName">{{ $t("miiEditor.nickname") }}</label>
                    <input
                      id="miiName"
                      v-model="mii.miiName"
                      type="text"
                      name="miiName"
                      minLength="1"
                      maxLength="10"
                    >
                  </div>
                  <div class="full-width">
                    <label for="creatorName">{{
                      $t("miiEditor.creator")
                    }}</label>
                    <input
                      id="creatorName"
                      v-model="mii.creatorName"
                      type="text"
                      name="creatorName"
                      minLength="1"
                      maxLength="10"
                    >
                  </div>
                  <div class="birthdate">
                    <label for="birthday">{{ $t("miiEditor.birthday") }}</label>
                    <BirthdaySetter
                      id="birthday"
                      :day="mii.birthDay"
                      :month="mii.birthMonth"
                      @change="
                        (e: { day: number; month: number }) => {
                          mii.birthDay = e.day;
                          mii.birthMonth = e.month;
                        }
                      "
                    />
                  </div>
                  <div class="icons">
                    <div class="input-wrapper">
                      <label for="favorite">{{
                        $t("miiEditor.favorite")
                      }}</label>
                      <div class="checkbox-wrapper">
                        <input
                          id="favorite"
                          v-model="mii.favorite"
                          type="checkbox"
                          name="favorite"
                        >
                        <Icon
                          name="ph:heart-fill"
                          class="icon checked"
                          size="32"
                        />
                        <Icon
                          name="ph:heart-break-fill"
                          class="icon unchecked"
                          size="32"
                        />
                      </div>
                    </div>
                    <div class="input-wrapper">
                      <label for="disableSharing">{{
                        $t("miiEditor.sharing")
                      }}</label>
                      <div class="checkbox-wrapper">
                        <input
                          id="disableSharing"
                          :checked="!mii.disableSharing"
                          type="checkbox"
                          name="disableSharing"
                          @click="
                            () => {
                              mii.disableSharing = !mii.disableSharing;
                            }
                          "
                        >
                        <Icon
                          name="ph:users-three-fill"
                          class="icon checked"
                          size="32"
                        />
                        <Icon
                          name="ph:user-fill"
                          class="icon unchecked"
                          size="32"
                        />
                      </div>
                    </div>
                    <div class="input-wrapper">
                      <label for="allowCopying">{{
                        $t("miiEditor.copying")
                      }}</label>
                      <div class="checkbox-wrapper">
                        <input
                          id="allowCopying"
                          v-model="mii.allowCopying"
                          type="checkbox"
                          name="allowCopying"
                        >
                        <Icon
                          name="ph:copy-fill"
                          class="icon checked"
                          size="32"
                        />
                        <Icon
                          name="ph:lock-key-fill"
                          class="icon unchecked"
                          size="32"
                        />
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="subtab.name === 'save'">
                  <div
                    id="saveTab"
                    class="tab save"
                  >
                    <p class="save-prompt">
                      {{ $t("miiEditor.saveCaption") }}
                    </p>
                    <div class="mii-comparison-animation-wrapper">
                      <div class="mii-comparison unconfirmed">
                        <img
                          class="old-mii"
                          :src="oldMiiNeutralUrl"
                        >
                        <Icon
                          name="ph:arrow-fat-right-fill"
                          class="icon"
                          size="48"
                        />
                        <div class="new-mii-wrapper">
                          <img
                            class="new-mii"
                            :src="newMiiNeutralUrl"
                          >
                        </div>
                      </div>
                      <div class="mii-comparison confirmed">
                        <img
                          class="old-mii"
                          :src="oldMiiSorrowUrl"
                        >
                        <Icon
                          name="ph:arrow-fat-right-fill"
                          class="icon"
                          size="48"
                        />
                        <div class="new-mii-wrapper">
                          <img
                            class="new-mii"
                            :src="newMiiSmileUrl"
                          >
                        </div>
                      </div>
                    </div>
                    <button
                      id="saveButton"
                      :class="{ button: true, primary: true }"
                      @click.prevent="handleSave()"
                    >
                      {{ $t("miiEditor.save") }}!
                    </button>
                  </div>
                </template>
              </template>
              <div
                v-for="(subpage, i) in subtab.values?.filter(
                  (_v: any, i: number) => i === activeSubPage,
                )"
                v-else
                :key="i"
                :class="{
                  subpage: true,
                  'has-sliders': subtab.type === 'slider',
                }"
              >
                <template v-if="subtab.type === 'slider'">
                  <template
                    v-for="v in subpage"
                    :key="v"
                  >
                    <div class="slider-wrapper">
                      <!-- display icon from spritesheet -->
                      <!-- @vue-expect-error -- this will only run if the subtab type is slider -->
                      <label :for="`${subtab.name}-${v.name}`"><svg view-box="0 0 32 32">
                        <!-- @vue-expect-error -- this will only run if the subtab type is slider -->
                        <use
                          :href="`/assets/images/miieditor_symbols.svg#slider-${getSpriteNameFromSlider(v.name)}`"
                        /></svg></label>
                      <!-- @vue-expect-error -- this will only run if the subtab type is slider -->
                      <input
                        :id="`${subtab.name}-${v.name}`"
                        :value="mii[v.name]"
                        type="range"
                        list="tickmarks"
                        :name="v.name"
                        :min="v.min"
                        :max="v.max"
                        :class="{
                          invert:
                            v.name.includes('YPosition') ||
                            v.name.includes('Rotation'),
                        }"
                        @input="
                          (e) => {
                            mii[v.name] = parseInt(e.target.value);

                            if (v.name !== 'build' && v.name !== 'height')
                              return;

                            renderMii(e, true);
                          }
                        "
                        @change="renderMii"
                      >
                    </div>
                  </template>
                </template>

                <template v-else-if="subtab.type === 'color'">
                  <template
                    v-for="(v, j) in subpage"
                    :key="v"
                  >
                    <input
                      :id="`${subtab.name}-${v}`"
                      :value="v?.toString()"
                      type="radio"
                      :name="subtab.name"
                      :checked="j === mii?.[subtab.name]"
                      @click="
                        () => {
                          mii[subtab.name] = j;
                          renderMii();
                        }
                      "
                    >
                    <!-- display color instead of icons -->
                    <label
                      :for="`${subtab.name}-${v}`"
                      :class="{
                        color: true,
                        selected: j === mii?.[subtab.name],
                      }"
                      :style="`background: ${v}`"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      height="48"
                      style="color: #fff"
                    >
                      <rect
                        width="256"
                        height="256"
                        fill="none"
                      />
                      <path
                        stroke="var(--bg-shade-2)"
                        stroke-width="1rem"
                        fill="currentColor"
                        d="M243.31,90.91l-128.4,128.4a16,16,0,0,1-22.62,0l-71.62-72a16,16,0,0,1,0-22.61l20-20a16,16,0,0,1,22.58,0L104,144.22l96.76-95.57a16,16,0,0,1,22.59,0l19.95,19.54A16,16,0,0,1,243.31,90.91Z"
                      />
                    </svg>
                    </label>
                  </template>
                </template>
                <template v-else>
                  <template
                    v-for="v in subpage"
                    :key="v"
                  >
                    <input
                      :id="`${subtab.name}-${v}`"
                      :value="v?.toString()"
                      type="radio"
                      :name="subtab.name"
                      :checked="v === mii?.[subtab.name]"
                      @click="
                        () => {
                          mii[subtab.name] = v;
                          renderMii();
                        }
                      "
                    >
                    <!-- display icon from spritesheet -->
                    <label :for="`${subtab.name}-${v}`"><svg view-box="0 0 32 32">
                      <use
                        :href="`/assets/images/miieditor_symbols.svg#value-${subtab.name}-${v?.toString()}`"
                      /></svg></label>
                  </template>
                </template>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--<template #fallback>
      <div class="fallback">
        <p>{{ $t('miiEditor.loading') }}</p>
      </div>
    </template>
  </ClientOnly>-->
</template>

<style lang="scss" scoped>
.fallback {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.fallback p {
	font-size: 1.5rem;
}

svg.logotype {
	position: absolute;
	width: 8rem;
	top: 2rem;
	left: 2rem;
}

.miieditor-wrapper {
	position: relative;
	display: grid;
	grid-template-columns: 1fr 1fr;
	height: 100vh;
	max-height: 100%;
	width: 100vw;
}

.canvas-wrapper {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	transform: translate(-20, 0);
	height: 100vh;
	max-height: 100%;
}

canvas#miiCanvas {
	width: auto;
	height: 90%;
	transform-origin: center;
	transition:
		transform 200ms,
		filter 150ms;
}

canvas#miiCanvas.loading {
	filter: blur(4px) brightness(50%);
}

div.params-wrapper {
	position: relative;
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: center;
	z-index: 3;
	background-color: var(--bg-shade-2);
}

.params-resizer {
	position: relative;
	display: grid;
	grid-auto-flow: row;
	gap: 1rem;
	width: 100%;
	min-width: 24rem;
	max-width: 36rem;
	height: auto;
	aspect-ratio: 39/40;

}

div.tabs,
div.subtabs {
	display: grid;
	grid-template-columns: repeat(11, 1fr);
	box-sizing: border-box;
	background: var(--bg-shade-0);
	padding: 0.3rem;
	gap: 0.3rem;
	border-radius: 0.6rem;
}

form.params {
	grid-template-columns: repeat(2, auto);
}
form.params .tab {
	display: grid;
	gap: 2rem 0;
}

div.subtabs {
	background: none;
}

div.tabs .tabbtn,
div.subtabs .subtabbtn {
	display: flex;
	align-items: center;
	justify-content: center;
	aspect-ratio: 1;
	border-radius: 0.4rem;
	background: none;
	padding: 0.4rem;
	color: var(--text-shade-1)
}

div.subtabs .subtabbtn {
	position: relative;
	color: var(--text-shade-3);
}

div.tabs .tabbtn svg,
div.subtabs .subtabbtn svg,
div.slider-wrapper svg {
	width: 100%;
	aspect-ratio: 1;
	height: auto;
}

div.tabs .tabbtn:hover,
div.tabs .tabbtn.active {
	background: var(--bg-shade-2);
	color: #fff;
}

div.subtabs .subtabbtn.active::before,
div.subtabs .subtabbtn.active:hover::before {
	content: "";
	position: absolute;
	bottom: -0.25rem;
	left: 5%;
	width: 90%;
	height: 0.25rem;
	background: var(--accent-shade-1);
	border-radius: 0.25rem;
}

div.subtabs-wrapper {
	position: relative;
}

.pagination {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	width: max-content;
	height: fit-content;
	grid-column: 1 / span 4;
	grid-row: 4;
	margin-left: auto;
	align-items: center;
	justify-content: center;
	font-size: 1.1rem;
	color: var(--text-shade-1);
}
.pagination .current-page-index {
	display: inline-block;
	font-weight: bold;
	color: var(--text-shade-3);
	width: 1.1rem;
	margin-right: 0.2ch;
	text-align: right;
}
.pagination .total-page-index {
	display: inline-block;
	width: 1.1rem;
}
.pagination svg {
	height: 100%;
}
.page-btn {
	appearance: none;
	border: none;
	background: none;
	cursor: pointer;
	padding: 0;
	height: 2rem;
	color: var(--accent-shade-1);
	margin: 0.5rem;
}
.page-btn:hover {
	background: none;
}
.page-btn:hover {
	color: var(--accent-shade-3);
}
.page-btn.next {
	margin-right: 0;
	padding-right: 0;
}
.page-btn.disabled {
	color: var(--bg-shade-3);
}

.subtab {
	aspect-ratio: 1;
	width: 100%;
}

fieldset .subpage.has-sliders {
	width: 100%;
	height: 75%;
	display: grid;
	grid-template-columns: 1fr;
	grid-auto-flow: row;
	grid-auto-rows: min-content;
	grid-template-rows: unset;
	justify-content: start;
	align-items: start;
	gap: 2rem;
}

.has-sliders .slider-wrapper {
	display: flex;
	align-items: center;
	width: 100%;
	gap: 1rem;
}

.has-sliders .slider-wrapper svg {
	height: 3rem;
}

.subtab.info {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: repeat(3, auto) 1fr;
	align-items: start;
	gap: 1rem;
}

.subtab.info .full-width {
	grid-column: 1 / span 2;
}

.subtab.info label {
	display: block;
	margin-bottom: 0.5rem;
}

.subtab.info .icons {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
	height: 100%;
}

.subtab.info .icons .input-wrapper {
	position: relative;
	display: grid;
	grid-template-rows: auto 1fr;
	text-align: center;
	height: 100%;
}

.subtab.info .icons .checkbox-wrapper {
	position: relative;
	display: flex;
}

.subtab.info .icons .checkbox-wrapper .icon {
	display: none;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
}
.subtab.info .icons input[type="checkbox"] ~ .icon.unchecked {
	display: block;
}
.subtab.info .icons input[type="checkbox"]:checked ~ .icon.unchecked {
	display: none;
}
.subtab.info .icons input[type="checkbox"]:checked ~ .icon.checked {
	display: block;
}

.subtab.info .icons input[type="checkbox"] {
	box-sizing: border-box;
	margin: 0;
	width: 100%;
	height: 100%;
	background: var(--red-shade-1);
}
.subtab.info .icons input[type="checkbox"]:checked {
	background: var(--green-shade-0);
}

fieldset,
fieldset .subpage {
	appearance: none;
	border: none;
	padding: 0;
	margin: 0;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(4, 1fr);
	gap: 0.5rem;
}

fieldset input[type="radio"] {
	display: none;
}
fieldset input[type="radio"] + label {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem;
	cursor: pointer;
	border-radius: 0.5rem;
	background: var(--bg-shade-3);
	aspect-ratio: 1;
}
fieldset {
	display: block;
}

fieldset input[type="radio"] + label svg {
	height: auto;
	width: 100%;
	aspect-ratio: 1;
}

fieldset input[type="radio"]:checked + label {
	background: var(--bg-shade-4);
	box-shadow:
		inset 0 0 0 0.25rem var(--accent-shade-1),
		inset 0 0 0 0.5rem var(--bg-shade-1);
}

fieldset input[type="radio"] + label.color svg {
	width: 4rem;
	display: none;
}
fieldset input[type="radio"]:checked + label.color svg {
	display: block;
}
input[type="range"].invert {
	direction: rtl;
}

.tab.save p.save-prompt {
	margin: 0;
	text-align: center;
}
.mii-comparison-animation-wrapper {
	position: relative;
	height: fit-content;
}
.mii-comparison {
	position: relative;
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 1rem;
	align-items: center;
	width: 100%;
	pointer-events: none;
	user-select: none;
}
.mii-comparison.confirmed {
	position: absolute;
	height: 100%;
	top: 0;
	left: 0;
	opacity: 0;
	overflow: hidden;
}
.mii-comparison img {
	display: block;
	width: 100%;
	aspect-ratio: 1;
	background: var(--bg-shade-3);
	border-radius: 1rem;
}

.mii-comparison .new-mii-wrapper {
	position: relative;
	transition:
		right 500ms 2s,
		transform 500ms 2s;
	right: 0;
}
.mii-comparison .new-mii-wrapper::after {
	position: absolute;
	content: "";
	display: block;
	box-shadow: inset 0 0 0 0.5rem var(--accent-shade-1);
	border-radius: 1rem;
	margin: 0;
	right: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
}

.mii-comparison svg path {
	fill: var(--accent-shade-1);
}

.saving {
	pointer-events: none;
}
.saving .mii-comparison.confirmed {
	opacity: 1;
}

.fade-in {
	animation: fadeIn 0.25s forwards;
}

.saving .tab.save button,
.saving .tab.save p.save-prompt,
.fade-out {
	animation: fadeOut 0.5s forwards;
}
.saving .mii-comparison.unconfirmed {
	animation: fadeOut 0.5s forwards;
	animation-delay: 0.5s;
}

.saving .mii-comparison.confirmed .old-mii,
.saving .mii-comparison.confirmed .icon {
	animation: fadeOut 0.5s forwards;
	animation-delay: 1.5s;
}

.saving .mii-comparison.confirmed .new-mii-wrapper {
	position: absolute;
	right: 50%;
	transform: translateX(50%);
	height: 100%;
	aspect-ratio: 1;
	width: auto;
}
@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
@keyframes fadeOut {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}

@media screen and (max-width: 1300px) {
	.miieditor-wrapper {
		grid-template-columns: 2fr 3fr;
	}

	canvas#miiCanvas {
		width: 80%;
		height: auto;
		aspect-ratio: 0.5;
	}
}

@media screen and (max-width: 1000px) {
	.miieditor-wrapper {
		grid-template-columns: 1fr 2fr;
	}

	canvas#miiCanvas {
		width: 80%;
		height: auto;
		aspect-ratio: 0.5;
	}
}

/* stack the sucker */
@media screen and (max-width: 900px) {
	.logotype {
		display: none;
	}
	.miieditor-wrapper {
		grid-template-columns: unset;
		grid-template-rows: auto 1fr;
		height: 100vh;
		max-height: 100%;
	}

	.canvas-wrapper {
		height: unset;
		max-height: 100%;
		min-height: 0;
		max-height: 100%;
		width: auto;
		overflow: hidden;
	}

	canvas#miiCanvas {
		min-height: 0;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		width: auto;
	}

	.params-wrapper {
		padding: 2rem 1rem;
	}

	.params-resizer {
		max-width: 28rem;
		height: auto;
		gap: .5rem
	}

	form.params .tab {
		gap: 1rem;
	}

	div.tabs,
	div.subtabs {
		padding: 0.2rem;
		gap: 0.1rem;
		border-radius: 0.25rem;
	}

	div.tabs .tabbtn,
	div.subtabs .subtabbtn {
		padding: 0.25rem;
		border-radius: 0.1rem;
	}

	.subtab.info {
	grid-template-rows: repeat(3, auto) 1fr;
	}

	.subtab.info .icons input[type="checkbox"] {
		height: calc(1.5rem + 24px);
	}

	.subtab.info .full-width {
		grid-column: unset;
	}

	.subtab.info .birthdate,
	.subtab.info .icons {
		grid-column: 1 / span 2;
	}

	fieldset input[type="radio"] + label.color svg {
		width: 2rem;
	}
}

@media screen and (max-width: 600px) {
	.params-wrapper {
		padding: 1rem 0.5rem;
	}

	.params-resizer {
		height: 95%;
		min-width: 0;
	}

	.mii-comparison {
		gap: 0.5rem;
	}

	.mii-comparison .icon {
		width: 2rem;
	}

	.mii-comparison .new-mii-wrapper::after {
		box-shadow: inset 0 0 0 0.25rem var(--accent-shade-1);
	}

		fieldset input[type="radio"]:checked + label {
	background: var(--bg-shade-4);
	box-shadow:
		inset 0 0 0 0.2rem var(--accent-shade-1),
		inset 0 0 0 0.3rem var(--bg-shade-1);
}

	fieldset .subpage.has-sliders {
		gap: 1rem;
	}

	.has-sliders .slider-wrapper svg {
		height: 2rem;
	}
}

@media screen and (max-width: 400px) {
	.params-wrapper {
		padding: .0rem 0.5rem;
	}

	.mii-comparison .icon {
		width: 1.5rem;
	}

	div.tabs,
	div.subtabs {
		gap: .2rem
	}

	div.tabs .tabbtn,
	div.subtabs .subtabbtn {
		padding: 0.1rem;
		border-radius: 0.1rem;
	}
}
</style>
