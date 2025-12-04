# Coolify Migration Checklist

This document provides a step-by-step checklist for migrating the Eco Tour Directory from Railway to Coolify when free tier limits are reached.

## Pre-Migration Checklist

### ✅ Planning Phase

- [ ] **Review Current Deployment**
  - [ ] Document current Railway configuration
  - [ ] List all environment variables
  - [ ] Note any custom domains
  - [ ] Document current resource usage
  - [ ] Backup all environment variables

- [ ] **Prepare Coolify Environment**
  - [ ] Provision Coolify instance (self-hosted or managed)
  - [ ] Ensure Coolify version is up to date
  - [ ] Configure DNS provider access
  - [ ] Prepare SSL certificates (if not using Let's Encrypt)

- [ ] **Database Verification**
  - [ ] Verify Supabase connection is stable
  - [ ] Document Supabase project details
  - [ ] Confirm database backup schedule
  - [ ] Test database connectivity from new host

### ✅ Resource Planning

- [ ] **Calculate Resource Requirements**
  - [ ] Current memory usage: _______
  - [ ] Current CPU usage: _______
  - [ ] Average requests per day: _______
  - [ ] Peak traffic patterns: _______

- [ ] **Coolify Host Specifications**
  - [ ] RAM allocated: _______ (minimum 512MB recommended)
  - [ ] CPU cores: _______ (minimum 0.5 core recommended)
  - [ ] Disk space: _______ (minimum 10GB recommended)
  - [ ] Network bandwidth: _______

## Migration Steps

### Phase 1: Environment Setup

- [ ] **Step 1.1: Create Coolify Application**
  ```bash
  # In Coolify dashboard:
  # 1. Click "New Application"
  # 2. Select "Git Repository"
  # 3. Enter: https://github.com/executiveusa/ECO-TOUR-DIRECTORY
  # 4. Select branch: main
  # 5. Name: eco-tour-directory
  ```

- [ ] **Step 1.2: Configure Build Settings**
  - [ ] Build pack: Nixpacks
  - [ ] Build command: `pnpm install && pnpm run build`
  - [ ] Start command: `pnpm start`
  - [ ] Port: `3000`
  - [ ] Node version: `18+`

- [ ] **Step 1.3: Set Environment Variables**
  Copy from Railway (or `.agents` file):
  
  **Required Variables:**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  
  **Optional Variables:**
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `ANTHROPIC_API_KEY` (if using AI enrichment)
  - [ ] `OPENAI_API_KEY` (if using AI enrichment)
  
  **Platform Variables:**
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`

### Phase 2: Testing

- [ ] **Step 2.1: Initial Deployment Test**
  - [ ] Deploy to Coolify staging environment (if available)
  - [ ] Verify build completes successfully
  - [ ] Check application starts without errors
  - [ ] Review deployment logs for warnings

- [ ] **Step 2.2: Functional Testing**
  - [ ] Test homepage loads correctly
  - [ ] Test product listing page
  - [ ] Test product submission form
  - [ ] Test authentication (login/signup)
  - [ ] Test database connectivity
  - [ ] Test image uploads (if applicable)
  - [ ] Test search functionality
  - [ ] Test filtering and sorting

- [ ] **Step 2.3: Performance Testing**
  - [ ] Load time < 3 seconds
  - [ ] API response time < 500ms
  - [ ] Database query performance acceptable
  - [ ] Memory usage within limits
  - [ ] CPU usage stable under load

- [ ] **Step 2.4: Security Testing**
  - [ ] HTTPS enabled and working
  - [ ] Environment variables not exposed
  - [ ] Authentication working correctly
  - [ ] CORS configured properly
  - [ ] Content Security Policy headers set

### Phase 3: DNS and Domain Configuration

- [ ] **Step 3.1: Configure Domain**
  - [ ] Add custom domain in Coolify
  - [ ] Domain name: _______________________
  - [ ] Generate SSL certificate (Let's Encrypt)
  - [ ] Verify certificate installation

- [ ] **Step 3.2: DNS Configuration**
  - [ ] Get Coolify server IP address: _______
  - [ ] Update DNS A record:
    ```
    Type: A
    Name: @ (or subdomain)
    Value: [Coolify IP]
    TTL: 300 (5 minutes for testing)
    ```
  - [ ] Wait for DNS propagation (5-30 minutes)
  - [ ] Test: `dig yourdomain.com` or `nslookup yourdomain.com`

- [ ] **Step 3.3: Verify Domain**
  - [ ] Test HTTP -> HTTPS redirect
  - [ ] Test www -> non-www redirect (if applicable)
  - [ ] Verify SSL certificate is valid
  - [ ] Test from multiple locations/devices

### Phase 4: Cutover

- [ ] **Step 4.1: Final Railway Backup**
  - [ ] Export all environment variables
  - [ ] Document current Railway URL
  - [ ] Take screenshots of Railway dashboard
  - [ ] Note any Railway-specific configurations

- [ ] **Step 4.2: Traffic Transition**
  - [ ] Lower Railway DNS TTL to 60 seconds (if using custom domain)
  - [ ] Monitor Railway traffic
  - [ ] Update DNS to point to Coolify
  - [ ] Monitor both platforms during transition

- [ ] **Step 4.3: Verification**
  - [ ] Verify new deployment is receiving traffic
  - [ ] Check error rates in Coolify logs
  - [ ] Monitor response times
  - [ ] Verify database operations working
  - [ ] Test critical user flows

### Phase 5: Post-Migration

- [ ] **Step 5.1: Monitoring Setup**
  - [ ] Configure Coolify monitoring alerts
  - [ ] Set up uptime monitoring (e.g., UptimeRobot)
  - [ ] Configure log retention
  - [ ] Set up error tracking (if applicable)

- [ ] **Step 5.2: Railway Cleanup**
  - [ ] Keep Railway deployment running for 24-48 hours
  - [ ] Monitor for any rollback needs
  - [ ] Once stable, pause Railway deployment
  - [ ] After 7 days, delete Railway deployment (optional)
  - [ ] Cancel Railway subscription (if applicable)

- [ ] **Step 5.3: Documentation Update**
  - [ ] Update README.md with new deployment URL
  - [ ] Update deployment documentation
  - [ ] Document new monitoring procedures
  - [ ] Update team/stakeholder documentation

### Phase 6: Optimization

- [ ] **Step 6.1: Performance Optimization**
  - [ ] Enable Coolify caching
  - [ ] Configure CDN (if needed)
  - [ ] Optimize database queries
  - [ ] Review and optimize resource allocation

- [ ] **Step 6.2: Cost Optimization**
  - [ ] Review actual resource usage
  - [ ] Adjust resource allocation if over/under-provisioned
  - [ ] Set up cost alerts
  - [ ] Document monthly cost vs Railway

- [ ] **Step 6.3: Security Hardening**
  - [ ] Review and update security headers
  - [ ] Configure rate limiting
  - [ ] Set up fail2ban (if self-hosting)
  - [ ] Enable automated backups
  - [ ] Configure firewall rules

## Rollback Plan

If issues occur during migration:

### Immediate Rollback

- [ ] **Revert DNS Changes**
  - [ ] Change DNS A record back to Railway
  - [ ] Wait for propagation
  - [ ] Verify traffic restored to Railway

### Investigation

- [ ] Document the issue
- [ ] Review Coolify logs
- [ ] Check environment variables
- [ ] Test locally if possible
- [ ] Contact support if needed

### Retry Migration

- [ ] Fix identified issues
- [ ] Test thoroughly on staging
- [ ] Schedule new migration window
- [ ] Notify stakeholders

## Troubleshooting Guide

### Common Issues and Solutions

#### Build Failures

**Issue**: Build times out or fails
- [ ] Check Node version compatibility
- [ ] Verify pnpm is available
- [ ] Increase build timeout in Coolify settings
- [ ] Check build logs for specific errors

**Issue**: Dependencies fail to install
- [ ] Verify `pnpm-lock.yaml` is committed
- [ ] Check for platform-specific dependencies
- [ ] Try clearing build cache

#### Runtime Issues

**Issue**: Application crashes on startup
- [ ] Verify all environment variables are set
- [ ] Check start command is correct
- [ ] Review application logs
- [ ] Verify port 3000 is available

**Issue**: Database connection fails
- [ ] Verify Supabase credentials
- [ ] Check network connectivity
- [ ] Verify Supabase project is active
- [ ] Test connection from Coolify host

#### Performance Issues

**Issue**: Slow response times
- [ ] Increase memory allocation
- [ ] Add more CPU cores
- [ ] Check database query performance
- [ ] Enable caching

**Issue**: Out of memory errors
- [ ] Increase memory limits
- [ ] Check for memory leaks
- [ ] Optimize application code
- [ ] Review and optimize dependencies

## Hostinger VPN Integration (Optional)

If using Hostinger VPN:

- [ ] **VPN Setup**
  - [ ] Install VPN client on Coolify host
  - [ ] Configure VPN connection
  - [ ] Test VPN connectivity
  - [ ] Configure routing rules

- [ ] **Security**
  - [ ] Enable VPN-only access
  - [ ] Configure firewall rules
  - [ ] Test fail-over scenarios
  - [ ] Document VPN configuration

## Sign-off

### Pre-Migration Approval

- [ ] Technical lead approval: _____________ Date: _______
- [ ] Stakeholder notification: ____________ Date: _______
- [ ] Maintenance window scheduled: _______ Date: _______

### Post-Migration Sign-off

- [ ] Migration completed successfully: ____ Date: _______
- [ ] All tests passed: ___________________ Date: _______
- [ ] Monitoring confirmed: _______________ Date: _______
- [ ] Documentation updated: ______________ Date: _______
- [ ] Stakeholders notified: ______________ Date: _______

## Timeline

Estimated migration timeline:

- **Planning**: 1-2 hours
- **Environment Setup**: 30-60 minutes
- **Testing**: 2-4 hours
- **DNS Configuration**: 30-60 minutes
- **Cutover**: 30 minutes
- **Monitoring**: 24-48 hours
- **Total**: 1-2 days

## Success Criteria

Migration is considered successful when:

- [ ] Application is accessible via custom domain
- [ ] All functionality working as expected
- [ ] Performance meets or exceeds Railway
- [ ] No critical errors in logs
- [ ] Monitoring and alerts configured
- [ ] Team trained on Coolify management
- [ ] Documentation updated

## Support Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Community Support**: https://coolify.io/discord
- **Project Repository**: https://github.com/executiveusa/ECO-TOUR-DIRECTORY
- **Supabase Support**: https://supabase.com/docs

## Notes

- Take your time with each step
- Test thoroughly before cutover
- Have a rollback plan ready
- Monitor closely for 24-48 hours post-migration
- Document any issues and resolutions
- Keep Railway deployment as backup initially

---

**Status**: Ready for execution
**Last Updated**: 2025-12-04
**Version**: 1.0.0
**Estimated Duration**: 1-2 days
