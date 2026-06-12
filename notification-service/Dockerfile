# ==========================================
# Stage 1: Builder (نصب پیش‌نیازها و کامپایل)
# ==========================================
FROM python:3.11-slim AS builder

WORKDIR /app

# کپی کردن فایل نیازمندی‌ها
COPY requirements.txt .

# نصب پکیج‌ها در مسیر user به جای سیستم اصلی تا انتقالش راحت باشد
RUN pip install --user --no-cache-dir -r requirements.txt

# ==========================================
# Stage 2: Production (ایمیج نهایی و سبک)
# ==========================================
FROM python:3.11-slim

WORKDIR /app

# کپی کردن پکیج‌های نصب شده از مرحله قبل
COPY --from=builder /root/.local /root/.local

# اضافه کردن مسیر پکیج‌ها به PATH
ENV PATH=/root/.local/bin:$PATH

# کپی کردن کد اصلی برنامه
COPY app.py .

# اجرای برنامه (سوئیچ u باعث میشه لاگ‌های پایتون در لحظه توی داکر چاپ بشن)
CMD ["python", "-u", "app.py"]