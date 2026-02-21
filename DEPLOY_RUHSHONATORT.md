# Deploy Plan: ruhshonatort.com (Cloudflare + Gateway + Backend + Vercel)

## 1) Siz bergan infratuzilma

- Domain: `ruhshonatort.com` (Cloudflare)
- Gateway server IP: `161.97.176.32`
- Backend server IP: `178.18.245.174`

## 2) Tavsiya etilgan yakuniy URL sxema

- `https://ruhshonatort.com` -> Next.js storefront (Vercel)
- `https://www.ruhshonatort.com` -> Next.js storefront (Vercel)
- `https://api.ruhshonatort.com` -> Gateway (`161.97.176.32`) -> Backend (`178.18.245.174:8090`)
- `https://erp.ruhshonatort.com` -> ERP panel (xohlasangiz gateway orqali)

## 3) Cloudflare DNS yozuvlari

### Website (Vercel)

- Type: `CNAME`
- Name: `@`
- Target: `cname.vercel-dns.com`
- Proxy status: DNS only (yoki proxied, Vercel tavsiyasiga qarab)

- Type: `CNAME`
- Name: `www`
- Target: `cname.vercel-dns.com`
- Proxy status: DNS only

### API

- Type: `A`
- Name: `api`
- IPv4: `161.97.176.32`
- Proxy status: Proxied (tavsiya)

## 4) Gateway server (161.97.176.32) Nginx config

`/etc/nginx/sites-available/api.ruhshonatort.com`

```nginx
server {
    listen 80;
    server_name api.ruhshonatort.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.ruhshonatort.com;

    ssl_certificate /etc/letsencrypt/live/api.ruhshonatort.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ruhshonatort.com/privkey.pem;

    client_max_body_size 20m;

    location / {
        proxy_pass http://178.18.245.174:8090;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/api.ruhshonatort.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5) Backend (`178.18.245.174`) .env production qiymatlari

`server/.env` (production instance):

```env
NODE_ENV=production
PORT=8090
DATABASE_URL=postgresql://.../ruxshonaerp?schema=public

CORS_ORIGIN=https://ruhshonatort.com,https://www.ruhshonatort.com,https://erp.ruhshonatort.com

JWT_SECRET=strong_secret_here
ACCESS_TOKEN_TTL=30m
REFRESH_TOKEN_TTL_DAYS=15
```

## 6) Vercel import paytida to'ldiriladigan maydonlar

Project import:
- Framework preset: `Next.js`
- Root Directory: `website`
- Build Command: `npm run build`
- Output Directory: `.next` (default)
- Install Command: `npm install`

Environment Variables:
- Key: `NEXT_PUBLIC_API_BASE_URL`
- Value: `https://api.ruhshonatort.com/api`
- Environments: Production / Preview / Development

Domain ulash:
- `ruhshonatort.com`
- `www.ruhshonatort.com`

## 7) Deploydan keyin tekshiruv

1. `https://api.ruhshonatort.com/api/health` -> 200
2. `https://ruhshonatort.com` ochilishi
3. Katalogda mahsulotlar chiqishi
4. Checkout orqali buyurtma berish
5. ERP admin `Buyurtmalar` bo'limida yangi buyurtma ko'rinishi

## 8) Push/deploy tartibi

```bash
git add .
git commit -m "feat: add Next.js storefront and orders public API"
git push origin main
```

Keyin Vercel auto deploy qiladi.
