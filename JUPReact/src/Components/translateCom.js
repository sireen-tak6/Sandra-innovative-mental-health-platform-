import React from 'react';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources:
        {
            en: {
                translation:
                {
                    user:"user",
                    doctor:"doctor",
                    messagehint:"Message",
                    myAccount:"My Account",
                    chats:"Chats",
                    online:"online",
                    ofline:"ofline",
                    nochats:"No chats yet",
                    rules:"Rules",
                    firstRule:"You must share the session link with only one patient",
                    secondRule:"The session link is activated only once to maintain security",
                    thirdRule:"If the page is updated or refreshed,the session link will be canceled",
                    completethirdRule:"and you must create another session",
                    readRules:"Read Terms",
                    talktosandra:"Talk To Sandra",
                    doctors:"Doctors",
                    Articals:"Articals",
                    Settings:"Settings",
                    home:"Home",
                    verfiy:"Verfiy",
                    signupdoctor:"Signup Doctor",
                    login:"Login",
                    logout:"Logout",
                    email:"Email",
                    more:"More Information",
                    chattingwith:"Chatting With",
                    posts:"Posts",
                    savePost:"Saved Post",
                    postManage:"Post Manage"


                }
            },
            ar: {
                translation:
                {
                    user:"مستخدم",
                    doctor:"دكتور",
                    messagehint:"الرساله",
                    myAccount:"حسابي",
                    chats:"المحادثات",
                    online:"نشط الان",
                    ofline:"غير_نشط",
                    nochats: " لايوجد رسائل بعد" ,
                    rules:"شروط",
                    firstRule:"يجب عليك مشاركة رابط الجلسه مع مريض واحد فقط",
                    secondRule:"رابط الجلسه يتم تفعيله مره واحده فقط لضمان الخصوصيه",
                    thirdRule:"اذا تم تحديث هذه الصفحه او الخروج منها سيتم الغاء الجلسه التي تم انشاءها",
                    completethirdRule:"ويجب عليك انشاء جلسه اخرى",
                    readRules:"قرأت الشروط",
                    talktosandra:"تحدث الى ساندرا",
                    doctors:"الاطباء",
                    Articals:"المقالات",
                    Settings:"الاعدادات",
                    home:"الرئيسية",
                    verfiy:"توثيق الحساب",
                    signupdoctor:"تسجيل حساب طبيب",
                    login:"تسجيل الدخول",
                    logout:"تسجيل الخروج",
                    email:"البريد الالكتروني",
                    more:"المزيد",
                    chattingwith:"تحدث الى",
                    posts:"منشورات",
                    savePost:"منشورات اعجبتني",
                    postManage:"ادارة المنشورات",


                }
            }
        },

        fallbackLng:"en" ,
        detection:
        {
            order:[
            "cookie",
            "htmlTag",
            "queryString" ,
            "localStorage",
            "sessionStorage",
            "navigator",
            "path",
            "subdomain",
            ],
            cache:["cookie"],
        },
    })
