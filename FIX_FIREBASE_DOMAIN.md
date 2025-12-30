# Fix Firebase Unauthorized Domain Error

## Problem
Your Vercel domain `nancer-zbbp.vercel.app` is not authorized in Firebase, causing authentication to fail.

## Solution: Add Domain to Firebase

### Step-by-Step Instructions:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Select Your Project**
   - Click on: **finance-management-syste-fdaf8**

3. **Navigate to Authentication**
   - Click **Authentication** in the left sidebar
   - Click on the **Settings** tab (gear icon)

4. **Add Authorized Domains**
   - Scroll down to **Authorized domains** section
   - Click **Add domain** button

5. **Add Your Vercel Domains**
   Add these domains one by one:
   - `nancer-zbbp.vercel.app` (your current deployment)
   - `ai-financer.vercel.app` (if you have a custom domain)
   - `*.vercel.app` (for all Vercel preview deployments - if supported)
   
   For each domain:
   - Enter the domain name
   - Click **Add**

6. **Wait for Propagation**
   - Changes may take 1-5 minutes to take effect
   - Refresh your Vercel site and try signing in again

### Important Notes:
- You need to add each Vercel deployment URL separately
- Preview deployments use different URLs (e.g., `your-project-git-branch.vercel.app`)
- The domain `localhost` is already authorized by default (for local development)

### Quick Fix:
1. Open: https://console.firebase.google.com/project/finance-management-syste-fdaf8/authentication/settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Enter: `nancer-zbbp.vercel.app`
5. Click "Add"
6. Wait 2-3 minutes
7. Try signing in again on your Vercel site


