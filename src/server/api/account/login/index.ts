export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const apiResponse = await fetch(`${useRuntimeConfig(event).apiBase}/v1/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ ...body, grant_type: 'password' })
	});
	const apiJSON = await apiResponse.json();

	if (!apiResponse.ok) {
		setResponseStatus(event, apiResponse.status, apiJSON.error);
		event.node.res.end();

		return;
	}

	setCookie(event, 'refresh_token', apiJSON.refresh_token);
	setCookie(event, 'access_token', apiJSON.access_token);
	setCookie(event, 'token_type', apiJSON.token_type);

	setResponseStatus(event, 200);
	event.node.res.end();
});
