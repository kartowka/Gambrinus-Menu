# Gambrinus-Menu
Gambrinus restaurant menu

## 🐳 Docker Setup

This project includes Docker configuration for easy deplo```yaml
labels:
   - "traefik.http.routers.gambrinus-secure.rule=Host(`gambrinus.kartowka.win`)"
  - "traefik.http.services.gambrinus.loadbalancer.server.port=3000"

  # Security & Performance
  - "traefik.http.middlewares.gambrinus-compress.compress=true"
  - "traefik.http.middlewares.gambrinus-security.headers.customresponseheaders.X-Frame-Options=DENY"
  - "traefik.http.middlewares.gambrinus-ratelimit.ratelimit.burst=100".enable=true"
  - "traefik.docker.network=frontend"              # Uses your existing network
  - "traefik.http.routers.gambrinus-secure.entrypoints=websecure"
  - "traefik.http.routers.gambrinus-secure.rule=Host(`gambrinus.kartowka.win`)"
  - "traefik.http.services.gambrinus.loadbalancer.server.port=3000"

  # Security & Performance
  - "traefik.http.middlewares.gambrinus-compress.compress=true"
  - "traefik.http.middlewares.gambrinus-security.headers.customresponseheaders.X-Frame-Options=DENY"
  - "traefik.http.middlewares.gambrinus-ratelimit.ratelimit.burst=100"
```ment.

### Prerequisites
- Docker
- Docker Compose

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/kartowka/Gambrinus-Menu.git
   cd Gambrinus-Menu
   ```

2. **Choose your setup:**

   **🚀 Production (with existing Traefik):**
   ```bash
   # Make sure your Traefik network exists
   docker network ls | grep frontend

   # Set up environment
   cp .env.example .env
   # Edit .env with your MongoDB Atlas URI

   # Deploy to existing Traefik setup
   docker-compose up --build -d
   ```

   **🛠 Development (with local MongoDB):**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   **⚡ Ultra-Minimal Production:**
   ```bash
   cp .env.production.example .env.production
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Access the application**
   - Main application: http://localhost:3000
   - MongoDB Express (dev only): http://localhost:8081

### Docker Commands

#### Ultra-Light Production
```bash
# Minimal production build (~50MB final image)
docker build --target production -t gambrinus-menu:minimal .

# Run with external database
docker run -p 3000:3000 --env-file .env gambrinus-menu:minimal
```

#### Development
```bash
# Full development stack
docker-compose -f docker-compose.dev.yml up --build

# Production-like testing
docker-compose -f docker-compose.prod.yml up --build

# View logs
docker-compose logs -f app

# Clean rebuild
docker-compose down && docker-compose up --build --force-recreate
```

#### Size Optimization
```bash
# Check image sizes
docker images gambrinus-menu

# Remove unused images/containers
docker system prune -a
```

### Docker Setup Options

| Setup | Size | Services | Use Case |
|-------|------|----------|----------|
| **Production** | ~45MB | App only | Existing Traefik + MongoDB Atlas |
| **Development** | ~250MB | App + MongoDB + Admin UI | Full local development |
| **Ultra-Minimal** | ~40MB | App only | Hardened production deployment |

**Services:**
- **app**: Node.js application (exposed on port 3000, routed via existing Traefik)
- **mongodb**: MongoDB database (port 27017) - dev only
- **mongo-express**: Database admin UI (port 8081) - dev only

**Existing Infrastructure:**
- **Traefik**: Your existing reverse proxy handles SSL, routing, and security
- **MongoDB Atlas**: External managed database service

### Traefik Integration

Your existing Traefik setup provides:
- ✅ **Automatic SSL** - Let's Encrypt certificates via your existing config
- ✅ **HTTP → HTTPS redirect** - Handled by your Traefik setup
- ✅ **Single domain** - `gambrinus.kartowka.win` (no WWW redirect needed)
- ✅ **Gzip compression** - Faster page loads
- ✅ **Security headers** - XSS protection, frame options, etc.
- ✅ **Rate limiting** - DDoS protection (100 req/s burst for production)
- ✅ **Dashboard** - Your existing Traefik admin UI

### Prerequisites

- ✅ Traefik running with `frontend` network
- ✅ MongoDB Atlas connection string
- ✅ Domain `gambrinus.kartowka.win` pointing to your server

### Traefik Labels Configuration

The app includes these Traefik labels for integration with your existing setup:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=frontend"              # Uses your existing network
  - "traefik.http.routers.gambrinus-secure.entrypoints=websecure"
  - "traefik.http.routers.gambrinus-secure.rule=Host(`gambrinus.co.il`) || Host(`www.gambrinus.co.il`)"
  - "traefik.http.services.gambrinus.loadbalancer.server.port=3000"

  # Security & Performance
  - "traefik.http.middlewares.gambrinus-compress.compress=true"
  - "traefik.http.middlewares.gambrinus-security.headers.customresponseheaders.X-Frame-Options=DENY"
  - "traefik.http.middlewares.gambrinus-ratelimit.ratelimit.burst=100"

  # WWW Redirect: www.gambrinus.co.il → gambrinus.co.il
  - "traefik.http.middlewares.gambrinus-www-redirect.redirectregex.regex=^https://www\\.gambrinus\\.co\\.il/(.*)"
  - "traefik.http.middlewares.gambrinus-www-redirect.redirectregex.replacement=https://gambrinus.co.il/${1}"
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `NODE_ENV`: Environment (development/production)
- `dbURI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT tokens (minimum 32 characters)
- `PORT`: Application port (default: 3000)
- `DOMAIN`: Your domain name (`gambrinus.kartowka.win`)

### Database

The MongoDB service includes:
- Automatic initialization with collections and indexes
- Persistent data storage with Docker volumes
- Admin user with credentials set in docker-compose.yml

## 💻 Local Development

### Without Docker

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `.env` with your MongoDB connection string

3. **Run the application**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

### Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run lint`: Run ESLint
- `npm run compile:sass`: Compile SASS files
