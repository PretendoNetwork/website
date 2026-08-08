import type { z, ZodType } from 'zod';

export async function readZodBody<T extends ZodType>(event: H3Event, schema: T): Promise<z.infer<T>> {
	const body = await readValidatedBody(event, schema.safeParse);
	if (!body.success) {
		throw createError({
			status: 400,
			statusText: 'Invalid input'
		});
	}
	return body.data;
}
