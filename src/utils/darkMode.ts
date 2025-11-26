// This file exports a shared dark mode utility for all pages
import { useThemeStore } from '../stores/themeStore';

export const useDarkModeClasses = () => {
    const { isDarkMode } = useThemeStore();

    return {
        isDarkMode,
        // Container classes
        page: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
        card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',

        // Text classes
        heading: isDarkMode ? 'text-white' : 'text-gray-900',
        subheading: isDarkMode ? 'text-gray-200' : 'text-gray-800',
        text: isDarkMode ? 'text-gray-300' : 'text-gray-600',
        label: isDarkMode ? 'text-gray-300' : 'text-gray-700',
        muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',

        // Input classes
        input: `${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500`,
        select: `${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500`,

        // Button classes
        buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
        buttonSecondary: isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300',

        // Border classes
        border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
        borderLight: isDarkMode ? 'border-gray-600' : 'border-gray-300',

        // Hover states
        hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    };
};
