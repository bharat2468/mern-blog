# MERN Blog Application

A full-stack blog platform designed for seamless content management and engaging user interaction, built using the MERN stack with several advanced technologies.

## Deployment

- **Frontend**: [Vercel Deployment Link](mern-blog-jet-three.vercel.app)
- **Backend**: [Render Deployment Link](https://mern-blog-api-v0xf.onrender.com)

## Features

- **User Authentication**: Implemented secure login and registration via **Google OAuth** for a smooth user experience.
- **Content Management**: Users can create, edit, delete, and interact with blog posts, comments, and likes.
- **Search Functionality**: Enhanced post search with filters for query and date, ensuring efficient content discovery.
- **Optimized Data Handling**: Leveraged **React Query** for caching and **Mongoose** aggregation pipelines for efficient backend data processing.
- **SEO-Friendly Slugs**: Implemented **Slugify** for generating clean and SEO-optimized URLs based on blog titles.
- **Form Handling and Validation**: Used **React Hook Form** for efficient and minimal re-renders during form input, with backend validation provided by **Zod**.
- **Image Upload**: Integrated **Cloudinary** for handling media uploads and optimization.
- **Theme Changer**: Users can switch between light and dark themes for a personalized experience.
- **Pagination**: Implemented pagination to handle large sets of posts efficiently.
- **Profile Management**: Users can manage their profiles, including updating personal information.
- **Admin Dashboard**: Admins have access to a dashboard for managing posts, users, and comments. They can view, modify, and delete content.
- **Admin-Only Post Creation**: Restricted post creation to admins only, ensuring control over content.

## Key Technologies

- **React Query**: For managing server state, caching, and implementing optimistic updates.
- **Mongoose**: Utilized aggregation pipelines for efficient data querying and manipulation.
- **React Hook Form**: For lightweight and efficient form handling with validation support.
- **Google OAuth**: Implemented secure and easy user authentication.
- **Slugify**: To generate SEO-friendly URLs.
- **Zod**: For schema validation on the backend.
- **DaisyUI**: For beautiful, component-based UI design.
- **Redux**: State management to handle global state efficiently.

## Other Technologies

- **bcrypt**: For securely hashing and storing user passwords.
- **Cloudinary**: For image and media upload, transformation, and management.
- **CORS**: Ensured secure cross-origin resource sharing.
- **React Router DOM**: For routing and navigation across the application.

## Tech Stack

- **Frontend**: JavaScript, React, React Query, Redux, DaisyUI, React Hook Form.
- **Backend**: Node.js, Express, MongoDB, Mongoose, Zod, bcrypt, Cloudinary.
- **Database**: MongoDB with Mongoose for data modeling and aggregation.
- **Authentication**: Google OAuth for user login.

