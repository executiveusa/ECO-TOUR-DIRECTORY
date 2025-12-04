# Coolify Deployment Support

This document provides configuration and deployment instructions for deploying the Eco Tour Directory on Coolify with Hostinger VPN support.

## Overview

Coolify is a self-hosted alternative to platforms like Heroku, Netlify, and Vercel. This configuration is provided as a fallback deployment option when Railway free tier limits are reached.

## Prerequisites

- A Coolify instance (self-hosted or managed)
- (Optional) Hostinger VPN for secure connections
- Git repository access
- Supabase project credentials

## Coolify Configuration

### Application Settings

```yaml
# Application Type
type: nodejs

# Build Configuration
build:
  command: pnpm install && pnpm run build
  
# Start Configuration  
start:
  command: pnpm start
  
# Port Configuration
port: 3000

# Health Check
healthcheck:
  path: /
  interval: 30s
  timeout: 10s
  retries: 3
```

### Environment Variables

Set the following environment variables in your Coolify application settings:

#### Required Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Optional Variables

```bash
# For admin operations (optional)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# For AI enrichment (optional - disabled by default)
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# Node environment
NODE_ENV=production
```

## Deployment Steps

### 1. Connect Repository

1. Log into your Coolify dashboard
2. Create a new application
3. Connect your Git repository: `https://github.com/executiveusa/ECO-TOUR-DIRECTORY`
4. Select the branch: `main` or your deployment branch

### 2. Configure Build Settings

```yaml
Build Pack: Nixpacks (recommended) or Docker
Build Command: pnpm install && pnpm run build
Start Command: pnpm start
Port: 3000
```

### 3. Set Environment Variables

Navigate to the Environment Variables section and add all required variables listed above.

### 4. Configure Domains

Set up your custom domain or use the Coolify-provided domain:
- Format: `eco-tour-directory.yourdomain.com`
- Enable HTTPS (Let's Encrypt is automatic in Coolify)

### 5. Deploy

Click "Deploy" to build and start your application.

## Hostinger VPN Integration

If you're using Hostinger VPN for secure connections:

### Network Configuration

```yaml
# Add to your Coolify network settings
network:
  mode: bridge
  # If using VPN tunnel
  external_network: hostinger_vpn
```

### VPN Tunnel Setup

1. **Install VPN client on Coolify host**
   ```bash
   # Install OpenVPN or WireGuard
   sudo apt-get update
   sudo apt-get install openvpn
   # or
   sudo apt-get install wireguard
   ```

2. **Configure VPN connection**
   - Download Hostinger VPN configuration
   - Place in `/etc/openvpn/` or `/etc/wireguard/`
   - Start VPN service

3. **Route Coolify traffic through VPN**
   ```bash
   # Add routing rules
   sudo ip route add <coolify-subnet> via <vpn-gateway>
   ```

### Security Considerations

- Enable firewall rules to allow only VPN traffic
- Use private networking for database connections
- Implement fail2ban for additional security
- Regular security updates

## Resource Allocation

Configure resources based on your Coolify host capacity:

```yaml
resources:
  limits:
    memory: 512MB  # Minimum recommended
    cpu: 0.5       # Half a CPU core
  reservations:
    memory: 256MB
    cpu: 0.25
```

## Monitoring

### Health Checks

Coolify automatically monitors your application health:
- Path: `/`
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3

### Logs

Access application logs via:
- Coolify Dashboard > Your App > Logs
- Command line: `coolify logs <app-id>`

### Metrics

Monitor resource usage in the Coolify dashboard:
- CPU usage
- Memory usage
- Network traffic
- Request counts

## Backup and Restore

### Database Backups

Since you're using Supabase, backups are handled by Supabase:
- Automated daily backups (free tier: 7 days retention)
- Manual backups via Supabase dashboard
- Export via pg_dump if needed

### Application State

No persistent state is stored in the application container:
- All data in Supabase
- Static assets in public directory
- No file uploads stored locally

## Troubleshooting

### Build Failures

```bash
# Check build logs
coolify logs <app-id> --build

# Common issues:
# 1. Node version mismatch - ensure Node 18+
# 2. Missing dependencies - check package.json
# 3. Build timeout - increase timeout in settings
```

### Runtime Issues

```bash
# Check application logs
coolify logs <app-id>

# Common issues:
# 1. Missing environment variables
# 2. Database connection failures
# 3. Port conflicts
```

### Performance Issues

```bash
# Check resource usage
coolify stats <app-id>

# Solutions:
# 1. Increase memory allocation
# 2. Add more CPU cores
# 3. Enable caching
# 4. Optimize database queries
```

## Migration from Railway

If migrating from Railway:

1. Export environment variables from Railway
2. Import to Coolify
3. Update DNS records to point to Coolify
4. Test thoroughly before switching
5. Keep Railway deployment as backup during transition

See `COOLIFY_MIGRATION.md` for detailed migration steps.

## Cost Estimation

Coolify self-hosting costs depend on your infrastructure:

### Small Deployment (1-2 apps)
- VPS: $5-10/month (1GB RAM, 1 CPU)
- Suitable for development/small production

### Medium Deployment (3-10 apps)
- VPS: $20-40/month (4GB RAM, 2 CPU)
- Suitable for production workloads

### Large Deployment (10+ apps)
- VPS: $80+/month (8GB+ RAM, 4+ CPU)
- Suitable for high-traffic production

## Support and Documentation

- **Coolify Docs**: https://coolify.io/docs
- **Community**: https://coolify.io/discord
- **GitHub**: https://github.com/coollabsio/coolify
- **This Project**: https://github.com/executiveusa/ECO-TOUR-DIRECTORY

## Notes

- This configuration is pre-configured but not activated
- Only use when Railway free tier is exceeded
- Test thoroughly before production deployment
- Monitor resource usage to prevent overages
- Coolify provides more control but requires more management

---

**Status**: Pre-configured, not activated
**Last Updated**: 2025-12-04
**Configuration Version**: 1.0.0
