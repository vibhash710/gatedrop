# 🛒 GateDrop — Digital Product Marketplace

A full-stack digital product marketplace where sellers can upload and sell digital products (courses, ebooks, templates, code and design assets) and buyers can browse, purchase, and download them instantly — no storefront to build, just a link and a price.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://gatedrop.online)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)

**Live:** [gatedrop.online](https://gatedrop.online) &nbsp;|&nbsp; **Built with Next.js 14 App Router**

---

## 🌟 Features

### Buyer
- 🛍️ Browse all published digital products
- 💳 Purchase products via Razorpay (UPI, cards, netbanking)
- ⚡ Instant download access after payment
- 📜 Purchase history with download links

### Seller
- ➕ Create, edit, publish, and unpublish products
- 🖼️ Upload cover images and product files via UploadThing
- 📊 Earnings dashboard with per-sale breakdown (revenue, platform fee, net earnings)
- 💰 10% platform commission with pending/paid payout tracking
- 🗂️ Products with existing purchases are unpublished, not deleted — preserves buyer access to files they already own

### Auth & Security
- 📧 Email/password signup with OTP verification via Resend
- 🔑 Google and GitHub OAuth
- 🔄 Password reset via secure, time-limited email link
- 🎭 Role-based access control (Buyer/Seller), assigned via post-signup onboarding
- 🗑️ Soft delete — deactivated accounts preserve buyer download access to previously purchased products
- ✅ Payment integrity verified server-side via Razorpay HMAC-SHA256 signature check before any purchase is recorded
- 🔒 Secure file downloads via UploadThing signed URLs with auth + purchase verification
- 🛡️ Rate limiting on auth, checkout, and download routes via Upstash Redis

### Platform
- 🌗 Dark / light / system theme toggle
- 📱 Fully responsive UI
- 🎯 Role-aware onboarding and dashboard routing

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL via Neon |
| ORM | Prisma |
| Auth | NextAuth v5 (Auth.js) |
| Payments | Razorpay |
| File Storage | UploadThing |
| Email | Resend |
| Rate Limiting | Upstash Redis |
| UI | Shadcn/ui, Tailwind CSS, Lucide React |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Deployment | Vercel |

---

## 🏗️ Architecture

```
/
├── app/
│   ├── (marketing)/        # Landing page — SSG
│   ├── (store)/            # Public store pages — ISR
│   │   ├── products/       # Product listing
│   │   └── products/[id]/  # Product detail + buy button
│   ├── dashboard/
│   │   ├── seller/         # Seller product management — SSR
│   │   └── purchases/      # Buyer purchase history — SSR
│   ├── api/
│   │   ├── checkout/       # Razorpay order creation
│   │   ├── verify-payment/ # Razorpay signature verification
│   │   ├── download/[id]/  # Secure file download route
│   │   ├── uploadthing/    # UploadThing route handler
│   │   └── auth/           # NextAuth route handler
│   ├── login/
│   ├── signup/
│   ├── verify-email/
│   ├── onboarding/
│   ├── forgot-password/
│   └── reset-password/[token]/
├── components/
├── lib/
│   ├── actions/            # Server Actions
│   ├── validations/
│   ├── auth.js             # NextAuth config
│   ├── email.js            # Resend email helpers
│   ├── getRateLimitIdentifier.js
│   ├── otp.js              # OTP generation + verification
│   ├── prisma.js           # Prisma client singleton
│   ├── ratelimit.js        # Upstash rate limiters
│   ├── razorpay.js            
│   └── resend.js
│   └── uploadthing.js
└── middleware.js            # Edge route protection
```

### Rendering Strategies
- **SSG** — Landing page (fully static)
- **ISR** — Product listing and detail pages (60s revalidation)
- **SSR** — Dashboard pages (always fresh, requires session)

### Payment Flow
```
User clicks Buy Now
→ POST /api/checkout → Razorpay order created (amount computed server-side)
→ Razorpay popup opens on page
→ User pays (UPI / card / netbanking)
→ Razorpay returns payment_id, order_id, signature
→ POST /api/verify-payment → HMAC-SHA256 signature verified
→ prisma.purchase.create() with platformFee / sellerEarnings computed at commission rate
→ Redirect to /dashboard/purchases
```

### Download Flow
```
User clicks Download
→ GET /api/download/[productId]
→ Session check → Purchase ownership verification
→ File URL resolved via UploadThing
→ Redirect to file
```

---

## 💰 Commission Model

GateDrop charges a **10% platform fee** on every sale, configurable via the `PlatformConfig` table.

| Amount paid by buyer | Platform fee (10%) | Seller earnings (90%) |
|---|---|---|
| ₹100 | ₹10 | ₹90 |
| ₹500 | ₹50 | ₹450 |
| ₹1000 | ₹100 | ₹900 |

Commission is calculated and locked in **at the time of each purchase**, so changing the platform rate later does not retroactively alter past sales.

### Payouts

Payouts are currently **manual**. Sellers submit a payout request via the Contact page on or after the 1st of each month; requests are verified against the seller's computed pending balance and processed within 48 hours via UPI or bank transfer.

> **Note:** Automated seller payouts via Razorpay Route/RazorpayX are planned for v2 — see [Roadmap](#-roadmap-v2).

---

## 📋 Prerequisites

Before running this project locally, make sure you have:

- **Node.js** ≥ 18.0.0
- **PostgreSQL database** (Neon free tier recommended)
- **Razorpay account** (test mode)
- **UploadThing account**
- **Resend account** (for transactional email)
- **Upstash Redis account**

Optional (for OAuth login):
- **Google OAuth credentials**
- **GitHub OAuth credentials**

---

## 🔧 Local Development

### 1. Clone Repository
```bash
git clone https://github.com/vibhash710/gatedrop.git
cd gatedrop
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
# DB
DATABASE_URL=your_neon_postgresql_connection_string?sslmode=verify-full

# Auth Secret
BETTER_AUTH_SECRET=your_auth_secret

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Razorpay (use test keys for local, live keys for production)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

# UploadThing
UPLOADTHING_TOKEN=your_token

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Push database schema
```bash
npx prisma db push
npx prisma generate
```

### 5. Seed platform config (commission rate)
```bash
node seed-config.mjs
```

### 6. Run development server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 💳 Test Payments (Local Development Only)

When running locally with test keys, no real money is charged.

| Method | Test Credentials |
|---|---|
| UPI | `success@razorpay` |
| Card | `5267 3181 8797 5449` / Any future expiry / CVV: `123` |
| OTP | `1234` |

---

## 🌐 Deployment

The app is deployed on **Vercel** with **Neon** PostgreSQL.

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables (see above)
4. Vercel auto-deploys on every push to `main`

`prisma generate` runs automatically via the `postinstall` script in `package.json`.

---

## ⚠️ Known Limitations

| Limitation | Reason | Plan |
|---|---|---|
| Manual seller payouts | Razorpay Route/RazorpayX requires separate business approval | Automate in v2 |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Vibhash Mishra**
- GitHub: [@vibhash710](https://github.com/vibhash710)
- Live: [gatedrop.online](https://gatedrop.online)

## 🙏 Acknowledgments

- Neon for PostgreSQL hosting
- Vercel for hosting and deployment
- UploadThing for file storage
- Razorpay for payment processing
- Resend for transactional email
- Upstash for Redis-based rate limiting
- All open-source libraries used in this project

---

**Built with Next.js, Prisma, and Razorpay — designed for creators who just want to drop a link and a price.**