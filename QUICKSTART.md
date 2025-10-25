# Quick Start Guide

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js (v14 or higher) installed
- ✅ MongoDB installed and running (or MongoDB Atlas account)
- ✅ Git installed (optional)

## Quick Setup (5 minutes)

### Method 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Method 2: Manual Setup

1. **Install Dependencies**
```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

2. **Configure Environment**
```bash
# Copy example env file
cp .env.example .env

# Edit .env and update:
# - MONGO_URI with your MongoDB connection string
# - JWT_SECRET with a secure random string
# - Email settings if you want email functionality
```

3. **Start the Application**
```bash
# Start both frontend and backend
npm run dev-all

# OR start separately:
# Backend: npm run dev
# Frontend: cd client && npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## First Time Setup

1. **Register a New Account**
   - Go to http://localhost:5173
   - Click "Sign Up"
   - Enter your details
   - You'll be automatically logged in

2. **Explore Default Categories**
   - Default categories are created automatically
   - Go to Categories page to view them

3. **Add Your First Transaction**
   - Click "Add Transaction" button
   - Fill in the details
   - Submit

4. **View Dashboard**
   - See your financial overview
   - Interactive charts update automatically

## Troubleshooting

### MongoDB Connection Error

**Problem:** `MongoDB connection error` in console

**Solutions:**
1. **Local MongoDB:**
   - Make sure MongoDB is running: `mongod`
   - Check if port 27017 is available
   - Update MONGO_URI in .env: `mongodb://localhost:27017/expense-tracker`

2. **MongoDB Atlas:**
   - Get connection string from Atlas
   - Replace `<password>` with your actual password
   - Whitelist your IP address in Atlas

### Port Already in Use

**Problem:** Port 5000 or 5173 already in use

**Solution:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

### Frontend Not Loading

**Problem:** Blank page or errors in browser console

**Solutions:**
1. Clear browser cache
2. Check if backend is running
3. Check browser console for specific errors
4. Verify VITE_API_URL environment variable

### Dependencies Installation Fails

**Problem:** npm install errors

**Solutions:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm cache clean --force`
3. Run `npm install` again
4. Update Node.js to latest LTS version

## Testing the Application

### Test User Registration
```bash
# Use API testing tool (Postman/Thunder Client)
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Transaction Creation
```bash
# First login and get token, then:
POST http://localhost:5000/api/transactions
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Grocery Shopping",
  "amount": 50.00,
  "type": "expense",
  "category": "<category_id>",
  "date": "2025-10-20"
}
```

## Features to Try

1. **Dashboard**
   - View financial summary
   - See recent transactions
   - Interactive charts

2. **Transactions**
   - Add income/expense
   - Filter and search
   - Edit/delete transactions

3. **Analytics**
   - View detailed charts
   - Category breakdown
   - Monthly trends

4. **Categories**
   - Create custom categories
   - Choose icons and colors
   - Manage categories

5. **Reports**
   - Download PDF reports
   - Export to CSV
   - Email reports

6. **Profile**
   - Update profile info
   - Upload profile picture
   - Set budget alerts
   - Change currency

7. **Theme**
   - Toggle dark/light mode
   - Persistent theme preference

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes reflect immediately
- Backend: Use `npm run dev` (nodemon)

### Database Management
```bash
# Connect to MongoDB shell
mongo

# Use the database
use expense-tracker

# View collections
show collections

# View users
db.users.find()

# Clear all transactions
db.transactions.deleteMany({})
```

### Reset Application
```bash
# Drop database and start fresh
mongo expense-tracker --eval "db.dropDatabase()"
```

## Production Checklist

Before deploying to production:
- [ ] Update all environment variables
- [ ] Use production MongoDB database
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Set up error logging
- [ ] Test all features
- [ ] Backup database
- [ ] Set up monitoring

## Need Help?

- Check the main [README.md](README.md)
- Review [DEPLOYMENT.md](DEPLOYMENT.md)
- Check GitHub Issues
- MongoDB Documentation
- React Documentation
- Express Documentation

## Common Commands Reference

```bash
# Development
npm run dev              # Start backend with nodemon
npm run client           # Start frontend
npm run dev-all          # Start both

# Production
npm start                # Start backend only
cd client && npm run build  # Build frontend

# Database
mongod                   # Start MongoDB
mongo                    # MongoDB shell

# Clean Install
rm -rf node_modules client/node_modules
rm package-lock.json client/package-lock.json
npm install
cd client && npm install
```

---

Happy expense tracking! 💰
