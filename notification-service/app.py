import redis
import json
import os
import time

# گرفتن تنظیمات رادیس از متغیرهای محیطی (برای سازگاری با داکر)
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))

def main():
    print(f"🚀 Starting Python Notification Service...")
    
    # اتصال به رادیس (با تلاش مجدد در صورت بالا نبودن رادیس)
    while True:
        try:
            r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
            r.ping()
            print("✅ Connected to Redis successfully!")
            break
        except redis.ConnectionError:
            print("⏳ Redis is not available yet. Retrying in 3 seconds...")
            time.sleep(3)

    # عضویت در کانال order_created که NestJS روی آن پیام می‌فرستد
    pubsub = r.pubsub()
    pubsub.subscribe('order_created')
    print("🎧 Listening for 'order_created' events...")

    # حلقه بی‌نهایت برای خواندن پیام‌ها
    for message in pubsub.listen():
        if message['type'] == 'message':
            try:
                # پیام‌های NestJS به صورت JSON با فرمت {"pattern": "...", "data": {...}} ارسال می‌شوند
                payload = json.loads(message['data'])
                actual_data = payload.get('data', {})
                
                order_id = actual_data.get('orderId')
                quantity = actual_data.get('quantity')
                
                print(f"✉️ [NOTIFICATION] Sending SMS: Your order #{order_id} (Quantity: {quantity}) has been registered!")
            except Exception as e:
                print(f"⚠️ Error processing message: {e}")

if __name__ == "__main__":
    main()