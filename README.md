# Transportation Evolution Visualization

An interactive web visualization exploring the history and future of urban transportation, built with Next.js, Framer Motion, and Recharts.

## Overview

This project provides an immersive scrollytelling experience that visualizes:

- Current transportation mode splits
- Historical trends (2010-2020)
- Environmental impact of different transport modes
- Commute time analysis
- Future projections and smart city concepts

## Features

- 📊 Interactive data visualizations using Recharts
- 🎯 Smooth scroll-based animations with Framer Motion
- 🎨 Responsive city map visualization with Canvas
- 🌗 Light/dark mode support
- 📱 Mobile-responsive design

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Composable charting library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icons

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/transportation-evolution.git
cd transportation-evolution
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── city-map.tsx         # Canvas-based city visualization
│   └── transportation-scrollytelling.tsx
└── lib/             # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
