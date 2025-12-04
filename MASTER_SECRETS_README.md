# Master Secrets Architecture

## Overview

The Railway Zero-Secrets Bootstrapper uses a **master secrets architecture** to manage credentials across all projects.

## File Location

The master secrets file is located at:
```
/tmp/railway-secrets/master.secrets.json
```

⚠️ **IMPORTANT**: This file is **NEVER** committed to the repository. It resides only on your local machine.

## Purpose

The `master.secrets.json` file:
- Stores all secrets for all Railway projects
- Provides placeholder values for development
- Serves as a reference for required secrets
- Can be consumed by secrets-provisioning agents

## Structure

```json
{
  "version": "1.0.0",
  "projects": {
    "ECO-TOUR-DIRECTORY": {
      "secrets": {
        "NEXT_PUBLIC_SUPABASE_URL": {
          "value": "https://placeholder.supabase.co",
          "description": "Supabase project API URL",
          "required": true,
          "placeholder": true
        },
        // ... more secrets
      }
    }
  }
}
```

## Usage

### For Developers

1. **Initial Setup**
   ```bash
   # File is auto-generated in /tmp/railway-secrets/
   # Or create manually using the template
   cp /tmp/railway-secrets/master.secrets.json ~/master.secrets.json
   ```

2. **Update Values**
   ```bash
   # Edit the file with your real secrets
   nano ~/master.secrets.json
   # Replace placeholder values with real credentials
   ```

3. **Never Commit**
   ```bash
   # Verify .gitignore excludes secrets
   cat .gitignore | grep secrets
   # Output should include:
   # master.secrets.json
   # *.secrets.json
   # secrets/
   ```

### For Secrets-Provisioning Agents

The `.agents` file provides a schema that other agents can use to:
- Discover required secrets
- Validate secret formats
- Generate `master.secrets.json` entries
- Inject secrets into deployment platforms

Example agent workflow:
```javascript
// 1. Read .agents file
const agentsSpec = JSON.parse(fs.readFileSync('.agents'));

// 2. Parse required secrets
const required = agentsSpec.required_secrets;

// 3. Read master.secrets.json
const masterSecrets = JSON.parse(fs.readFileSync('~/master.secrets.json'));

// 4. Inject into Railway
for (const secret of required) {
  railway.env.set(secret, masterSecrets[secret].value);
}
```

## Security Best Practices

### ✅ DO

- Store `master.secrets.json` in a secure location
- Use different secrets for dev/staging/prod
- Rotate secrets regularly
- Backup secrets securely (encrypted)
- Use environment-specific files

### ❌ DON'T

- Never commit `master.secrets.json` to git
- Never share secrets in plain text
- Never use production secrets in development
- Never store secrets in application code
- Never log secrets to console

## File Templates

### Local Development Template

Create `.env.local`:
```bash
# From master.secrets.json, copy values here
NEXT_PUBLIC_SUPABASE_URL=your-dev-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-key
```

### Production Template

Set in Railway dashboard:
```bash
# From master.secrets.json, copy values here
NEXT_PUBLIC_SUPABASE_URL=your-prod-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-key
```

## Integration with Deployment

### Railway Deployment

Railway uses environment variables from its dashboard, NOT `master.secrets.json`.

**Workflow:**
1. Secrets defined in `.agents`
2. Developer fills `master.secrets.json`
3. Developer manually sets in Railway dashboard
4. Railway injects at runtime

### Coolify Deployment

Similar to Railway:
1. Read `master.secrets.json` for reference
2. Set variables in Coolify dashboard
3. Coolify injects at runtime

## Automation

### Secrets Sync Script (Future)

A future enhancement could include:
```bash
# Sync master.secrets.json to Railway
npm run secrets:sync

# This would:
# 1. Read master.secrets.json
# 2. Compare with Railway env vars
# 3. Prompt for updates
# 4. Apply changes via Railway API
```

## Troubleshooting

### Issue: Secrets Not Working

**Check:**
1. Values in `master.secrets.json` are not placeholders
2. Values are correctly set in deployment platform
3. Application is reading from correct environment
4. No typos in variable names

### Issue: File Not Found

**Solution:**
```bash
# Check if file exists
ls -la /tmp/railway-secrets/master.secrets.json

# If not, create from template
mkdir -p /tmp/railway-secrets
# Copy template from repository
```

### Issue: Invalid Format

**Solution:**
```bash
# Validate JSON
cat /tmp/railway-secrets/master.secrets.json | jq .

# Fix JSON syntax errors
# Ensure all quotes and brackets match
```

## Related Documentation

- **Secrets Schema**: See `.agents` file
- **Deployment Guide**: See `RAILWAY_DEPLOYMENT.md`
- **Environment Setup**: See `.env.railway.example`
- **Security Guide**: See `RAILWAY_ZERO_SECRETS_BOOTSTRAPPER.md`

## Support

If you have questions about secrets management:
1. Review `.agents` file for required secrets
2. Check `RAILWAY_DEPLOYMENT.md` for setup instructions
3. Open GitHub issue for assistance

---

**Last Updated**: 2025-12-04  
**Version**: 1.0.0  
**Status**: Documentation Complete
