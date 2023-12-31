const backendMessages = {
  "Enter the reservation Archive that this bill belongs to.":
    "أدخل أرشيف الحجز التابع لهذه الفاتورة.",
  "Enter user's id": "أدخل معرف المستخدم",
  "Enter vehicle's id": "أدخل معرف المركبة",
  "Enter Date of bill": "أدخل تاريخ الفاتورة",
  "Enter the volume of fuel": "أدخل حجم الوقود",
  "Enter the type of fuel": "أدخل نوع الوقود",
  "Enter the name of station": "أدخل اسم المحطة",
  "Enter the price of bill": "أدخل سعر الفاتورة",
  "Garage should have a name": "يجب أن يحتوي المرآب على اسم",
  "There is a garage with this name": "هناك مرآب بنفس الاسم",
  "Garage should have an address": "يجب أن يحتوي المرآب على عنوان",
  "There is a garage with this address": "هناك مرآب بنفس العنوان",
  "Please provide the garage's phone number": "يرجى توفير رقم هاتف المرآب",
  "There is a garage with this phone number": "هناك مرآب بنفس رقم الهاتف",
  "Please provide a valid phone number": "يرجى توفير رقم هاتف صالح",
  "Enter the id of the reserved user": "أدخل معرف المستخدم المحجوز",
  "Enter Id of the reserved vehicle": "أدخل معرف المركبة المحجوزة",
  "Enter Id of the reserved garage": "أدخل معرف المرآب المحجوز",
  "Enter Date of reservation": "أدخل تاريخ الحجز",
  "Enter the location of departure": "أدخل موقع المغادرة",
  "Enter the time of departure": "أدخل وقت المغادرة",
  "Enter the ODO of departure": "أدخل قراءة عداد المغادرة",
  "Enter the location of arrival": "أدخل موقع الوصول",
  "Enter the Id of User": "أدخل معرف المستخدم",
  "Enter the Id of vehicle": "أدخل معرف المركبة",
  "User should has name": "يجب أن يحتوي المستخدم على اسم",
  "Please provide your email": "يرجى تقديم عنوان بريدك الإلكتروني",
  "Please provide a valid email": "يرجى تقديم عنوان بريد إلكتروني صالح",
  "Please provide your phone number": "يرجى تقديم رقم هاتفك",
  "Please provide a password": "يرجى تقديم كلمة المرور",
  "Please confirm a password": "يرجى تأكيد كلمة المرور",
  "Passwords are not the same!": "كلمات المرور غير متطابقة!",
  "Vehicle should have the brand or manufacturer name.":
    "يجب أن تحتوي المركبة على العلامة التجارية أو اسم الشركة المصنعة.",
  "Vehicle should have a model.": "يجب أن تحتوي المركبة على طراز.",
  "Vehicle should have an Engine Output.":
    "يجب أن تحتوي المركبة على قوة المحرك.",
  "Vehicle should have a Max Speed.": "يجب أن تحتوي المركبة على السرعة القصوى.",
  "Vehicle should have a year of manufacture.":
    "يجب أن تحتوي المركبة على سنة التصنيع.",
  "Vehicle should have a type of fuel it uses.":
    "يجب أن تحتوي المركبة على نوع الوقود الذي تستخدمه.",
  "Vehicle should have the number of miles it has been driven.":
    "يجب أن تحتوي المركبة على عدد الأميال التي قطعتها.",
  "Vehicle should have an identification number.":
    "يجب أن تحتوي المركبة على رقم تعريف.",
  "Identification number should be unique for every car.":
    "يجب أن يكون رقم التعريف فريدًا لكل سيارة.",
  "Vehicle should have at least one image.":
    "يجب أن تحتوي المركبة على صورة واحدة على الأقل.",
  "Vehicle should belong to a garage.": "يجب أن ينتمي المركبة إلى مرآب.",
  "Vehicle should have the number of seats.":
    "يجب أن تحتوي المركبة على عدد المقاعد.",
  "There is a user with this email address.":
    "هناك مستخدم بنفس عنوان البريد الإلكتروني.",
  "Code sent to email!": "تم إرسال الرمز إلى البريد الإلكتروني!",
  "There was an error sending the email. Try again later!":
    "حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى لاحقًا!",
  "Code is invalid or has expired": "الرمز غير صالح أو منتهي الصلاحية",
  "You have signed up successfully. Please wait accept from admin.":
    "لقد قمت بالتسجيل بنجاح. يرجى الانتظار لحين قبول الطلب من قبل المسؤول.",
  "Please provide email and password.":
    "يرجى تقديم البريد الإلكتروني وكلمة المرور.",
  "Incorrect email or password.": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "This user has been blocked by the admin.":
    "تم حظر هذا المستخدم من قبل المسؤول.",
  "Please wait for accept from admin.":
    "يرجى الانتظار لحين قبول الطلب من قبل المسؤول.",
  "Please provide a Token.": "يرجى تقديم رمز.",
  "You are not logged in! Please login to get access.":
    "أنت غير مسجل الدخول! يرجى تسجيل الدخول للوصول.",
  "The user belonging to this code does not exist.":
    "المستخدم المرتبط بهذا الرمز غير موجود.",
  "User recently changed password! Please log in again.":
    "قام المستخدم مؤخرًا بتغيير كلمة المرور! يرجى تسجيل الدخول مرة أخرى.",
  "You do not have permission to perform this action.":
    "ليس لديك إذن لأداء هذا الإجراء.",
  "There is no admin with this email address.":
    "لا يوجد مسؤول بنفس عنوان البريد الإلكتروني.",
  "There is no user with this email address.":
    "لا يوجد مستخدم بنفس عنوان البريد الإلكتروني.",
  "Your current password is wrong.": "كلمة المرور الحالية خاطئة.",
  "Invalid token. Please log in again!":
    "الرمز غير صالح. يرجى تسجيل الدخول مرة أخرى!",
  "Your token has expired! Please log in again.":
    "انتهت صلاحية الرمز الخاص بك! يرجى تسجيل الدخول مرة أخرى.",
  "Something went wrongq!": "حدث خطأ ما!",
  "Invalid input data.": "بيانات غير صالحة.",
  "already exists.": "موجود بالفعل.",
  "No document found with this Id":
    "لم يتم العثور على وثيقة بهذا الرقم المعرف.",
  "Created Successfully": "تم الإنشاء بنجاح.",
  "You made a request for this vehicle already":
    "لقد قمت بطلب هذه المركبة بالفعل",
  "You made a request for another vehicle": "لقد قمت بطلب مركبة أخرى",
  "Send request successfully, Please wait accept from admin":
    "تم إرسال الطلب بنجاح، يرجى الانتظار لحين قبوله من قبل المسؤول",
  "ICostumeRequest not found": "لم يتم العثور على طلب الملابس",
  "Accept request successfully": "تم قبول الطلب بنجاح",
  "the user is active now.": "المستخدم نشط الآن.",
  "This user is already blocked": "تم حظر هذا المستخدم بالفعل",
  "the user blocked now.": "تم حظر المستخدم الآن.",
  "This user is already Accepted By Admin":
    "تم قبول هذا المستخدم بالفعل من قبل المشرف",
  "User Accepted Successfully": "تم قبول المستخدم بنجاح",
  "This vehicle is not in using mode.": "هذه المركبة ليست في وضع الاستخدام.",
  "Vehicles returned successfully": "تمت إعادة المركبات بنجاح",
  "This vehicle has been in use by another user":
    "تم استخدام هذه المركبة بالفعل من قبل مستخدم آخر",
  "Return's request has accepted by admin": "تم قبول طلب الإرجاع من قبل المشرف",
  "Return's request canceled successfully.": "تم إلغاء طلب الإرجاع بنجاح.",
  "disLiked Successfully": "تمت الإزالة من المفضلة بنجاح",
  "Liked Successfully": "تمت الإضافة إلى المفضلة بنجاح",
};

export const ar = {
  ...backendMessages,
  "Delete Bill": "حذف الفاتورة",
  "Do you want to delete this Bill": "هل تريد حذف هذه الفاتورة",
  "Bill Deleted Successfully": "تم حذف الفاتورة بنجاح",
  "Password has changed Successfully": "تم تغيير كلمة المرور بنجاح",
  "All Garages": "جميع الكراجات",
  "Book Vehicle Now !": "احجز المركبة الآن!",
  "You Did Not Book Any Vehicle": "لم تقم بحجز أي مركبة",
  "No Vehicle": "لا توجد مركبة",
  Filter: "تصفية",
  Max: "أقصى",
  Min: "أدنى",
  Year: "السنة",
  Model: "الموديل",
  Garage: "الكراج",
  Vehicle: "المركبة",
  "Search Garage": "البحث في الكراج",
  "Search Vehicle": "البحث عن مركبة",
  "Available Vehicles": "المركبات المتاحة",
  Garages: "الكراجات",
  Ok: "موافق",
  "You has requested another vehicle, if You Want to request this vehicle delete the another request.":
    "لقد طلبت مركبة أخرى، إذا كنت ترغب في طلب هذه المركبة، قم بحذف الطلب الآخر.",
  "You are using another vehicle": "أنت تستخدم مركبة أخرى",
  Warning: "تحذير",
  "Book Vehicle": "حجز المركبة",
  "Using By Another User": "تستخدمها مستخدم آخر",
  "Using By You": "تستخدمها أنت",
  Requested: "مطلوب",
  Transmission: "ناقل الحركة",
  "Body Type": "نوع الهيكل",
  Capacity: "السعة",
  "Max Speed": "السرعة القصوى",
  "Engine Out": "محرك خارجي",
  Features: "الميزات",
  Specification: "المواصفات",
  "Vehicle Details": "تفاصيل المركبة",
  "Edit Request": "تعديل الطلب",
  "Request Date": "تاريخ الطلب",
  "Do you want to delete this request": "هل ترغب في حذف هذا الطلب",
  "Delete Request": "حذف الطلب",
  Yes: "نعم",
  No: "لا",
  "Do you want to cancel return's request of this vehicle":
    "هل ترغب في إلغاء طلب العودة لهذه المركبة",
  "Cancel Return's Request": "إلغاء طلب العودة",
  "Do you want to return this vehicle": "هل ترغب في إعادة هذه المركبة",
  "Return Vehicle": "إعادة المركبة",
  Success: "نجاح",
  Return: "عودة",
  "Cancel Return Request": "إلغاء طلب العودة",
  Bills: "الفواتير",
  Details: "تفاصيل",
  details: "تفاصيل",
  Vehicles: "المركبات",
  Address: "العنوان",
  "No Bills Found": "لم يتم العثور على فواتير",
  "Arrival Data": "بيانات الوصول",
  "Departure Data": "بيانات المغادرة",
  "Are you sure, you want to log out ?": "هل أنت متأكد أنك تريد الخروج؟",
  "Log out": "تسجيل الخروج",
  "ِAvailable": "متاح",
  Working: "قيد العمل",
  "My Favorites": "المفضلة",
  Archive: "الأرشيف",
  Status: "الحالة",
  "My Bills": "فواتيري",
  "Show More": "عرض المزيد",
  "My Archive": "أرشيفي",
  "Upload Bill Image": "تحميل صورة الفاتورة",
  "Image Uploaded Successfully": "تم تحميل الصورة بنجاح",
  "No Item Found": "لم يتم العثور على عنصر",
  View: "عرض",
  Submit: "إرسال",
  Cancel: "إلغاء",
  Close: "إغلاق",
  Seats: "المقاعد",
  "View All": "عرض الكل",
  Delete: "حذف",
  gas: "بنزين",
  hybrid: "هجين",
  electric: "كهربائي",
  diesel: "ديزل",
  gasoline: "بنزين",
  "No Note": "لا توجد ملاحظة",
  Date: "التاريخ",
  Station: "المحطة",
  Show: "عرض",
  "Arrival Date": "تاريخ الوصول",
  "Fuel Bills": "فواتير الوقود",
  "Arrival Odo": "عداد الوصول",
  To: "إلى",
  "Departure Date": "تاريخ المغادرة",
  "Departure Odo": "عداد المغادرة",
  From: "من",
  Update: "تحديث",
  Upload: "تحميل",
  Bill: "فاتورة",
  Create: "إنشاء",
  Edit: "تعديل",
  "Create Bill": "إنشاء فاتورة",
  "Verify Email": "تحقق من البريد الإلكتروني",
  "Verification Email": "بريد التحقق",
  "Log in": "تسجيل الدخول",
  "Do you have an account?": "هل لديك حساب؟",
  "Create an account and access our app": "أنشئ حسابًا واستخدم تطبيقنا",
  Apply: "تطبيق",
  ok: "موافق",
  success: "نجاح",
  "Reset Password": "إعادة تعيين كلمة المرور",
  "Forgot Password": "نسيت كلمة المرور",
  "Sign Up": "التسجيل",
  "Don't have an account?": "ليس لديك حساب؟",
  Login: "تسجيل الدخول",
  "Forgot Password ?": "هل نسيت كلمة المرور؟",
  "Please log in to continue using our app":
    "يرجى تسجيل الدخول للاستمرار باستخدام تطبيقنا",
  "Log In Now": "تسجيل الدخول الآن",
  Email: "البريد الإلكتروني",
  Name: "الاسم",
  "Phone Number": "رقم الهاتف",
  Password: "كلمة المرور",
  "New Password": "كلمة المرور الجديدة",
  "Confirm Password": "تأكيد كلمة المرور",
  "Current Password": "كلمة المرور الحالية",
  "Enter verification code": "أدخل رمز التحقق",
  "Fuel Type": "نوع الوقود",
  "Station Name": "اسم المحطة",
  "Fuel Volume": "حجم الوقود",
  Price: "السعر",
  Note: "ملاحظة",
  "Enter your email": "أدخل بريدك الإلكتروني",
  "Incorrect Email": "بريد إلكتروني غير صحيح",
  "Enter your phone number": "أدخل رقم هاتفك",
  "Enter your name": "أدخل اسمك",
  "Name is not valid": "الاسم غير صالح",
  "Enter your password": "أدخل كلمة المرور",
  "Password must contain at least 8 characters":
    "يجب أن تحتوي كلمة المرور على ما لا يقل عن 8 أحرف",
  "Passwords must match": "يجب أن تتطابق كلمات المرور",
  "Enter current password": "أدخل كلمة المرور الحالية",
  "Enter code": "أدخل الرمز",
  "Enter fuel volume": "أدخل حجم الوقود",
  "Enter station name": "أدخل اسم المحطة",
  "Enter price": "أدخل السعر",
};
