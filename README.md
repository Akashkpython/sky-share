# ☁️ Sky Share — Premium Cloud File Sharing

A premium, minimalistic file-sharing platform. Upload files, get a 4-digit code, share it. No sign-up required.

## Features
- 🚀 Instant file sharing with 4-digit codes
- 📁 Multiple file uploads (up to 500MB per file)
- 🔒 Presigned URLs — files never pass through the server
- ⏰ 24-hour auto-expiry
- 📱 Fully responsive design
- 🛡️ Rate-limited code verification
- 🎨 Premium monochrome UI

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: Cloudflare R2
- **Cache/Metadata**: Redis
- **Icons**: Lucide React

## Prerequisites
- Node.js 18+
- Redis server (local or hosted like Upstash)
- Cloudflare R2 bucket + API credentials

## Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd sky-share

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment
```bash
cp server/.env.example server/.env
# Edit server/.env with your credentials
```

### 3. Run Development
```bash
# Terminal 1: Start server
cd server && npm run dev

# Terminal 2: Start client
cd client && npm run dev
```

The client runs on http://localhost:5173 with API proxied to http://localhost:3001.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| PORT | No | 3001 | Server port |
| REDIS_URL | Yes | - | Redis connection URL |
| R2_ACCOUNT_ID | Yes | - | Cloudflare account ID |
| R2_ACCESS_KEY_ID | Yes | - | R2 API key ID |
| R2_SECRET_ACCESS_KEY | Yes | - | R2 API key secret |
| R2_BUCKET_NAME | Yes | - | R2 bucket name |
| CORS_ORIGIN | No | * | Allowed CORS origin |
| MAX_FILE_SIZE | No | 524288000 | Max file size in bytes (500MB) |
| MAX_FILES_PER_TRANSFER | No | 10 | Max files per transfer |
| TRANSFER_EXPIRY_HOURS | No | 24 | Transfer TTL in hours |

## Cloudflare R2 Setup

1. Log in to Cloudflare dashboard
2. Go to R2 Object Storage
3. Create a new bucket (e.g., `sky-share-files`)
4. Go to R2 > Manage R2 API Tokens
5. Create an API token with Object Read & Write permissions
6. Copy Account ID, Access Key ID, and Secret Access Key
7. Set bucket CORS policy:
```json
[
  {
    "AllowedOrigins": ["http://localhost:5173", "https://your-domain.com"],
    "AllowedMethods": ["GET", "PUT", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Redis Setup

### Local Redis
```bash
# macOS
brew install redis && brew services start redis
# Use REDIS_URL=redis://localhost:6379

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### Hosted Redis (Recommended for Production)
- [Upstash](https://upstash.com) — Free tier available, serverless Redis
- [Redis Cloud](https://redis.com/cloud) — Managed Redis

## Deployment

### Frontend (Vercel)
1. Import the `client/` directory to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-api.railway.app`

### Backend (Railway)
1. Create a new project on Railway
2. Add the `server/` directory
3. Set all environment variables
4. Railway auto-detects Node.js and runs `npm start`
5. Add Redis plugin from Railway marketplace

### CORS Configuration
After deploying, update:
- `CORS_ORIGIN` in server env to your Vercel domain
- R2 bucket CORS to include your Vercel domain

## Security Considerations
- 4-digit codes are rate-limited (5 attempts per 10 min, then 30-min lockout)
- Files stored in private R2 bucket, accessed only via presigned URLs
- Presigned upload URLs expire after 30 minutes
- Presigned download URLs expire after 1 hour
- All transfers auto-expire after 24 hours
- Filenames are sanitized to prevent path traversal
- No file content passes through the Express server
- Security headers via Helmet

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/transfers | Create new transfer |
| POST | /api/transfers/:id/upload | Get presigned upload URL |
| POST | /api/transfers/:id/files/:fileId/confirm | Confirm file upload |
| POST | /api/transfers/:id/complete | Mark transfer ready |
| POST | /api/receive/verify | Verify 4-digit code |
| GET | /api/transfers/:id/files | List transfer files |
| GET | /api/transfers/:id/download/:fileId | Get download URL |
| DELETE | /api/transfers/:id | Delete transfer |
| GET | /api/health | Health check |

## License
MIT
