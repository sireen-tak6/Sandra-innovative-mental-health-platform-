<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Notification;

class LikeController extends Controller
{




    //this function for give me best three doctor 
    public function BestThreeDoctor(Request $request)
    {
        $doctors = DB::table('likes')
            ->select('doctors.*')
            ->join('doctors', 'likes.doctor_id', '=', 'doctors.id')
            ->orderBy('likes.like', 'desc')
            ->take(3)
            ->get();

        return response()->json(
            [
                'doctors' => $doctors,
            ]
        );
    }

    //this function for adding like to the doctor ... still in work 
    public function AddLike($doctor_id, $patient_id)
    {
        $like = Like::where('doctor_id', $doctor_id)->where('patient_id', $patient_id)->first();
 
        if ($like) {
            // Delete the existing like record
            $like->delete();
            $notification=Notification::where('type','Like')->where('userID',$doctor_id)->where('data->patientID',$patient_id)->limit(1)->first();
            if($notification){
                $notification->delete();
            }

            $doctor=Doctor::find($doctor_id);
            $likes = $doctor->DoctorLikes->count();
            return response()->json(['message' => 'Like removed successfully','likes'=>$likes], 200);
        } else {
            // If the like record doesn't exist, create a new one
            $newLike = new Like();
            $newLike->doctor_id = $doctor_id;
            $newLike->patient_id = $patient_id;
            $newLike->like = 1;
            $newLike->save();
            $notification=Notification::where('type','Like')->where('userID',$doctor_id)->where('data->patientID',$patient_id)->whereNull("read_at")->limit(1)->first();
            if($notification){
                $notification->created_at=Carbon::now();
                $notification->save();   
            }
            else{
                $notification=new Notification();
                $notification->Type="Like";
                $notification->data=["patientID"=>$patient_id];
                $notification->userID=$doctor_id;
                $notification->userType="doctor";
                $notification->save();
            }
            $doctor=Doctor::find($doctor_id);
            $likes = $doctor->DoctorLikes->count();
            return response()->json(['message' => 'Like added successfully','likes'=>$likes], 200);
        }
    }

    //this function for show likes of the doctor .. still in work 
    public function showLikes($doctor_id)
{
    $like = Like::where('doctor_id', $doctor_id)->count();

    if ($like) {
        return response()->json(['likes' => $like], 200);
    } else {
        return response()->json(['likes' => 0 ]);
    }
}

}