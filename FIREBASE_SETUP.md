# Firebase Setup for Vercel Deployment

## Fix: "auth/unauthorized-domain" Error

This error occurs because your Vercel domain is not authorized in Firebase. Follow these steps to fix it:

### Step 1: Get Your Vercel Domain
1. Go to your Vercel project dashboard
2. Your domain will be something like: `your-project.vercel.app`
3. Also note any custom domains you've added

### Step 2: Add Domain to Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **finance-management-syste-fdaf8**
3. Click on the **Authentication** icon in the left sidebar
4. Click on **Settings** tab
5. Scroll down to **Authorized domains**
6. Click **Add domain**
7. Add your Vercel domain (e.g., `your-project.vercel.app`)
8. If you have a custom domain, add that too
9. Click **Add**

### Step 3: Common Domains to Add
- `localhost` (already added by default)
- `your-project.vercel.app` (your Vercel deployment URL)
- `your-project-git-main.vercel.app` (preview deployments)
- Any custom domains you're using

### Step 4: Verify
After adding the domain, wait a few minutes for changes to propagate, then try signing in again.

## Important Notes:
- Changes may take a few minutes to take effect
- You need to add each Vercel deployment URL separately
- Preview deployments use different URLs (e.g., `your-project-git-branch.vercel.app`)

