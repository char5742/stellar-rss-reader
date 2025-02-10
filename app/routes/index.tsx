import { createFileRoute } from '@tanstack/react-router';
import { useTheme } from '~/shared/interface/hooks/useTheme';

export const Route = createFileRoute('/')({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}

export function Index() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Stellar RSS Reader</h1>
			<div className="mb-4">
				<select
					value={theme}
					onChange={(e) =>
						setTheme(e.target.value as 'light' | 'dark' | 'system')
					}
					className="p-2 rounded border bg-white dark:bg-gray-800"
				>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
					<option value="system">System</option>
				</select>
			</div>
		</div>
	);
}
