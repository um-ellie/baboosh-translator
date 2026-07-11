# 🐱 Baboosh Translate

[فارسی](#پروژه-ببوش-ترنسلیت-baboosh-translate) \|
[English](#beboosh-translate-project)

------------------------------------------------------------------------

# 🐱 پروژه ببوش ترنسلیت (Beboosh Translate)

یک افزونه سبک، تمیز و بامزه برای کروم که با هدف راحت‌تر کردن مطالعه متن‌های انگلیسی طراحی شده است.

مهم‌ترین مزیت این extension این است که بدون توجه به موقعیت مکانی کاربر، فقط از لهجه آمریکایی برای تلفظ استفاده می‌کند. البته لهجه بریتیش هم به زودی به آن اضافه می‌کنم.

در حال حاضر فقط قابلیت ترجمه و تلفظ از زبان انگلیسی به فارسی را دارد. زبان‌های دیگر هم به زودی به آن اضافه می‌شوند.

کافی است هر متنی را در یک صفحه وب انتخاب (Select) کنید تا آیکون پیشی کوچولو ظاهر شود. با کلیک روی آن، همزمان که تلفظ صوتی متن (با لهجه آمریکایی از طریق گوگل) پخش می‌شود، ترجمه فارسی روان آن را هم در یک باکس مشاهده می‌کنید.

این باکس کاملاً هوشمند طراحی شده و خودش را طوری تنظیم می‌کند که هیچ‌وقت از لبه‌های صفحه بیرون نزند و یا روی متن اصلی قرار نگیرد.

قابلیت پخش صدا بعد از کلیک روی آیکون popup یا بعد از باز شدن باکس popup قابل انتخاب است. این تنظیمات را می‌توانید از صفحه options یا منوی اصلی extension تغییر دهید.

این پروژه بیشتر برای من یک پروژه تمرینی برای JavaScript است. خوشحال می‌شوم آن را تست کنید، مشکلاتش را به من بگویید، یا اگر خوشتان آمد پیشنهاد دهید چه ویژگی‌هایی دوست دارید به آن اضافه کنم.

ایمیل من در صفحه about قرار دارد.

## معماری فنی

این افزونه بر پایه **Manifest V3** توسعه داده شده است.

برای پخش صوت از Chrome Offscreen Document استفاده می‌کند تا با قوانین امنیتی جدید کروم تداخلی نداشته باشد.

درخواست‌های ترجمه هم به صورت Async از طریق Service Worker به API گوگل ارسال می‌شوند.

## راهنمای نصب و راه‌اندازی

از آنجایی که در حال حاضر اکانت Developer گوگل ندارم، نتوانستم افزونه را به صورت رسمی در Google Web Store منتشر کنم. اما برای اینکه کار شما راحت باشد، یک فایل آماده نصب (`.crx`) در بخش Releases قرار داده‌ام.

می‌توانید به یکی از دو روش زیر افزونه را روی مرورگر خود نصب کنید:

### روش اول: نصب سریع از طریق فایل CRX (پیشنهادی)
۱. ابتدا به بخش **Releases** در همین ریپازیتوری بروید و آخرین نسخه فایل با پسوند `.crx` را دانلود کنید.
۲. مرورگر کروم را باز کنید و به آدرس `chrome://extensions/` بروید.
۳. از گوشه بالا سمت راست، گزینه **Developer mode** را روشن کنید.
۴. حالا فایل `.crx` دانلود شده را با ماوس بکشید و داخل همین صفحه افزونه‌ها رها کنید (Drag & Drop).
۵. پیامی برای تایید نصب ظاهر می‌شود؛ روی **Add extension** کلیک کنید. کار تمام است!

### روش دوم: بارگذاری به صورت دستی (Unpacked)
۱. کل این ریپازیتوری را دانلود (یا Clone) کنید و فایل زیپ را روی سیستم خود Extract کنید.
۲. مرورگر کروم را باز کنید و به آدرس `chrome://extensions/` بروید.
۳. از گوشه بالا سمت راست، گزینه **Developer mode** را روشن کنید.
۴. از گوشه بالا سمت چپ، دکمه **Load unpacked** را بزنید.
۵. پوشه اصلی پروژه (جایی که فایل `manifest.json` قرار دارد) را انتخاب کنید.

حالا به یک سایت خارجی بروید، متنی را انتخاب کنید و بگذارید ببوش کارش را انجام بدهد!  
*(نکته: اگر بعد از نصب، در صفحه‌ای که از قبل باز بود کار نکرد، کافی است یک‌بار آن صفحه را Refresh کنید).*

## برنامه‌های آینده و زبان‌های جدید

این پروژه همچنان در حال توسعه است و به زودی زبان‌های دیگری را هم به آن اضافه می‌کنم.

منتظر آپدیت‌های بعدی باشید!

دوستتون دارم. مراقب خودتون باشید❤️🐈🦒🐘🐢🌳

------------------------------------------------------------------------

# 🐱 Beboosh Translate Project

[فارسی](#پروژه-ببوش-ترنسلیت-baboosh-translate) \|
[English](#beboosh-translate-project)

A lightweight, clean, and cute Chrome extension designed to make reading English texts easier.

The most important advantage of this extension is that, regardless of the user's location, it always uses an American accent for pronunciation. Of course, I will add the British accent soon as well.

Currently, it only supports translation and pronunciation from English to Persian. More languages will be added soon.

Simply select any text on a web page, and the little cat icon will appear. By clicking on it, you will hear the pronunciation of the selected text (with an American accent through Google), while also seeing its smooth Persian translation inside a popup box.

This popup box is designed to be completely smart. It automatically adjusts its position so it never goes outside the screen edges and never covers the original text.

The sound behavior can be selected either after clicking the popup icon or after opening the popup box. You can change this option from the options page or the main extension menu.

This project is mostly a practice project for me to improve my JavaScript skills. I would be happy if you test it, tell me about its problems, or if you like it, suggest what features you would like me to add.

My email address is available on the about page.

## Technical Architecture

This extension is developed based on **Manifest V3**.

For audio playback, it uses Chrome Offscreen Document to avoid conflicts with the new Chrome security rules.

Translation requests are sent asynchronously through the Service Worker to Google's API.

## Installation Guide

Since I don't currently have a Google Developer account, I couldn't publish this extension on the official Chrome Web Store. However, to make things much easier for you, I have provided a ready-to-install `.crx` file in the **Releases** section.

You can install the extension using one of the following two methods:

### Method 1: Quick Install via CRX File (Recommended)
1. Go to the **Releases** section of this repository and download the latest `.crx` file.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Turn on **Developer mode** from the top-right corner.
4. Simply drag and drop the downloaded `.crx` file anywhere into the Extensions page.
5. A confirmation dialog will appear. Click **Add extension**, and you're good to go!

### Method 2: Manual Load (Unpacked)
1. Download this entire repository (or clone it) and extract the ZIP file on your system.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Turn on **Developer mode** from the top-right corner.
4. Click the **Load unpacked** button from the top-left corner.
5. Choose the main project folder (the one containing the `manifest.json` file).

Now go to any foreign website, select some text, and let Beboosh do its job!  
*(Note: If it doesn't work on an already open tab right after installation, just refresh that page).*

## Future Plans and New Languages

This project is still under development, and I will add more languages soon.

Stay tuned for future updates!

I love you all. Take care of yourselves ❤️🐈🦒🐘🐢🌳