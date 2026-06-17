# GovAssist Deployment Guide

## Why GitHub Pages Won't Work

GitHub Pages only supports **static websites** (HTML, CSS, JavaScript). Your GovAssist app uses:
- **Server-side API routes** (`/app/api/chat/route.ts`)
- **Environment variables** for API keys
- **Next.js dynamic features**

These require a **Node.js server**, which GitHub Pages doesn't provide.

---

## ✅ Solution: Deploy to Vercel (Recommended)

Vercel is the **official hosting platform** for Next.js apps. It's **free** and takes 5 minutes.

### Step 1: Push Your Code to GitHub

1. Make sure your code is pushed to GitHub
2. **IMPORTANT**: Your `.env.local` file is already in `.gitignore` (good!), so your API keys are NOT uploaded

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. Click **"Import Project"**
4. Select your **GovAssist repository** from GitHub
5. Vercel will auto-detect it's a Next.js app

### Step 3: Add Environment Variables

Before clicking "Deploy", you need to add your environment variables:

1. In the Vercel deployment screen, scroll to **"Environment Variables"**
2. Add these variables (copy from your `.env.local` file):

```
OPENAI_API_KEY=sk-proj-********************************

XAI_API_KEY=xai-your-grok-key-here

NEXT_PUBLIC_SUPABASE_URL=https://rhdoftupnfceaoqrltvs.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoZG9mdHVwbmZjZWFvcXJsdHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5Nzk3ODQsImV4cCI6MjA4NjU1NTc4NH0.bF_7gJLyitbmGmckoAUYh9zZO7AnA1_ysYymxG9F9bo
```

3. Click **"Deploy"**

### Step 4: Your App is Live! 🎉

- Vercel will give you a URL like: `https://your-app-name.vercel.app`
- Every time you push to GitHub, Vercel will **auto-deploy** the updates

---

## Alternative: Deploy to Netlify

If you prefer Netlify:

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Add the same environment variables in **Site settings → Environment variables**
5. Deploy!

---

## Important Notes

### 🔒 Security
- **Never commit `.env.local`** to GitHub (it's already in `.gitignore`)
- Your API keys are safe - they're only stored in Vercel/Netlify's secure environment

### 🔄 Auto-Deployment
- Both Vercel and Netlify will **automatically redeploy** when you push to GitHub
- No manual steps needed after initial setup

### 💰 Cost
- Both platforms have **generous free tiers** perfect for your app
- Vercel Free: Unlimited personal projects
- Netlify Free: 100GB bandwidth/month

---

## Troubleshooting

### "Build Failed" Error
If deployment fails, check:
1. Run `npm run build` locally first to catch errors
2. Make sure all dependencies are in `package.json`
3. Check the build logs in Vercel/Netlify dashboard

### "API Route Not Working"
1. Verify environment variables are set correctly
2. Check that variable names match exactly (case-sensitive)
3. Redeploy after adding/changing environment variables

### "Supabase Connection Error"
1. Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. Verify your Supabase project is active
3. Check Supabase dashboard for any issues

---

## Quick Comparison

| Feature | GitHub Pages | Vercel | Netlify |
|---------|-------------|--------|---------|
| Static Sites | ✅ | ✅ | ✅ |
| Server-side Code | ❌ | ✅ | ✅ |
| Environment Variables | ❌ | ✅ | ✅ |
| Next.js Support | ❌ | ✅ (Best) | ✅ |
| Auto-Deploy from GitHub | ✅ | ✅ | ✅ |
| Free Tier | ✅ | ✅ | ✅ |

**Verdict**: Use **Vercel** for Next.js apps (it's made by the Next.js team!)

---

## Need Help?

If you encounter any issues during deployment, let me know and I'll help troubleshoot!
