import { useTheme } from '../hooks/useTheme';

interface RootLayoutProps {
	children: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
	const { currentTheme } = useTheme();

	return <div className={`min-h-screen ${currentTheme}`}>{children}</div>;
};
