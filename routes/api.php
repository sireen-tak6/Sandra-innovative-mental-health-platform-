<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ArticlesController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\PendingArticlesController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DislikeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\DoctorVerfiyController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SecretaryController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientInformationController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DlikeController;
use App\Http\Controllers\PlikeController;
use App\Http\Controllers\PostController;


/*

|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


//this section for auth

Route::post('/signup/user' , [AuthController::class , 'signup']);
Route::post('/signup/doctor',[AuthController::class , 'signupDoctor']);

//this api for verfiy patient email before login
Route::get('/verify-email-patient/{token}',
[AuthController::class, 'verifyEmailUser'])
->name('verify.email.user');
//this api for verify doctor email before login
Route::get('/verify-email/{token}',
[AuthController::class, 'verifyEmail'])
->name('verify.email');
Route::get('/verify-new-email/{token}',
[SettingsController::class, 'verifyEmail'])
->name('verify.new.email');
Route::post('/login',[AuthController::class,'login']);
Route::post('/login/Secretary',[AuthController::class,'SecretaryLogin']);
Route::post('/logout/{type}/{id}', [AuthController::class , 'logout']);

//Admin api
//for me
Route::get('firstAdmin' , [AdminController::class , 'AddFirstAdmin']);
//for sireen
Route::get('secondAdmin' , [AdminController::class , 'AddSecondAdmin']);
//for accept or reject doctors depend on them documents
Route::post('/AcceptOrReject/{doctorId}' , [AdminController::class , 'acceptOrRejectDoctor']);
//for show all doctor
Route::get('/show/doctor' , [AdminController::class , 'getAllDoctors']);
//for delete doctor
Route::delete('/delete/doctor/{doctorId}', [AdminController::class, 'deleteDoctor']);
//for show admin information
Route::post('/show/admin/info/{id}' , [AdminController::class , 'getAdminById']);
//for get document and doctor info
Route::get('/admin/file-info', [AdminController::class, 'getFileAndDoctorInfo']);
//for get images
Route::get('/get/images' , [AdminController::class , 'getImages']);


//Notification api
Route::post('/allNotifications',[NotificationController::class,'GetNotifications']);
Route::post('/unreadNotificationCount',[NotificationController::class,'GetNotificationCount']);
Route::post('/markAsRead/{notificationID}',[NotificationController::class,'markAsRead']);


//Chat api
//first function openChat
//it's work
Route::post('/open-chat/{user_type}/{user_id}/{other_user_id}' , [ChatController::class , 'openChat']);
//second function sendMessage
//it's work
Route::post('/send-message/{sender_id}/{receiver_id}', [ChatController::class, 'sendMessage']);
//third function showMessages
//it's work
Route::post('/show-messages/{id}',[ChatController::class , 'showMessages']);
//forth function showChat
//it's work
Route::post('/show-chat/{id}' , [ChatController::class , 'showChat']);
//fifth function GetChatById
//it's work
Route::post('/get-chat/{id}' , [ChatController::class , 'GetChatByID']);

//sixth function deleteChat
//it's work
Route::post('/delete-chat/{id}/{user_id}' , [ChatController::class , 'deleteChat']);

//doctor api
// it's work
Route::get('/get/doctors' , [DoctorController::class ,'getAllDoctor']);
Route::post('/doctorInfo/{doctorId}' , [DoctorController::class ,'DoctorInfo']);
Route::post('/doctorArticles/{doctorId}' , [DoctorController::class ,'DoctorArticles']);

//this section for the HomeController
Route::post('BestArticles' , [HomeController::class ,'BestArticles']);
Route::post('/best/doctor' , [HomeController::class ,'getBestDoctors']);
Route::post('/numbers' , [HomeController::class ,'numbers']);

//this section for the LikeController
// it's work
Route::post('/show/likes/{doctor_id}', [LikeController::class, 'showLikes']);
// it's work
Route::post('/add/like/{doctor_id}/{patient_id}', [LikeController::class ,'AddLike']);


//this function for the DisLike Controller
//it's work
Route::post('/add/dislike/{doctor_id}/{patient_id}' , [DislikeController::class , 'AddDislike']);
//it's work
Route::post('/show/dislike/{doctor_id}', [DislikeController::class ,'showDislikes']);

//this funcitons for Doctor verfiy controller
Route::post('/verfiy/{doctor_id}' , [DoctorVerfiyController::class , 'uploadFile']);


//this section for DoctorController
Route::post('/isVerfiy/{id}', [DoctorController::class , 'isVerfiyDoctor']);


Route::post('/Search' , [SearchController::class , 'Search']);


//articles section
//done
Route::get('Categories',[CategoriesController::class,'getAll']);
//done
Route::get('Categories/insert',[CategoriesController::class,'insert']);


//done
Route::post('Articles',[ArticlesController::class,'index']);
//done
Route::post('Articles/Liked',[ArticlesController::class,'Liked']);
//done
Route::post('Articles/cat/{catID}',[ArticlesController::class,'showCategory']);
//done
Route::post('Articles/upload',[ArticlesController::class,'store']);
//done
Route::post('Articles/content/{ArticleID}',[ArticlesController::class,'show']);
//done
Route::post('Articles/update/{ArticleID}',[ArticlesController::class,'update']);
//done
Route::post('Articles/update/content/{ArticleID}',[ArticlesController::class,'updateContent']);
//done
Route::post('/Articles/{ArticleID}/like',[ArticlesController::class,'like']);
//done
Route::post('/Articles/{ArticleID}/dislike',[ArticlesController::class,'dislike'] );
//done
Route::post('/Articles/cat/{ArticleID}/report',[ArticlesController::class,'report']);
//done
Route::post('Articles/delete/{ArticleID}',[ArticlesController::class,'destroy']);


//pending articles section
Route::post('Articles/pending',[PendingArticlesController::class,'showPending']);
Route::post('Articles/pending/{ArticleID}',[PendingArticlesController::class,'pendingContent']);
Route::post('Articles/pending/{ArticleID}/accept',[PendingArticlesController::class,'articleAccept']);
Route::post('Articles/pending/{ArticleID}/reject',[PendingArticlesController::class,'articleReject']);
Route::post('Articles/myPending',[PendingArticlesController::class,'showDoctorArticles']);


//settings section
//done
Route::post('Settings/delete',[SettingsController::class,'destroy']);
//done
Route::post('Settings/ChangePassword',[SettingsController::class,'ChangePassword']);
//done
Route::post('Settings/info',[SettingsController::class,'show']);
Route::post('Settings/AccountInfo',[SettingsController::class,'updateAccount']);
Route::post('Settings/getPersonalInfo',[SettingsController::class,'getPersonalInfo']);
Route::post('Settings/PersonalInfo',[SettingsController::class,'PersonalInfo']);

Route::post('AddSecretary',[SecretaryController::class,'AddSecretary']);
Route::post('Settings/SecretaryInfo',[SecretaryController::class,'UpdateSecretary']);
Route::post('Settings/getSecretaryInfo',[SecretaryController::class,'getSecretaryUserName']);

Route::post('recurringSchedules',[AppointmentController::class,'addSchedule']);
Route::post('getSchedules',[AppointmentController::class,'getSchedule']);
Route::post('AddAppointment',[AppointmentController::class,'AddAppointment']);
Route::post('getReservedAppointments',[AppointmentController::class,'getReservedAppointments']);
Route::post('DeleteAppointment',[AppointmentController::class,'DeleteAppointment']);
Route::post('ApproveAppointment',[AppointmentController::class,'approveAppointment']);
Route::post('AddInfo',[PatientInformationController::class,'AddInfo']);
Route::post('getInfo',[PatientInformationController::class,'getInfo']);
Route::post('setBanks',[AppointmentController::class,'setBanks']);
Route::post('PaidAppointment',[AppointmentController::class,'PaidAppointment']);
Route::post('DoneAppointment',[AppointmentController::class,'DoneAppointment']);
Route::post('haveAppointment',[AppointmentController::class,'haveAppointment']);
Route::post('AddComplaint',[ComplaintController::class,'AddComplaint']);
Route::post('getComplaints',[ComplaintController::class,'getComplaints']);
Route::post('markComplaintAsDone',[ComplaintController::class,'markComplaintAsDone']);
Route::post('deleteComplaint',[ComplaintController::class,'deleteComplaint']);
Route::get('/get/patients' , [PatientController::class ,'getAllPatientInfo']);
Route::post('getPatientNotes' , [PatientController::class ,'getPatientNotes']);
Route::post('addSessionNote' , [AppointmentController::class ,'addSessionNote']);
Route::post('endSession' , [AppointmentController::class ,'endSession']);
Route::post('breakSession' , [AppointmentController::class ,'breakSession']);
Route::post('SearchAppointment' , [SearchController::class ,'SearchAppointment']);
Route::post('AddNotesSummarization' , [PatientInformationController::class ,'AddNotesSummarization']);
//---------------Khaled-------------------


//this section for the Posts
// on the test
Route::post('/posts', [PostController::class, 'store']);
//on the test
Route::get('/posts/{id}', [PostController::class, 'show']);
//on the test
Route::get('/get/posts' , [PostController::class, 'getAllPosts']);
//on the test
Route::post('/add/post/like/{post_id}/{patient_id}' , [PlikeController::class , 'addPostLike']);
//on the test
Route::get('/get/post/like/{post_id}' , [PlikeController::class , 'showPostLikes']);
//on the test
Route::get('get/suggestion/post/{id}' , [PostController::class , 'suggestionPost']);
//on the test
Route::get('/delete/post/{id}', [PostController::class , 'deletePost']);
//on the test
Route::get('doctor/post/{id}' , [PostController::class , 'getPostSharedByDoctor']);
//on the test
Route::post('/add/post/dlike/{post_id}/{patient_id}' , [DlikeController::class , 'addPostDlike']);
//on the test
Route::get('/get/post/dlike/{post_id}' , [DlikeController::class , 'showPostDlikes']);
//on the test
Route::get('/get/post/by/category/{category}' , [PostController::class , 'getPostsBySameCategory']);