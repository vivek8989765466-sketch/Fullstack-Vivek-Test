export const v2Theme = {
  colors: {
    primary: {
      50: 'from-purple-50 via-pink-50 to-indigo-50',
      100: 'bg-purple-100',
      200: 'border-purple-200 ring-purple-200',
      300: 'border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400',
      400: 'from-purple-400 to-pink-400',
      500: 'from-purple-500 to-pink-500',
      600: 'from-purple-600 to-pink-600',
      700: 'hover:from-purple-700 hover:to-pink-700',
      800: 'hover:text-purple-800',
    },
    accent: {
      50: 'bg-purple-50/50 border-purple-200',
      100: 'text-purple-100',
      200: 'border-purple-200',
      300: 'text-purple-300',
      400: 'text-purple-400',
      500: 'text-purple-500',
      600: 'text-purple-600 hover:text-purple-800',
      700: 'text-purple-700',
      800: 'text-purple-800',
    },
    background: {
      page: 'min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50',
      card: 'bg-white/90 backdrop-blur',
      header: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    },
    button: {
      primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg',
      secondary: 'bg-transparent border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400',
      outline: 'bg-transparent border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400',
    },
    input: {
      base: 'border-purple-200 ring-purple-200 focus:border-purple-500 focus:ring-purple-500',
      error: 'border-red-500 ring-red-200',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      accent: 'text-purple-600 hover:text-purple-800',
      white: 'text-white',
    }
  },
  spacing: {
    container: 'max-w-5xl',
    input: 'h-14',
    button: 'h-14 px-10',
  },
  layout: {
    form: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    header: 'text-center mb-8',
    card: 'shadow-xl border-0 overflow-hidden',
  }
}
