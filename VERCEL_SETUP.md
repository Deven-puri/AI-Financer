# Vercel Deployment Setup

## Environment Variables Required

You need to set the following environment variables in your Vercel project settings:

1. **REACT_APP_FIREBASE_API_KEY** - Your Firebase API key
2. **REACT_APP_GROQ_API_KEY** (optional) - Your GROQ API key for AI features

## How to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Go to **Environment Variables**
4. Add each variable:
   - **Name**: `REACT_APP_FIREBASE_API_KEY`
   - **Value**: Your Firebase API key
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. Repeat for `REACT_APP_GROQ_API_KEY` if needed
7. **Redeploy** your application after adding variables

## Important Notes:

- After adding environment variables, you MUST redeploy for them to take effect
- The build will succeed without these, but the app won't work properly
- Make sure to add variables for all environments (Production, Preview, Development)

## Troubleshooting:

If your site shows a blank page:
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Check Vercel build logs for any errors
4. Make sure you redeployed after adding environment variables

