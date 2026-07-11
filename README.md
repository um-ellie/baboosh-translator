# 🐱 Baboosh Translate


فارسی | English

---
# ببوش ترنسلیت

یک افزونه سبک، تمیز و بامزه برای کروم که با هدف راحت‌تر کردن مطالعه
متن‌های انگلیسی طراحی شده.

مهم‌ترین مزیت این extension حل مشکل نبود لحجه آمریکای در لوکیشن های دیگه است. اگر شما با ip لوکیشن جایی به غیر آمریکا وصل بشید. گوگل فقط لحجه بریتیش را برای شما فعال می کنه.
اما با ببوش ترنسلیت، بدون توجه به موقعیت مکانی کاربر،
می تونید از لهجه آمریکایی برای تلفظ استفاده ‌کنید.
البته لهجه بریتیش هم به زودی به آن اضافه می‌کنم. که قابل انتخاب باشه.

در حال حاضر فقط قابلیت ترجمه و تلفظ از زبان انگلیسی به فارسی را دارد.
زبان‌های دیگر هم به زودی بهش اضافه می کنم

کافیه یک متنی را در صفحه وب انتخاب (Select) کنید تا آیکون پیشی
کوچولو ظاهر بشه. با کلیک روی اون، همزمان که تلفظ صوتی متن (با لهجه
آمریکایی از طریق API گوگل) پخش می‌شود، ترجمه فارسی روان آن را هم در یک باکس
مشاهده می‌کنید.

این باکس کاملاً هوشمند طراحی شده و خودش را طوری تنظیم می‌کند که هیچ‌وقت از
لبه‌های صفحه بیرون نزنه و یا روی متن اصلی قرار نگیره.

قابلیت بخش صدا: اینکه بعد از کلیک روی آیکون popup و یا بعد از باز شدن باکس
popup بخش بشه، قابل انتخابه. این تنظیمات را می‌تونید از صفحه options یا منوی
اصلی extension تغییر بدید.

این پروژه بیشتر برای من یک پروژه تمرینی برای JavaScript است. خوشحال
میشم که تستش کنید، مشکلاتش را به من بگید، یا اگر خوشتن اومد پیشنهاد بدید که چه ویژگی‌هایی دوست دارید به اون اضافه کنم.

ایمیل من هم تو صفحه about قرار داره.

## معماری فنی

این افزونه بر پایه **Manifest V3** توسعه داده شده است.

برای پخش صوت از Chrome Offscreen Document استفاده می‌کند تا با قوانین
امنیتی جدید کروم تداخلی نداشته باشد.

درخواست‌های ترجمه هم به صورت Async از طریق Service Worker به API گوگل
ارسال می‌شوند.

# روش نصب

از آنجایی که در حال حاضر اکانت Developer گوگل ندارم، نتونستم افزونه را به صورت رسمی در Google Web Store منتشر کنم. ببخشید.
ولی دو تا روش هست که می تونید راحت از افزونه استفاده کنید.

### روش اول: نصب سریع از طریق فایل CRX (پیشنهادی)


1. ابتدا به بخش **Releases** در همین ریپازیتوری بروید و آخرین نسخه فایل با پسوند `.crx` را دانلود کنید.
2. مرورگر کروم را باز کنید و به آدرس `chrome://extensions/` بروید.
3. از گوشه بالا سمت راست، گزینه **Developer mode** را روشن کنید.
4. حالا فایل `.crx` دانلود شده را با ماوس بکشید و داخل همین صفحه افزونه‌ها رها کنید (Drag & Drop).
5. پیامی برای تایید نصب ظاهر می‌شود؛ روی **Add extension** کلیک کنید. کار تمام است!

### روش دوم: بارگذاری به صورت دستی (Unpacked)


1. کل این ریپازیتوری را دانلود (یا Clone) کنید و فایل زیپ را روی سیستم خود Extract کنید.
2. مرورگر کروم را باز کنید و به آدرس `chrome://extensions/` بروید.
3. از گوشه بالا سمت راست، گزینه **Developer mode** را روشن کنید.
4. از گوشه بالا سمت چپ، دکمه **Load unpacked** را بزنید.
5. پوشه اصلی پروژه (جایی که فایل `manifest.json` قرار دارد) را انتخاب کنید.

حالا به یک سایت خارجی بروید، متنی را انتخاب کنید و بگذارید ببوش کارش را انجام بدهد!

# خطاها:
_(نکته: اگر بعد از نصب، در صفحه‌ای که از قبل باز بود کار نکرد، کافی است یک‌بار آن صفحه را Refresh کنید)._

## برنامه‌های آینده و زبان‌های جدید

این پروژه همچنان در حال توسعه است و به زودی زبان‌های دیگری را هم به آن
اضافه می‌کنم.

منتظر آپدیت‌های بعدی باشید!

دوستتون دارم. مراقب خودتون باشید❤️🐈🦒🐘🐢🌳

---


# Baboosh Translate

A lightweight, clean, and cute Chrome extension designed to make reading
English texts easier.

The biggest advantage of this extension is solving the problem of not having
an American accent available in different locations. If you connect with an IP
from a location outside the United States, Google only enables the British
accent for you.

But with Baboosh Translate, regardless of the user's location, you can use an
American accent for pronunciation.

Of course, I will add the British accent soon as well, so users can choose
between them.

Currently, it only supports translation and pronunciation from English to
Persian. Other languages will be added soon.

Simply select a text on a webpage, and the little cat icon will appear.
By clicking on it, while the audio pronunciation of the text (with an American
accent through Google's API) is played, you can also see its smooth Persian
translation inside a popup box.

This popup box is designed to be completely smart. It automatically adjusts
its position so it never goes outside the screen edges and never covers the
original text.

## Audio Feature

You can choose whether the pronunciation starts immediately after clicking the
popup icon, or after the popup box is opened.

You can change this setting from the options page or the main extension menu.

This project is mostly a practice project for me to improve my JavaScript
skills.

I would be happy if you test it, tell me about its problems, or if you like
it, suggest what features you would like to see added in the future.

My email address is also available on the About page.

## Technical Architecture

This extension is developed based on **Manifest V3**.

For audio playback, it uses Chrome Offscreen Document to avoid conflicts with
the new Chrome security rules.

Translation requests are sent asynchronously to Google's API through a Service
Worker.

# Installation

Since I currently don't have a Google Developer account, I couldn't publish
the extension officially on the Google Web Store. Sorry about that.

But there are two easy ways to use the extension.

## Method 1: Quick installation using the CRX file (Recommended)


1. First, go to the **Releases** section in this repository and download the
   latest `.crx` file.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** from the top-right corner.
4. Drag and drop the downloaded `.crx` file into the extensions page.
5. A confirmation message will appear. Click **Add extension**. Done!

## Method 2: Manual installation (Unpacked)


1. Download (or Clone) this entire repository and extract the ZIP file on your
   system.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** from the top-right corner.
4. Click the **Load unpacked** button from the top-left corner.
5. Select the main project folder (the folder containing the
   `manifest.json` file).

Now go to a foreign website, select some text, and let Baboosh do its job!

# Errors

_(Note: If it does not work on a page that was already open before
installation, simply refresh that page once.)_

## Future Plans and New Languages

This project is still under development, and I will add more languages soon.

Stay tuned for future updates!

Love you all. Take care of yourselves ❤️🐈🦒🐘🐢🌳