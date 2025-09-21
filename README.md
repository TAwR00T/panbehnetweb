# راهنمای استقرار پنبه VPN با وردپرس به عنوان Headless CMS

این راهنما شما را قدم به قدم برای استقرار کامل اپلیکیشن پنبه VPN با استفاده از یک معماری مدرن و انعطاف‌پذیر راهنمایی می‌کند.

## معماری جدید: وردپرس بی‌سر (Headless) + React

در این معماری، ما از **"بهترینِ هر دو جهان"** استفاده می‌کنیم:
- **باطن (Backend):** یک سایت وردپرسی که فقط برای مدیریت محتوا (مثل مقالات وبلاگ، نظرات مشتریان، سوالات متداول، پلن‌ها و...) توسط ادمین استفاده می‌شود. این بخش روی یک ساب‌دامین مانند `admin.yourdomain.com` قرار می‌گیرد.
- **ظاهر (Frontend):** همان اپلیکیشن زیبای React که داریم. این اپلیکیشن به جای داشتن محتوای ثابت، اطلاعات را از طریق API از وردپرس دریافت کرده و به کاربران نمایش می‌دهد. این بخش روی دامنه اصلی `yourdomain.com` قرار می‌گیرد.

**مزایا:**
- **مدیریت محتوای آسان:** شما یک پنل مدیریت وردپرس قدرتمند و آشنا برای ویرایش تمام محتوای سایت بدون نیاز به کدنویسی دارید.
- **سرعت و زیبایی:** کاربران همچنان از سرعت، انیمیشن‌ها و تجربه کاربری مدرن اپلیکیشن React لذت می‌برند.
- **انعطاف‌پذیری:** می‌توانید از افزونه‌های قدرتمند وردپرس (مثل ووکامرس برای فروش) در بخش مدیریت خود استفاده کنید.

---

## پیش‌نیازها

- یک سرور با سیستم‌عامل Ubuntu 22.04.
- یک دامنه اصلی (مثلاً `panbeh.com`) و یک ساب‌دامین (مثلاً `admin.panbeh.com`) که هر دو به IP سرور شما متصل شده باشند.
- نصب بودن `Node.js` (نسخه ۱۸ یا بالاتر) و `npm` روی سرور (برای ساخت پروژه React).

---

## بخش اول: نصب و راه‌اندازی وردپرس (روی ساب‌دامین)

در این بخش، ما وردپرس را روی `admin.yourdomain.com` نصب می‌کنیم.

1.  **نصب پشته LEMP (Nginx, MySQL, PHP):**
    ```bash
    sudo apt update
    sudo apt install nginx mysql-server php-fpm php-mysql -y
    ```

2.  **پیکربندی دیتابیس MySQL:**
    ابتدا وارد محیط MySQL شوید:
    ```bash
    sudo mysql
    ```
    سپس دستورات زیر را برای ساخت دیتابیس و کاربر جدید اجرا کنید (رمز عبور خود را جایگزین `your_strong_password` کنید):
    ```sql
    CREATE DATABASE panbeh_wp DEFAULT CHARACTER SET utf8 COLLATE utf8_persian_ci;
    CREATE USER 'panbeh_user'@'localhost' IDENTIFIED BY 'your_strong_password';
    GRANT ALL PRIVILEGES ON panbeh_wp.* TO 'panbeh_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    ```

3.  **دانلود و پیکربندی وردپرس:**
    ```bash
    cd /var/www
    sudo curl -O https://fa.wordpress.org/latest-fa_IR.zip
    sudo apt install unzip -y
    sudo unzip latest-fa_IR.zip
    sudo mv wordpress panbeh-admin
    sudo chown -R www-data:www-data /var/www/panbeh-admin
    cd /var/www/panbeh-admin
    sudo cp wp-config-sample.php wp-config.php
    sudo nano wp-config.php
    ```
    در فایل `wp-config.php`، اطلاعات دیتابیسی که در مرحله قبل ساختید را وارد کنید.

4.  **پیکربندی Nginx برای وردپرس:**
    یک فایل کانفیگ جدید برای ساب‌دامین خود بسازید:
    ```bash
    sudo nano /etc/nginx/sites-available/panbeh-admin
    ```
    محتوای زیر را در آن کپی کرده و `admin.yourdomain.com` را با ساب‌دامین خود جایگزین کنید:
    ```nginx
    server {
        listen 80;
        server_name admin.yourdomain.com;
        root /var/www/panbeh-admin;
        index index.php index.html index.htm;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; # Check your PHP version
        }

        location ~ /\.ht {
            deny all;
        }
    }
    ```
    سایت را فعال کرده و Nginx را ری‌استارت کنید:
    ```bash
    sudo ln -s /etc/nginx/sites-available/panbeh-admin /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

5.  **تکمیل نصب وردپرس:**
    حالا به آدرس `http://admin.yourdomain.com` در مرورگر خود بروید و مراحل نصب ۵ دقیقه‌ای وردپرس را تکمیل کنید.

---

## بخش دوم: تبدیل وردپرس به یک CMS بی‌سر

1.  **ورود به پنل وردپرس:** وارد `http://admin.yourdomain.com/wp-admin` شوید.

2.  **نصب افزونه‌ها:**
    از بخش "افزونه‌ها" > "افزودن"، افزونه‌های زیر را نصب و فعال کنید:
    - **Advanced Custom Fields (ACF):** برای ساخت فیلدهای سفارشی.
    - **Custom Post Type UI (CPT UI):** برای ساخت انواع محتوای سفارشی (مثل نظرات، سوالات و...).
    - **ACF to REST API:** برای نمایش فیلدهای سفارشی در خروجی API.

3.  **ساخت ساختار محتوا (مثال: نظرات مشتریان):**
    - به منوی "CPT UI" بروید و یک "نوع نوشته" جدید بسازید.
      - **برچسب مفرد:** `Testimonial` (نظر)
      - **برچسب جمع:** `Testimonials` (نظرات)
      - **نامک (Slug):** `testimonial`
    - **مهم:** پس از ساخت، در همان صفحه تنظیمات CPT UI به پایین اسکرول کنید تا به بخش **"REST API Base Slug"** برسید. این مقدار را به `testimonials` (جمع) تغییر دهید. این کار باعث می‌شود آدرس API با چیزی که در کد انتظار می‌رود، هماهنگ باشد.
    - به منوی "زمینه‌های سفارشی" (ACF) بروید و یک گروه فیلد جدید بسازید. آن را به نوع نوشته `testimonial` اختصاص دهید. فیلدهای مورد نیاز مانند `role` (نقش)، `avatar` (آواتار) و `rating` (امتیاز) را به آن اضافه کنید.
    - حالا می‌توانید از منوی جدید "نظرات" در پنل وردپرس، محتوای خود را وارد کنید.

4.  **مدیریت محتوای وبلاگ:**
    - وردپرس به طور پیش‌فرض بخش "نوشته‌ها" را دارد که می‌توانید از همان برای مدیریت مقالات وبلاگ استفاده کنید.
    - برای اضافه کردن فیلدهای بیشتر (مانند `metaDescription` یا `keywords` برای سئو)، می‌توانید از افزونه ACF برای نوع نوشته `post` (نوشته) استفاده کنید.
    - **تصویر شاخص:** از قابلیت "تصویر شاخص" خود وردپرس برای تعیین عکس اصلی هر مقاله استفاده کنید.
    
5.  **بررسی REST API:**
    وردپرس به طور خودکار برای محتوای شما یک خروجی API می‌سازد.
    - **مقالات وبلاگ:** `https://admin.yourdomain.com/wp-json/wp/v2/posts`
    - **نظرات مشتریان:** `https://admin.yourdomain.com/wp-json/wp/v2/testimonials`

---

## بخش سوم: استقرار سایت React و اتصال به وردپرس

1.  **کلون کردن پروژه:**
    ```bash
    git clone [آدرس-ریپازیتوری-گیت‌هاب-شما] /var/www/panbeh-react
    cd /var/www/panbeh-react
    ```

2.  **به‌روزرسانی کد برای فراخوانی API:**
    - در فایل‌هایی مانند `components/TestimonialsSection.tsx` و `components/BlogPage.tsx`، آدرس API شبیه‌سازی شده را با آدرس واقعی API وردپرس خود جایگزین کنید.
    - مثال: به جای داده‌های ثابت، از `fetch('https://admin.yourdomain.com/wp-json/wp/v2/posts')` برای دریافت اطلاعات استفاده کنید.
    - **نکته:** پس از ویرایش فایل‌ها، تغییرات را در ریپازیتوری گیت‌هاب خود Push کرده و سپس روی سرور Pull کنید.

3.  **نصب وابستگی‌ها و بیلد پروژه:**
    ```bash
    npm install
    npm run build
    ```
    این دستور فایل‌های نهایی و بهینه‌سازی شده سایت شما را در پوشه `dist/` قرار می‌دهد.

4.  **پیکربندی Nginx برای سایت React:**
    یک فایل کانفیگ جدید برای دامنه اصلی خود بسازید:
    ```bash
    sudo nano /etc/nginx/sites-available/panbeh-react
    ```
    محتوای زیر را در آن کپی کرده و `yourdomain.com` را با دامنه خود جایگزین کنید:
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        root /var/www/panbeh-react/dist;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
    ```
    سایت را فعال کرده و Nginx را ری‌استارت کنید:
    ```bash
    sudo ln -s /etc/nginx/sites-available/panbeh-react /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
    ```

---

## بخش چهارم: فعال‌سازی SSL با Let's Encrypt

برای امنیت بیشتر، هر دو سایت خود را با SSL امن کنید.

1.  **نصب Certbot:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```

2.  **دریافت و نصب گواهی SSL برای هر دو دامنه:**
    ```bash
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com
    ```
    مراحل را دنبال کرده و گزینه تغییر مسیر از HTTP به HTTPS را انتخاب کنید.

**تبریک!** اپلیکیشن شما اکنون با یک پنل مدیریت وردپرسی قدرتمند در حال اجراست.