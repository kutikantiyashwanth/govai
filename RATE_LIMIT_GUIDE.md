# 🛑 Fixing Supabase Rate Limit Errors

If you are seeing **"Rate limit reached"** or **"Too many attempts"**, it is because Supabase is preventing spam by limiting how many sign-up/sign-in emails can be sent in a short time.

## ✅ How to Fix (For Development)

Since you are in development, you should legitimate **disable email verification**. This allows you to create accounts instantly without triggering email rate limits.

1.  **Open Supabase Dashboard**
    *   Go to: [https://supabase.com/dashboard/project/rhdoftupnfceaoqrltvs/auth/providers](https://supabase.com/dashboard/project/rhdoftupnfceaoqrltvs/auth/providers)
    *   *(If that link doesn't work, go to Authentication > Providers > Email)*

2.  **Configure Email Provider**
    *   Find **Email** in the list and click it.
    *   **Disable** "Confirm email" (Toggle it OFF).
    *   **Save** the settings.

## 🚀 What this does
*   Users are confirmed immediately upon sign-up.
*   No emails are sent, so you won't hit the "Email Rate Limit".
*   You can log in instantly.

## ⚠️ Still stuck?
If you are currently rate-limited (blocked), you have two options:
1.  **Wait**: The block usually lasts 60 minutes for repeated offenses, or ~60 seconds for minor ones.
2.  **Use a different email**: The limit is often per-email-address (unless you hit the IP limit). Try `test2@example.com`.
