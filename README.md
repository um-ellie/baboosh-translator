# Baboosh Translate | ببوش ترنسلیت

<div align="center">

![Baboosh Translate Logo](src/assets/icon128.png)

### **Baboosh Translate**
**A lightweight, cute, and intelligent extension for Chrome & Firefox: English-to-Persian translation with standard American accent TTS.**

**افزونهٔ هوشمند، سبک و دوست‌داشتنی برای کروم و فایرفاکس: ترجمه متن‌های انگلیسی به فارسی و تلفظ صوتی با لهجهٔ آمریکایی.**

[فارسی](#ببوش-ترنسلیت-فارسی) | [English Guide](#baboosh-translate-english)

---

</div>

---

# ببوش ترنسلیت (فارسی)

افزونه **ببوش ترنسلیت (Baboosh Translate)** یک ابزار کاربردی، تمیز و سبک برای مرورگرهای **گوگل کروم (Google Chrome)** و **موزیلا فایرفاکس (Mozilla Firefox)** است که مطالعهٔ متن‌های انگلیسی را در وب بسیار راحت‌تر و دلپذیرتر می‌کند.

---

## فهرست مطالب (فارسی)
- [مهم‌ترین مزیت افزونه](#مهمترین-مزیت-افزونه)
- [ویژگی‌های اصلی](#ویژگیهای-اصلی)
- [معماری فنی](#معماری-فنی)
- [راهنمای نصب](#راهنمای-نصب)
- [تنظیمات و سفارشی‌سازی](#تنظیمات-و-سفارشی‌سازی)
- [عیب‌یابی و نکات مهم](#عیب‌یابی-و-نکات-مهم)
- [برنامه‌های آینده](#برنامه‌های-آینده)
- [درباره پروژه و یادبود](#درباره-پروژه-و-یادبود)

---

## مهم‌ترین مزیت افزونه

بزرگ‌ترین مشکل در سرویس‌های آنلاین ترجمه (مانند Google Translate) این است که با اتصال از برخی کشورها یا تغییر IP، گوگل به صورت خودکار لهجه بریتانیایی (British Accent) را برای تلفظ صوتی اعمال می‌کند و انتخاب لهجه آمریکایی غیرفعال می‌شود.

**ببوش ترنسلیت** این مشکل را به طور کامل حل کرده است! بدون توجه به موقعیت مکانی یا IP شما، تلفظ صوتی متن همیشه با **لهجهٔ استاندارد آمریکایی (en-US)** پخش می‌شود.

---

## ویژگی‌های اصلی

- **تلفظ با لهجه دقیق آمریکایی**: پخش صدای انگلیسی با لهجهٔ آمریکایی از طریق Google TTS API بدون محدودیت جغرافیایی.
- **ترجمه روان به فارسی**: ترجمهٔ سریع و دقیق کلمات و جملات انگلیسی به فارسی.
- **آیکون شناور و هوشمند پیشی**: با انتخاب (Select) هر متنی در صفحه، آیکون بامزه پیشی ظاهر می‌شود.
- **موقعیت‌یابی هوشمند (Smart Positioning)**: باکس ترجمه به گونه‌ای طراحی شده که هرگز از لبه‌های مرورگر بیرون نزند و روی متن اصلی قرار نگیرد.
- **مدیریت پخش صدا (Instant / On-Demand)**: امکان فعال یا غیرفعال‌سازی پخش خودکار صدا هنگام باز شدن باکس ترجمه (قابل تغییر از منوی پاپ‌آپ یا صفحه تنظیمات).
- **پشتیبانی از مرورگرهای کروم و فایرفاکس**: سازگاری کامل با Chrome و Firefox.
- **رابط کاربری مدرن**: طراحی زیبا، سبک و سازگار با سیستم‌عامل‌های مختلف.

---

## معماری فنی

این افزونه بر پایه آخرین استاندارد گوگل و موزیلا (**Manifest V3**) توسعه داده شده است:

- **Service Worker پس‌زمینه (`src/background/background.js`)**: پردازش درخواست‌های ترجمه به صورت اسنکرون (Async) با مکانیزم Fallback برای تضمین دسترسی همیشگی به API ترجمه.
- **دور زدن محدودیت‌های CORS/CSP صوتی**: تبدیل فایل‌های صوتی دریافتی به فرمت Base64 Data URL در Service Worker جهت پخش روان و بدون خطا در تمامی سایت‌ها.
- **ذخیره‌سازی همگام (`Chrome Storage API`)**: همگام‌سازی تنظیمات کاربر (پخش خودکار/دستی صدا) بین منوی Popup، صفحه Options و Content Script.

---

## راهنمای نصب

افزونه **ببوش ترنسلیت** هم در **فایرفاکس** و هم در **کروم** قابل استفاده است:

### مرورگر فایرفاکس (Firefox) - نصب مستقیم
این افزونه به صورت رسمی در فروشگاه افزونه‌های فایرفاکس (Firefox Add-ons Store) قرار دارد و می‌توانید آن را به راحتی با یک کلیک نصب کنید:
**[دریافت و نصب افزونه از فروشگاه رسمی فایرفاکس (AMO)](https://addons.mozilla.org/en-US/firefox/addon/baboosh-translate/)**

### مرورگر کروم (Google Chrome)
به دلیل عدم داشتن حساب Developer گوگل در حال حاضر، این افزونه هنوز در Chrome Web Store قرار نگرفته است، اما می‌توانید از دو روش زیر آن را نصب کنید:

#### روش اول: نصب نسخهٔ آماده (پیشنهادی)
1. به بخش **[Releases](https://github.com/um-ellie/baboosh-translator/releases)** در همین ریپازیتوری بروید و فایل `baboosh-translate-chrome.zip` را دانلود و Extract کنید.
2. مرورگر کروم را باز کرده و به آدرس `chrome://extensions/` بروید.
3. از گوشه بالا سمت راست، گزینه **Developer mode** را روشن کنید.
4. از بالا سمت چپ روی دکمه **Load unpacked** کلیک کنید.
5. پوشهٔ Extract‌شده (پوشه‌ای که فایل `manifest.json` در آن است) را انتخاب کنید.

#### روش دوم: نصب دستی پوشه کد (Unpacked)
1. کل این ریپازیتوری را دانلود (یا `git clone`) کرده و در پوشهٔ پروژه دستور `npm run build:chrome` را اجرا کنید.
2. مرورگر کروم را باز کرده و به آدرس `chrome://extensions/` بروید.
3. گزینه **Developer mode** را از بالا سمت راست فعال کنید.
4. از بالا سمت چپ روی دکمه **Load unpacked** کلیک کنید.
5. پوشهٔ `dist/chrome` (پوشه‌ای که فایل `manifest.json` در آن قرار دارد) را انتخاب کنید.

> **نکته:** پس از نصب، اگر افزونه در صفحاتی که از قبل باز بوده‌اند کار نکرد، کافی است یک بار آن صفحه را Refresh کنید.

---

## تنظیمات و سفارشی‌سازی

شما می‌توانید رفتار پخش صدا را مطابق میل خود تغییر دهید:
- **Instant Pronunciation (پخش فوری)**: به محض کلیک روی آیکون و باز شدن باکس ترجمه، تلفظ صوتی پخش می‌شود.
- **On-Demand Only (پخش دستی)**: صدا فقط زمانی پخش می‌شود که روی دکمه **Listen** کلیک کنید.

این تنظیمات از طریق منوی **Popup** (کلیک روی آیکون افزونه در شريط مرورگر) و همچنین **Options Page** به راحتی قابل تغییر است.

---

## برنامه‌های آینده

- اضافه کردن امکان انتخاب لهجه بریتانیایی (British Accent).
- پشتیبانی از ترجمه به سایر زبان‌های دنیا.
- اضافه کردن کلیدهای میانبر (Keyboard Shortcuts) جهت ترجمه سریع‌تر.

---

## درباره پروژه و یادبود

نام این پروژه به یاد گربهٔ عزیز و دوست‌داشتنی به نام **ببوش (Baboosh)** انتخاب شده است.
این افزونه همچنین پروژه‌ای دلی و تمرینی برای ارتقای مهارت‌های JavaScript است.

- **سازنده:** Ellie
- **ایمیل پشتیبانی:** umellie8@gmail.com
- **ریپازیتوری گیت‌هاب:** [github.com/um-ellie/baboosh-translator](https://github.com/um-ellie/baboosh-translator)

*با عشق و احترام*

---

<br>

---

# Baboosh Translate (English)

**Baboosh Translate** is a lightweight, clean, and adorable extension for **Google Chrome** and **Mozilla Firefox** built to make reading English articles and web content effortless.

---

## Table of Contents (English)
- [Core Value Proposition](#core-value-proposition)
- [Key Features](#key-features-1)
- [Technical Architecture](#technical-architecture-1)
- [Installation Guide](#installation-guide-1)
- [Settings & Customization](#settings--customization-1)
- [Troubleshooting](#troubleshooting-1)
- [Future Roadmap](#future-roadmap)
- [Author & Dedication](#author--dedication)

---

## Core Value Proposition

When using translation services like Google Translate outside the US, Google often defaults to the British accent for TTS audio playback and restricts access to the American accent based on IP location.

**Baboosh Translate** solves this location constraint! Regardless of your IP or geographical region, audio pronunciation is guaranteed to use the **standard American accent (en-US)** via Google TTS.

---

## Key Features

- **Standard American Accent TTS**: Always plays clear American pronunciation via Google TTS API regardless of location.
- **Fluent Persian Translation**: Instantly translates selected English text into natural Persian.
- **Smart Floating Cat Action Icon**: Select any text on a webpage, and a cute cat icon pops up right beside your selection.
- **Intelligent Viewport Boundary Control**: The translation popup box dynamically calculates layout bounds to prevent overflowing off-screen edges or obscuring original text.
- **Flexible Audio Modes**: Choose between auto-play audio or on-demand manual audio playback.
- **Chrome & Firefox Compatible**: Full cross-browser compatibility.
- **Clean & Modern UI**: Built with modern CSS, smooth visual components, and complete Manifest V3 compliance.

---

## Technical Architecture

Developed using modern **Manifest V3** standards for Chrome and Firefox:

- **Background Service Worker (`src/background/background.js`)**: Handles asynchronous API requests with automatic fallback endpoint switching between Google Translate gateways (`googleapis.com` and `google.as`).
- **CORS / CSP Audio Handling**: Fetches audio ArrayBuffers and converts them to Base64 Data URLs inside the Service Worker to guarantee smooth audio playback across strict CSP web pages.
- **Synchronized Storage (`Chrome Storage API`)**: Keeps user audio preferences seamlessly updated between the Popup menu, Options page, and Content Script.

---

## Installation Guide

**Baboosh Translate** supports both **Mozilla Firefox** and **Google Chrome**:

### Mozilla Firefox - Official Add-ons Store (Instant Install)
The extension is officially published on the Firefox Add-ons Store. You can install it with a single click:
**[Install Baboosh Translate from Firefox Add-ons (AMO)](https://addons.mozilla.org/en-US/firefox/addon/baboosh-translate/)**

### Google Chrome
Since the extension is currently not listed on the Chrome Web Store, you can install it using either of the following two methods:

#### Method 1: Install a Release Package (Recommended)
1. Go to the **[Releases](https://github.com/um-ellie/baboosh-translator/releases)** section of this repository, download `baboosh-translate-chrome.zip`, and extract it.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the extracted folder containing `manifest.json`.

#### Method 2: Manual Installation (Unpacked Source)
1. Download or `git clone` this repository, then run `npm run build:chrome` from the project folder.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select `dist/chrome` (the directory containing `manifest.json`).

> **Note:** If the extension does not trigger on web pages that were open prior to installation, simply reload (refresh) those tabs once.

---

## Settings & Customization

You can easily adjust the audio behavior based on your preference:
- **Instant Pronunciation**: Plays pronunciation audio automatically as soon as the translation popup panel displays.
- **On-Demand Only**: Plays audio only when you explicitly click the **Listen** button.

Toggle this setting anytime from the extension's **Popup Menu** or **Options Page**.

---

## Future Roadmap

- Option to switch to British Accent pronunciation.
- Support for additional target translation languages.
- Customizable keyboard shortcuts for instant translation.

---

## Author & Dedication

The name of this application is dedicated in loving memory of a sweet cat named **Baboosh**.

- **Developer:** Ellie
- **Support Email:** umellie8@gmail.com
- **GitHub Repository:** [github.com/um-ellie/baboosh-translator](https://github.com/um-ellie/baboosh-translator)

*Made with love*
