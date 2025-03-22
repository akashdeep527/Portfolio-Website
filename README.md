# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. This portfolio showcases professional experience, skills, education, and projects in an interactive and visually appealing format.

## Features

- **Interactive Resume**: Dynamic display of professional experience, skills, and education
- **Admin Dashboard**: Secure admin area for updating portfolio content
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Modern UI**: Clean, professional design using Tailwind CSS
- **TypeScript**: Type-safe code for better developer experience and fewer bugs
- **MongoDB Integration**: Store and retrieve portfolio data using MongoDB

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js (optional)
- **Database**: MongoDB
- **Hosting**: Netlify
- **Authentication**: Firebase Authentication

## Project Structure

```
├── src/
│   ├── components/     # React components
│   │   ├── admin/      # Admin dashboard components
│   │   └── auth/       # Authentication components
│   ├── context/        # React context providers
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
- MongoDB Atlas account (for database features)

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
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_MONGODB_URI=your_mongodb_connection_string
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
2. Log in with admin credentials
3. Use the dashboard to update your resume information

## Customization

### Updating Resume Data

Edit the data in the admin dashboard or modify the `src/data.ts` file directly.

### Changing the Theme

Modify the `tailwind.config.js` file to update colors, fonts, and other theme settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Netlify for the easy deployment platform 