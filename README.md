# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. This portfolio showcases professional experience, skills, education, and projects in an interactive and visually appealing format.

## Features

- **Interactive Resume**: Dynamic display of professional experience, skills, and education
- **Admin Dashboard**: Secure admin area for updating portfolio content
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Modern UI**: Clean, professional design using Tailwind CSS
- **TypeScript**: Type-safe code for better developer experience and fewer bugs
- **Supabase Integration**: Store and retrieve portfolio data using Supabase
- **Authentication**: User authentication via Supabase Auth

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Backend as a Service)
- **Database**: PostgreSQL (via Supabase)
- **Hosting**: Netlify
- **Authentication**: Supabase Auth

## Project Structure

```
├── src/
│   ├── components/     # React components
│   │   ├── admin/      # Admin dashboard components
│   │   └── auth/       # Authentication components
│   ├── config/         # Configuration files
│   │   └── supabase.ts # Supabase client configuration
│   ├── context/        # React context providers
│   ├── services/       # Service layer for API operations
│   ├── data.ts         # Static data
│   ├── types.ts        # TypeScript types
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── package.json        # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Supabase account (free tier available)

### Supabase Setup

1. Create a free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Set up the following tables in Supabase:
   - profiles
   - experiences
   - education
   - skills
   - languages
4. Get your Supabase URL and anon key from the project API settings

### Installation

1. Clone the repository
   ```
   git clone https://github.com/akashdeep527/Portfolio-Website.git
   cd Portfolio-Website
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the application

### Building for Production

1. Create a production build
   ```
   npm run build
   ```

2. Preview the production build locally
   ```
   npm run preview
   ```

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file contains the necessary configuration.

### Deploy to Netlify

1. Push your code to a GitHub repository
2. Create a new site in Netlify connected to your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add the environment variables from your `.env` file to Netlify's environment variables

## Admin Access

To access the admin dashboard:

1. Navigate to `/admin`
2. Log in with your Supabase account credentials
3. Use the dashboard to update your resume information

## Customization

### Updating Resume Data

Edit the data in the admin dashboard, which will save to your Supabase database.

### Changing the Theme

Modify the `tailwind.config.js` file to update colors, fonts, and other theme settings.

## Supabase Database Schema

The database uses the following schema:

1. **profiles**: User profile information
   - id (uuid, primary key, references auth.users.id)
   - full_name (text)
   - title (text)
   - about (text)
   - email (text)
   - phone (text)
   - location (text)
   - website (text)
   - avatar_url (text, optional)

2. **experiences**: Work experiences
   - id (int8, primary key)
   - user_id (uuid, references profiles.id)
   - company (text)
   - position (text)
   - start_date (date)
   - end_date (date, optional)
   - description (text)
   - current (boolean)

3. **education**: Educational background
   - id (int8, primary key)
   - user_id (uuid, references profiles.id)
   - institution (text)
   - degree (text)
   - field (text)
   - start_date (date)
   - end_date (date, optional)
   - description (text)

4. **skills**: Professional skills
   - id (int8, primary key)
   - user_id (uuid, references profiles.id)
   - name (text)
   - level (int2, 1-5 for skill level)
   - category (text)

5. **languages**: Language proficiency
   - id (int8, primary key)
   - user_id (uuid, references profiles.id)
   - name (text)
   - proficiency (text, e.g., 'Fluent', 'Intermediate', 'Beginner')

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Supabase for the powerful backend-as-a-service
- Netlify for the easy deployment platform 