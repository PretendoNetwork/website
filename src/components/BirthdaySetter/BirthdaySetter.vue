<script lang="ts" setup>
const { day, month } = defineProps<{ day: number; month: number }>();
defineEmits(['change']);

const { t, locale } = useI18n();

const open = ref(false);
const tempDay = ref(day);
const tempMonth = ref(month === 0 ? 1 : month);

const validTempDate = computed(() => {
	return checkvalidDate(tempDay.value, tempMonth.value);
});
const daysInTempMonth = computed(() => {
	return getMaxDaysInMonth(tempMonth.value);
});

/* gets the number of days in a month, in a leap year. months are 0-indexed and setting the day field to 0 returns the last day of the month prior.
 * 2004 was chosen because it's a leap year and it's my birth year :3 */
function getMaxDaysInMonth(month: number) {
	return new Date(2004, month, 0).getDate();
}

function monthToString(month: number) {
	return new Date(2004, month - 1, 15).toLocaleDateString(locale.value, {
		month: 'long'
	});
}

function checkvalidDate(day: number, month: number) {
	if (month < 1 || month > 12) {
		return false;
	} else if (day < 1 || day > getMaxDaysInMonth(month)) {
		return false;
	} else {
		return true;
	}
}

const dateString = computed(() => {
	if (!checkvalidDate(day, month)) {
		return t('miiEditor.clickToSet');
	}

	const birthdate = new Date(2004, month - 1, day);

	return birthdate.toLocaleDateString(undefined, {
		month: '2-digit',
		day: '2-digit'
	});
});
</script>

<template>
  <div class="date-selector-wrapper">
    <div
      :class="{'date-selector': true, 'open': open }"
    >
      <template v-if="open">
        <div class="header">
          <button
            :class="{
              previous: true,
              'page-btn': true,
              disabled: tempMonth === 1,
            }"
            :disabled="tempMonth === 1"
            @click.prevent="() => {
              tempMonth--;
            }"
          >
            <Icon
              name="ph:caret-left"
              size="20"
            />
          </button>
          <span class="month-name">{{ monthToString(tempMonth) }}</span>
          <button
            :class="{
              next: true,
              'page-btn': true,
              disabled: tempMonth === 12,
            }"
            :disabled="tempMonth === 12"
            @click.prevent="() => {
              tempMonth++;
            }"
          >
            <Icon
              name="ph:caret-right"
              size="20"
            />
          </button>
        </div>
        <fieldset class="datepicker-day-grid">
          <template
            v-for="i in [
              ...Array(daysInTempMonth)
                .keys()
                .map((j) => j + 1),
            ]"
            :key="i"
          >
            <input
              :id="`datepicker-day-${i}`"
              :value="i"
              type="radio"
              :name="`datepicker-days`"
              :checked="i === tempDay && month === tempMonth"
              @click="
                () => {
                  tempDay = i;
                  $emit('change', { day: tempDay, month: tempMonth})
                }
              "
            >
            <label :for="`datepicker-day-${i}`"><span>{{ i }}</span></label>
          </template>
        </fieldset>
      </template>
    </div>

    <div
      :class="{ input: true, 'invalid-date': !validTempDate, open: open }"
      @click="!open && (open = true)"
    >
      <button
        class="trash action-button"
        @click.prevent.stop="() => {
          $emit('change', { day: 0, month: 0})
          open = false
        }"
      >
        <Icon
          name="ph:trash-fill"
          size="24"
        />
      </button>
      <span class="date-string">{{ dateString }}</span>
      <Icon
        class="icon"
        name="ph:calendar-dots-fill"
        size="24"
      />
      <button
        class="confirm action-button"
        @click.prevent.stop="() => {
          open = false
        }"
      >
        <Icon
          name="ph:check-circle-fill"
          size="24"
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.date-selector-wrapper {
	position: relative;
	display: grid;
	user-select: none;
}

.date-selector {
	display: grid;
	justify-content: center;
	position: absolute;
	width: 100%;
	max-height: 0;
	height: 0;
	overflow-y: hidden;
	box-sizing: border-box;
	bottom: 100%;
	background-color: var(--bg-shade-0);
	border: 1px solid var(--bg-shade-3);
	border-bottom: 0;
	border-radius: .5rem .5rem 0 0;
	opacity: 0;
	z-index: 2;
	transition: max-height 400ms, opacity 200ms;
}

.date-selector.open {
	opacity: 1;
	height: auto;
	max-height: 24rem;
}

.date-selector.open::after {
	content: "";
	position: absolute;
	display: block;
	height: 1px;
	width: 90%;
	left: 5%;
	bottom: 0;
	background: var(--bg-shade-3);
}

.date-selector .header {
	display: grid;
	grid-template-columns: auto 1fr auto;
	text-align: center;
	padding: 1rem .75rem .25rem .75rem;
}

.date-selector .header button {
	background: none;
	padding: .25rem;
	height: 20px;
}

.date-selector .header button.disabled  {
	color: var(--text-shade-0)
}

.datepicker-day-grid {
	appearance: none;
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: .25rem;
	border: none;
	padding: .75rem;
	margin: 0;
}

.datepicker-day-grid input[type="radio"] {
	display: none;
}
.datepicker-day-grid input[type="radio"] + label {
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: .25rem;
	padding: .25rem .5rem;
	background: none;
	height: fit-content;
	color: var(--text-shade-0);
	width: 1rem;
	font-size: inherit;
	aspect-ratio: 1;
}
.datepicker-day-grid input[type="radio"]:checked + label {
	color: var(--text-shade-3);
	font-weight: 700;
	background: var(--accent-shade-1);
}

.input {
	position: relative;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	gap: 0.5rem;
	background-color: var(--bg-shade-3);
	border: none;
	border-radius: 4px;
	padding: 12px;
	cursor: pointer;
	color: var(--text-shade-3);
	border: 0 solid var(--bg-shade-3);
	transition: background 200ms, color 200ms, border-radius 200ms;
}
.input.open {
	cursor: unset;
	justify-content: space-between;
	color: var(--text-shade-3);
	background-color: var(--bg-shade-0);
	border: 1px solid var(--bg-shade-3);
	border-top: 0;
	border-radius: 0 0 .5rem .5rem;
	padding: 12px 11px 11px 11px;
}

.input .icon {
		position: absolute;
		right: 11px;
}
.input.open .icon {
	display: none;
}

.input .action-button {
	display: none;
	background: none;
	padding: 0;
	height: 24px;
}
.input.open .action-button {
	display: inline-block;
}

.input .action-button.trash {
		color: var(--red-shade-2);
}

.input.invalid-date {
	color: var(--text-shade-1);
}

/*
.subtab.info .birthdate.monthFirst .month {
	order: 0;
}
.subtab.info .birthdate.monthFirst span {
	order: 1;
}
.subtab.info .birthdate.monthFirst .day  {
	order: 2;
}*/
</style>
