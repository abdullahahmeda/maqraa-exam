import { HomeIcon, UsersIcon, HelpCircleIcon, BookCheckIcon, BookOpenIcon, ConstructionIcon, BellRingIcon, FlaskConicalIcon, SettingsIcon, UserCogIcon, BugIcon } from "lucide-react";

export const menuItems = {
  SUPER_ADMIN: [
    {
      icon: HomeIcon,
      label: 'الرئيسية',
      key: '/dashboard',
    },
    {
      icon: UsersIcon,
      label: 'المستخدمون',
      key: '/dashboard/users',
    },
    {
      icon: HelpCircleIcon,
      label: 'الأسئلة',
      key: '/dashboard/questions',
      items: [
        {
          key: '/dashboard/questions',
          label: 'الأسئلة'
        },
        {
          key: '/dashboard/questions/styles',
          label: 'أنواع الأسئلة'
        }
      ]
    },
    // {
    //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    //   label: 'أنواع الأسئلة',
    //   key: '/dashboard/questions/styles',
    // },
    {
      icon: BookCheckIcon,
      label: 'الإختبارات',
      key: '/dashboard/exams',
      items: [
        {
          label: 'إختبارات النظام',
          key: '/dashboard/exams'
        },
        {
          label: 'الإختبارات التجريبية',
          key: '/dashboard/quizzes'
        }
      ]
    },
    // {
    //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
    //   label: 'الإختبارات التجريبية',
    //   key: '/dashboard/quizzes',
    // },
    {
      icon: BookOpenIcon,
      label: 'المقررات',
      key: '/dashboard/courses',
    },
    {
      icon: ConstructionIcon,
      label: 'المناهج',
      key: '/dashboard/curricula',
    },
    {
      icon: ConstructionIcon,
      label: 'الدورات',
      key: '/dashboard/cycles',
    },
    {
      icon: ConstructionIcon,
      label: 'المسارات',
      key: '/dashboard/tracks',
    },
    {
      icon: BugIcon,
      label: 'تبليغات الأخطاء',
      key: '/dashboard/error-reports',
    },
    {
      icon: BellRingIcon,
      label: 'الإشعارات',
      key: '/dashboard/notifications',
    },
    {
      icon: SettingsIcon,
      label: 'إعدادت الموقع',
      key: '/dashboard/settings',
    },
    // {
    //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-cog"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>',
    //   label: 'تعديل الحساب',
    //   key: '/dashboard/profile',
    // },
  ],
  ADMIN: [
    {
      icon: HomeIcon,
      label: 'الرئيسية',
      key: '/dashboard',
    },
    {
      icon: UsersIcon,
      label: 'المستخدمون',
      key: '/dashboard/users',
    },
    {
      icon: HelpCircleIcon,
      label: 'الأسئلة',
      key: '/dashboard/questions',
    },
    // {
    //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    //   label: 'أنواع الأسئلة',
    //   key: '/dashboard/questions/styles',
    // },
    {
      icon: BookCheckIcon,
      label: 'الإختبارات',
      key: '/dashboard/exams',
    },
    // {
    //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
    //   label: 'الإختبارات التجريبية',
    //   key: '/dashboard/quizzes',
    // },
    {
      icon: BookOpenIcon,
      label: 'المقررات',
      key: '/dashboard/courses',
    },
    {
      icon: ConstructionIcon,
      label: 'المناهج',
      key: '/dashboard/curricula',
    },
    {
      icon: ConstructionIcon,
      label: 'الدورات',
      key: '/dashboard/cycles',
    },
    {
      icon: ConstructionIcon,
      label: 'المسارات',
      key: '/dashboard/tracks',
    },
    {
      icon: BugIcon,
      label: 'تبليغات الأخطاء',
      key: '/dashboard/error-reports',
    },
    {
      icon: BellRingIcon,
      label: 'الإشعارات',
      key: '/dashboard/notifications',
    },
    {
      icon: SettingsIcon,
      label: 'إعدادت الموقع',
      key: '/dashboard/settings',
    },
    // {
    //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-cog"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>',
    //   label: 'تعديل الحساب',
    //   key: '/dashboard/profile',
    // },
  ],
  CORRECTOR: [
    {
      icon: BookCheckIcon,
      label: 'إختبارات النظام',
      key: '/dashboard/exams',
    },
    {
      icon: UserCogIcon,
      label: 'تعديل الحساب',
      key: '/dashboard/profile',
    },
  ],
  STUDENT: [
    {
      icon: BookCheckIcon,
      label: 'إختبارات النظام',
      key: '/dashboard/exams',
    },
    // {
    //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
    //   label: 'الإختبارات التجريبية',
    //   key: '/dashboard/quizzes',
    // },
    {
      icon: FlaskConicalIcon,
      label: 'بدأ اختبار تجريبي',
      key: '/start-quiz',
    },
    {
      icon: UserCogIcon,
      label: 'تعديل الحساب',
      key: '/dashboard/profile',
    },
  ],
}
