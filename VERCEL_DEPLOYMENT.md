# Vercel Deployment Guide

This project is now configured for deployment to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (optional, for CLI deployment):
   ```bash
   npm i -g vercel
   ```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure Vercel deployment"
   git push origin main
   ```

2. **Import project to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Configure Environment Variables**:
   - In the Vercel project settings, go to "Environment Variables"
   - Add the following variable:
     - `OPENAI_API_KEY` (your OpenAI API key, if you want to use the OpenAI proxy)

4. **Deploy**:
   - Click "Deploy" and Vercel will build and deploy your project

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   For production deployment:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   ```

## Project Structure

- **Frontend**: Built with Vite and React, output to `dist/public`
- **API Routes**: Serverless functions in the `api/` directory:
  - `/api/health` - Health check endpoint
  - `/api/openai-proxy` - OpenAI proxy endpoint (requires OPENAI_API_KEY)
  - `/api/dummy-ai` - Fallback AI endpoint

## Configuration Files

- `vercel.json` - Vercel deployment configuration
- `.vercelignore` - Files to exclude from deployment
- `api/` - Serverless functions directory

## Environment Variables

Set these in your Vercel project settings:

- `OPENAI_API_KEY` (optional) - Your OpenAI API key for the AI proxy feature

## Build Process

Vercel will automatically:
1. Run `npm install`
2. Run `npm run build` (builds frontend to `dist/public`)
3. Deploy the frontend as static files
4. Deploy API functions from the `api/` directory as serverless functions

## Troubleshooting

- If the build fails, check the build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- The API functions use Node.js 20.x runtime
- Frontend routes are handled by the SPA rewrite rule in `vercel.json`

