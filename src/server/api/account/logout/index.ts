export default defineEventHandler(async (event) => {
	deleteCookie(event, 'refresh_token');
	deleteCookie(event, 'access_token');
	deleteCookie(event, 'token_type');

	event.node.res.end();

	return;
});
