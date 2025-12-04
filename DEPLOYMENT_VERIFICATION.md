# Deployment Verification Guide

This document provides step-by-step verification procedures to ensure your Railway Zero-Secrets deployment is working correctly.

## Pre-Deployment Verification

### ✅ Configuration Files Check

Run this command to verify all deployment files are present:

```bash
ls -la .agents railway.toml nixpacks.toml maintenance.html RAILWAY_DEPLOYMENT.md COOLIFY_SUPPORT.md COOLIFY_MIGRATION.md
```

Expected output: All files should exist

### ✅ Integration Status Check

```bash
npm run integrations:check
```

Expected output:
```
AI Enrichment:
  Status: DISABLED
  Location: app/submit/action.ts
  Required: ANTHROPIC_API_KEY or OPENAI_API_KEY

Deployment Status:
  ✓ Ready for Railway free tier deployment
  ✓ No AI API keys required
  ✓ Cost-protected configuration
```

### ✅ Environment Variables Validation

Check that you have the required variables ready:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project settings
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project settings

Optional (can be added later):
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - For admin features
- [ ] `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` - For AI enrichment

### ✅ Supabase Setup Verification

1. **Database exists**: Verify your Supabase project is created
2. **Migrations applied**: Run `supabase db push` or apply migrations manually
3. **Tables created**: Verify tables exist in Supabase dashboard:
   - [ ] products
   - [ ] categories
   - [ ] tags
   - [ ] labels
   - [ ] auth.users (built-in)

## Deployment Verification

### Step 1: Initial Deployment

After deploying to Railway:

#### 1.1 Check Build Status

In Railway dashboard:
- [ ] Build started successfully
- [ ] Build completed without errors
- [ ] Build time < 5 minutes (typical)

Common build issues:
```bash
# Issue: pnpm not found
# Solution: Railway auto-installs via nixpacks.toml

# Issue: Out of memory during build
# Solution: Build is optimized for 512MB, should not exceed
```

#### 1.2 Check Runtime Status

- [ ] Application started successfully
- [ ] Health check passing
- [ ] No crash loops in logs

View logs in Railway dashboard or via CLI:
```bash
railway logs
```

#### 1.3 Verify Public URL

- [ ] Railway URL is accessible (e.g., `https://your-app.railway.app`)
- [ ] HTTPS certificate valid
- [ ] Page loads without errors

### Step 2: Functional Testing

#### 2.1 Homepage Test

Visit your Railway URL:
- [ ] Homepage loads successfully
- [ ] Product listings appear (or empty state if no products)
- [ ] Navigation menu works
- [ ] Dark/light mode toggle works
- [ ] No console errors in browser DevTools

#### 2.2 Authentication Test

Test user authentication:
```
1. Click "Login" or "Sign Up"
2. Register a new account
3. Check email for confirmation (if enabled)
4. Login successfully
5. Verify user session persists
```

Checklist:
- [ ] Sign up form works
- [ ] Login form works
- [ ] Authentication state persists
- [ ] Logout works

**Note**: If email confirmation is enabled and causing issues, disable it in Supabase:
- Go to Supabase Dashboard > Authentication > Providers > Email
- Uncheck "Confirm email"

#### 2.3 Product Submission Test

Test the core functionality:
```
1. Navigate to /submit
2. Fill out the product form
3. Upload a logo (optional)
4. Submit the form
5. Verify product appears in listing
```

Checklist:
- [ ] Submit form loads
- [ ] Form validation works
- [ ] Submission succeeds
- [ ] Product appears in database (check Supabase)
- [ ] Product appears on homepage after refresh

#### 2.4 Database Connectivity Test

Verify Supabase integration:
- [ ] Can fetch products from database
- [ ] Can insert new products
- [ ] Can update products (if applicable)
- [ ] Authentication queries work

Check in Supabase dashboard:
- [ ] Products table has data
- [ ] Auth users table has test user
- [ ] Storage bucket exists (if using image uploads)

### Step 3: Performance Testing

#### 3.1 Load Time Test

Measure page load times:
```bash
# Use browser DevTools Network tab or:
curl -w "@-" -o /dev/null -s https://your-app.railway.app << 'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
EOF
```

Target metrics:
- [ ] Homepage load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No 500 errors
- [ ] No 404 errors (except expected)

#### 3.2 Resource Usage Test

Monitor in Railway dashboard:
- [ ] Memory usage < 400MB (of 512MB allocated)
- [ ] CPU usage reasonable (spikes are normal)
- [ ] No out-of-memory errors
- [ ] No CPU throttling warnings

#### 3.3 Cold Start Test

Test after 10+ minutes of inactivity:
- [ ] First request completes (may be slow)
- [ ] Subsequent requests fast
- [ ] No timeout errors

Railway free tier may have cold starts. This is normal.

### Step 4: Security Verification

#### 4.1 Environment Variables Security

Verify secrets are not exposed:
```bash
# Check these URLs should NOT show secrets:
curl https://your-app.railway.app/api/health
curl https://your-app.railway.app/.env
curl https://your-app.railway.app/.env.local
```

- [ ] No environment variables exposed in HTML
- [ ] No API keys visible in browser DevTools
- [ ] `.env` files not accessible via HTTP
- [ ] Source maps disabled in production

#### 4.2 HTTPS Verification

- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Valid SSL certificate
- [ ] No mixed content warnings
- [ ] Security headers present

Check headers:
```bash
curl -I https://your-app.railway.app
```

Expected headers:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`

#### 4.3 Authentication Security

- [ ] Supabase RLS (Row Level Security) enabled
- [ ] Session management working
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection enabled

### Step 5: Cost Protection Verification

#### 5.1 Resource Limits Check

Verify cost protection is active:
- [ ] `railway.toml` present with resource limits
- [ ] Memory limit: 512MB
- [ ] CPU limit: 0.5 vCPU
- [ ] No runaway processes

#### 5.2 Usage Monitoring

Check Railway dashboard:
- [ ] Current usage < $5/month (free tier)
- [ ] Build minutes used (free tier: generous)
- [ ] Runtime hours used (free tier: 500 hours)
- [ ] No unexpected charges

#### 5.3 Maintenance Mode Test

**Do not trigger this in production!**

To verify maintenance mode works (in staging):
1. Rename `railway.toml` temporarily
2. Trigger a deployment
3. Verify maintenance page appears
4. Restore `railway.toml`

Expected behavior:
- [ ] Maintenance page displays
- [ ] Main service paused
- [ ] No charges during maintenance

### Step 6: Monitoring Setup

#### 6.1 Railway Dashboard Monitoring

Set up monitoring:
- [ ] Enable deployment notifications
- [ ] Set up Discord/Slack webhook (optional)
- [ ] Configure alert thresholds

#### 6.2 External Monitoring (Optional)

Set up external uptime monitoring:
- [ ] UptimeRobot: https://uptimerobot.com (free tier)
- [ ] Pingdom: https://www.pingdom.com
- [ ] StatusCake: https://www.statuscake.com

Monitor:
- [ ] Uptime percentage
- [ ] Response time
- [ ] SSL certificate expiry

#### 6.3 Log Monitoring

Configure log retention:
- [ ] Railway logs accessible
- [ ] Error logs visible
- [ ] Warning logs visible
- [ ] Info logs visible (optional)

## Post-Deployment Checklist

### Immediate (Within 1 hour)

- [ ] All functional tests passing
- [ ] No errors in Railway logs
- [ ] Application accessible via public URL
- [ ] Core features working (auth, submit, list)
- [ ] Database connectivity verified

### Short-term (Within 24 hours)

- [ ] Monitor usage metrics
- [ ] Check for any error patterns
- [ ] Verify email notifications (if enabled)
- [ ] Test from different devices
- [ ] Test from different networks

### Medium-term (Within 1 week)

- [ ] Review resource usage trends
- [ ] Monitor costs (should be $0 on free tier)
- [ ] Collect user feedback
- [ ] Identify performance bottlenecks
- [ ] Plan optimizations if needed

## Troubleshooting Common Issues

### Issue: Build Fails

**Symptoms**: Build fails in Railway dashboard

**Solutions**:
1. Check build logs for specific error
2. Verify `nixpacks.toml` is present
3. Ensure `pnpm-lock.yaml` is committed
4. Check Node version compatibility
5. Clear build cache in Railway

### Issue: Application Crashes on Startup

**Symptoms**: App starts then immediately crashes

**Solutions**:
1. Check runtime logs in Railway
2. Verify environment variables are set
3. Check Supabase credentials are correct
4. Verify database migrations applied
5. Check for missing dependencies

### Issue: Database Connection Fails

**Symptoms**: "Cannot connect to Supabase" errors

**Solutions**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Check Supabase project is active (not paused)
4. Verify network connectivity
5. Check Supabase dashboard for issues

### Issue: Slow Performance

**Symptoms**: Pages load slowly, timeouts

**Solutions**:
1. Check Railway resource usage
2. Optimize database queries
3. Enable caching
4. Reduce image sizes
5. Consider upgrading Railway plan

### Issue: Out of Memory

**Symptoms**: Application crashes with OOM errors

**Solutions**:
1. Reduce concurrent operations
2. Optimize memory usage in code
3. Disable optional features (AI enrichment)
4. Increase memory limit in `railway.toml`
5. Upgrade to paid Railway plan

### Issue: Free Tier Exceeded

**Symptoms**: Service paused, maintenance page shows

**Solutions**:
1. Wait for next billing cycle
2. Upgrade to Railway paid plan
3. Optimize resource usage
4. Migrate to Coolify (see COOLIFY_MIGRATION.md)

## Success Metrics

Your deployment is successful when:

### Technical Metrics
- [ ] Uptime > 99%
- [ ] Homepage load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Build time < 5 minutes
- [ ] Memory usage < 400MB
- [ ] Zero security vulnerabilities

### Functional Metrics
- [ ] User registration working
- [ ] User login working
- [ ] Product submission working
- [ ] Product listing working
- [ ] Search/filter working
- [ ] Image uploads working (if enabled)

### Business Metrics
- [ ] Cost: $0 (free tier)
- [ ] Deployment time < 10 minutes
- [ ] Zero downtime incidents
- [ ] User satisfaction high
- [ ] Ready for production traffic

## Rollback Plan

If deployment fails critically:

### Immediate Rollback
1. In Railway dashboard, click "Deployments"
2. Find previous successful deployment
3. Click "Redeploy"
4. Wait for rollback to complete

### Alternative Rollback
```bash
railway rollback
```

### Complete Restart
If all else fails:
1. Delete Railway deployment
2. Create new Railway project
3. Follow RAILWAY_DEPLOYMENT.md from scratch
4. Restore from database backup if needed

## Next Steps

After successful verification:

1. **Enable Optional Features** (if needed)
   - Add AI API keys
   - Enable admin features
   - Configure custom domain

2. **Optimize Performance**
   - Enable caching
   - Optimize database queries
   - Configure CDN (if needed)

3. **Scale if Needed**
   - Monitor usage trends
   - Upgrade Railway plan if needed
   - Consider Coolify for high traffic

4. **Documentation**
   - Document any custom configurations
   - Update team documentation
   - Create runbooks for common tasks

## Support Resources

### Railway Issues
- Railway Dashboard: https://railway.app
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

### Application Issues
- GitHub Issues: https://github.com/executiveusa/ECO-TOUR-DIRECTORY/issues
- Deployment Guides: See RAILWAY_DEPLOYMENT.md

### Database Issues
- Supabase Dashboard: https://app.supabase.com
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

---

**Last Updated**: 2025-12-04
**Version**: 1.0.0
**Status**: Ready for Production Verification
