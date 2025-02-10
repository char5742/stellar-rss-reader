import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
// biome-ignore lint/style/useImportType: <explanation>
import * as React from 'react'; // Changed from "import type * as React"hanged from "import type * as React"
import { RootLayout } from '~/layouts/RootLayout';
import appCss from '~/styles/app.css?url';
import { seo } from '~/utils/seo';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			...seo({
				title:
					'Stellar RSS Reader - The best way to read your favorite RSS feeds',
				description:
					'Stellar RSS Reader is the best way to read your favorite RSS feeds with a user-friendly interface and advanced features.',
			}),
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<RootLayout>
				<Outlet />
			</RootLayout>
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<Meta />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
