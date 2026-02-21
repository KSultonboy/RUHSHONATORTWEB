# Ruhshona Storefront (Next.js)

Bu papka `ruhshonatort.com` uchun mijozlarga buyurtma qabul qiladigan website (MVP) hisoblanadi.

## Texnologiya

- Next.js 16 (App Router)
- React 19
- API: `GET /api/public/categories`, `GET /api/public/products`, `POST /api/public/orders`

## Lokal ishga tushirish

```powershell
cd website
npm install
npm run dev
```

Default: `http://localhost:3000`

Agar API lokal bo'lsa `.env.local` yarating:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8090/api
```

Eslatma: `.env.local` bo'lmasa ham, website `localhost` da ochilganda avtomatik `http://localhost:8090/api` ga ulanadi.

## Production API

Productionda quyidagidan foydalaniladi:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.ruhshonatort.com/api
```

## Muhim sahifalar

- `/` - landing + ommabop mahsulotlar
- `/catalog` - to'liq katalog, filter/qidiruv
- `/checkout` - savat + buyurtma formasi
- `/success` - track code bilan tasdiq

## Deploy

Deploy bo'yicha aniq qadamlar `website/DEPLOY_RUHSHONATORT.md` da.
