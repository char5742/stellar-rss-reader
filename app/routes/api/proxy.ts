import { createAPIFileRoute } from '@tanstack/start/api';

export const APIRoute = createAPIFileRoute('/api/proxy')({
	GET: async ({ request }) => {
		const query = new URLSearchParams(request.url.split('?')[1]);
		const targetUrl = (query.get('url') as string) || '';
		if (!targetUrl) {
			return new Response('URL parameter is required.', { status: 400 });
		}
		const response = await fetch(targetUrl);

		if (!response.ok) {
			return new Response('Error fetching the target URL.', {
				status: response.status,
			});
		}

		return new Response(response.body, {
			status: response.status,
			headers: [
				['Content-Type', response.headers.get('content-type') || 'text/plain'],
			],
		});
	},
});
