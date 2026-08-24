<script setup lang="ts">
import { Label, Dialog, Select, DatePicker } from 'reka-ui/namespaced';
import { parseDate } from '@internationalized/date';
import {
	getLocalizedRegionTimezones,
	getLocalizedCountryList,
	getLocalizedRegionList,
	regionIdToCountryId,
	countryIdToUndefinedRegionId
} from '@/utils/localizeConsole';
import type { ApiAccountUpdateRequest, GetApiAuthMe } from '~~/shared/api-types';

const toasts = useToasts();
const { locale } = useI18n();

const { profile } = defineProps<{
	profile: GetApiAuthMe;
	dialogContainer: HTMLElement | null;
}>();

const open = defineModel<boolean>();

const emit = defineEmits<{
	change: [];
}>();

const newBirthday = shallowRef(parseDate(profile.birthday || ''));
const newCountry = ref(regionIdToCountryId(profile.region || 0));
const newRegion = ref(profile.region);
const newTimezone = ref(profile.timezone);

const newLocalizedTimezoneList = computed(() => {
	return getLocalizedRegionTimezones(locale.value, newRegion.value);
});

const localizedCountryList = computed(() => {
	return getLocalizedCountryList(locale.value);
});

const newLocalizedRegionList = computed(() => {
	return getLocalizedRegionList(locale.value, newRegion.value);
});

watch(newCountry, () => {
	// if a new country has been picked, set the region to its 'Undefined' region.
	newRegion.value = countryIdToUndefinedRegionId(newCountry.value);
});

watch(newRegion, (o, n) => {
	if (regionIdToCountryId(o) === regionIdToCountryId(n)) {
		// same country so we leave the timezone as is, else we might override the user's choice.
		return;
	}

	newTimezone.value = newLocalizedTimezoneList.value?.[0]?.area || '';
});

const { execute: executeUpdateUserData, isLoading: isLoadingUpdateUserData } =
	useAsync({
		async handler() {
			const updateBody: ApiAccountUpdateRequest = {
				birthday: newBirthday.value.toString(),
				region: newRegion.value,
				timezone: newTimezone.value
			};
			await apiFetch('/api/account/update', {
				method: 'PATCH',
				body: updateBody
			});

			open.value = false;

			emit('change');
		},
		onError(error) {
			const err = getApiError(error);
			toasts.publish({
				type: 'error',
				text: err.message
			});
		}
	});
</script>

<template>
  <Dialog.Root v-model:open="open">
    <Dialog.Trigger as-child>
      <slot />
    </Dialog.Trigger>
    <Dialog.Portal :to="dialogContainer ?? undefined">
      <Dialog.Overlay />
      <Dialog.Content
        class="modal"
        @interact-outside="(e) => {
          if (isLoadingUpdateUserData) {
            return e.preventDefault();
          }
        }"
      >
        <Dialog.Title>
          {{ $t("account.settings.settingCards.userSettings") }}.
        </Dialog.Title>
        <div class="fieldsets-container">
          <fieldset class="account-edit">
            <Label
              class="birthday"
              for="birthday"
            >
              {{ $t("account.settings.settingCards.birthDate") }}</Label>
            <DatePicker.Root
              v-model="newBirthday"
              :locale="locale"
              granularity="day"
              close-on-select
            >
              <DatePicker.Field
                v-slot="{ segments }"
                class="date-field"
              >
                <template
                  v-for="item in segments"
                  :key="item.part"
                >
                  <DatePicker.Input
                    v-if="item.part === 'literal'"
                    :part="item.part"
                    class="date-field-literal"
                  >
                    {{ item.value }}
                  </DatePicker.Input>
                  <DatePicker.Input
                    v-else
                    :part="item.part"
                    class="date-field-segment"
                  >
                    {{ item.value }}
                  </DatePicker.Input>
                </template>

                <DatePicker.Trigger class="calendar-popover-trigger">
                  <Icon
                    name="ph:calendar-dots"
                    class="date-icon"
                  />
                </DatePicker.Trigger>
              </DatePicker.Field>

              <DatePicker.Content
                align="end"
                class="calendar-popover-content"
                :portal="{
                  disabled: true
                }"
              >
                <DatePicker.Arrow class="calendar-popover-arrow" />
                <DatePicker.Calendar
                  v-slot="{ weekDays, grid }"
                  class="calendar"
                >
                  <DatePicker.Header class="calendar-header">
                    <DatePicker.Prev
                      class="calendar-nav-button"
                    >
                      <Icon
                        name="ph:caret-left"
                        class="date-icon"
                      />
                    </DatePicker.Prev>

                    <DatePicker.Heading class="calendar-heading" />
                    <DatePicker.Next
                      class="calendar-nav-button"
                    >
                      <Icon
                        name="ph:caret-right"
                        class="date-icon"
                      />
                    </DatePicker.Next>
                  </DatePicker.Header>
                  <div
                    class="calendar-wrapper"
                  >
                    <DatePicker.Grid
                      v-for="month in grid"
                      :key="month.value.toString()"
                      class="calendar-grid"
                    >
                      <DatePicker.GridHead>
                        <DatePicker.GridRow class="calendar-grid-row">
                          <DatePicker.HeadCell
                            v-for="day in weekDays"
                            :key="day"
                            class="calendar-head-cell"
                          >
                            {{ day }}
                          </DatePicker.HeadCell>
                        </DatePicker.GridRow>
                      </DatePicker.GridHead>
                      <DatePicker.GridBody>
                        <DatePicker.GridRow
                          v-for="(weekDates, index) in month.rows"
                          :key="`weekDate-${index}`"
                          class="calendar-grid-row"
                        >
                          <DatePicker.Cell
                            v-for="weekDate in weekDates"
                            :key="weekDate.toString()"
                            :date="weekDate"
                            class="calendar-cell"
                          >
                            <DatePicker.CellTrigger
                              :day="weekDate"
                              :month="month.value"
                              class="calendar-cell-trigger"
                            />
                          </DatePicker.Cell>
                        </DatePicker.GridRow>
                      </DatePicker.GridBody>
                    </DatePicker.Grid>
                  </div>
                </DatePicker.Calendar>
              </DatePicker.Content>
            </DatePicker.Root>
          </fieldset>

          <fieldset class="account-edit">
            <Label
              class="country"
              for="country"
            >
              {{ $t("account.settings.settingCards.country") }}</Label>
            <Select.Root v-model="newCountry">
              <Select.Trigger
                class="select-trigger"
                aria-label="Select country"
              >
                <Select.Value />
                <Icon name="ph:caret-down" />
              </Select.Trigger>

              <Select.Content
                class="select-content"
                position="popper"
              >
                <Select.ScrollUpButton class="select-scrollbutton">
                  <Icon name="ph:caret-up" />
                </Select.ScrollUpButton>

                <Select.Viewport class="select-viewport">
                  <Select.Item
                    v-for="c in localizedCountryList"
                    :key="c.id"
                    class="select-item"
                    :value="c.id"
                  >
                    <Select.ItemIndicator class="select-itemindicator">
                      <Icon name="ph:check" />
                    </Select.ItemIndicator>
                    <Select.ItemText>
                      {{ c.name }}
                    </Select.ItemText>
                  </Select.Item>
                </Select.Viewport>

                <Select.ScrollDownButton class="select-scrollbutton">
                  <Icon name="ph:caret-down" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Root>
          </fieldset>

          <fieldset class="account-edit">
            <Label
              class="region"
              for="region"
            >{{
              $t("account.settings.settingCards.region")
            }}</Label>
            <Select.Root v-model="newRegion">
              <Select.Trigger
                class="select-trigger"
                aria-label="Select region"
              >
                <Select.Value />
                <Icon name="ph:caret-down" />
              </Select.Trigger>

              <Select.Content
                class="select-content"
                position="popper"
              >
                <Select.ScrollUpButton class="select-scrollbutton">
                  <Icon name="ph:caret-up" />
                </Select.ScrollUpButton>

                <Select.Viewport class="select-viewport">
                  <Select.Item
                    v-for="r in newLocalizedRegionList"
                    :key="r.id"
                    class="select-item"
                    :value="r.id"
                  >
                    <Select.ItemIndicator class="select-itemindicator">
                      <Icon name="ph:check" />
                    </Select.ItemIndicator>
                    <Select.ItemText>
                      {{ r.name }}
                    </Select.ItemText>
                  </Select.Item>
                </Select.Viewport>

                <Select.ScrollDownButton class="select-scrollbutton">
                  <Icon name="ph:caret-down" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Root>
          </fieldset>

          <fieldset class="account-edit">
            <Label
              class="timezone"
              for="timezone"
            >
              {{ $t("account.settings.settingCards.timezone") }}</Label>
            <Select.Root v-model="newTimezone">
              <Select.Trigger
                class="select-trigger"
                aria-label="Select timezone"
              >
                <Select.Value />
                <Icon name="ph:caret-down" />
              </Select.Trigger>

              <Select.Content
                class="select-content"
                position="popper"
              >
                <Select.ScrollUpButton class="select-scrollbutton">
                  <Icon name="ph:caret-up" />
                </Select.ScrollUpButton>

                <Select.Viewport class="select-viewport">
                  <Select.Item
                    v-for="tz in newLocalizedTimezoneList"
                    :key="tz.area"
                    class="select-item"
                    :value="tz.area"
                  >
                    <Select.ItemIndicator class="select-itemindicator">
                      <Icon name="ph:check" />
                    </Select.ItemIndicator>
                    <Select.ItemText>
                      {{ tz.area.replaceAll("_", " ") }} - {{ tz.name }}
                    </Select.ItemText>
                  </Select.Item>
                </Select.Viewport>

                <Select.ScrollDownButton class="select-scrollbutton">
                  <Icon name="ph:caret-down" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Root>
          </fieldset>
        </div>

        <div class="modal-button-wrapper">
          <Dialog.Close
            class="cancel"
            :disabled="isLoadingUpdateUserData"
          >
            {{ $t("modals.cancel") }}
          </Dialog.Close>
          <button
            class="action"
            :disabled="isLoadingUpdateUserData"
            @click="executeUpdateUserData"
          >
            <Loader v-if="isLoadingUpdateUserData" />
            <span v-else>{{
              $t("modals.confirm")
            }}</span>
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</template>

<style scoped>
.modal p.noundo {
	font-weight: bold;
	color: var(--text-shade-3);
}

fieldset {
	position: relative;
	display: flex;
	flex-flow: column;
	height: min-content;
	padding: 0;
	gap: .25rem;
	border: none;
}

.fieldsets-container {
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: 1fr;
	gap: 1rem
}

div.modal input {
	background-color: var(--bg-shade-2);
}

.select-trigger,
.select-item {
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 4px;
	padding: 12px;
	line-height: 1;
	height: 3em;
	background-color: var(--bg-shade-3);
	color: var(--text-shade-3);
	width: 100%;
}

.select-item {
	background: none;
}
.select-trigger:hover {
	background-color: var(--bg-shade-4);
}
.select-trigger:focus {
	box-shadow: 0 0 0 2px #fff;
}

:deep(.select-content) {
	overflow: hidden;
	background-color: var(--bg-shade-3);
	margin: .25rem 0;
	border-radius: 6px;
	max-height: min(var(--reka-select-content-available-height), 420px);
	height: fit-content;
	width: var(--reka-select-trigger-width);
	box-shadow:
		0px 10px 38px -10px rgba(22, 23, 24, 0.4),
		0px 10px 20px -15px rgba(22, 23, 24, 0.2);
}

:deep(.select-content[data-state='open']),
:deep(.date-picker-content[data-state='open']),
:deep(div:has(> .calendar-popover-content[data-state='open'])) {
	z-index: 100 !important;
}

.select-item {
	border-radius: 3px;
	display: flex;
	align-items: center;
	padding: 0 35px 0 25px;
	position: relative;
	user-select: none;
	color: var(--text-shade-2);
	cursor: pointer;
}
.select-item[data-disabled] {
	color: var(--text-shade-1);
	pointer-events: none;
}
.select-item[data-highlighted] {
	outline: none;
	background-color: var(--bg-shade-4);
	color: var(--text-shade-3);
}
.select-item[data-state='checked'] {
	color: var(--text-shade-3);
}

.select-label {
	padding: 0 25px;
	font-size: 12px;
	line-height: 25px;
	color: var(--mauve-11);
}

.select-separator {
	height: 1px;
	background-color: var(--grass-6);
	margin: 5px;
}

.select-itemindicator {
	position: absolute;
	left: 0;
	width: 25px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.select-scrollbutton {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 25px;
	background-color: var(--bg-shade-3);
	color: var(--grass-11);
	cursor: default;
}

.date-field {
  display: flex;
  padding: 12px;
	height: 3rem;
  align-items: center;
  border-radius: 4px;
  text-align: center;
  background-color: var(--bg-shade-3);
  user-select: none;
  color: var(--text-shade-3);
	box-sizing: border-box;
}

.date-field[data-invalid] {
  border: 1px solid var(--red-shade-2);
}

.date-field-literal {
  padding: 0.25rem;
}

.date-field-segment {
  padding: 0.25rem;
	border-radius: 4px;
}

.date-field-segment:hover{
  background-color: var(--bg-shade-4);
}

.date-field-segment:focus {
  background-color: var(--bg-shade-4);
	outline: 2px solid var(--text-shade-3)
}

.date-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.calendar {
	width: 100%;
	box-sizing: border-box;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-nav-button {
	all: unset;
	cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: transparent;
  cursor: pointer;
}

.calendar-nav-button:hover {
  color: var(--text-shade-2);
}

.calendar-heading {
  font-weight: 500;
  color: 15px;
}

.calendar-wrapper {
  display: flex;

  flex-direction: column;
}

.calendar-grid {
  margin-top: 0.25rem;
  width: 100%;
  user-select: none;
  border-collapse: collapse;
}

.calendar-grid-row {
  display: grid;
  margin-bottom: 0.25rem;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  width: 100%;
}

.calendar-head-cell {
  border-radius: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--text-shade-1);
  font-weight: 400;
	text-align: center;
	margin-bottom: .5rem;
}

.calendar-cell {
  position: relative;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
}

.calendar-cell-trigger {
  display: flex;
  position: relative;
  padding: 0.25rem .5rem;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: transparent;
  outline-style: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
  color: var(--text-shade-3);
  white-space: nowrap;
  background-color: transparent;
	border-radius: 4px;
}

.calendar-cell-trigger:hover {
  border-color: var(--text-shade-3);
}

.calendar-cell-trigger:focus {
  box-shadow: 0 0 0 2px var(--text-shade-3);;
}

.calendar-cell-trigger[data-selected] {
  background-color: var(--text-shade-3);
  color: var(--bg-shade-3);
  font-weight: bold;
}

.calendar-cell-trigger[data-selected]::before {
  background-color: #FFFFFF;
}

.calendar-cell-trigger[data-outside-view] {
  color: var(--text-shade-1);
}

.calendar-popover-trigger {
	all: unset;
	cursor: pointer;
	margin-left: auto;
	display: flex;
}

.calendar-popover-trigger:focus {
  box-shadow: 0 0 0 2px #000000;
}

:deep(.calendar-popover-content) {
  border-radius: 4px;
  padding: 24px;
  width: 260px;
  background-color: var(--bg-shade-3-5);
	color: var(--text-shade-3);
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
:deep(.calendar-popover-content):focus {
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px,
    0 0 0 2px var(--grass-7);
}
:deep(.calendar-popover-content)[data-state='open'][data-side='top'] {
  animation-name: slideDownAndFade;
}
:deep(.calendar-popover-content)[data-state='open'][data-side='right'] {
  animation-name: slideLeftAndFade;
}
:deep(.calendar-popover-content)[data-state='open'][data-side='bottom'] {
  animation-name: slideUpAndFade;
}
:deep(.calendar-popover-content)[data-state='open'][data-side='left'] {
  animation-name: slideRightAndFade;
}

:deep(.calendar-popover-arrow) {
  fill: var(--bg-shade-3-5);
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
