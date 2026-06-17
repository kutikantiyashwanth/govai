# FINAL DEPLOYMENT STEPS FOR GOVASSISTANT

**You are almost there!** Since your Vercel project is `govassistant`, please follow these exact steps to fix the login issue:

## Step 1: Add Environment Variables in Vercel

1.  Go to: [https://vercel.com/kutikantiyashwanths-projects/govassistant/settings/environment-variables](https://vercel.com/kutikantiyashwanths-projects/govassistant/settings/environment-variables)
2.  Add **Key**: `NEXT_PUBLIC_SUPABASE_URL`
    *   **Value**: `https://rhdoftupnfceaoqrltvs.supabase.co`
3.  Add **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoZG9mdHVwbmZjZWFvcXJsdHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5Nzk3ODQsImV4cCI6MjA4NjU1NTc4NH0.bF_7gJLyitbmGmckoAUYh9zZO7AnA1_ysYymxG9F9bo`
4.  **Save**.

## Step 2: REDEPLOY (Crucial!)

**Your changes won't work until you redeploy.**

1.  Go to: [https://vercel.com/kutikantiyashwanths-projects/govassistant/deployments](https://vercel.com/kutikantiyashwanths-projects/govassistant/deployments)
2.  Find the top deployment.
3.  Click the **three dots (⋮)** on the right.
4.  Click **Redeploy**.

## Step 3: Update Supabase URL Configuration

1.  Go to your Supabase Dashboard: [https://supabase.com/dashboard/project/rhdoftupnfceaoqrltvs/auth/url-configuration](https://supabase.com/dashboard/project/rhdoftupnfceaoqrltvs/auth/url-configuration)
2.  **Site URL**: Enter your live Vercel URL. It is likely:
    *   `https://govassistant.vercel.app`
    *(Check your Vercel dashboard to be sure of the exact link)*.
3.  **Redirect URLs**: Add this exact URL:
    *   `https://govassistant.vercel.app/**`
4.  **Save**.

## Step 4: Test Login

Go to `https://govassistant.vercel.app/login` and try to sign up or log in. It should work perfectly now!
