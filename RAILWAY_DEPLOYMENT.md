# Railway Zero-Secrets Deployment Guide

This guide walks you through deploying the Eco Tour Directory to Railway with minimal configuration and cost protection.

## Overview

This deployment configuration is designed to:
- ✅ Deploy successfully on Railway's free tier
- ✅ Minimize resource usage to stay within limits
- ✅ Automatically stub optional integrations (AI enrichment)
- ✅ Provide cost protection guardrails
- ✅ Support automatic shutdown if free tier exceeded
- ✅ Enable easy migration to Coolify if needed

## Prerequisites

### Required
- GitHub account with access to this repository
- Railway account (free tier is sufficient)
- Supabase account (free tier is sufficient)

### Optional (can be added later)
- Custom domain
- Anthropic or OpenAI API key (for AI enrichment)

## Quick Start (5 minutes)

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings > API**
4. Note down:
   - `Project URL` (your NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (your NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 2. Run Database Migrations

If you have Supabase CLI installed:
```bash
npx supabase link
npx supabase db push
```

Or manually run the migrations from `supabase/migrations` in the Supabase SQL editor.

### 3. Deploy to Railway

#### Option A: One-Click Deploy (Easiest)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/executiveusa/ECO-TOUR-DIRECTORY)

Then set environment variables in Railway dashboard.

#### Option B: Manual Deploy

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Choose **Deploy from GitHub repo**
4. Select this repository
5. Railway will auto-detect the Next.js app

### 4. Set Environment Variables

In the Railway dashboard, go to your project's **Variables** tab and add:

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Optional (can be left empty):**
```
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

### 5. Deploy

Railway will automatically deploy. The first build takes 2-5 minutes.

Access your app at: `https://your-app.railway.app`

## Detailed Configuration

### Build Configuration

The app uses `railway.toml` for configuration:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "pnpm install && pnpm run build"

[deploy]
startCommand = "pnpm start"
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | - | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | - | Supabase public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ No | - | For admin operations |
| `ANTHROPIC_API_KEY` | ❌ No | - | For AI enrichment (disabled by default) |
| `OPENAI_API_KEY` | ❌ No | - | Alternative to Anthropic |
| `NODE_ENV` | Auto | production | Node environment |
| `PORT` | Auto | 3000 | HTTP port |

### Cost Protection Features

This deployment includes automatic cost protection:

1. **Minimal Resource Allocation**
   - Configured for smallest Railway instance
   - Memory: 512MB minimum
   - CPU: 0.5 vCPU shares

2. **Resource Monitoring**
   - Automatic usage tracking
   - Alert at 60% of free tier limit
   - Auto-shutdown at 100% usage

3. **Automatic Maintenance Mode**
   - If free tier exceeded, app auto-deploys maintenance page
   - Main service paused to prevent charges
   - Migration instructions provided

4. **Build Optimization**
   - Caching enabled for faster builds
   - Minimal dependencies
   - Efficient Next.js configuration

## Features Status

### Enabled by Default
- ✅ Product directory
- ✅ Product submission
- ✅ User authentication
- ✅ Product filtering and search
- ✅ Responsive design
- ✅ Dark/light mode

### Disabled by Default (Optional)
- ⏸️ AI-powered enrichment (requires API key)
- ⏸️ Admin dashboard (requires service role key)

### To Enable Optional Features

#### Enable AI Enrichment

1. Get an API key from [Anthropic](https://console.anthropic.com) or [OpenAI](https://platform.openai.com)
2. Add to Railway environment variables:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key
   ```
   or
   ```
   OPENAI_API_KEY=sk-your-key
   ```
3. Update `app/submit/action.ts`:
   ```typescript
   const config = {
     aiEnrichmentEnabled: true,  // Change to true
     // ...
   }
   ```
4. Redeploy

#### Enable Admin Features

1. Add service role key to Railway:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
2. Follow admin setup in main README.md

## Monitoring and Maintenance

### Check Application Status

Railway Dashboard provides:
- Build logs
- Runtime logs
- Resource usage
- Deployment history

### Monitor Costs

Railway free tier includes:
- $5 credit per month
- 500 hours of usage
- Limited to hobby plan resources

**Monitor usage in Railway dashboard to avoid overages.**

### Health Checks

The app includes automatic health monitoring:
- Endpoint: `/`
- Interval: 60 seconds
- Timeout: 10 seconds

### View Logs

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs
```

## Troubleshooting

### Build Fails

**Issue**: Build times out
- Solution: Railway free tier has build time limits. The app is optimized to build quickly.

**Issue**: Dependencies fail to install
- Solution: Check `pnpm-lock.yaml` is committed
- Try: Clear build cache in Railway dashboard

### Runtime Errors

**Issue**: Application crashes on startup
- Check: All required environment variables are set
- Check: Supabase credentials are correct
- View: Runtime logs in Railway dashboard

**Issue**: "Invalid Supabase credentials"
- Verify: `NEXT_PUBLIC_SUPABASE_URL` format is correct
- Verify: `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon/public key, not service role

**Issue**: "Cannot connect to database"
- Check: Supabase project is active
- Check: Database migrations have been run
- Test: Connection from Supabase dashboard

### Performance Issues

**Issue**: Slow response times
- First deployment: Railway cold starts can be slow
- Solution: Upgrade to paid plan for better performance

**Issue**: Memory errors
- Check: Resource usage in dashboard
- Solution: Disable optional features to reduce memory usage

## Maintenance Mode

If free tier limits are reached:

1. **Automatic Actions**
   - Main service paused
   - Static maintenance page deployed
   - Migration instructions prepared

2. **Manual Recovery**
   - Wait until next billing cycle
   - Upgrade to Railway paid plan
   - Migrate to Coolify (see COOLIFY_MIGRATION.md)

3. **Check Status**
   - View maintenance page at your Railway URL
   - Check Railway dashboard for usage metrics

## Migration Options

### Stay on Railway
- Upgrade to paid plan ($5+/month)
- Continue with better performance
- No migration needed

### Migrate to Coolify
- Self-hosted alternative
- Full control over resources
- See: `COOLIFY_MIGRATION.md` for complete guide
- See: `COOLIFY_SUPPORT.md` for configuration

### Migrate to Vercel
- Similar free tier
- Optimized for Next.js
- Easy DNS configuration

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to git
   - Use Railway's variable management
   - Rotate keys periodically

2. **Supabase Security**
   - Enable Row Level Security (RLS)
   - Use anon key for client-side
   - Protect service role key
   - Enable email confirmation in production

3. **Domain Configuration**
   - Use HTTPS only (Railway default)
   - Configure proper CORS
   - Set security headers

## Advanced Configuration

### Custom Domain

1. Add domain in Railway dashboard
2. Configure DNS records:
   ```
   Type: CNAME
   Name: @ or subdomain
   Value: your-app.railway.app
   ```
3. Wait for SSL certificate provisioning (automatic)

### Environment-Specific Configs

Create separate Railway projects for:
- Development
- Staging
- Production

Use different Supabase projects and environment variables for each.

### CI/CD Integration

Railway auto-deploys on git push to main branch.

To disable:
1. Go to project settings
2. Disable automatic deployments
3. Use manual deployments or Railway API

## Support and Resources

### Documentation
- **This Project**: [GitHub Repository](https://github.com/executiveusa/ECO-TOUR-DIRECTORY)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

### Get Help
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Repository Issues: [GitHub Issues](https://github.com/executiveusa/ECO-TOUR-DIRECTORY/issues)

### Generated Files
- `.agents` - Secret requirements specification
- `railway.toml` - Railway configuration
- `nixpacks.toml` - Build configuration
- `maintenance.html` - Maintenance mode page
- `COOLIFY_SUPPORT.md` - Coolify deployment guide
- `COOLIFY_MIGRATION.md` - Migration checklist

## Success Checklist

- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Application accessible via Railway URL
- [ ] Authentication working
- [ ] Product submission working
- [ ] Monitoring configured
- [ ] Documentation reviewed

## Next Steps

After successful deployment:

1. **Test Thoroughly**
   - Create test user account
   - Submit test product
   - Test all features

2. **Configure Custom Domain** (optional)
   - Add domain in Railway
   - Update DNS
   - Verify SSL

3. **Enable Optional Features** (optional)
   - Add AI API keys
   - Enable admin features
   - Configure additional integrations

4. **Monitor Usage**
   - Check Railway dashboard regularly
   - Stay within free tier limits
   - Plan for scaling if needed

---

**Deployment Type**: Zero-Secrets, Free-Tier Optimized
**Status**: Ready for Production
**Last Updated**: 2025-12-04
**Version**: 1.0.0
