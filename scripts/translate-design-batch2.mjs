import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const uiWireframeLinksHtml = `<div class="note">
       <p>
        <b>মনে রাখবেন:</b> এই লিংকগুলোতে ক্লিক করে UI ডিজাইন সম্পর্কে আরও জানুন:
       </p>
       <ol>
        <li>
         <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959239/pdfs/ui-theory-1" target="_blank">UI ডিজাইন কী - UI ওয়্যারফ্রেমিং পরিচিতি</a>
        </li>
        <li>
         <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959240/pdfs/ui-theory-2" target="_blank">UI কন্ট্রোল - UI ওয়্যারফ্রেমিং পরিচিতি</a>
        </li>
        <li>
         <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959242/pdfs/ui-theory-3" target="_blank">UI ডিজাইন প্যাটার্ন - UI ওয়্যারফ্রেমিং পরিচিতি</a>
        </li>
        <li>
         <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959243/pdfs/ui-theory-4" target="_blank">ডিজাইন নীতিমালা - UI ওয়্যারফ্রেমিং পরিচিতি</a>
        </li>
        <li>
         <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959245/pdfs/ui-theory-5" target="_blank">টেমপ্লেট - UI ওয়্যারফ্রেমিং পরিচিতি</a>
        </li>
        <li>
         <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959246/pdfs/ui-theory-6" target="_blank">প্রক্রিয়া - UI ওয়্যারফ্রেমিং পরিচিতি</a>
        </li>
        <li>
         <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959247/pdfs/wireframes" target="_blank">ওয়্যারফ্রেম কী?</a>
        </li>
       </ol>
      </div>`

const docs = [
  {
    id: '55ac2efe-2f95-4dad-9896-b5e80747be76', // design/brochure-exercise
    title: 'ব্রোশিওর ডিজাইন',
    meta_description: 'বিনামূল্যে ডাউনলোডযোগ্য ট্রাই-ফোল্ড ও হাফ-ফোল্ড ব্রোশিওর ডিজাইন উদাহরণসহ অনুশীলন করুন।',
    blocks: [
      { id: '4TnPMAvxilui', text: 'ব্রোশিওর ডিজাইন', type: 'heading', level: 2, anchor: 'brochure-design' },
      { id: '1IUIJxxdmUQr', type: 'richtext', html: '<hr>' },
      { id: 'o1OHe_IkVMZz', type: 'table', header: ['অনুশীলনী', 'ইমেজ ও কপি ডাউনলোড করুন'], rows: [
        ['০১. সুশি ত্রি-ফোল্ড ব্রোশিওর <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960255/img/graphics-design/brochure/thumbnail/brochure-tri-fold-01.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960242/img/graphics-design/brochure/brochure-tri-fold-01.webp" class="btn btn-primary" download="LCA-brochure-01">ডাউনলোড করুন</a>'],
        ['০২. বায়ো ফুড ত্রি-ফোল্ড ব্রোশিওর <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960256/img/graphics-design/brochure/thumbnail/brochure-tri-fold-02.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960243/img/graphics-design/brochure/brochure-tri-fold-02.webp" class="btn btn-primary" download="LCA-brochure-02">ডাউনলোড করুন</a>'],
        ['০৩. বিজনেস হাফ-ফোল্ড ব্রোশিওর <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960257/img/graphics-design/brochure/thumbnail/brochure-two-fold-01.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960245/img/graphics-design/brochure/brochure-two-fold-01.webp" class="btn btn-primary" download="LCA-brochure-03">ডাউনলোড করুন</a>'],
        ['০৪. ব্রেকফাস্ট হাফ-ফোল্ড ব্রোশিওর <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960258/img/graphics-design/brochure/thumbnail/brochure-two-fold-02.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960246/img/graphics-design/brochure/brochure-two-fold-02.webp" class="btn btn-primary" download="LCA-brochure-04">ডাউনলোড করুন</a>'],
        ['০৫. অ্যাবস্ট্র্যাক্ট হাফ-ফোল্ড ব্রোশিওর <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960259/img/graphics-design/brochure/thumbnail/brochure-two-fold-03.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960248/img/graphics-design/brochure/brochure-two-fold-03.webp" class="btn btn-primary" download="LCA-brochure-05">ডাউনলোড করুন</a>'],
      ] },
      { id: 'lVfNNZOp3DmJ', type: 'richtext', html: '<p class="note">\n       <b>মনে রাখবেন:</b> আরও ব্রোশিওর উদাহরণ দেখতে <a href="https://webgraphicshub.com/works/brochure-trifold/" target="_blank">Web Graphics Hub</a> ভিজিট করুন।\n      </p>' },
    ],
    toc: [{ id: 'brochure-design', text: 'ব্রোশিওর ডিজাইন', level: 2 }],
  },
  {
    id: '18a1e07b-c40c-47ed-9450-85295ddbcd9a', // design/menu-exercise
    title: 'মেনু কার্ড ডিজাইন',
    meta_description: 'বিনামূল্যে ডাউনলোডযোগ্য রেস্তোরাঁ ও ককটেল মেনু কার্ড ডিজাইন উদাহরণসহ অনুশীলন করুন।',
    blocks: [
      { id: 'ty2BXkKe6kod', text: 'মেনু কার্ড ডিজাইন', type: 'heading', level: 2, anchor: 'menu-card-design' },
      { id: '1Z9GUuJccZLZ', type: 'richtext', html: '<hr>' },
      { id: 'gQau4-9k3Qp5', type: 'table', header: ['অনুশীলনী', 'ইমেজ ও কপি ডাউনলোড করুন'], rows: [
        ['০১. ককটেল মেনু ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960306/img/graphics-design/menu/thumbnail/food-flyer-1.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960295/img/graphics-design/menu/food-flyer-1.webp" class="btn btn-primary" download="LCA-menu-01">ডাউনলোড করুন</a>'],
        ['০২. ফাস্ট কিং মেনু ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960307/img/graphics-design/menu/thumbnail/food-flyer-2.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960297/img/graphics-design/menu/food-flyer-2.webp" class="btn btn-primary" download="LCA-menu-02">ডাউনলোড করুন</a>'],
        ['০৩. ফ্রেশ ফুড হোম মেনু ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960308/img/graphics-design/menu/thumbnail/food-flyer-3.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960298/img/graphics-design/menu/food-flyer-3.webp" class="btn btn-primary" download="LCA-menu-03">ডাউনলোড করুন</a>'],
        ['০৪. ক্লাসিক মেনু ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960309/img/graphics-design/menu/thumbnail/food-flyer-4.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960299/img/graphics-design/menu/food-flyer-4.webp" class="btn btn-primary" download="LCA-menu-04">ডাউনলোড করুন</a>'],
        ['০৫. ভিন্টেজ মেনু ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960310/img/graphics-design/menu/thumbnail/food-flyer-5.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960301/img/graphics-design/menu/food-flyer-5.webp" class="btn btn-primary" download="LCA-menu-05">ডাউনলোড করুন</a>'],
        ['০৬. বার্গার মেনু ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960311/img/graphics-design/menu/thumbnail/food-flyer-6.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960304/img/graphics-design/menu/food-flyer-6.webp" class="btn btn-primary" download="LCA-menu-06">ডাউনলোড করুন</a>'],
        ['০৬. রয়েল মেনু ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960312/img/graphics-design/menu/thumbnail/food-flyer-7.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960305/img/graphics-design/menu/food-flyer-7.webp" class="btn btn-primary" download="LCA-menu-07">ডাউনলোড করুন</a>'],
      ] },
      { id: 'KsMSZS1jskPJ', type: 'richtext', html: '<p class="note">\n       <b>মনে রাখবেন:</b> আরও মেনু উদাহরণ দেখতে <a href="https://webgraphicshub.com/works/food-menu-design/" target="_blank">Web Graphics Hub</a> ভিজিট করুন।\n      </p>' },
    ],
    toc: [{ id: 'menu-card-design', text: 'মেনু কার্ড ডিজাইন', level: 2 }],
  },
  {
    id: '703c786b-e63f-4e7e-8530-e5dd8ff53912', // design/poster
    title: 'পোস্টার ডিজাইন',
    meta_description: 'বিনামূল্যে ডাউনলোডযোগ্য সোশ্যাল মিডিয়া পোস্টার ও ইনস্টাগ্রাম স্টোরি ডিজাইন উদাহরণসহ অনুশীলন করুন।',
    blocks: [
      { id: 'CyjRFirvaV-r', text: 'পোস্টার ডিজাইন', type: 'heading', level: 2, anchor: 'poster-design' },
      { id: 'KqNLkygiKq7H', type: 'richtext', html: '<hr>' },
      { id: 'QNhCwr040bnk', type: 'table', header: ['অনুশীলনী', 'ইমেজ ও কপি ডাউনলোড করুন'], rows: [
        ['১. ফ্যাশন সেল ইনস্টাগ্রাম স্টোরিজ <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960333/img/graphics-design/poster/thumbnail/poster-01.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960316/img/graphics-design/poster/poster-01.webp" class="btn btn-primary" download="LCA-Poster-01">ডাউনলোড করুন</a>'],
        ['২. ফ্যাশন সোশ্যাল মিডিয়া পোস্ট টেমপ্লেট <img src="https://res.cloudinary.com/portfolios-gq/image/upload/v1663743805/Uplabs/Manly_Fashion_Social_Media_Post_Template_phjqpw.jpg" alt="">', '<a href="https://res.cloudinary.com/portfolios-gq/image/upload/v1663743805/Uplabs/Manly_Fashion_Social_Media_Post_Template_phjqpw.jpg" class="btn btn-primary" download="LCA-Poster-02">ডাউনলোড করুন</a>'],
        ['৩. মিনিমালিস্ট ইনস্টা স্টোরিজ ফিড পোস্ট (ট্রাভেল) <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960334/img/graphics-design/poster/thumbnail/poster-03.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960317/img/graphics-design/poster/poster-03.webp" class="btn btn-primary" download="LCA-Poster-03">ডাউনলোড করুন</a>'],
        ['৪. সোশ্যাল মিডিয়া সেলস পোস্ট টেমপ্লেট <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960335/img/graphics-design/poster/thumbnail/poster-04.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960320/img/graphics-design/poster/poster-04.webp" class="btn btn-primary" download="LCA-Poster-04">ডাউনলোড করুন</a>'],
        ['৫. বিজনেস মার্কেটিং ওয়েব সোশ্যাল মিডিয়া পোস্টার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960336/img/graphics-design/poster/thumbnail/poster-05.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960321/img/graphics-design/poster/poster-05.webp" class="btn btn-primary" download="LCA-Poster-05">ডাউনলোড করুন</a>'],
        ['৬. ভেক্টর সোশ্যাল মিডিয়া পোস্ট <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960337/img/graphics-design/poster/thumbnail/poster-06.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960322/img/graphics-design/poster/poster-06.webp" class="btn btn-primary" download="LCA-Poster-06">ডাউনলোড করুন</a>'],
        ['৭. স্পোর্টস সোশ্যাল মিডিয়া পোস্ট <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960338/img/graphics-design/poster/thumbnail/poster-07.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960323/img/graphics-design/poster/poster-07.webp" class="btn btn-primary" download="LCA-Poster-07">ডাউনলোড করুন</a>'],
        ['৮. কালেকশন (ফুড রেস্টুরেন্ট) <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960339/img/graphics-design/poster/thumbnail/poster-08.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960324/img/graphics-design/poster/poster-08.webp" class="btn btn-primary" download="LCA-Poster-08">ডাউনলোড করুন</a>'],
        ['৯. কালেকশন সোশ্যাল মিডিয়া গ্র্যাডিয়েন্ট পোস্ট <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960340/img/graphics-design/poster/thumbnail/poster-09.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960325/img/graphics-design/poster/poster-09.webp" class="btn btn-primary" download="LCA-Poster-09">ডাউনলোড করুন</a>'],
        ['১০. ফ্যাশন সোশ্যাল মিডিয়া লিকুইড পোস্ট ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960341/img/graphics-design/poster/thumbnail/poster-10.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960326/img/graphics-design/poster/poster-10.webp" class="btn btn-primary" download="LCA-Poster-10">ডাউনলোড করুন</a>'],
      ] },
      { id: 'wnlvAbBxo9e3', type: 'richtext', html: '<p class="note">\n       <b>মনে রাখবেন:</b> আরও সোশ্যাল মিডিয়া পোস্টার উদাহরণ দেখতে <a href="https://webgraphicshub.com/works/social-media-post-design/" target="_blank">Web Graphics Hub</a> ভিজিট করুন।\n      </p>' },
    ],
    toc: [{ id: 'poster-design', text: 'পোস্টার ডিজাইন', level: 2 }],
  },
  {
    id: '7b4f702a-6d40-4688-adc2-042ee11f48c5', // design/ui-exercise
    title: 'UI ডিজাইন',
    meta_description: 'বিনামূল্যে ডাউনলোডযোগ্য মোবাইল অ্যাপ ও ড্যাশবোর্ড UI ডিজাইন উদাহরণসহ অনুশীলন করুন।',
    blocks: [
      { id: 'FNxYdH5sfK7f', text: 'UI ডিজাইন', type: 'heading', level: 2, anchor: 'ui-design' },
      { id: 'Z3OM4SSHnCKB', type: 'richtext', html: '<hr>' },
      { id: '5DDNONOD332C', type: 'table', header: ['অনুশীলনী', 'ইমেজ ও কপি ডাউনলোড করুন'], rows: [
        ['০১. মিউজিক অ্যাপ ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960349/img/graphics-design/ui/thumbnail/ui-design-1.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960357/img/graphics-design/ui/ui-design-1.webp" class="btn btn-primary" download="LCA-ui-01">ডাউনলোড করুন</a>'],
        ['০২. ফিন্যান্সিয়াল অ্যাপ ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960350/img/graphics-design/ui/thumbnail/ui-design-2.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960358/img/graphics-design/ui/ui-design-2.webp" class="btn btn-primary" download="LCA-ui-02">ডাউনলোড করুন</a>'],
        ['০৩. শপিং অ্যাপ ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960351/img/graphics-design/ui/thumbnail/ui-design-3.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960359/img/graphics-design/ui/ui-design-3.webp" class="btn btn-primary" download="LCA-ui-03">ডাউনলোড করুন</a>'],
        ['০৪. ইউজার ড্যাশবোর্ড ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960352/img/graphics-design/ui/thumbnail/ui-design-4.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960361/img/graphics-design/ui/ui-design-4.webp" class="btn btn-primary" download="LCA-ui-04">ডাউনলোড করুন</a>'],
        ['০৫. ড্যাশবোর্ড ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960353/img/graphics-design/ui/thumbnail/ui-design-5.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960362/img/graphics-design/ui/ui-design-5.webp" class="btn btn-primary" download="LCA-ui-05">ডাউনলোড করুন</a>'],
        ['০৬. টাস্ক ম্যানেজমেন্ট অ্যাপ <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960354/img/graphics-design/ui/thumbnail/ui-design-6.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960363/img/graphics-design/ui/ui-design-6.webp" class="btn btn-primary" download="LCA-ui-06">ডাউনলোড করুন</a>'],
        ['০৭. শপিং অ্যাপ <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960356/img/graphics-design/ui/thumbnail/ui-design-7.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960365/img/graphics-design/ui/ui-design-7.webp" class="btn btn-primary" download="LCA-ui-07">ডাউনলোড করুন</a>'],
      ] },
      { id: 'y-PF4NxJH_9A', type: 'richtext', html: uiWireframeLinksHtml },
    ],
    toc: [{ id: 'ui-design', text: 'UI ডিজাইন', level: 2 }],
  },
  {
    id: '65fe2a5a-2726-47c2-bf9f-f9853c2f34ca', // design/visiting-card-exercise
    title: 'ভিজিটিং / বিজনেস কার্ড ডিজাইন',
    meta_description: 'বিনামূল্যে ডাউনলোডযোগ্য মডার্ন বিজনেস কার্ড ডিজাইন উদাহরণসহ অনুশীলন করুন।',
    blocks: [
      { id: '14UQhPfORZ2A', text: 'ভিজিটিং / বিজনেস কার্ড ডিজাইন', type: 'heading', level: 2, anchor: 'visiting-business-card-design' },
      { id: 'pz2Q8b0ybJIl', type: 'richtext', html: '<hr>' },
      { id: 'BERGlO8vHJJo', type: 'table', header: ['অনুশীলনী', 'ইমেজ ও কপি ডাউনলোড করুন'], rows: [
        ['০১. মডার্ন বিজনেস কার্ড <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960366/img/graphics-design/visiting-card/thumbnail/visiting-card-1.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960372/img/graphics-design/visiting-card/visiting-card-1.webp" class="btn btn-primary" download="LCA-visiting-card-01">ডাউনলোড করুন</a>'],
        ['০২. মডার্ন বিজনেস কার্ড <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960367/img/graphics-design/visiting-card/thumbnail/visiting-card-2.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960373/img/graphics-design/visiting-card/visiting-card-2.webp" class="btn btn-primary" download="LCA-visiting-card-02">ডাউনলোড করুন</a>'],
        ['০৩. মডার্ন বিজনেস কার্ড <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960368/img/graphics-design/visiting-card/thumbnail/visiting-card-3.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960375/img/graphics-design/visiting-card/visiting-card-3.webp" class="btn btn-primary" download="LCA-visiting-card-03">ডাউনলোড করুন</a>'],
        ['০৪. মডার্ন বিজনেস কার্ড <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960369/img/graphics-design/visiting-card/thumbnail/visiting-card-4.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960377/img/graphics-design/visiting-card/visiting-card-4.webp" class="btn btn-primary" download="LCA-visiting-card-04">ডাউনলোড করুন</a>'],
        ['০৫. মডার্ন বিজনেস কার্ড <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960370/img/graphics-design/visiting-card/thumbnail/visiting-card-5.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960378/img/graphics-design/visiting-card/visiting-card-5.webp" class="btn btn-primary" download="LCA-visiting-card-05">ডাউনলোড করুন</a>'],
        ['০৬. মডার্ন বিজনেস কার্ড <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960371/img/graphics-design/visiting-card/thumbnail/visiting-card-6.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960379/img/graphics-design/visiting-card/visiting-card-6.webp" class="btn btn-primary" download="LCA-visiting-card-05">ডাউনলোড করুন</a>'],
      ] },
      { id: 'zo4AyYCTbiLS', type: 'richtext', html: '<p class="note">\n       <b>মনে রাখবেন:</b> আরও ভিজিটিং / বিজনেস কার্ড উদাহরণ দেখতে <a href="https://webgraphicshub.com/works/business-card/" target="_blank">Web Graphics Hub</a> ভিজিট করুন।\n      </p>' },
    ],
    toc: [{ id: 'visiting-business-card-design', text: 'ভিজিটিং / বিজনেস কার্ড ডিজাইন', level: 2 }],
  },
  {
    id: '194c9696-008d-4e28-9dc9-3a51c0949d3d', // design/web-design
    title: 'ওয়েব ডিজাইন',
    meta_description: 'কফি শপ, সেলুন, জুতার দোকান এবং জিমের মতো বিনামূল্যে ডাউনলোডযোগ্য ওয়েবসাইট ওয়্যারফ্রেম দিয়ে অনুশীলন করুন।',
    blocks: [
      { id: '16TpDxCmD9IX', text: 'ওয়েবসাইট ডিজাইন', type: 'heading', level: 2, anchor: 'website-design' },
      { id: '4NPreuiIs-QQ', type: 'richtext', html: '<hr>' },
      { id: 'DX0lzgIR6YRp', type: 'table', header: ['অনুশীলনী', 'ইমেজ ও কপি ডাউনলোড করুন'], rows: [
        ['১. কফি শপ <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960422/img/website-design/thumbnail/wireframe-01.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960427/img/website-design/wireframe-01.webp" class="btn btn-primary" download="LCA-Wireframe-01">ডাউনলোড করুন</a>'],
        ['২. সেলুন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960423/img/website-design/thumbnail/wireframe-02.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960428/img/website-design/wireframe-02.webp" class="btn btn-primary" download="LCA-Wireframe-02">ডাউনলোড করুন</a>'],
        ['৩. জুতার দোকান <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960424/img/website-design/thumbnail/wireframe-03.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960429/img/website-design/wireframe-03.webp" class="btn btn-primary" download="LCA-Wireframe-03">ডাউনলোড করুন</a>'],
        ['৪. জিম <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960425/img/website-design/thumbnail/wireframe-04.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960431/img/website-design/wireframe-04.webp" class="btn btn-primary" download="LCA-Wireframe-04">ডাউনলোড করুন</a>'],
        ['৪. ব্লগ <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960426/img/website-design/thumbnail/wireframe-05.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960433/img/website-design/wireframe-05.webp" class="btn btn-primary" download="LCA-Wireframe-05">ডাউনলোড করুন</a>'],
      ] },
      { id: 'juS0andiOByu', type: 'richtext', html: uiWireframeLinksHtml },
    ],
    toc: [{ id: 'website-design', text: 'ওয়েবসাইট ডিজাইন', level: 2 }],
  },
]

for (const doc of docs) {
  const meta_title = `${doc.title} | Learn Computer Academy`
  const { error } = await supabase.from('doc_translations').upsert(
    { doc_id: doc.id, locale: 'bn', title: doc.title, meta_title, meta_description: doc.meta_description, blocks: doc.blocks, toc: doc.toc },
    { onConflict: 'doc_id,locale' }
  )
  if (error) { console.error(doc.id, error); process.exit(1) }
  console.log('written:', doc.id)
}
console.log('design batch2: 6/6 written')
