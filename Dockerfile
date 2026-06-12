# ==========================================
# Stage 1: Builder (نصب، بیلد و هرس کردن پکیج‌ها)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# کپی فایل‌های کانفیگ و پکیج‌ها
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# نصب تمام وابستگی‌ها برای عملیات بیلد
RUN npm install

# کپی کل کدهای پروژه
COPY . .

# دریافت نام سرویس و بیلد کردن آن
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
RUN npm run build ${APP_NAME}

# هرس کردن پکیج‌های توسعه (devDependencies) برای سبک شدن نهایی node_modules
RUN npm prune --production

# ==========================================
# Stage 2: Production (ایمیج نهایی و بسیار سبک)
# ==========================================
FROM node:20-alpine

WORKDIR /usr/src/app

# دریافت نام سرویس برای استفاده در مسیر اجرا
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# کپی کردن پوشه بیلد شده (dist) و پوشه هرس شده (node_modules) از مرحله قبل
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# اجرای میکروسرویس
CMD node dist/apps/${APP_NAME}/main.js