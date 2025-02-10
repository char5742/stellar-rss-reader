import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { RootLayout } from '../layouts/RootLayout';

export const Route = createRootRoute({
	component: () => (
		<RootLayout>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</RootLayout>
	),
});
