# learn.play: The Interactive Video Game History Curriculum

**learn.play** is a gamified, mobile-first web application designed to guide a "Historian" (Dad) and "Apprentice" (Son) through a 50-week video game history curriculum. It transforms static learning materials into an engaging, interactive experience with progress tracking, rich media, and AI-powered lesson generation.

## 🚀 Features

### Core Experience
*   **Curriculum Timeline**: A 50-week journey through video game history, organized by "Blocks" (eras).
*   **Gamification**: Track XP, Levels, and Streaks to stay motivated.
*   **Game Library**: A searchable bibliography of all games in the curriculum.
*   **Side Quests & Readlist**: Track extra challenges and related books/movies.

### The Historian's Manual (AI Powered)
*   **Dynamic Content**: Generates a custom "magazine-style" manual for each week using Google Gemini AI.
*   **Contextual Learning**: Provides historical context, educational angles, and "Dad Tips" for every game.
*   **Interactive UI**: Features a beautiful, responsive layout with sticky navigation and hero images.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
*   **UI Library**: [Material UI v6](https://mui.com) (with custom dark theme)
*   **Database**: PostgreSQL (via Docker)
*   **ORM**: [Prisma](https://www.prisma.io)
*   **AI**: Google Gemini API (`gemini-2.5-flash`)
*   **Containerization**: Docker & Docker Compose

## 📦 Getting Started

### Prerequisites
*   Docker & Docker Compose
*   Node.js 18+ (for local development)
*   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd dadguide.videogames
    ```

2.  **Start the Application (Docker)**
    ```bash
    docker-compose up -d --build
    ```
    The app will be available at `http://localhost:3002`.

3.  **Database Setup**
    The application uses a PostgreSQL database. Ensure the container is running and seed the initial data:
    ```bash
    # Run the seed script inside the container
    docker exec learn-play node scripts/seed.js
    ```

4.  **Configure AI**
    Navigate to `/settings` in the app and enter your Google Gemini API Key to enable the Historian's Manual features.

## 🤝 Contributing

This is a personal project for a father-son duo, but ideas and suggestions are welcome!

## 📄 License

MIT

