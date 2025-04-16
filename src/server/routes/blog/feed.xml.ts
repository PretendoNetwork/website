import { Feed } from 'feed';

export default defineEventHandler(async (event) => {
	const allPosts = await queryCollection(event, 'blog').all();

	const posts = allPosts.filter(p => !p.path.startsWith('/blog/_')).sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	const feed = new Feed({
		title: 'Pretendo Network Blog',
		description: 'The latest updates in condensed chunks',
		updated: new Date(posts[0].date),
		id: 'http://pretendo.network/',
		link: 'https://pretendo.network/blog/',
		image: 'https://pretendo.network/assets/images/opengraph/opengraph-image.png',
		favicon: 'http://pretendo.network/favicon.ico',
		copyright: 'Pretendo Network',
		feedLinks: {
			atom: 'https://pretendo.network/blog/rss.xml'
		}
	});

	posts.forEach((post) => {
		feed.addItem({
			title: post.title,
			id: post.path,
			link: `https://pretendo.network/${post.path}`,
			description: post.caption,
			author: [
				{
					name: post.author
				}
			],
			date: new Date(post.date),
			image: `https://pretendo.network/${post.cover_image}`
		});
	});

	feed.addCategory('Technology');

	event.res.setHeader('content-type', 'text/xml');

	return feed.rss2();
});
