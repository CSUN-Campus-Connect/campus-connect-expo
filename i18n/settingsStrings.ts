export type AppLocale =
  | 'en'
  | 'es'
  | 'fr'
  | 'ar'
  | 'hy'
  | 'hi'
  | 'ko'
  | 'zh'
  | 'ja';

/** Display order in the language picker (native names where conventional). */
export const SUPPORTED_LOCALES: { code: AppLocale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'hy', label: 'Հայերեն' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '简体中文' },
  { code: 'ja', label: '日本語' },
];

export type SettingsStringKey =
  | 'settingsTitle'
  | 'intro'
  | 'sectionYourAccount'
  | 'sectionPrivacySecurity'
  | 'sectionPreferences'
  | 'sectionMessaging'
  | 'sectionSocial'
  | 'sectionMarketplace'
  | 'sectionClubs'
  | 'sectionEvents'
  | 'sectionAcademics'
  | 'sectionSupport'
  | 'rowAccount'
  | 'rowPrivacy'
  | 'rowSecurity'
  | 'rowNotifications'
  | 'rowAppearance'
  | 'rowWebsiteLanguage'
  | 'rowMessagingSettings'
  | 'rowSocialSettings'
  | 'rowMarketplaceSettings'
  | 'rowClubSettings'
  | 'rowEventSettings'
  | 'rowAcademicSettings'
  | 'rowHelpSupport'
  | 'pickerTitle'
  | 'pickerMessage'
  | 'cancel'
  | 'rowCustomizeSidebar'
  | 'customizeBottomBarTitle'
  | 'customizeBottomBarIntro'
  | 'bottomBarSlot1'
  | 'bottomBarSlot2'
  | 'bottomBarNone'
  | 'bottomBarHome'
  | 'bottomBarMessages'
  | 'bottomBarMore'
  | 'bottomBarSocial'
  | 'bottomBarEvents'
  | 'bottomBarClubs'
  | 'bottomBarAcademics'
  | 'bottomBarSrc'
  | 'bottomBarDuplicateError'
  | 'customizeBottomBarDone';

const en: Record<SettingsStringKey, string> = {
  settingsTitle: 'Settings',
  intro: 'Manage your account, privacy, preferences, and more.',
  sectionYourAccount: 'Your account',
  sectionPrivacySecurity: 'Privacy & Security',
  sectionPreferences: 'Preferences',
  sectionMessaging: 'Messaging',
  sectionSocial: 'Social',
  sectionMarketplace: 'Marketplace',
  sectionClubs: 'Clubs',
  sectionEvents: 'Events',
  sectionAcademics: 'Academics',
  sectionSupport: 'Support',
  rowAccount: 'Account',
  rowPrivacy: 'Privacy',
  rowSecurity: 'Security',
  rowNotifications: 'Notifications',
  rowAppearance: 'Appearance',
  rowWebsiteLanguage: 'Website language',
  rowMessagingSettings: 'Messaging settings',
  rowSocialSettings: 'Social settings',
  rowMarketplaceSettings: 'Marketplace settings',
  rowClubSettings: 'Club settings',
  rowEventSettings: 'Event settings',
  rowAcademicSettings: 'Academic settings',
  rowHelpSupport: 'Help & Support',
  pickerTitle: 'Website language',
  pickerMessage: 'Choose a language for the app.',
  cancel: 'Cancel',
  rowCustomizeSidebar: 'Customize your sidebar',
  customizeBottomBarTitle: 'Bottom navigation',
  customizeBottomBarIntro:
    'Choose up to two shortcuts between Messages and More. Home, Messages, and More always stay in the bar (up to five items total).',
  bottomBarSlot1: 'Shortcut 1 (optional)',
  bottomBarSlot2: 'Shortcut 2 (optional)',
  bottomBarNone: 'None',
  bottomBarHome: 'Home',
  bottomBarMessages: 'Messages',
  bottomBarMore: 'More',
  bottomBarSocial: 'Social',
  bottomBarEvents: 'Events',
  bottomBarClubs: 'Clubs',
  bottomBarAcademics: 'Academics',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: 'That shortcut is already in the other slot.',
  customizeBottomBarDone: 'Done',
};

const es: Record<SettingsStringKey, string> = {
  settingsTitle: 'Ajustes',
  intro: 'Gestiona tu cuenta, privacidad, preferencias y más.',
  sectionYourAccount: 'Tu cuenta',
  sectionPrivacySecurity: 'Privacidad y seguridad',
  sectionPreferences: 'Preferencias',
  sectionMessaging: 'Mensajes',
  sectionSocial: 'Social',
  sectionMarketplace: 'Mercado',
  sectionClubs: 'Clubes',
  sectionEvents: 'Eventos',
  sectionAcademics: 'Académico',
  sectionSupport: 'Ayuda',
  rowAccount: 'Cuenta',
  rowPrivacy: 'Privacidad',
  rowSecurity: 'Seguridad',
  rowNotifications: 'Notificaciones',
  rowAppearance: 'Apariencia',
  rowWebsiteLanguage: 'Idioma del sitio',
  rowMessagingSettings: 'Ajustes de mensajes',
  rowSocialSettings: 'Ajustes sociales',
  rowMarketplaceSettings: 'Ajustes del mercado',
  rowClubSettings: 'Ajustes de clubes',
  rowEventSettings: 'Ajustes de eventos',
  rowAcademicSettings: 'Ajustes académicos',
  rowHelpSupport: 'Ayuda y soporte',
  pickerTitle: 'Idioma del sitio',
  pickerMessage: 'Elige un idioma para la aplicación.',
  cancel: 'Cancelar',
  rowCustomizeSidebar: 'Personalizar la barra lateral',
  customizeBottomBarTitle: 'Navegación inferior',
  customizeBottomBarIntro:
    'Elige hasta dos accesos directos entre Mensajes y Más. Inicio, Mensajes y Más siempre permanecen (hasta cinco en total).',
  bottomBarSlot1: 'Acceso directo 1 (opcional)',
  bottomBarSlot2: 'Acceso directo 2 (opcional)',
  bottomBarNone: 'Ninguno',
  bottomBarHome: 'Inicio',
  bottomBarMessages: 'Mensajes',
  bottomBarMore: 'Más',
  bottomBarSocial: 'Social',
  bottomBarEvents: 'Eventos',
  bottomBarClubs: 'Clubes',
  bottomBarAcademics: 'Académico',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: 'Ese acceso ya está en el otro espacio.',
  customizeBottomBarDone: 'Listo',
};

const fr: Record<SettingsStringKey, string> = {
  settingsTitle: 'Paramètres',
  intro: 'Gérez votre compte, confidentialité, préférences, etc.',
  sectionYourAccount: 'Votre compte',
  sectionPrivacySecurity: 'Confidentialité et sécurité',
  sectionPreferences: 'Préférences',
  sectionMessaging: 'Messagerie',
  sectionSocial: 'Social',
  sectionMarketplace: 'Marketplace',
  sectionClubs: 'Clubs',
  sectionEvents: 'Événements',
  sectionAcademics: 'Scolarité',
  sectionSupport: 'Assistance',
  rowAccount: 'Compte',
  rowPrivacy: 'Confidentialité',
  rowSecurity: 'Sécurité',
  rowNotifications: 'Notifications',
  rowAppearance: 'Apparence',
  rowWebsiteLanguage: 'Langue du site',
  rowMessagingSettings: 'Paramètres de messagerie',
  rowSocialSettings: 'Paramètres sociaux',
  rowMarketplaceSettings: 'Paramètres du marketplace',
  rowClubSettings: 'Paramètres des clubs',
  rowEventSettings: 'Paramètres des événements',
  rowAcademicSettings: 'Paramètres scolaires',
  rowHelpSupport: 'Aide et support',
  pickerTitle: 'Langue du site',
  pickerMessage: 'Choisissez une langue pour l’application.',
  cancel: 'Annuler',
  rowCustomizeSidebar: 'Personnaliser la barre latérale',
  customizeBottomBarTitle: 'Navigation inférieure',
  customizeBottomBarIntro:
    'Choisissez jusqu’à deux raccourcis entre Messages et Plus. Accueil, Messages et Plus restent toujours (cinq éléments au total).',
  bottomBarSlot1: 'Raccourci 1 (facultatif)',
  bottomBarSlot2: 'Raccourci 2 (facultatif)',
  bottomBarNone: 'Aucun',
  bottomBarHome: 'Accueil',
  bottomBarMessages: 'Messages',
  bottomBarMore: 'Plus',
  bottomBarSocial: 'Social',
  bottomBarEvents: 'Événements',
  bottomBarClubs: 'Clubs',
  bottomBarAcademics: 'Scolarité',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: 'Ce raccourci est déjà dans l’autre emplacement.',
  customizeBottomBarDone: 'OK',
};

const ar: Record<SettingsStringKey, string> = {
  settingsTitle: 'الإعدادات',
  intro: 'أدر حسابك، الخصوصية، التفضيلات، والمزيد.',
  sectionYourAccount: 'حسابك',
  sectionPrivacySecurity: 'الخصوصية والأمان',
  sectionPreferences: 'التفضيلات',
  sectionMessaging: 'الرسائل',
  sectionSocial: 'اجتماعي',
  sectionMarketplace: 'السوق',
  sectionClubs: 'النوادي',
  sectionEvents: 'الفعاليات',
  sectionAcademics: 'أكاديمي',
  sectionSupport: 'الدعم',
  rowAccount: 'الحساب',
  rowPrivacy: 'الخصوصية',
  rowSecurity: 'الأمان',
  rowNotifications: 'الإشعارات',
  rowAppearance: 'المظهر',
  rowWebsiteLanguage: 'لغة الموقع',
  rowMessagingSettings: 'إعدادات الرسائل',
  rowSocialSettings: 'الإعدادات الاجتماعية',
  rowMarketplaceSettings: 'إعدادات السوق',
  rowClubSettings: 'إعدادات النوادي',
  rowEventSettings: 'إعدادات الفعاليات',
  rowAcademicSettings: 'الإعدادات الأكاديمية',
  rowHelpSupport: 'المساعدة والدعم',
  pickerTitle: 'لغة الموقع',
  pickerMessage: 'اختر لغة التطبيق.',
  cancel: 'إلغاء',
  rowCustomizeSidebar: 'تخصيص الشريط الجانبي',
  customizeBottomBarTitle: 'شريط التنقل السفلي',
  customizeBottomBarIntro:
    'اختر حتى اختصارين بين الرسائل والمزيد. الرئيسية والرسائل والمزيد تبقى دائمًا (حتى خمسة عناصر).',
  bottomBarSlot1: 'اختصار 1 (اختياري)',
  bottomBarSlot2: 'اختصار 2 (اختياري)',
  bottomBarNone: 'بدون',
  bottomBarHome: 'الرئيسية',
  bottomBarMessages: 'الرسائل',
  bottomBarMore: 'المزيد',
  bottomBarSocial: 'اجتماعي',
  bottomBarEvents: 'الفعاليات',
  bottomBarClubs: 'النوادي',
  bottomBarAcademics: 'أكاديمي',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: 'هذا الاختصار موجود بالفعل في المكان الآخر.',
  customizeBottomBarDone: 'تم',
};

const hy: Record<SettingsStringKey, string> = {
  settingsTitle: 'Կարգավորումներ',
  intro: 'Կառավարեք ձեր հաշիվը, գաղտնիությունը, նախընտրությունները և այլն։',
  sectionYourAccount: 'Ձեր հաշիվը',
  sectionPrivacySecurity: 'Գաղտնիություն և անվտանգություն',
  sectionPreferences: 'Նախընտրություններ',
  sectionMessaging: 'Հաղորդագրություններ',
  sectionSocial: 'Սոցիալ',
  sectionMarketplace: 'Առևտրային հարթակ',
  sectionClubs: 'Ակումբներ',
  sectionEvents: 'Միջոցառումներ',
  sectionAcademics: 'Կրթություն',
  sectionSupport: 'Աջակցություն',
  rowAccount: 'Հաշիվ',
  rowPrivacy: 'Գաղտնիություն',
  rowSecurity: 'Անվտանգություն',
  rowNotifications: 'Ծանուցումներ',
  rowAppearance: 'Տեսք',
  rowWebsiteLanguage: 'Կայքի լեզու',
  rowMessagingSettings: 'Հաղորդագրությունների կարգավորումներ',
  rowSocialSettings: 'Սոցիալ կարգավորումներ',
  rowMarketplaceSettings: 'Առևտրային կարգավորումներ',
  rowClubSettings: 'Ակումբների կարգավորումներ',
  rowEventSettings: 'Միջոցառումների կարգավորումներ',
  rowAcademicSettings: 'Կրթական կարգավորումներ',
  rowHelpSupport: 'Օգնություն և աջակցություն',
  pickerTitle: 'Կայքի լեզու',
  pickerMessage: 'Ընտրեք հավելվածի լեզուն։',
  cancel: 'Չեղարկել',
  rowCustomizeSidebar: 'Կարգավորել կողային վահանակը',
  customizeBottomBarTitle: 'Ստորին նավարկում',
  customizeBottomBarIntro:
    'Ընտրեք մինչև երկու դյուրանցում Հաղորդագրությունների և Ավելիի միջև։ Տուն, Հաղորդագրություններ և Ավելին միշտ մնում են (մինչև հինգ)։',
  bottomBarSlot1: 'Դյուրանցում 1 (ընտրովի)',
  bottomBarSlot2: 'Դյուրանցում 2 (ընտրովի)',
  bottomBarNone: 'Ոչ մեկը',
  bottomBarHome: 'Տուն',
  bottomBarMessages: 'Հաղորդագրություններ',
  bottomBarMore: 'Ավելին',
  bottomBarSocial: 'Սոցիալ',
  bottomBarEvents: 'Միջոցառումներ',
  bottomBarClubs: 'Ակումբներ',
  bottomBarAcademics: 'Կրթություն',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: 'Այդ դյուրանցումն արդեն մյուս դիրքում է։',
  customizeBottomBarDone: 'Պատրաստ է',
};

const hi: Record<SettingsStringKey, string> = {
  settingsTitle: 'सेटिंग्स',
  intro: 'अपना खाता, गोपनीयता, वरीयताएँ और बाकी प्राथमिकताएँ प्रबंधित करें।',
  sectionYourAccount: 'आपका खाता',
  sectionPrivacySecurity: 'गोपनीयता और सुरक्षा',
  sectionPreferences: 'वरीयताएँ',
  sectionMessaging: 'संदेश',
  sectionSocial: 'सामाजिक',
  sectionMarketplace: 'मार्केटप्लेस',
  sectionClubs: 'क्लब',
  sectionEvents: 'आयोजन',
  sectionAcademics: 'शैक्षणिक',
  sectionSupport: 'सहायता',
  rowAccount: 'खाता',
  rowPrivacy: 'गोपनीयता',
  rowSecurity: 'सुरक्षा',
  rowNotifications: 'सूचनाएँ',
  rowAppearance: 'दिखावट',
  rowWebsiteLanguage: 'वेबसाइट की भाषा',
  rowMessagingSettings: 'संदेश सेटिंग्स',
  rowSocialSettings: 'सामाजिक सेटिंग्स',
  rowMarketplaceSettings: 'मार्केटप्लेस सेटिंग्स',
  rowClubSettings: 'क्लब सेटिंग्स',
  rowEventSettings: 'आयोजन सेटिंग्स',
  rowAcademicSettings: 'शैक्षणिक सेटिंग्स',
  rowHelpSupport: 'सहायता और समर्थन',
  pickerTitle: 'वेबसाइट की भाषा',
  pickerMessage: 'ऐप के लिए भाषा चुनें।',
  cancel: 'रद्द करें',
  rowCustomizeSidebar: 'साइडबार अनुकूलित करें',
  customizeBottomBarTitle: 'निचला नेविगेशन',
  customizeBottomBarIntro:
    'संदेशों और अधिक के बीच दो शॉर्टकट चुनें। होम, संदेश और अधिक हमेशा रहते हैं (कुल पाँच तक)।',
  bottomBarSlot1: 'शॉर्टकट 1 (वैकल्पिक)',
  bottomBarSlot2: 'शॉर्टकट 2 (वैकल्पिक)',
  bottomBarNone: 'कोई नहीं',
  bottomBarHome: 'होम',
  bottomBarMessages: 'संदेश',
  bottomBarMore: 'अधिक',
  bottomBarSocial: 'सामाजिक',
  bottomBarEvents: 'आयोजन',
  bottomBarClubs: 'क्लब',
  bottomBarAcademics: 'शैक्षणिक',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: 'वह शॉर्टकट पहले से दूसरे स्लॉट में है।',
  customizeBottomBarDone: 'हो गया',
};

const ko: Record<SettingsStringKey, string> = {
  settingsTitle: '설정',
  intro: '계정, 개인정보 보호, 환경설정 등을 관리하세요.',
  sectionYourAccount: '내 계정',
  sectionPrivacySecurity: '개인정보 보호 및 보안',
  sectionPreferences: '환경설정',
  sectionMessaging: '메시지',
  sectionSocial: '소셜',
  sectionMarketplace: '마켓플레이스',
  sectionClubs: '동아리',
  sectionEvents: '이벤트',
  sectionAcademics: '학업',
  sectionSupport: '지원',
  rowAccount: '계정',
  rowPrivacy: '개인정보',
  rowSecurity: '보안',
  rowNotifications: '알림',
  rowAppearance: '모양',
  rowWebsiteLanguage: '웹사이트 언어',
  rowMessagingSettings: '메시지 설정',
  rowSocialSettings: '소셜 설정',
  rowMarketplaceSettings: '마켓플레이스 설정',
  rowClubSettings: '동아리 설정',
  rowEventSettings: '이벤트 설정',
  rowAcademicSettings: '학업 설정',
  rowHelpSupport: '도움말 및 지원',
  pickerTitle: '웹사이트 언어',
  pickerMessage: '앱에서 사용할 언어를 선택하세요.',
  cancel: '취소',
  rowCustomizeSidebar: '사이드바 사용자 지정',
  customizeBottomBarTitle: '하단 탐색',
  customizeBottomBarIntro:
    '메시지와 더보기 사이에 바로가기를 최대 두 개 선택하세요. 홈, 메시지, 더보기는 항상 표시됩니다(최대 다섯 개).',
  bottomBarSlot1: '바로가기 1(선택)',
  bottomBarSlot2: '바로가기 2(선택)',
  bottomBarNone: '없음',
  bottomBarHome: '홈',
  bottomBarMessages: '메시지',
  bottomBarMore: '더보기',
  bottomBarSocial: '소셜',
  bottomBarEvents: '이벤트',
  bottomBarClubs: '동아리',
  bottomBarAcademics: '학업',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: '이미 다른 칸에 있는 바로가기입니다.',
  customizeBottomBarDone: '완료',
};

const zh: Record<SettingsStringKey, string> = {
  settingsTitle: '设置',
  intro: '管理账户、隐私、偏好设置等。',
  sectionYourAccount: '你的账户',
  sectionPrivacySecurity: '隐私与安全',
  sectionPreferences: '偏好设置',
  sectionMessaging: '消息',
  sectionSocial: '社交',
  sectionMarketplace: '市场',
  sectionClubs: '社团',
  sectionEvents: '活动',
  sectionAcademics: '学业',
  sectionSupport: '支持',
  rowAccount: '账户',
  rowPrivacy: '隐私',
  rowSecurity: '安全',
  rowNotifications: '通知',
  rowAppearance: '外观',
  rowWebsiteLanguage: '网站语言',
  rowMessagingSettings: '消息设置',
  rowSocialSettings: '社交设置',
  rowMarketplaceSettings: '市场设置',
  rowClubSettings: '社团设置',
  rowEventSettings: '活动设置',
  rowAcademicSettings: '学业设置',
  rowHelpSupport: '帮助与支持',
  pickerTitle: '网站语言',
  pickerMessage: '选择应用显示语言。',
  cancel: '取消',
  rowCustomizeSidebar: '自定义侧边栏',
  customizeBottomBarTitle: '底部导航',
  customizeBottomBarIntro:
    '在“消息”和“更多”之间最多添加两个快捷方式。首页、消息和更多始终保留（最多五个）。',
  bottomBarSlot1: '快捷方式 1（可选）',
  bottomBarSlot2: '快捷方式 2（可选）',
  bottomBarNone: '无',
  bottomBarHome: '首页',
  bottomBarMessages: '消息',
  bottomBarMore: '更多',
  bottomBarSocial: '社交',
  bottomBarEvents: '活动',
  bottomBarClubs: '社团',
  bottomBarAcademics: '学业',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: '该快捷方式已在另一栏中。',
  customizeBottomBarDone: '完成',
};

const ja: Record<SettingsStringKey, string> = {
  settingsTitle: '設定',
  intro: 'アカウント、プライバシー、環境設定などを管理します。',
  sectionYourAccount: 'あなたのアカウント',
  sectionPrivacySecurity: 'プライバシーとセキュリティ',
  sectionPreferences: '環境設定',
  sectionMessaging: 'メッセージ',
  sectionSocial: 'ソーシャル',
  sectionMarketplace: 'マーケットプレイス',
  sectionClubs: 'クラブ',
  sectionEvents: 'イベント',
  sectionAcademics: '学業',
  sectionSupport: 'サポート',
  rowAccount: 'アカウント',
  rowPrivacy: 'プライバシー',
  rowSecurity: 'セキュリティ',
  rowNotifications: '通知',
  rowAppearance: '外観',
  rowWebsiteLanguage: 'サイトの言語',
  rowMessagingSettings: 'メッセージ設定',
  rowSocialSettings: 'ソーシャル設定',
  rowMarketplaceSettings: 'マーケットプレイス設定',
  rowClubSettings: 'クラブ設定',
  rowEventSettings: 'イベント設定',
  rowAcademicSettings: '学業設定',
  rowHelpSupport: 'ヘルプとサポート',
  pickerTitle: 'サイトの言語',
  pickerMessage: 'アプリの表示言語を選んでください。',
  cancel: 'キャンセル',
  rowCustomizeSidebar: 'サイドバーをカスタマイズ',
  customizeBottomBarTitle: '下部ナビゲーション',
  customizeBottomBarIntro:
    'メッセージとその他の間に最大2つのショートカットを選びます。ホーム、メッセージ、その他は常に表示されます（合計5つまで）。',
  bottomBarSlot1: 'ショートカット1（任意）',
  bottomBarSlot2: 'ショートカット2（任意）',
  bottomBarNone: 'なし',
  bottomBarHome: 'ホーム',
  bottomBarMessages: 'メッセージ',
  bottomBarMore: 'その他',
  bottomBarSocial: 'ソーシャル',
  bottomBarEvents: 'イベント',
  bottomBarClubs: 'クラブ',
  bottomBarAcademics: '学業',
  bottomBarSrc: 'SRC',
  bottomBarDuplicateError: 'そのショートカットはすでにもう一方にあります。',
  customizeBottomBarDone: '完了',
};

export const settingsStrings: Record<AppLocale, Record<SettingsStringKey, string>> = {
  en,
  es,
  fr,
  ar,
  hy,
  hi,
  ko,
  zh,
  ja,
};

export function getSettingsString(locale: AppLocale, key: SettingsStringKey): string {
  return settingsStrings[locale][key] ?? settingsStrings.en[key];
}
