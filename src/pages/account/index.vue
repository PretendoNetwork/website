<script setup lang="ts">
import type { ApiAccountUpdateRequest } from '~~/shared/api-types';

definePageMeta({
	needsAuth: true
});

const authStore = useAuthStore();
const { data: profile, refresh } = await useApiFetch('/api/auth/me');
const { data: connections, refresh: refreshConnections } = await useApiFetch('/api/auth/me-connections');

async function updateServerEnvironment(env: ApiAccountUpdateRequest['environment']) {
	try {
		await apiFetch('/api/account/update', {
			method: 'PATCH',
			body: {
				environment: env
			} satisfies ApiAccountUpdateRequest
		});
		await refresh();
	} catch (error: unknown) {
		const err = getApiError(error);
		alert(err.code);
	}
}

async function deleteAccount() {
	try {
		await apiFetch('/api/account/delete', {
			method: 'POST'
		});
		authStore.logout();
		await navigateTo('/');
	} catch (error: unknown) {
		const err = getApiError(error);
		alert(err.code);
	}
}

async function linkDiscord() {
	try {
		const result = await apiFetch('/api/account/discord-link', {
			method: 'GET'
		});
		await navigateTo(result.url, { external: true });
	} catch (error: unknown) {
		const err = getApiError(error);
		alert(err.code);
	}
}

async function unlinkDiscord() {
	try {
		await apiFetch('/api/account/discord-unlink', {
			method: 'POST'
		});
		await refresh();
		await refreshConnections();
	} catch (error: unknown) {
		const err = getApiError(error);
		alert(err.code);
	}
}

async function updateMii() {
	try {
		await apiFetch('/api/account/update', {
			method: 'PATCH',
			body: {
				mii: { name: 'steve', primary: 'Y', data: 'AwAAQOlVognnx0GC2qjhdwOzuI0n2QAAAGBzAHQAZQB2AGUAAAAAAAAAAAAAAEBAAAAhAQJoRBgmNEYUgRIXaA0AACkAUkhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAANeC' }
			} satisfies ApiAccountUpdateRequest
		});
		await refresh();
	} catch (error: unknown) {
		const err = getApiError(error);
		alert(err.code);
	}
}
</script>

<template>
  <div v-if="profile">
    <h1>Hello {{ profile.username }}</h1>
    <p>TODO: account stub page</p>
    <div :style="{ border: '1px solid white', margin: '2rem 0' }">
      <p>Environment ({{ profile.serverAccessLevel }})</p>
      <button @click="updateServerEnvironment('prod')">
        Prod
      </button>
      <button @click="updateServerEnvironment('test')">
        Test
      </button>
      <button @click="updateServerEnvironment('dev')">
        Dev
      </button>
    </div>
    <button
      v-if="profile.discordId"
      @click="unlinkDiscord()"
    >
      Unlink discord: <span v-if="connections?.discord">
        <img
          :style="{ height: '25px', width: '25px', borderRadius: '100px'}"
          :src="connections.discord.avatarUrl ?? '#'"
        >
        {{ connections.discord.username }}
      </span>
    </button>
    <button
      v-else
      @click="linkDiscord()"
    >
      Link discord
    </button>
    <button
      @click="updateMii()"
    >
      Update Mii
    </button>
    <button
      :style="{ color: 'red' }"
      @click="deleteAccount()"
    >
      Delete account
    </button>
  </div>
</template>
