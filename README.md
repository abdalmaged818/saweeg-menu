# سويق | المنيو الإلكتروني

منيو رقمي ثنائي اللغة لعلامة **سويق**، مخصص لفرعي المقصد وبستان المستظل. بُني المشروع باستخدام Vite وTypeScript وHTML دلالي وCSS حديث، من دون إطار واجهات أو Backend أو سلة مشتريات.

الموقع الرسمي: [https://menu.saweegsa.com/](https://menu.saweegsa.com/)

## المزايا

- العربية هي اللغة الافتراضية مع دعم RTL كامل.
- نسخة إنجليزية كاملة في `/en/` مع دعم LTR.
- تبديل فوري بين فرعي المقصد وبستان المستظل.
- حفظ الفرع في الرابط ثم في `localStorage` كخيار احتياطي.
- عرض جميع الأقسام بالتتابع مع تبديل الفرع من دون إعادة تحميل الصفحة.
- عرض المشروبات والإضافات بقائمة مخصصة وسهلة القراءة.
- بطاقات نصية صغيرة ومقصودة للمنتجات التي لا تتوفر لها صور رسمية.
- تصميم Mobile First منشور عبر GitHub Pages على نطاق مخصص.
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

إعداد Vite يستخدم جذر النطاق المخصص:

```text
/
```

## بنية الملفات

```text
.
├── .github/workflows/deploy.yml
├── assets-source/product-images/
├── public/
│   ├── assets/brand/
│   ├── assets/products/
│   ├── CNAME
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
├── scripts/process-product-images.mjs
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
- نمط العرض `displayMode`: إما `image` أو `compact`.
- اسم ملف الصورة `image` عند استخدام نمط `image`.
- الفروع التي يتوفر فيها المنتج `branches`.

لا تنشئ قوائم منتجات منفصلة لكل فرع؛ خاصية `branches` هي مصدر التصفية.

## إضافة فرع

1. أضف المعرّف الجديد إلى نوع `BranchId` في `src/types/menu.ts`.
2. أضف بيانات الفرع إلى `src/data/branches.ts`.
3. أضف الاسم المركزي إلى `src/config/site.ts`.
4. أضف المعرّف إلى خاصية `branches` في المنتجات والإضافات المتوفرة.

## تغيير الروابط الرسمية

عدّل قيم `links` للمتجر وخرائط الفروع وWhatsApp وLinktree في:

```text
src/config/site.ts
```

## تغيير الشعار

ضع ملف الشعار الرسمي بصيغة SVG داخل:

```text
public/assets/brand/logo-saweeg.svg
```

سيظهر الشعار تلقائيًا. عند غيابه يظهر اسم «سويق» نصيًا من دون صورة مكسورة.

## تحسين صور المنتجات

توضع الصور الأصلية في:

```text
assets-source/product-images/
```

ثم تُعالج إلى WebP مربعة في مساحة sRGB وبحد أقصى 1400×1400 بكسل عبر:

```bash
npm run images:optimize
```

وتُكتب النتائج النهائية في:

```text
public/assets/products/
```

الصور الرسمية المتوفرة حاليًا تستخدم الأسماء التالية حرفيًا:

1. `talbinah-ice-cream.webp`
2. `cold-talbinah.webp`
3. `hot-talbinah.webp`
4. `talbinah-lotus-cheesecake.webp`
5. `damkah.webp`
6. `maamoul-box.webp`
7. `basbousa-box.webp`
8. `talbinah-sachet-box.webp`
9. `gift-box.webp`
10. `al-jabirah-box.webp`
11. `sawiq-powder.webp`

المنتجات `dates-with-sawiq` و`talbinah-powder`
و`madini-crepe-cheese-signature` تستخدم `displayMode: "compact"` ولا تنشئ
مساحة صورة أو Placeholder. لا يُحوّل أي منها إلى بطاقة مصورة إلا بعد إضافة
مصدر رسمي مطابق وتحديث `displayMode` واسم الملف في البيانات.

## النطاق الرسمي

يحتوي `public/CNAME` على:

```text
menu.saweegsa.com
```

وسجل DNS المطلوب للنطاق الفرعي هو:

```text
Type: CNAME
Host: menu
Target: abdalmaged818.github.io
```

## English

Saweeg Digital Menu is a lightweight bilingual Vite and TypeScript website for the Al-Maqsad and Bustan Al-Mustazal branches. Product, branch, category, and extras data are maintained as typed TypeScript data, while GitHub Actions deploys the site to GitHub Pages at `https://menu.saweegsa.com/`.
