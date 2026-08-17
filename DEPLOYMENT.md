# Deployment Guide

## Prerequisites
- Node.js 20+
- npm or yarn
- Docker (for container deployment)
- Nginx (for reverse proxy)
- SSL certificates (Let's Encrypt)
- Domain name configured

## Environment Setup

### 1. Environment Variables
Copy `.env.production` template and fill in actual values:
```bash
cp .env.production .env.production.local
```

**Required variables:**
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_APP_URL` - Frontend application URL
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID

### 2. SSL Certificates (Let's Encrypt)
```bash
# Obtain SSL certificate
sudo certbot certonly --standalone -d imaginemebylovie.com -d www.imaginemebylovie.com

# Certificates will be stored in:
# /etc/letsencrypt/live/imaginemebylovie.com/
```

### 3. Nginx Configuration
```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/imagineme

# Enable site
sudo ln -s /etc/nginx/sites-available/imagineme /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Deployment Options

### Option A: Direct Node.js Deployment
```bash
# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start npm --name "imagineme" -- start

# Configure PM2 to start on boot
pm2 startup
pm2 save
```

### Option B: Docker Deployment
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Scale if needed
docker-compose up -d --scale web=3
```

### Option C: CI/CD Deployment (GitHub Actions)
1. Configure GitHub Secrets:
   - `SERVER_HOST` - Server IP/domain
   - `SERVER_USER` - SSH username
   - `SSH_PRIVATE_KEY` - SSH private key
   - `DOCKER_USERNAME` - Docker Hub username
   - `DOCKER_PASSWORD` - Docker Hub password
   - `API_BASE_URL` - Backend API URL
   - `APP_URL` - Frontend URL

2. Push to `main` branch triggers automatic deployment

## Health Monitoring

### Check Application Health
```bash
curl https://imaginemebylovie.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-08-17T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Monitor Logs
```bash
# PM2 logs
pm2 logs imagineme

# Docker logs
docker-compose logs -f web

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Performance Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
ANALYZE=true npm run build
```

### 2. CDN Configuration
- Configure CDN for static assets
- Set up cache headers for optimal performance
- Enable Gzip compression

### 3. Database Optimization
- Use connection pooling
- Enable query caching
- Monitor slow queries

## Security Checklist

- [ ] SSL certificates configured and valid
- [ ] Security headers implemented
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

## Monitoring Setup

### 1. Sentry Error Tracking
- Configure Sentry in `.env.production`
- Monitor error rates
- Set up alerting

### 2. Google Analytics
- Add tracking ID to environment
- Monitor user behavior
- Track conversion funnels

### 3. Uptime Monitoring
- Set up external monitoring (Pingdom, UptimeRobot)
- Configure alert notifications
- Monitor response times

## Rollback Procedure

### If deployment fails:
```bash
# Rollback to previous version
pm2 rollback imagineme

# Or with Docker
docker-compose down
docker-compose up -d --build

# Or revert Git commit
git revert HEAD
git push origin main
```

### If critical issue detected:
```bash
# Put site in maintenance mode
sudo nginx -s stop

# Deploy previous stable version
# ... (deployment steps)

# Start nginx
sudo nginx -s start
```

## Troubleshooting

### Common Issues:

1. **Build fails**
   - Check Node.js version compatibility
   - Verify environment variables
   - Check disk space

2. **Application not starting**
   - Check port conflicts: `netstat -tulpn | grep :3000`
   - Verify build completed successfully
   - Check logs for errors

3. **Nginx 502 errors**
   - Verify backend is running
   - Check nginx configuration
   - Verify SSL certificates

4. **Performance issues**
   - Check server resources
   - Monitor database queries
   - Analyze bundle size
   - Enable caching

## Maintenance

### Regular Tasks:
- **Daily**: Check error rates and performance metrics
- **Weekly**: Review and update dependencies
- **Monthly**: Security audit and penetration testing
- **Quarterly**: Major dependency updates and optimization

### Update Process:
```bash
# Pull latest changes
git pull origin main

# Install updated dependencies
npm ci --production

# Rebuild application
npm run build

# Restart application
pm2 restart imagineme
```

## Contact Information
- **Development Team**: dev@imagineme.com
- **Emergency Contact**: admin@imagineme.com
- **Monitoring Dashboard**: https://monitor.imagineme.com