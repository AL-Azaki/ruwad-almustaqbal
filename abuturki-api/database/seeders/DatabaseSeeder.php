<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\Project;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::factory()->create([
            'name' => 'مدير النظام',
            'email' => 'admin@abuturki.com',
            'password' => bcrypt('password'),
        ]);

        // Services
        $services = [
            [
                'title' => 'تركيب كاميرات المراقبة',
                'description' => 'توريد وتركيب كاميرات المراقبة الأمنية (CCTV) للشركات والمنازل بأعلى جودة مع إمكانية المراقبة عن بُعد عبر الجوال.',
                'icon' => 'Video',
                'starting_price' => 500.00,
                'status' => 'active'
            ],
            [
                'title' => 'الأنظمة الذكية (Smart Home)',
                'description' => 'تحويل منزلك إلى منزل ذكي للتحكم بالإضاءة، التكييف، والأبواب عن طريق الجوال والأوامر الصوتية.',
                'icon' => 'Cpu',
                'starting_price' => 1500.00,
                'status' => 'active'
            ],
            [
                'title' => 'الشبكات والسنترالات',
                'description' => 'تأسيس شبكات سلكية ولاسلكية متطورة، وتركيب أنظمة السنترال للمكاتب والشركات.',
                'icon' => 'Wifi',
                'starting_price' => 800.00,
                'status' => 'active'
            ],
            [
                'title' => 'تأسيس الكهرباء الشامل',
                'description' => 'تمديد وتأسيس الأعمال الكهربائية للفلل والمباني التجارية مع ضمان أعلى معايير الجودة والسلامة.',
                'icon' => 'Zap',
                'starting_price' => 2500.00,
                'status' => 'active'
            ],
            [
                'title' => 'أنظمة البصمة والدخول',
                'description' => 'أجهزة الحضور والانصراف، والأقفال الذكية للفنادق والمكاتب.',
                'icon' => 'Fingerprint',
                'starting_price' => 600.00,
                'status' => 'active'
            ]
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        // Projects
        $projects = [
            [
                'title' => 'تجهيز نظام أمني لشركة تجارية',
                'category' => 'كاميرات مراقبة',
                'description' => 'تم توريد وتركيب 16 كاميرا مراقبة بدقة 4K مع نظام تسجيل NVR يغطي كافة أرجاء المعرض الخارجي والمكاتب الداخلية.',
                'image_path' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'title' => 'مشروع فيلا ذكية - حي النرجس',
                'category' => 'منازل ذكية',
                'description' => 'تحويل كامل أنظمة الإضاءة والتكييف والستائر لتعمل عبر نظام ذكي موحد يمكن التحكم به عبر تطبيق في الهاتف الذكي.',
                'image_path' => 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'title' => 'تأسيس كابينة سيرفرات',
                'category' => 'شبكات',
                'description' => 'بناء وتأسيس كابينة سيرفرات متكاملة (Data Center) لشركة هندسية مع ترتيب الكابلات وتركيب الـ Switches.',
                'image_path' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'title' => 'تأسيس كهرباء مبنى سكني',
                'category' => 'كهرباء',
                'description' => 'أعمال التمديدات الكهربائية الرئيسية وتوزيع الأحمال لمبنى سكني مكون من 3 طوابق باستخدام مواد عالية الجودة.',
                'image_path' => 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'
            ]
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }

        // Orders
        $orders = [
            [
                'customer_name' => 'أحمد العتيبي',
                'phone' => '0551234567',
                'location' => 'حي الملقا - الرياض',
                'service_type' => 'تركيب كاميرات المراقبة',
                'description' => 'أحتاج تركيب 4 كاميرات خارجية للفيلا مع إمكانية الربط على الجوال.',
                'status' => 'new',
            ],
            [
                'customer_name' => 'شركة أبعاد التطور',
                'phone' => '0509876543',
                'location' => 'شارع العليا',
                'service_type' => 'الشبكات والسنترالات',
                'description' => 'نحتاج تأسيس سنترال للمكتب الجديد، حوالي 10 تحويلات.',
                'status' => 'pending',
            ],
            [
                'customer_name' => 'خالد الدوسري',
                'phone' => '0533334444',
                'location' => 'حي الياسمين',
                'service_type' => 'الأنظمة الذكية',
                'description' => 'عندي فيلا عظم وأبي أسس لها نظام سمارت هوم كامل.',
                'status' => 'in_progress',
            ],
            [
                'customer_name' => 'فهد القحطاني',
                'phone' => '0566667777',
                'location' => 'حي الصحافة',
                'service_type' => 'تأسيس الكهرباء الشامل',
                'description' => 'مشكلة في طبلون الكهرباء الرئيسي ويفصل باستمرار.',
                'status' => 'completed',
            ]
        ];

        foreach ($orders as $order) {
            Order::create($order);
        }

        // Settings
        $settings = [
            'siteName' => 'رواد المستقبل',
            'siteDescription' => 'نحن نوصل إلى كل شبر أو حي داخل جدة في أي مكان، فقط أرسل الموقع.',
            'contactEmail' => 'abdoalazaki190@gmail.com',
            'contactPhone' => '+966506396004',
            'whatsappNumber' => '966506396004',
            'facebook' => 'https://facebook.com/Jeddahtechnician',
            'twitter' => '',
            'instagram' => 'https://instagram.com/jeddah_technician',
            'snapchat' => 'https://www.snapchat.com/add/blzky2021',
            'tiktok' => '',
            'theme' => 'light',
            'language' => 'ar'
        ];

        foreach ($settings as $key => $value) {
            Setting::create([
                'key' => $key,
                'value' => $value
            ]);
        }

        // Dummy Projects
        $dummyProjects = [
            [
                'title' => 'تمديد شبكة إنترنت لشركة كبرى',
                'category' => 'شبكات',
                'description' => 'مشروع متكامل لتمديد وتنظيم شبكة الإنترنت والسنترال.',
                'image_path' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'title' => 'تأسيس كهرباء لفيلا سكنية',
                'category' => 'كهرباء',
                'description' => 'أعمال الكهرباء المتكاملة من التأسيس إلى التشطيب.',
                'image_path' => 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'title' => 'تركيب كاميرات مراقبة',
                'category' => 'أنظمة مراقبة',
                'description' => 'نظام مراقبة متكامل مع أجهزة NVR لمجمع تجاري.',
                'image_path' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'title' => 'تصميم وإنارة ديكور مخفية',
                'category' => 'ديكور وإنارة',
                'description' => 'تنفيذ إنارة ليد مخفية وديكورات خشبية عصرية.',
                'image_path' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
            ],
            [
                'title' => 'صيانة وإصلاح سباكة',
                'category' => 'سباكة',
                'description' => 'معالجة تسريبات المياه وتأسيس السباكة الحديثة.',
                'image_path' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
            ],
        ];

        foreach ($dummyProjects as $project) {
            \App\Models\Project::create($project);
        }
    }
}
