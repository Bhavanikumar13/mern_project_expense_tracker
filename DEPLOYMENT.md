# Deployment Guide

## Backend Deployment

### Option 1: Render

1. Go to [Render](https://render.com) and sign up
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: expense-tracker-api
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_atlas_connection
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=production
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLIENT_URL=your_frontend_url
   ```
6. Click "Create Web Service"

### Option 2: Railway

1. Go to [Railway](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Deploy

## Frontend Deployment

### Option 1: Vercel

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
6. Deploy

### Option 2: Netlify

1. Go to [Netlify](https://netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select repository
4. Configure:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
6. Deploy

## Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Add this connection string to your backend environment variables

## Environment Setup

### Production Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your_production_secret_key_very_secure
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=https://your-frontend-domain.vercel.app
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-domain.render.com
```

## Gmail App Password Setup

1. Go to your Google Account settings
2. Security → 2-Step Verification (enable if not enabled)
3. Security → App passwords
4. Select "Mail" and "Other"
5. Copy the generated password
6. Use this as EMAIL_PASS in environment variables

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and loading
- [ ] MongoDB connection is working
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] Email functionality is working
- [ ] File uploads directory exists
- [ ] SSL/HTTPS is enabled
- [ ] API endpoints are accessible from frontend

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure CLIENT_URL in backend matches your frontend URL
   - Check CORS configuration in server.js

2. **MongoDB Connection Failed**
   - Verify connection string is correct
   - Check if IP address is whitelisted in MongoDB Atlas
   - Ensure password doesn't contain special characters

3. **Email Not Sending**
   - Verify Gmail app password is correct
   - Enable "Less secure app access" if using regular password
   - Check EMAIL_HOST and EMAIL_PORT settings

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json

5. **API Not Responding**
   - Check if PORT environment variable is set
   - Verify backend logs for errors
   - Ensure all required environment variables are set

## Monitoring & Maintenance

- Set up error logging (consider Sentry or LogRocket)
- Monitor database performance
- Set up automated backups for MongoDB
- Monitor API usage and set rate limits if needed
- Keep dependencies updated

## Security Best Practices

- Never commit .env files
- Use strong JWT secrets
- Enable HTTPS only in production
- Implement rate limiting
- Sanitize user inputs
- Keep dependencies updated
- Use helmet.js for security headers
- Implement CSRF protection

---

For more help, refer to the official documentation of each platform.
