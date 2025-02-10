import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
	component: About,
});

export function About() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">About</h1>
			<p>
				Stellar RSS Reader
				は、モダンで使いやすいRSSリーダーを目指して開発されています。
			</p>
		</div>
	);
}
