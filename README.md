# Baboosh Translate 🐱

[English](#english) | [فارسی](#فارسی)

---

## English

**Baboosh Translate** is a lightweight, clean, and cute Chrome Extension designed to make reading foreign texts seamless. Just select any text on a webpage, and a little cat icon will pop up. Click it, and it will instantly pronounce the word/phrase using Google TTS (with an American accent) while simultaneously showing you the Persian (Farsi) translation.


Right-click the extension icon in your toolbar to quickly access the "About" page.

### 🛠️ How it Works Under the Hood
* Uses Manifest V3 architecture.
* Implements a **Chrome Offscreen Document** (`audio.html` / `audio.js`) to handle audio streams without violating modern extension security policies.
* Fetches translations directly via the Google Translate API using asynchronous service worker messaging.

### 🚀 How to Install (Locally)
1. Clone or download this repository to your machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle switch in the top right corner).
4. Click **Load unpacked** in the top left.
5. Select the folder containing these files. 
6. Go highlight some text and let the cat do the work!

---

## فارسی

پروژه **ببوش ترنسلیت** (Baboosh Translate) یک افزونه سبک، تمیز و بامزه برای کروم هست که با هدف راحت‌تر کردن مطالعه متن‌های انگلیسی طراحی شده. کافیه هر متنی رو توی صفحه وب انتخاب (Select) کنید تا آیکون پیشی کوچولو ظاهر بشه. با کلیک روی اون، همزمان که تلفظ صوتی متن (با لهجه آمریکایی از طریق گوگل) پخش می‌شه، ترجمه فارسی روان اون رو هم توی یک باکس می‌بینید.


با راست‌کلیک روی آیکون افزونه در تولبار، می‌تونید به صفحه About دسترسی داشته باشید.

در حال حاضر هنوز دارم سعی می کنم گسترش بدم. زبان های دیگه هم بهش اضافه می کنم. به زودی...
### 🛠️ معماری فنی و پشت صحنه
* توسعه داده شده بر پایه **Manifest V3**.
* استفاده از **Chrome Offscreen Document** برای مدیریت بی‌نقص پخش صوت بدون تداخل با قوانین امنیتی جدید مرورگر.
* اتصال مستقیم به API گوگل ترنسلیت از طریق Service Worker به صورت کاملاً ناهمگام (Async).

### 🚀 راهنمای نصب و راه‌اندازی (لوکال)
۱. کل این ریپازیتوری رو دانلود کنید یا جفتش کنید (Clone) روی سیستم خودتون.
۲. مرورگر کروم رو باز کنید و برید به آدرس `chrome://extensions/`.
۳. از گوشه بالا سمت راست، گزینه **Developer mode** رو روشن کنید.
۴. از گوشه بالا سمت چپ، دکمه **Load unpacked** رو بزنید.
۵. پوشه‌ای که فایل‌های افزونه داخلش هست رو انتخاب کنید.
۶. حالا برید روی یک متن تست کنید و بذارید بابوش کارش رو انجام بده!