import { Link } from '@tanstack/react-router';
import { useTheme } from '~/hooks/useTheme';

interface RootLayoutProps {
	children: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
	const { currentTheme } = useTheme();

	return (
		<div className={`min-h-screen ${currentTheme}`}>
			<nav className="bg-white dark:bg-gray-800 shadow mb-4">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-4">
							<Link
								to="/"
								className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
								activeProps={{ className: 'text-blue-500 dark:text-blue-400' }}
							>
								ホーム
							</Link>
							<Link
								to="/feeds"
								className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
								activeProps={{ className: 'text-blue-500 dark:text-blue-400' }}
							>
								フィード管理
							</Link>
							<Link
								to="/about"
								className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
								activeProps={{ className: 'text-blue-500 dark:text-blue-400' }}
							>
								About
							</Link>
						</div>
					</div>
				</div>
			</nav>
			<main className="container mx-auto px-4">{children}</main>
		</div>
	);
};
