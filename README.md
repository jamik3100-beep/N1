# Javoxirxo'ja — Portfolio

Javoxirxo'janing portfolio sayti. HTML, CSS va JavaScript'da yozilgan; Supabase akkaunt tizimi uchun internet orqali Supabase JS kutubxonasidan foydalaniladi.

## GitHub Pages'da chiqarish

1. Ushbu fayllarni GitHub repository'ga yuklang.
2. Repository'da **Settings → Pages** bo'limini oching.
3. **Deploy from a branch** ni tanlang, `main` branch va `/ (root)` papkasini belgilang.
4. **Save** tugmasini bosing. Sayt GitHub Pages bergan manzilda ochiladi.

## Akkaunt va ro'yxatdan o'tishni ulash

Akkaunt bo'limida ro'yxatdan o'tish, email/parol bilan kirish, parolni tiklash va akkauntdan chiqish mavjud. Haqiqiy ishlashi uchun:

1. Supabase Dashboard'da loyihangizni oching va **Project Settings → API** bo'limiga o'ting.
2. `supabase-config.js` faylidagi `YOUR_SUPABASE_PROJECT_URL` o'rniga Project URL'ni, `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` o'rniga **publishable key** (yoki eski loyihalarda **anon key**)ni kiriting.
3. Supabase'da **Authentication → URL Configuration** bo'limiga GitHub Pages saytingizning manzilini **Site URL** va **Redirect URLs** ro'yxatlariga qo'shing.
4. **Authentication → Providers → Email** bo'limida email orqali ro'yxatdan o'tish yoqilganini tekshiring.
5. Fayllarni GitHub'ga yuklab, sahifani oching. Ro'yxatdan o'tishda saytga kiritilgan emailingizga kelgan tasdiqlash havolasini bosing.

`supabase-config.js` GitHub Pages'da ommaviy ko'rinadi. Faqat brauzerda ishlatish uchun mo'ljallangan **publishable/anon key**ni qo'ying; **service_role** key, parol yoki maxfiy kalitni hech qachon bu faylga kiritmang. Bu sahifa akkauntga kirish/chiqish va profilni ko'rsatishni ulaydi; alohida foydalanuvchi ma'lumotlarini saqlaydigan jadval yoki admin huquqlari avtomatik yaratilmaydi.

## Shaxsiylashtirish

- Bog'lanish tugmasi hozircha email manzilsiz turibdi. `index.html` ichidagi `href="mailto:"` qiymatini o'z emailingizga almashtiring.
- GitHub yoki Telegram profilingiz bo'lsa, navigatsiya yoki footerga o'z profilingiz havolasini qo'shing.
- `styles.css` boshidagi rang o'zgaruvchilari orqali sayt ranglarini o'zgartirishingiz mumkin.
