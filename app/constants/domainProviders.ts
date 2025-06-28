export const DOMAIN_PROVIDERS = [
  {
    tag: 'Namecheap',
    domainUrl: 'https://www.namecheap.com/domains/',
    nameEn: 'Namecheap',
    nameFa: 'نیم چیپ',
    descriptionEn:
      'Namecheap is one of the world\'s largest domain registrars, known for its competitive pricing and excellent customer support. They offer a wide range of domain extensions and additional services like SSL certificates and website builders. Namecheap\'s domain transfer service is particularly user-friendly, making it easy to switch from other providers.',
    descriptionFa:
      'نیم چیپ یکی از بزرگترین ثبت‌نام‌دهندگان دامنه در جهان است که با قیمت‌های رقابتی و پشتیبانی مشتری عالی شناخته شده است. این شرکت مجموعه‌ای از انواع دامنه‌ها و خدمات اضافی مانند سرورهای SSL و سازنده وب را ارائه می‌دهد. خدمات انتقال دامنه نیم چیپ بسیار کاربردی و راحت است و انتقال از سرویس‌دهندگان دیگر را آسان می‌کند.',
  },
  {
    tag: 'GoDaddy',
    domainUrl: 'https://www.godaddy.com/en-uk',
    nameEn: 'GoDaddy',
    nameFa: 'گو ددی',
    descriptionEn:
      'GoDaddy is one of the largest domain registrars and web hosting providers globally. Known for its comprehensive services including domains, hosting, SSL certificates, and website builders. GoDaddy offers 24/7 customer support and a user-friendly interface, making it ideal for both beginners and experienced users.',
    descriptionFa:
      'گو ددی یکی از بزرگترین سرویس‌دهندگان ثبت‌نام دامنه و میزبانی وب در سطح جهان است. این شرکت خدمات گسترده‌ای از جمله ثبت دامنه، میزبانی، سرورهای SSL و سازنده وب را ارائه می‌دهد. گو ددی پشتیبانی 24 ساعته در 7 روز هفته و رابط کاربری ساده و کاربردی دارد که برای همچنین کاربران مبتدی و حرفه‌ای مناسب است.',
  },
  {
    tag: 'IranServer',
    domainUrl: 'https://www.iranserver.com/domain-registration/',
    nameEn: 'IranServer',
    nameFa: 'ایران سرور',
    descriptionEn:
      'IranServer is a leading domain registrar in Iran, offering both Iranian (.ir) and international domain registrations. They provide reliable hosting services and dedicated support for Persian-speaking customers. IranServer is known for its fast response times and local data centers.',
    descriptionFa:
      'ایران سرور یکی از بزرگترین ثبت‌نام‌دهندگان دامنه در ایران است که خدمات ثبت دامنه‌های ایرانی (.ir) و بین‌المللی را ارائه می‌دهد. این شرکت خدمات میزبانی معتبر و پشتیبانی اختصاصی برای کاربران فارسی‌زبان را ارائه می‌دهد. ایران سرور برای سرعت پاسخگویی و داده‌سنترهای محلی شناخته شده است.',
  },
  {
    tag: 'AzarOnline',
    domainUrl: 'https://dashboard.azaronline.com/order/domain',
    nameEn: 'AzarOnline',
    nameFa: 'آذر آنلاین',
    descriptionEn:
      'AzarOnline is a trusted Iranian domain registrar and hosting provider. They specialize in .ir domain registrations and offer excellent technical support in Persian. AzarOnline is known for its competitive pricing and reliable infrastructure.',
    descriptionFa:
      'آذر آنلاین یکی از سرویس‌دهندگان معتبر ثبت‌نام دامنه و میزبانی در ایران است. این شرکت تخصص خاصی در ثبت دامنه‌های .ir دارد و پشتیبانی فنی عالی به زبان فارسی ارائه می‌دهد. آذر آنلاین برای قیمت‌های رقابتی و زیرساخت معتبر شناخته شده است.',
  },
  {
    tag: 'ParsVDS',
    domainUrl: 'https://parsvds.com/domain/',
    nameEn: 'ParsVDS',
    nameFa: 'پارس وی دی اس',
    descriptionEn:
      'ParsVDS is a reliable Iranian hosting and domain registration service provider. They offer both shared hosting and VPS services along with domain registration. ParsVDS is known for its fast and responsive technical support team.',
    descriptionFa:
      'پارس وی دی اس یکی از سرویس‌دهندگان معتبر میزبانی و ثبت‌نام دامنه در ایران است. این شرکت علاوه بر خدمات میزبانی مشترک و VPS، خدمات ثبت دامنه نیز ارائه می‌دهد. پارس وی دی اس برای پشتیبانی فنی سرعت دار و پاسخگو شناخته شده است.',
  },
] as const

export type DomainProvider = keyof typeof DOMAIN_PROVIDERS
