<script setup lang="ts">
const code = useRoute().params.code;
const { data: error } = await useAsyncData(`${code}`, () => {
	return queryCollection('errorcodes').where('stem', '=', code).first();
});

console.log(error.value);

if (!error.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

useHead({
	title: `${error.value.code} | Docs`,
	meta: [
		{ property: 'description', content: error.value.message },
		{ property: 'og:description', content: error.value.message },
		{ property: 'og:image:alt', content: '' },
		{ name: 'twitter:description', content: error.value.message }
	]
});

definePageMeta({
	layout: 'docs'
});
</script>

<template>
  <div class="content-inner">
    <h1>Error Code {{ error?.code }}</h1>
    <table>
      <tbody>
        <tr>
          <th>System</th>
          <td>{{ error?.module.system }}</td>
        </tr>
        <tr>
          <th>Module</th>
          <td>{{ error?.module.name }} ({{ error?.module.description }})</td>
        </tr>
        <tr>
          <th>Message</th>
          <td>{{ error?.message }}</td>
        </tr>
        <tr>
          <th>Cause</th>
          <td>{{ error?.long_description }}</td>
        </tr>
        <tr>
          <th>Solution</th>
          <td>{{ error?.long_solution }}</td>
        </tr>
      </tbody>
    </table>

    <p>
      If you have not yet connected to Pretendo, please follow <NuxtLink to="/docs/install">
        the guide
      </NuxtLink> to get started.
    </p>
  </div>
</template>
