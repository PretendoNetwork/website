export function slugify(str: string): string {
	return str.toLowerCase().replaceAll(/ /g, '-');
}
