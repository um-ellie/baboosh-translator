# 🐱 Baboosh Translate

[فارسی](#پروژه-بابوش-ترنسلیت-baboosh-translate) \|
[English](#baboosh-translate-project)

------------------------------------------------------------------------

# 🐱 پروژه ببوش ترنسلیت (Baboosh Translate)

یک افزونه سبک، تمیز و بامزه برای کروم که با هدف راحت‌تر کردن مطالعه
متن‌های انگلیسی طراحی شده است.

مهم‌ترین مزیت این extension این است که بدون توجه به موقعیت مکانی کاربر،
فقط از لهجه آمریکایی برای تلفظ استفاده می‌کند. البته لهجه بریتیش هم به
زودی به آن اضافه می‌کنم.

در حال حاضر فقط قابلیت ترجمه و تلفظ از زبان انگلیسی به فارسی را دارد.
زبان‌های دیگر هم به زودی به آن اضافه می‌شوند.

کافی است هر متنی را در یک صفحه وب انتخاب (Select) کنید تا آیکون پیشی
کوچولو ظاهر شود. با کلیک روی آن، همزمان که تلفظ صوتی متن (با لهجه
آمریکایی از طریق گوگل) پخش می‌شود، ترجمه فارسی روان آن را هم در یک باکس
مشاهده می‌کنید.

این باکس کاملاً هوشمند طراحی شده و خودش را طوری تنظیم می‌کند که هیچ‌وقت از
لبه‌های صفحه بیرون نزند و یا روی متن اصلی قرار نگیرد.

قابلیت بخش صدا بعد از کلیک روی آیکون popup و یا بعد از باز شدن باکس
popup قابل انتخاب است. این تنظیمات را می‌توانید از صفحه options یا منوی
اصلی extension تغییر دهید.

این پروژه بیشتر برای من یک پروژه تمرینی برای JavaScript است. خوشحال
می‌شوم آن را تست کنید، مشکلاتش را به من بگویید، یا اگر خوشتان آمد پیشنهاد
دهید چه ویژگی‌هایی دوست دارید به آن اضافه کنم.

ایمیل من در صفحه about قرار دارد.

## معماری فنی

این افزونه بر پایه **Manifest V3** توسعه داده شده است.

برای پخش صوت از Chrome Offscreen Document استفاده می‌کند تا با قوانین
امنیتی جدید کروم تداخلی نداشته باشد.

درخواست‌های ترجمه هم به صورت Async از طریق Service Worker به API گوگل
ارسال می‌شوند.

## راهنمای نصب و راه‌اندازی (لوکال)

در حال حاضر اکانت Developer در گوگل ندارم، به همین دلیل پروژه را
نتوانستم در Google Web Store قرار بدهم. ببخشید.

می‌توانید به روشی که توضیح داده شده از آن استفاده کنید.

۱. **دانلود پروژه:**\
کل این ریپازیتوری را دانلود کنید (یا Clone کنید) و روی سیستم خود Extract
کنید.

۲. **صفحه افزونه‌ها:**\
مرورگر کروم را باز کنید و به آدرس زیر بروید:

    chrome://extensions/

۳. **حالت توسعه‌دهنده:**\
از گوشه بالا سمت راست، گزینه **Developer mode** را روشن کنید.

۴. **بارگذاری افزونه:**\
از گوشه بالا سمت چپ، دکمه **Load unpacked** را بزنید.

۵. **انتخاب پوشه:**\
پوشه اصلی پروژه (جایی که فایل `manifest.json` قرار دارد) را انتخاب کنید.

۶. حالا به یک سایت خارجی بروید، متنی را انتخاب کنید و بگذارید ببوش کارش
را انجام بدهد!

اگر دفعه اول کار نکرد، فقط کافی است صفحه را Refresh کنید.

## برنامه‌های آینده و زبان‌های جدید

این پروژه همچنان در حال توسعه است و به زودی زبان‌های دیگری را هم به آن
اضافه می‌کنم.

منتظر آپدیت‌های بعدی باشید!

دوستتون دارم. مراقب خودتون باشید❤️🐈🦒🐘🐢🌳

------------------------------------------------------------------------

# 🐱 Baboosh Translate Project

[فارسی](#پروژه-ببوش-ترنسلیت-baboosh-translate) \|
[English](#baboosh-translate-project)

A lightweight, clean, and cute Chrome extension designed to make reading
English texts easier.

The most important advantage of this extension is that, regardless of
the user's location, it always uses an American accent for
pronunciation. Of course, I will add the British accent soon as well.

Currently, it only supports translation and pronunciation from English
to Persian. More languages will be added soon.

Simply select any text on a web page, and the little cat icon will
appear. By clicking on it, you will hear the pronunciation of the
selected text (with an American accent through Google), while also
seeing its smooth Persian translation inside a popup box.

This popup box is designed to be completely smart. It automatically
adjusts its position so it never goes outside the screen edges and never
covers the original text.

The sound behavior can be selected either after clicking the popup icon
or after opening the popup box. You can change this option from the
options page or the main extension menu.

This project is mostly a practice project for me to improve my
JavaScript skills. I would be happy if you test it, tell me about its
problems, or if you like it, suggest what features you would like me to
add.

My email address is available on the about page.

## Technical Architecture

This extension is developed based on **Manifest V3**.

For audio playback, it uses Chrome Offscreen Document to avoid conflicts
with the new Chrome security rules.

Translation requests are sent asynchronously through the Service Worker
to Google's API.

## Local Installation Guide

Currently, I do not have a Google Developer account, so I could not
publish this project on the Google Web Store. Sorry about that.

You can use it by following these steps:

۱. **Download the project:**\
Download this entire repository (or Clone it) and extract it on your
system.

۲. **Open Extensions page:**\
Open Chrome and go to:

    chrome://extensions/

۳. **Enable Developer mode:**\
Turn on **Developer mode** from the top-right corner.

۴. **Load the extension:**\
Click the **Load unpacked** button from the top-left corner.

۵. **Select the folder:**\
Choose the main project folder (the folder containing the
`manifest.json` file).

۶. Now go to any foreign website, select some text, and let Baboosh do
its job!

If it does not work the first time, just refresh the page.

## Future Plans and New Languages

This project is still under development, and I will add more languages
soon.

Stay tuned for future updates!

I love you all. Take care of yourselves ❤️🐈🦒🐘🐢🌳
