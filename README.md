# Rockie - Cryptocurrency Trading Platform

<div align="center">
  <img src="/public/logo.svg" alt="Rockie Platform Logo" width="200">
  <p><em>Trade cryptocurrencies with modern tools and real-time data</em></p>

  [![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Latest-darkgreen?style=flat-square&logo=supabase)](https://supabase.io/)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
</div>

## 📋 Overview

Rockie is a comprehensive cryptocurrency trading platform built with modern web technologies. This project provides a seamless trading experience with real-time market data, user authentication, personalized dashboards, and advanced trading tools.

[🔗 Live Demo](https://turkcell-gygy-final.vercel.app/tr)

## ✨ Features

- **🌐 Multi-language Support**: Complete internationalization with next-intl
- **🌓 Theme Switching**: Seamless toggle between light and dark modes
- **🔐 User Authentication**: Secure sign-up, login, and account management via Supabase
- **📊 Real-time Market Data**: Live cryptocurrency prices, market trends, and order book
- **📈 Interactive Charts**: TradingView integration for professional crypto analysis
- **⭐ Favorites System**: Save and organize your preferred cryptocurrencies
- **💼 Personalized Dashboard**: Custom trading interface with watchlists and order history
- **📱 Responsive Design**: Optimized experience across desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/) with [React 19](https://react.dev/) - App Router architecture
- [React Bootstrap](https://react-bootstrap.github.io/) - UI components framework
- [SCSS/SASS](https://sass-lang.com/) with CSS Modules - Styling solution
- [Zustand](https://github.com/pmndrs/zustand) - State management library
- [React Hook Form](https://react-hook-form.com/) with [Yup](https://github.com/jquense/yup) - Form management and validation

### Backend & Services
- [Supabase](https://supabase.io/) - Backend-as-a-Service for authentication and database
- [TradingView Widgets](https://www.tradingview.com/widget/) - Professional trading charts
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization framework
- [Tanstack Query](https://tanstack.com/query/latest) - Data fetching and cache management

### Development Tools
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Lucide React](https://lucide.dev/) & [Bootstrap Icons](https://icons.getbootstrap.com/) - Icon libraries
- [Skeleton Loading](https://www.npmjs.com/package/react-loading-skeleton) - Loading state UI

## 🗂️ Project Structure

```
src/
├── app/                  # Next.js app router pages and layouts
│   ├── [locale]/         # Localization routes
│   │   ├── (main)/       # Landing pages
│   │   └── dashboard/    # Dashboard pages
├── components/           # React components organized by feature
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard UI components
│   ├── landing-page/     # Homepage components
│   ├── market/           # Market data components
│   └── profile/          # User profile components
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization configuration
├── lib/                  # Shared utility functions and type definitions
├── store/                # Zustand state management
│   ├── favoritesStore.ts # Favorites state management
│   ├── sidebar-store.ts  # Sidebar state management
│   └── themeStore.ts     # Theme state management
├── utils/                # Utility functions
│   └── supabase/         # Supabase client setup
└── middleware.ts         # Next.js middleware configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Supabase account for backend services

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rockie-platform.git
   cd rockie-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 💡 Usage Examples

### Theme Switching

```tsx
import { useThemeStore } from "@/store/themeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? <Moon /> : <Sun />}
    </button>
  );
}
```

### Authentication

```tsx
import { login } from "@/components/auth/actions";

// In your form submit handler
const handleSubmit = (data: LoginFormData) => {
  login(data);
};
```

### Favorites System

```tsx
import { useFavoriteStore } from "@/store/favoritesStore";
import { toggleFavoriteCoin } from "@/hooks/toggleFavorites";

export default function CoinRow({ coinId }) {
  const isFavorite = useFavoriteStore((state) => state.isFavorite(coinId));
  
  const handleFavoriteClick = async () => {
    await toggleFavoriteCoin(coinId);
  };
  
  return (
    <StarIcon
      fill={isFavorite ? "#ffc107" : "none"}
      onClick={handleFavoriteClick}
    />
  );
}
```

## 🌐 API Endpoints

The application uses the following key API endpoints:

- **Cryptocurrency Data**: CoinGecko API for market data
- **User Authentication**: Supabase Auth API
- **User Preferences**: Supabase Database

## 📦 Deployment

This application can be easily deployed on [Vercel](https://vercel.com/) or any other platform that supports Next.js:

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm run start
# or
yarn start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.io/) - Open source Firebase alternative
- [TradingView](https://www.tradingview.com/) - Financial visualization platform
- [React Bootstrap](https://react-bootstrap.github.io/) - Bootstrap components built with React
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Turkcell GYGY Program](https://gelecegiyazanlar.turkcell.com.tr/) - For the opportunity to build this project

---

<div align="center">
  <p>Developed with ❤️ by [Hikmet Melik FIRAT]</p>
</div>
