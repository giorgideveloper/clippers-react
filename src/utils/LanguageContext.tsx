import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export type LanguageCode = "EN" | "KA" | "RU";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { code: "KA", name: "ქართული", flag: "🇬🇪" },
  { code: "EN", name: "English", flag: "🇬🇧" },
  { code: "RU", name: "Русский", flag: "🇷🇺" }
] as const;

// Deep dictionary for premium localization
const translations: Record<LanguageCode, Record<string, string>> = {
  EN: {
    // Brand & Header
    "brand_name": "SOVEREIGN",
    "brand_suffix": "Club",
    "exquisite_grooming": "Exquisite Male Grooming",
    "access_owner": "Access Owner Panel",
    "owner_console": "Console center",
    "owner_admin": "Admin",
    "shop_address": "72 Regent Imperial Blvd, New York • Open Daily 09:00 AM - 08:00 PM",
    "shop_address_short": "72 Regent Imperial Blvd, New York",
    "shop_phone": "+1 (212) 555-0104",

    // Navigation buttons
    "btn_back": "Back",
    "btn_continue": "Continue Progress",
    "btn_continue_short": "Continue",
    "btn_confirm_reservation": "Confirm Reservation",
    "btn_client_chair": "Book Client Chair",
    "btn_switch_booking": "Switch to Booking",
    "btn_manage": "Click to Manage",
    "btn_details_arrow": "Details ➔",
    "btn_reschedule": "Change Hour",
    "btn_cancel_panel": "Close Panel",
    "btn_confirm_chair": "Confirm Chair",
    "btn_complete_seat": "Complete Seat",
    "btn_cancel_booking": "Cancel Booking",
    "btn_dismiss": "Cancel",
    "btn_confirm_slot": "Confirm New Slot",
    "btn_add_stylist": "Add New Stylist",
    "btn_enroll_craftsman": "Enroll Craftsman",

    // Stepper Labels
    "step_0": "Choose Service",
    "step_1": "Choose Barber",
    "step_2": "Date & Time",
    "step_3": "Checkout Review",
    "step_4": "Complete",

    // Footer Trust Links
    "trust_flexible": "Flexible dates",
    "trust_flexible_desc": "Reschedule up to 1 hr before",
    "trust_certified": "Certified Craftsmanship",
    "trust_certified_desc": "Verified luxury master barbers",
    "trust_swift": "Swift Execution",
    "trust_swift_desc": "Punctual appointment starts",

    // Mobile Booking summary
    "treatment_details_title": "Your Treatment Details",
    "exp_style": "Experience Style",
    "master_barber": "Master Barber",
    "arrival_time": "Arrival Time",
    "choose_service_first": "Choose Service",

    // Booking Step 0: Service Selection
    "services_title_main": "Select Haircut &",
    "services_title_accent": "Treatment Packages",
    "services_subtitle": "CHOOSE FROM OUR EXQUISITE SUITE OF CLASSIC CUTS, MODERN FADES, AND SHAVES",
    "cat_all": "All Offerings",
    "cat_hair": "Haircuts",
    "cat_beard": "Beard sculpting",
    "cat_shave": "Imperial Shaves",
    "cat_combo": "Exclusive Combos",

    // Booking Step 1: Barber Selection
    "barbers_title_main": "Assign Barber",
    "barbers_title_accent": "Master Stylist",
    "barbers_subtitle": "SELECT THE TRUSTED CRAFTSMAN TO ALIGN YOUR PERSONAL AESTHETIC SIGNATURE",
    "reviews_count": "reviews",

    // Booking Step 2: DateTimePicker
    "date_title_main": "Reserve Arrival",
    "date_title_accent": "Slot & Hour",
    "date_subtitle": "SELECT YOUR FAVORED CALENDAR DATE AND TIME SLOT FOR STANDING TREATMENT",
    "section_morning": "Morning Sessions",
    "section_afternoon": "Afternoon Indulgences",
    "section_evening": "Evening Splendors",
    "slot_conflicts": "Temporarily filled or fully committed",
    "no_dates": "Select a date above to load premium availability slots",

    // Booking Step 3: Checkout Info review
    "checkout_title_main": "Confirm Velvet",
    "checkout_title_accent": "Ticket Details",
    "checkout_subtitle": "RE-VERIFY YOUR CUSTOM SELECTION & ENTER CONTACT DETAILS FOR CONFIRMATION",
    "cust_name": "Full Name",
    "cust_phone": "Contact Phone",
    "cust_email": "Email Address",
    "cust_notes": "Special Directions or Requests",
    "placeholder_notes": "e.g. Sharp taper fade, hot tea preferred, classic scissor cut blend...",
    "error_name": "Please enter your full name.",
    "error_email": "Please enter a valid email address.",
    "error_phone": "Please enter a valid contact phone number.",

    // Success Screen
    "success_badge": "Sovereign VIP Secured",
    "success_title_main": "Reservation",
    "success_title_accent": "Confirmed",
    "success_desc": "Your signature grooming chair has been reserved. A confirmation ticket has been synchronized with our digital lounge registrar.",
    "ticket_header": "Official Reservation Ticket",
    "ticket_time_label": "Arrival Time",
    "ticket_service_label": "Sovereign Treatment",
    "ticket_barber_label": "Master Artisan",
    "ticket_id": "Ticket Serial",
    "success_action": "Schedule Another Session",

    // Dynamic Services Strings
    "service_sov-cut_name": "The Sovereign Cut",
    "service_sov-cut_desc": "Signature tailor-made haircut, double hot lather shampoo wash, blow-dry finish, and sharp straight-razor neck clean.",
    "service_buzz-fade_name": "Skin Fade & Edge",
    "service_buzz-fade_desc": "Ultra-precise skin-fade transition with personalized tapering and razor-sharp perimeter lining.",
    "service_beard-sculpt_name": "Beard Sculpt & Steam",
    "service_beard-sculpt_desc": "Detailed beard architectural sculpting, dynamic hot towel steam, premium sandalwood oil massage, and razor cheek lining.",
    "service_royal-shave_name": "Imperial Royal Shave",
    "service_royal-shave_desc": "Double pass straight-razor shave, pre-shave essential oil, rich lather applied with warm badger brush, and custom face massage.",
    "service_gent-combo_name": "The Gentlemen's Choice",
    "service_gent-combo_desc": "Our core combination: The Sovereign Cut meticulously paired with the Beard Sculpt & Steam. The gold standard package.",
    "service_royal-combo_name": "The Royal Treatment",
    "service_royal-combo_desc": "The Ultimate Sovereign indulgence: The Sovereign Cut alongside the Imperial Royal Shave, topped with a relaxing scalp care ritual.",

    // Dynamic Barbers Strings
    "barber_any-barber_name": "Any Available Stylist",
    "barber_any-barber_specialty": "Instant placement with first available master craftsman",
    "barber_alex-vance_name": "Alexander Vance",
    "barber_alex-vance_specialty": "Classic Scissor Cuts & Fine Tapering",
    "barber_marcus-sterling_name": "Marcus Sterling",
    "barber_marcus-sterling_specialty": "Precision Beard Architect & Razor Master",
    "barber_elena-rostova_name": "Elena Rostova",
    "barber_elena-rostova_specialty": "Modern Texturing, Layers & Color Design",
    "barber_julian-croft_name": "Julian Croft",
    "barber_julian-croft_specialty": "High Skin Fades & Sharp Urban Linups",

    // Admin Panel Overview
    "admin_nav_overview": "Overview",
    "admin_nav_schedule": "Live Schedule",
    "admin_nav_barbers": "Barber Staff",
    "admin_nav_services": "Service Catalog",
    "admin_nav_settings": "Settings Hub",
    "admin_welcome": "Barber",
    "admin_welcome_accent": "Staff Management",
    "admin_welcome_subtitle": "MANAGE SHIFT COVERAGE, ASSIGN MASTER WORKERS & REVIEWS",
    "admin_avail_status": "Set Availability Status",
    "admin_shift_coverage": "Standard Seat: Salon #",
    "admin_add_stylist_title": "Add New Stylist Craftsman",
    "admin_form_name": "Barber Full Name",
    "admin_form_name_placeholder": "e.g. Master Alistair Cunningham",
    "admin_form_shift": "Working Shift / Hours",
    "admin_form_specialties": "Select Specialties Badges",
    "admin_form_avatar": "Visual Avatar representation",
    "admin_form_drag_photo": "Drag photo or browse",
    "admin_form_format_limit": "PNG, JPG, WEBP • Max 2MB",
    "admin_form_preset_or": "Or Pick Premium Monogram Color Theme",
    "admin_form_crest_info": "Generates a majestic initials crest using our signature royal typography styles.",
    "admin_form_success": "System Registry OK",
    "admin_new_craftsman_added": "Craftsman Added",
    "admin_new_craftsman_desc": "Stylist has been enrolled. High tier booking slots initialized.",

    // Admin Appointments & quick actions
    "admin_live_schedule": "Live Agendas",
    "admin_live_schedule_desc": "MANAGE APPOINTMENTS • CLICK CARD FOR LARGE QUICK STATUS ACTION SHEET",
    "admin_time_slot": "Time Slot",
    "admin_customer": "Customer",
    "admin_assigned_barber": "Assigned Barber",
    "admin_service_price": "Service (Price)",
    "admin_status": "Status Badge",
    "admin_empty_window": "Empty Window",
    "admin_no_bookings": "No bookings scheduled",
    "admin_ticket_serial": "ID",
    "admin_email_conn": "Email Connection",
    "admin_contact_phone": "Contact Phone",
    "admin_booking_slot": "Selected Booking Slot",
    "admin_sovereign_item": "Sovereign Service & Stylist",
    "admin_special_notes": "Special Directions",
    "admin_open_walk": "Open for guest bookings or walking appointments.",
    "admin_ticket_manager": "Manage Appointment Ticket",
    "admin_segmented_pipeline": "Segmented Pipeline Phase",
    "admin_reschedule_title": "Reschedule Session Hour",
    "admin_reschedule_tip": "Please choose a new treatment time slot for this VIP appointment.",
    "admin_confirm_session": "Need to offset this appointment?",
    "admin_confirm_chair": "Confirm Chair",
    "admin_complete_seat": "Complete Seat",
    "admin_cancel_booking": "Cancel Booking",
    "admin_action_suite": "Tactile Action Suite",
    
    // Status badges
    "status_pending": "Pending",
    "status_confirmed": "Confirmed",
    "status_completed": "Completed",
    "status_cancelled": "Cancelled",

    // Settings hub
    "settings_main": "Settings &",
    "settings_accent": "Controls",
    "settings_desc": "CLEANUP WORKSPACE, RE-POPULATE SIMULATED DATABASES",
    "settings_wipe": "Wipe State & Re-populate Default Database",
    "settings_wipe_desc": "This completely wipes existing appointments, catalogs, and staff availability status from your current local preview cache, then restores the pristine defaults. Excellent for verifying empty states and starting a clean test.",
    "settings_reset_btn": "Reset DB To Pristine State",
    "settings_biz_location": "Business Location & Contact Credentials",
    "settings_biz_salon": "Physical Salon",
    "settings_biz_hotline": "Manager Desk Hotline"
  },
  KA: {
    // Brand & Header
    "brand_name": "სოვერენი",
    "brand_suffix": "კლუბი",
    "exquisite_grooming": "დახვეწილი მამაკაცის მოვლა",
    "access_owner": "მფლობელის პანელი",
    "owner_console": "კონსოლის ცენტრი",
    "owner_admin": "ადმინი",
    "shop_address": "რეჯენტ იმპერიალ ბულვარი 72, ნიუ იორკი • ღიაა ყოველდღე 09:00 - 20:00",
    "shop_address_short": "რეჯენტ იმპერიალ ბულვარი 72, ნიუ იორკი",
    "shop_phone": "+1 (212) 555-0104",

    // Navigation buttons
    "btn_back": "უკან",
    "btn_continue": "გაგრძელება",
    "btn_continue_short": "გაგრძელება",
    "btn_confirm_reservation": "რეზერვაციის დადასტურება",
    "btn_client_chair": "კლიენტის ჯავშანი",
    "btn_switch_booking": "კლიენტის რეჟიმი",
    "btn_manage": "მართვა",
    "btn_details_arrow": "დეტალები ➔",
    "btn_reschedule": "დროის შეცვლა",
    "btn_cancel_panel": "დახურვა",
    "btn_confirm_chair": "დადასტურება",
    "btn_complete_seat": "დასრულება",
    "btn_cancel_booking": "გაუქმება",
    "btn_dismiss": "გაუქმება",
    "btn_confirm_slot": "ახალი დროის დადასტურება",
    "btn_add_stylist": "ახალი სტილისტის დამატება",
    "btn_enroll_craftsman": "რეგისტრაცია",

    // Stepper Labels
    "step_0": "სერვისი",
    "step_1": "ბარბერი",
    "step_2": "დრო",
    "step_3": "შემოწმება",
    "step_4": "დასრულდა",

    // Footer Trust Links
    "trust_flexible": "მოქნილი თარიღები",
    "trust_flexible_desc": "უფასო შეცვლა 1 საათით ადრე",
    "trust_certified": "სერტიფიცირებული ხელოვნება",
    "trust_certified_desc": "გამოცდილი პრემიუმ ბარბერები",
    "trust_swift": "სწრაფი მომსახურება",
    "trust_swift_desc": "დაწყება ზუსტად დროზე",

    // Mobile Booking summary
    "treatment_details_title": "თქვენი პროცედურის დეტალები",
    "exp_style": "სერვისის ტიპი",
    "master_barber": "მთავარი ბარბერი",
    "arrival_time": "მოსვლის დრო",
    "choose_service_first": "აირჩიეთ სერვისი",

    // Booking Step 0: Service Selection
    "services_title_main": "აირჩიეთ",
    "services_title_accent": "სერვისის პაკეტი",
    "services_subtitle": "შეარჩიეთ ჩვენი დახვეწილი კლასიკური თმის შეჭრის, მოდური ფეიდებისა და პარსვის სერვისებიდან",
    "cat_all": "ყველა შეთავაზება",
    "cat_hair": "თმის შეჭრა",
    "cat_beard": "წვერის მოდელირება",
    "cat_shave": "პარსვა",
    "cat_combo": "ექსკლუზივი",

    // Booking Step 1: Barber Selection
    "barbers_title_main": "შეარჩიეთ",
    "barbers_title_accent": "ოსტატი სტილისტი",
    "barbers_subtitle": "აირჩიეთ გამოცდილი პროფესიონალი თქვენი პერსონალური სტილის დასახვეწად",
    "reviews_count": "შეფასება",

    // Booking Step 2: DateTimePicker
    "date_title_main": "დაჯავშნეთ",
    "date_title_accent": "თარიღი და დრო",
    "date_subtitle": "შეარჩიეთ თქვენთვის სასურველი კალენდარული დღე და საათი ვიზიტისთვის",
    "section_morning": "დილის სესიები",
    "section_afternoon": "დღის მომსახურებები",
    "section_evening": "საღამოს სესიები",
    "slot_conflicts": "დროებით დაკავებულია",
    "no_dates": "აირჩიეთ სასურველი თარიღი თავისუფალი საათების სანახავად",

    // Booking Step 3: Checkout Info review
    "checkout_title_main": "შეამოწმეთ",
    "checkout_title_accent": "ჯავშნის დეტალები",
    "checkout_subtitle": "გადაამოწმეთ თქვენი არჩევანი და შეიყვანეთ საკონტაქტო მონაცემები დასადასტურებლად",
    "cust_name": "სრული სახელი",
    "cust_phone": "ტელეფონის ნომერი",
    "cust_email": "ელ-ფოსტა",
    "cust_notes": "სპეციალური მოთხოვნები",
    "placeholder_notes": "მაგ. კლასიკური შეჭრა მაკრატლით, ცხელი ჩაი, ზუსტი კონტურები წვერზე...",
    "error_name": "გთხოვთ შეიყვანოთ თქვენი სრული სახელი.",
    "error_email": "გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის მისამართი.",
    "error_phone": "გთხოვთ შეიყვანოთ სწორი მობილურის ნომერი.",

    // Success Screen
    "success_badge": "Sovereign VIP დაცულია",
    "success_title_main": "ჯავშანი",
    "success_title_accent": "დადასტურებულია",
    "success_desc": "თქვენი დახვეწილი სტილის სკამი რეზერვირებულია. დასტური სინქრონიზებულია ჩვენს ციფრულ სისტემასთან.",
    "ticket_header": "ოფიციალური ჯავშნის ბარათი",
    "ticket_time_label": "ვიზიტის დრო",
    "ticket_service_label": "სერვისის ტიპი",
    "ticket_barber_label": "ოსტატი ბარბერი",
    "ticket_id": "სერიული ნომერი",
    "success_action": "ახალი ვიზიტის დაგეგმვა",

    // Dynamic Services Strings
    "service_sov-cut_name": "სოვერენის შეჭრა",
    "service_sov-cut_desc": "კლასიკური ინდივიდუალური თმის შეჭრა, ორმაგი დაბანა ცხელი ქაფით და შამპუნით, დაფენვა და კისრის გასუფთავება საშიში სამართებლით.",
    "service_buzz-fade_name": "სკინ ფეიდი და კონტური",
    "service_buzz-fade_desc": "ულტრა-ზუსტი კონტურები და გადასვლები თმის შეჭრისას პერსონალური სტილის გათვალისწინებით.",
    "service_beard-sculpt_name": "წვერის მოდელირება და ორთქლი",
    "service_beard-sculpt_desc": "წვერის არქიტექტურული მოდელირება, ცხელი პირსახოცის ორთქლი, მასაჟი სანდალოზის ზეთით და ყელის გასუფთავება.",
    "service_royal-shave_name": "იმპერიული სამეფო პარსვა",
    "service_royal-shave_desc": "ორმაგი პარსვა საშიში სამართებლით, სპეციალური ზეთები, მდიდარი ქაფი და დამამშვიდებელი სახის მასაჟი.",
    "service_gent-combo_name": "ჯენტლმენის არჩევანი",
    "service_gent-combo_desc": "ოქროს სტანდარტის კომბინირებული პაკეტი: სოვერენის თმის შეჭრა და წვერის მოდელირება ცხელი ორთქლით.",
    "service_royal-combo_name": "სამეფო მომსახურება",
    "service_royal-combo_desc": "ლუქს კლასის სრული პაკეტი: სოვერენის შეჭრა, იმპერიული პარსვა და თავის კანის დამამშვიდებელი მოვლის რიტუალი.",

    // Dynamic Barbers Strings
    "barber_any-barber_name": "ნებისმიერი თავისუფალი ბარბერი",
    "barber_any-barber_specialty": "მყისიერი ჯავშანი პირველივე თავისუფალ ხელოსანთან",
    "barber_alex-vance_name": "ალექსანდერ ვანსი",
    "barber_alex-vance_specialty": "კლასიკური მაკრატლით შეჭრა და კონტურები",
    "barber_marcus-sterling_name": "მარკუს სტერლინგი",
    "barber_marcus-sterling_specialty": "წვერის არქიტექტორი და სამართებლის ოსტატი",
    "barber_elena-rostova_name": "ელენა როსტოვა",
    "barber_elena-rostova_specialty": "თანამედროვე ტექსტურები, ფენები და თმის ფერი",
    "barber_julian-croft_name": "ჯულიან კროფტი",
    "barber_julian-croft_specialty": "მაღალი სკინ ფეიდები და მკვეთრი კონტურები",

    // Admin Panel Overview
    "admin_nav_overview": "მიმოხილვა",
    "admin_nav_schedule": "განრიგი",
    "admin_nav_barbers": "ბარბერები",
    "admin_nav_services": "სერვისები",
    "admin_nav_settings": "პარამეტრები",
    "admin_welcome": "პერსონალის",
    "admin_welcome_accent": "ხელმძღვანელობა",
    "admin_welcome_subtitle": "მართეთ სამუშაო ცვლები, აკონტროლეთ ბარბერები და იხილეთ გამოხმაურებები",
    "admin_avail_status": "სამუშაო სტატუსის შეცვლა",
    "admin_shift_coverage": "სამუშაო ადგილი: სალონი #",
    "admin_add_stylist_title": "ახალი სტილისტის დამატება სალონში",
    "admin_form_name": "ბარბერის სახელი და გვარი",
    "admin_form_name_placeholder": "მაგ. ალისტერ კანინგემი",
    "admin_form_shift": "საცვლო საათები",
    "admin_form_specialties": "მონიშნეთ სპეციალობები და უნარები",
    "admin_form_avatar": "ვიზუალური ავატარის შერჩევა",
    "admin_form_drag_photo": "ჩააგდეთ სურათი აქ ან აირჩიეთ",
    "admin_form_format_limit": "PNG, JPG, WEBP • მაქს. 2MB",
    "admin_form_preset_or": "ან აირჩიეთ პრემიუმ მონოგრამის ფერი",
    "admin_form_crest_info": "ქმნის სამეფო მონოგრამას თქვენი სახელიდან გამომდინარე.",
    "admin_form_success": "რეგისტრაცია წარმატებულია",
    "admin_new_craftsman_added": "სტილისტი ამატებულია",
    "admin_new_craftsman_desc": "ახალი ბარბერი წარმატებით დარეგისტრირდა სისტემაში. საათები აქტიურია.",

    // Admin Appointments & quick actions
    "admin_live_schedule": "მიმდინარე განრიგი",
    "admin_live_schedule_desc": "მართეთ ჯავშნები • დააკლიკეთ ბარათს სტატუსის შესაცვლელად",
    "admin_time_slot": "მომსახურების დრო",
    "admin_customer": "კლიენტი",
    "admin_assigned_barber": "შერჩეული ბარბერი",
    "admin_service_price": "სერვისი (ფასი)",
    "admin_status": "სტატუსი",
    "admin_empty_window": "თავისუფალია",
    "admin_no_bookings": "ვიზიტები არ არის დაგეგმილი",
    "admin_ticket_serial": "ID",
    "admin_email_conn": "ელ-ფოსტა",
    "admin_contact_phone": "საკონტაქტო მობილური",
    "admin_booking_slot": "შერჩეული სამუშაო საათი",
    "admin_sovereign_item": "სერვისი და შემსრულებელი",
    "admin_special_notes": "სპეციალური მოთხოვნები",
    "admin_open_walk": "ღიაა ნებისმიერი კლიენტის მისაღებად.",
    "admin_ticket_manager": "ვიზიტის ბარათის მართვა",
    "admin_segmented_pipeline": "მომსახურების ეტაპი",
    "admin_reschedule_title": "ვიზიტის დროის გადატანა",
    "admin_reschedule_tip": "გთხოვთ შეარჩიოთ ახალი თავისუფალი დრო მოცემული ვიზიტისთვის.",
    "admin_confirm_session": "გსურთ ამ ვიზიტის გადატანა?",
    "admin_confirm_chair": "სავარძლის დადასტურება",
    "admin_complete_seat": "მომსახურების დასრულება",
    "admin_cancel_booking": "ჯავშნის გაუქმება",
    "admin_action_suite": "სწრაფი მოქმედებების პანელი",

    // Status badges
    "status_pending": "მოლოდინში",
    "status_confirmed": "დასტურდება",
    "status_completed": "დასრულდა",
    "status_cancelled": "გაუქმდა",

    // Settings hub
    "settings_main": "პარამეტრები და",
    "settings_accent": "მართვა",
    "settings_desc": "სისტემის გასუფთავება, დეფოლტ ბაზის აღდგენა",
    "settings_wipe": "მონაცემთა ბაზის მთლიანი გასუფთავება",
    "settings_wipe_desc": "აღნიშნული ფუნქცია სრულად წაშლის თქვენს ამჟამინდელ კლიენტებს, ჯავშნებსა და პერსონალს ლოკალური მეხსიერებიდან და დააბრუნებს პირვანდელ მდგომარეობას.",
    "settings_reset_btn": "აღდგენა პირვანდელ სახემდე",
    "settings_biz_location": "მდებარეობა და საკონტაქტო მონაცემები",
    "settings_biz_salon": "სალონის მისამართი",
    "settings_biz_hotline": "ცხელი ხაზი"
  },
  RU: {
    // Brand & Header
    "brand_name": "SOVEREIGN",
    "brand_suffix": "Клуб",
    "exquisite_grooming": "Изысканный мужской уход",
    "access_owner": "Панель владельца",
    "owner_console": "Панель управления",
    "owner_admin": "Админ",
    "shop_address": "72 Regent Imperial Blvd, Нью-Йорк • Открыто ежедневно 09:00 - 20:00",
    "shop_address_short": "72 Regent Imperial Blvd, Нью-Йорк",
    "shop_phone": "+1 (212) 555-0104",

    // Navigation buttons
    "btn_back": "Назад",
    "btn_continue": "Продолжить",
    "btn_continue_short": "Продолжить",
    "btn_confirm_reservation": "Подтвердить бронь",
    "btn_client_chair": "Забронировать кресло",
    "btn_switch_booking": "Режим клиента",
    "btn_manage": "Управлять",
    "btn_details_arrow": "Детали ➔",
    "btn_reschedule": "Изменить время",
    "btn_cancel_panel": "Закрыть панель",
    "btn_confirm_chair": "Подтвердить",
    "btn_complete_seat": "Обслужить",
    "btn_cancel_booking": "Отменить",
    "btn_dismiss": "Отмена",
    "btn_confirm_slot": "Подтвердить время",
    "btn_add_stylist": "Добавить стилиста",
    "btn_enroll_craftsman": "Зарегистрировать",

    // Stepper Labels
    "step_0": "Услуга",
    "step_1": "Барбер",
    "step_2": "Время",
    "step_3": "Проверка",
    "step_4": "Завершено",

    // Footer Trust Links
    "trust_flexible": "Гибкие даты",
    "trust_flexible_desc": "Перенос сеанса до 1 часа бесплатно",
    "trust_certified": "Премиум качество",
    "trust_certified_desc": "Сертифицированные топ-мастера",
    "trust_swift": "Точное время",
    "trust_swift_desc": "Начало сеанса минута в минуту",

    // Mobile Booking summary
    "treatment_details_title": "Детали вашего визита",
    "exp_style": "Стиль услуги",
    "master_barber": "Мастер барбер",
    "arrival_time": "Время прибытия",
    "choose_service_first": "Абнемент услуг",

    // Booking Step 0: Service Selection
    "services_title_main": "Выберите услугу",
    "services_title_accent": "и пакеты ухода",
    "services_subtitle": "ВЫБЕРИТЕ ИЗ НАШЕГО ИЗЫСКАННОГО КАТАЛОГА КЛАССИЧЕСКИХ СТРИЖЕК, СОВРЕМЕННЫХ ФЕЙДОВ И БРИТЬЯ",
    "cat_all": "Все предложения",
    "cat_hair": "Стрижки",
    "cat_beard": "Моделирование бороды",
    "cat_shave": "Королевское бритье",
    "cat_combo": "Эксклюзивные комбо",

    // Booking Step 1: Barber Selection
    "barbers_title_main": "Выберите мастера",
    "barbers_title_accent": "стилиста",
    "barbers_subtitle": "ВЫБЕРИТЕ ПРОФЕССИОНАЛА ДЛЯ СОЗДАНИЯ ВАШЕГО ИНДИВИДУАЛЬНОГО ОБРАЗА",
    "reviews_count": "отзывов",

    // Booking Step 2: DateTimePicker
    "date_title_main": "Забронировать",
    "date_title_accent": "день и время",
    "date_subtitle": "ВЫБЕРИТЕ УДОБНУЮ ДАТУ И СВОБОДНЫЙ ИНТЕРВАЛ ДЛЯ ВИЗИТА",
    "section_morning": "Утренние сеансы",
    "section_afternoon": "Дневные визиты",
    "section_evening": "Вечернее время",
    "slot_conflicts": "Временно забронировано",
    "no_dates": "Выберите дату выше для получения списка свободного времени",

    // Booking Step 3: Checkout Info review
    "checkout_title_main": "Проверить детали",
    "checkout_title_accent": "и подтвердить",
    "checkout_subtitle": "ПРОВЕРЬТЕ ВЫБРАННЫЕ НАСТРОЙКИ И ВВЕДИТЕ ДАННЫЕ ДЛЯ ПОДТВЕРЖДЕНИЯ",
    "cust_name": "Имя и фамилия",
    "cust_phone": "Номер телефона",
    "cust_email": "Электронная почта",
    "cust_notes": "Особые пожелания",
    "placeholder_notes": "например, стрижка классическими ножницами, горячий чай, подчеркнуть бороду...",
    "error_name": "Пожалуйста, введите ваше полное имя.",
    "error_email": "Пожалуйста, введите корректный email.",
    "error_phone": "Пожалуйста, введите корректный номер телефона.",

    // Success Screen
    "success_badge": "VIP статус Sovereign подтвержден",
    "success_title_main": "Бронь",
    "success_title_accent": "подтверждена",
    "success_desc": "Ваше кресло зарезервировано. Подтверждение автоматически синхронизировано с нашей системой администратора.",
    "ticket_header": "Официальный талон бронирования",
    "ticket_time_label": "Время визита",
    "ticket_service_label": "Процедура Sovereign",
    "ticket_barber_label": "Мастер стилист",
    "ticket_id": "Номер билета",
    "success_action": "Запланировать другой визит",

    // Dynamic Services Strings
    "service_sov-cut_name": "Стрижка Sovereign Cut",
    "service_sov-cut_desc": "Индивидуальная фирменная стрижка, мытье головы с двойным распаривающим массажем и бритье шеи опасной бритвой.",
    "service_buzz-fade_name": "Скин-Фейд и окантовка",
    "service_buzz-fade_desc": "Ультраточный переход со сведением на нет, персонализированная градуировка и бритвенная окантовка шеи и висков.",
    "service_beard-sculpt_name": "Архитектура бороды и пар",
    "service_beard-sculpt_desc": "Детализированное скульптурирование бороды с распариванием горячим компрессом и массажем с фирменным маслом.",
    "service_royal-shave_name": "Императорское бритье",
    "service_royal-shave_desc": "Традиционное бритье опасной бритвой в два захода, распаривающий компресс, густая пена и массаж лица.",
    "service_gent-combo_name": "Выбор Джентльмена",
    "service_gent-combo_desc": "Золотой стандарт ухода: Стрижка Sovereign Cut в сочетании с архитектурой бороды и горячим паром.",
    "service_royal-combo_name": "Королевский уход",
    "service_royal-combo_desc": "Абсолютный люкс Sovereign: Стрижка Sovereign Cut и Императорское бритье с расслабляющим уходом за кожей головы.",

    // Dynamic Barbers Strings
    "barber_any-barber_name": "Любой свободный мастер",
    "barber_any-barber_specialty": "Мгновенная запись к первому освободившемуся мастеру",
    "barber_alex-vance_name": "Александр Вэнс",
    "barber_alex-vance_specialty": "Классические ножницы и точные переходы",
    "barber_marcus-sterling_name": "Маркус Стерлинг",
    "barber_marcus-sterling_specialty": "Архитектор бороды и мастер бритья опасной бритвой",
    "barber_elena-rostova_name": "Елена Ростова",
    "barber_elena-rostova_specialty": "Современные текстурные стрижки и колористика",
    "barber_julian-croft_name": "Джулиан Крофт",
    "barber_julian-croft_specialty": "Высокие скин-фейды и четкие геометрические линии",

    // Admin Panel Overview
    "admin_nav_overview": "Обзор",
    "admin_nav_schedule": "Расписание",
    "admin_nav_barbers": "Мастера",
    "admin_nav_services": "Каталог услуг",
    "admin_nav_settings": "Настройки",
    "admin_welcome": "Управление",
    "admin_welcome_accent": "персоналом",
    "admin_welcome_subtitle": "Определяйте смены, координируйте мастеров и отслеживайте отзывы клиентов",
    "admin_avail_status": "Установить рабочий статус",
    "admin_shift_coverage": "Стандартное место: Салон #",
    "admin_add_stylist_title": "Регистрация нового мастера",
    "admin_form_name": "Полное имя мастера",
    "admin_form_name_placeholder": "например, Мастер Алистер Каннингем",
    "admin_form_shift": "Рабочая смена / Часы работы",
    "admin_form_specialties": "Выберите специализации мастера",
    "admin_form_avatar": "Визуальное представление (аватар)",
    "admin_form_drag_photo": "Перетащите фото сюда или выберите",
    "admin_form_format_limit": "PNG, JPG, WEBP • Макс. 2MB",
    "admin_form_preset_or": "Или выберите премиальную цветовую монограмму",
    "admin_form_crest_info": "Создает благородную монограмму на основе инициалов мастера.",
    "admin_form_success": "Регистрация успешна",
    "admin_new_craftsman_added": "Мастер зарегистрирован",
    "admin_new_craftsman_desc": "Новый барбер добавлен в систему. Рабочие часы активированы.",

    // Admin Appointments & quick actions
    "admin_live_schedule": "Текущий день",
    "admin_live_schedule_desc": "Управляйте визитами • Нажмите на карточку для открытия меню быстрых действий",
    "admin_time_slot": "Время приема",
    "admin_customer": "Клиент",
    "admin_assigned_barber": "Назначенный мастер",
    "admin_service_price": "Услуга (цена)",
    "admin_status": "Текущий статус",
    "admin_empty_window": "Свободно",
    "admin_no_bookings": "Визитов на выбранный день не запланировано",
    "admin_ticket_serial": "ID",
    "admin_email_conn": "Электронный адрес",
    "admin_contact_phone": "Контактный телефон",
    "admin_booking_slot": "Выбранный интервал визита",
    "admin_sovereign_item": "Услуга и мастер исполнитель",
    "admin_special_notes": "Специальные инструкции",
    "admin_open_walk": "Интервал открыт для записи онлайн или клиентов без предварительной записи.",
    "admin_ticket_manager": "Управление билетом бронирования",
    "admin_segmented_pipeline": "Этап прохождения услуги",
    "admin_reschedule_title": "Перенос времени визита",
    "admin_reschedule_tip": "Пожалуйста, назначьте новое свободное время для выбранного визита.",
    "admin_confirm_session": "Желаете перенести данный сеанс?",
    "admin_confirm_chair": "Подтвердить визит",
    "admin_complete_seat": "Обслуживание завершено",
    "admin_cancel_booking": "Отменить бронь",
    "admin_action_suite": "Панель быстрых действий",

    // Status badges
    "status_pending": "Ожидает",
    "status_confirmed": "Подтвержден",
    "status_completed": "Выполнен",
    "status_cancelled": "Отменен",

    // Settings hub
    "settings_main": "Настройки и",
    "settings_accent": "Контроль",
    "settings_desc": "Очистка кэша, восстановление базы по умолчанию",
    "settings_wipe": "Сброс и восстановление базы данных",
    "settings_wipe_desc": "Данная операция полностью удалит текущие записи, клиентов и персонал из локального кэша и вернет демонстрационную базу к исходным демонстрационным значениям.",
    "settings_reset_btn": "Вернуть базу в исходное состояние",
    "settings_biz_location": "Расположение филиала и контакты",
    "settings_biz_salon": "Физический адрес салона",
    "settings_biz_hotline": "Горячая линия"
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("sov_barber_lang") as LanguageCode;
    return saved && (saved === "KA" || saved === "EN" || saved === "RU") ? saved : "EN";
  });

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem("sov_barber_lang", code);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Deep fallback check for other languages if key is missing in active language
    for (const code of (["EN", "KA", "RU"] as LanguageCode[])) {
      if (translations[code]?.[key] !== undefined) {
        return translations[code][key];
      }
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Reusable animated translated text block that cross-fades on language change
export function Translate({ id, fallback, className = "" }: { id: string; fallback?: string; className?: string }) {
  const { t, language } = useLanguage();
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={language}
        initial={{ opacity: 0, y: 1.5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -1.5 }}
        transition={{ duration: 0.2 }}
        className={`inline-block ${className}`}
      >
        {t(id, fallback)}
      </motion.span>
    </AnimatePresence>
  );
}
