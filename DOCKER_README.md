# Recipe App - Dockerized

This document provides complete instructions for dockerizing and deploying the Recipe App.

## 🐳 Docker Configuration

The application has been containerized using:
- **Base Image**: `nginx:alpine` (lightweight, ~23MB)
- **Web Server**: Nginx with optimized configuration
- **Port**: 80 (container) → 8080 (host)
- **Static Files**: Served from `/usr/share/nginx/html/`

## 📁 Docker Files Created

1. **`Dockerfile`** - Container build instructions
2. **`docker-compose.yml`** - Multi-container orchestration
3. **`.dockerignore`** - Files excluded from build context
4. **`nginx.conf`** - Optimized Nginx configuration
5. **`deploy-ibm-cloud.sh`** - IBM Cloud deployment script

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up -d

# Access the app at http://localhost:8080

# Stop the application
docker-compose down
```

### Option 2: Using Docker Commands

```bash
# Build the Docker image
docker build -t recipe-app .

# Run the container
docker run -d -p 8080:80 --name recipe-app recipe-app

# Access the app at http://localhost:8080

# Stop and remove the container
docker stop recipe-app
docker rm recipe-app
```

## 🔧 Development Commands

```bash
# View container logs
docker logs recipe-app

# Access container shell
docker exec -it recipe-app /bin/sh

# Check container status
docker ps

# Rebuild image (after code changes)
docker-compose build --no-cache
docker-compose up -d
```

## ☁️ IBM Cloud Deployment

### Prerequisites
1. Install IBM Cloud CLI: https://cloud.ibm.com/docs/cli
2. Login to IBM Cloud: `ibmcloud login --sso`

### Automated Deployment
```bash
# Make script executable
chmod +x deploy-ibm-cloud.sh

# Run deployment script
./deploy-ibm-cloud.sh
```

### Manual Deployment Steps

1. **Set target region and resource group**
   ```bash
   ibmcloud target -r us-south -g default
   ```

2. **Create container registry namespace**
   ```bash
   ibmcloud cr namespace-add recipe-app-namespace
   ```

3. **Build and push Docker image**
   ```bash
   ibmcloud cr build -t recipe-app-namespace/recipe-app:latest .
   ```

4. **Deploy to IBM Cloud Code Engine**
   ```bash
   ibmcloud ce application create \
       --name recipe-app \
       --image us.icr.io/recipe-app-namespace/recipe-app:latest \
       --port 80 \
       --cpu 0.25 \
       --memory 0.5G
   ```

## 🏗️ Architecture Details

### Container Structure
```
recipe-app/
├── nginx:alpine (base image)
├── /usr/share/nginx/html/ (static files)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── assets/
└── /etc/nginx/nginx.conf (custom config)
```

### Nginx Optimizations
- **Gzip Compression**: Enabled for text files
- **Static File Caching**: 1-year cache for assets
- **Security Headers**: XSS protection, content type options
- **Health Check**: `/health` endpoint
- **SPA Support**: Fallback to index.html for routing

### Performance Features
- **Lightweight**: ~23MB base image
- **Fast Startup**: Alpine Linux
- **Efficient Caching**: Browser and CDN friendly
- **Compression**: Reduced bandwidth usage

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 8080
   netstat -tulpn | grep 8080
   
   # Use different port
   docker run -d -p 8081:80 --name recipe-app recipe-app
   ```

2. **Container won't start**
   ```bash
   # Check logs
   docker logs recipe-app
   
   # Check nginx configuration
   docker exec -it recipe-app nginx -t
   ```

3. **Static files not loading**
   ```bash
   # Check file permissions
   docker exec -it recipe-app ls -la /usr/share/nginx/html/
   
   # Verify nginx is serving files
   docker exec -it recipe-app wget -qO- http://localhost:80
   ```

### IBM Cloud Issues

1. **Authentication errors**
   ```bash
   # Re-login to IBM Cloud
   ibmcloud login --sso
   ```

2. **Registry access denied**
   ```bash
   # Check registry permissions
   ibmcloud cr namespaces
   ```

3. **Code Engine deployment fails**
   ```bash
   # Check application status
   ibmcloud ce application get --name recipe-app
   
   # View logs
   ibmcloud ce application logs --name recipe-app
   ```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Container health
docker inspect recipe-app | grep Health -A 10

# Application health
curl http://localhost:8080/health
```

### Resource Usage
```bash
# Container stats
docker stats recipe-app

# Disk usage
docker system df
```

### Cleanup
```bash
# Remove unused images
docker image prune

# Remove unused containers
docker container prune

# Full cleanup
docker system prune -a
```

## 🔒 Security Considerations

- **Base Image**: Alpine Linux (minimal attack surface)
- **Security Headers**: XSS protection, content type options
- **No Root User**: Nginx runs as non-root
- **Minimal Dependencies**: Only essential packages
- **Regular Updates**: Keep base image updated

## 📈 Scaling

### Horizontal Scaling (Docker Compose)
```yaml
# In docker-compose.yml
services:
  recipe-app:
    deploy:
      replicas: 3
```

### IBM Cloud Auto-scaling
```bash
# Update application with auto-scaling
ibmcloud ce application update --name recipe-app \
    --min-scale 1 \
    --max-scale 10
```

## 🎯 Best Practices

1. **Image Optimization**
   - Use multi-stage builds for production
   - Minimize layers in Dockerfile
   - Use specific image tags

2. **Security**
   - Regular security scans
   - Keep base images updated
   - Use secrets for sensitive data

3. **Monitoring**
   - Implement health checks
   - Monitor resource usage
   - Set up logging

4. **CI/CD**
   - Automate builds and deployments
   - Use semantic versioning
   - Implement rollback strategies

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker and IBM Cloud documentation
3. Check application logs for specific errors

**Happy Cooking! 🍳** 