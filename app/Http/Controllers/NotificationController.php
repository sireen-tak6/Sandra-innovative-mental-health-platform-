<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use App\Models\Notification;
use Illuminate\Support\Carbon;

class NotificationController extends Controller
{
    //this fucntion for get all doctors 
    public function GetNotificationCount(Request $request)
    {
        $userID=$request->userID;
        $unreadCount = Notification::where('userID', $userID)->where('type','!=','Chat')
                          ->whereNull('read_at')
                          ->count();
        return response()->json(['status'=>200,'notificationCount'=>$unreadCount]);
    

    }

    public function GetNotifications(Request $request)
    {
        $userID=$request->userID;
        $notifications = Notification::where('userID', $userID)->orderBy('created_at', 'desc')->get();
        return response()->json(['status'=>200,'notifications'=>$notifications]);
    }
    public function markAsRead($notificationID,Request $request)
    {
        $userID=$request->userID;
        $notification = Notification::find($notificationID);
        $notification->read_at=Carbon::now();
        $notification->save();
        return response()->json(['status'=>200,'status'=>"read",'read_at'=>$notification->read_at]);
    }
}