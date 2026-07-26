# سويق | المنيو الإلكتروني

منيو رقمي ثنائي اللغة لعلامة **سويق**، مخصص لفرعي المقصد وبستان المستظل. بُني المشروع باستخدام Vite وTypeScript وHTML دلالي وCSS حديث، من دون إطار واجهات أو Backend أو سلة مشتريات.

الموقع المنشور: [https://abdalmaged818.github.io/saweeg-menu/](https://abdalmaged818.github.io/saweeg-menu/)

## المزايا

- العربية هي اللغة الافتراضية مع دعم RTL كامل.
- نسخة إنجليزية كاملة في `/en/` مع دعم LTR.
- تبديل فوري بين فرعي المقصد وبستان المستظل.
- حفظ الفرع في الرابط ثم في `localStorage` كخيار احتياطي.
- تصفية المنتجات حسب التصنيف من دون إعادة تحميل الصفحة.
- عرض المشروبات والإضافات بقائمة مخصصة وسهلة القراءة.
- معالجة مرئية هادئة عند غياب صور المنتجات أو الشعار.
- تصميم Mobile First ومتوافق مع GitHub Pages.
- ملفات SEO أساسية وصفحة 404 وملف Web Manifest.
- نشر تلقائي من فرع `main` عبر GitHub Actions.

## التقنية المستخدمة

- Vite
- TypeScript
- Semantic HTML
- CSS حديث ومنظم
- JavaScript/TypeScript خفيف للتفاعلات

## التشغيل محليًا

يتطلب المشروع Node.js 22 أو إصدار LTS متوافق.

```bash
npm install
npm run dev
```

## فحص TypeScript وبناء الإنتاج

```bash
npm run typecheck
npm run build
npm run preview
```

ينتج أمر البناء مجلد `dist/` الجاهز للنشر.

## النشر

ملف `.github/workflows/deploy.yml` يبني المشروع وينشر `dist/` تلقائيًا عند كل Push إلى فرع `main`، كما يدعم التشغيل اليدوي من صفحة Actions.

إعداد Vite يستخدم المسار الأساسي:

```text
/saweeg-menu/
```

## بنية الملفات

```text
.
├── .github/workflows/deploy.yml
├── public/
│   ├── assets/brand/
│   ├── assets/products/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── src/
│   ├── config/site.ts
│   ├── data/
│   ├── i18n/
│   ├── scripts/
│   ├── styles/
│   ├── templates/
│   └── types/
├── en/index.html
├── 404.html
├── index.html
└── vite.config.ts
```

## تعديل الأسعار

عدّل قيمة `price` للمنتج داخل:

```text
src/data/products.ts
```

وعدّل سعر المشروب أو الإضافة داخل:

```text
src/data/extras.ts
```

الأسعار أرقام بالريال السعودي، وتُعرض صياغتها العربية أو الإنجليزية تلقائيًا.

## إضافة منتج

أضف كائنًا واحدًا فقط إلى `src/data/products.ts` يحتوي على:

- معرّف فريد `id`.
- الاسم العربي `nameAr`.
- الاسم الإنجليزي `nameEn`.
- السعر `price`.
- التصنيف `category`.
- اسم ملف الصورة `image`.
- الفروع التي يتوفر فيها المنتج `branches`.

لا تنشئ قوائم منتجات منفصلة لكل فرع؛ خاصية `branches` هي مصدر التصفية.

## إضافة فرع

1. أضف المعرّف الجديد إلى نوع `BranchId` في `src/types/menu.ts`.
2. أضف بيانات الفرع إلى `src/data/branches.ts`.
3. أضف الاسم المركزي إلى `src/config/site.ts`.
4. أضف المعرّف إلى خاصية `branches` في المنتجات والإضافات المتوفرة.

## تغيير رابط المتجر

عدّل `storeUrl` في:

```text
src/config/site.ts
```

## تغيير الشعار

ضع ملف الشعار الرسمي بصيغة WebP داخل:

```text
public/assets/brand/logo-saweeg.webp
```

سيظهر الشعار تلقائيًا. عند غيابه يظهر اسم «سويق» نصيًا من دون صورة مكسورة.

## إضافة الصور النهائية

ضع صور المنتجات المربعة بصيغة WebP داخل:

```text
public/assets/products/
```

يجب استخدام الأسماء التالية حرفيًا:

1. `talbinah-ice-cream.webp`
2. `cold-talbinah.webp`
3. `hot-talbinah.webp`
4. `talbinah-lotus-cheesecake.webp`
5. `dates-with-sawiq.webp`
6. `damkah.webp`
7. `maamoul-box.webp`
8. `basbousa-box.webp`
9. `talbinah-sachet-box.webp`
10. `gift-box.webp`
11. `al-jabirah-box.webp`
12. `sawiq-powder.webp`
13. `talbinah-powder.webp`
14. `madini-crepe-cheese-signature.webp`

عند غياب أي صورة تبقى البطاقة متوازنة بخلفية زخرفية هادئة، وبمجرد إضافة الملف بالاسم الصحيح تظهر الصورة من دون تعديل الكود.

## English

Saweeg Digital Menu is a lightweight bilingual Vite and TypeScript website for the Al-Maqsad and Bustan Al-Mustazal branches. Product, branch, category, and extras data are maintained as typed TypeScript data, while GitHub Actions handles the production deployment to GitHub Pages.
