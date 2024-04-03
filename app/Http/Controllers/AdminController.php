<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\DoctorVerfiy;
use App\Models\Doctor;
use App\Models\Article;
use Illuminate\Support\Facades\Hash;


class AdminController extends Controller
{
    public function AddFirstAdmin()
    {
        $Admin = new Admin();
        $Admin->id = 1 ;
        $Admin->user_name = 'khaled' ;
        $Admin->email = 'klora756@gmail.com' ;
        $Admin->password = Hash::make('klora1234');
        $Admin->save(); 
       return $Admin; 
    }
    public function AddSecondAdmin()
    {
        $Admin = new Admin();
        $Admin->id = 2 ;
        $Admin->user_name = 'Sireen' ;
        $Admin->email = 'sireentak@gmail.com' ;
        $Admin->password = Hash::make('123456789');
        $Admin->save(); 
       return $Admin;
    }
    public function acceptOrRejectDoctor(Request $request, $doctorId)
    {
        $request->validate([
            'action' => 'required|string|in:accept,reject',
        ]);
        $action = $request->input('action');
        $fileModel = DoctorVerfiy::where('doctor_id', $doctorId)->first();
        if (!$fileModel) {
            return response()->json(['message' => 'File not found for the specified doctor'], 404);
        } else {
            if ($action === 'accept') {
                $fileModel->isVerfiy = 1;
                $fileModel->save();
                return response()->json([
                    'message' => 'Doctor verification complete successfully , status updated successfully'
                    , 'DocumentInfo' => $fileModel
                    
                ]);
            } else {
                $fileModel->delete();
                return response()->json([
                    'message' => 'The request for verfiy rejected',
                ]);
            }
        }

    }

    public function getFileAndDoctorInfo()
    {
        // Retrieve file information where isVerify is 0
        $fileInfo = DoctorVerfiy::where('isVerfiy', 0)->get();

        // Retrieve doctor information related to the files
        $doctorIds = $fileInfo->pluck('doctor_id');
        $doctorInfo = Doctor::whereIn('id', $doctorIds)->get();

        // Get the image URLs based on the file information
        // $imageUrls = [];
        // foreach ($fileInfo as $file) {
        //     $imageUrl = Storage::disk('public')->url('app/uploads/'.$file->filename);
        //     //$imageUrl = "/app/uploads/"+$file->filename ; 
        //     $imageUrls[$file->id] = $imageUrl;
        // }
        // Return the file, doctor, and image information as JSON response
        return response()->json([
            // 'files' => $fileInfo,
            'doctors' => $doctorInfo,
            // 'imageUrls' => $imageUrls
        ]);
    }


    public function getAllDoctors()
    {
        $doctors = Doctor::all();
        foreach ($doctors as $doctor) {
            $doctor->likesCount = $doctor->DoctorLikes->count();
            $reportCount = Article::where('doctorID', $doctor->id)->sum('reports');
            $doctor->reportsCount=$reportCount;
        } 
        

        return response()->json(['doctors' => $doctors]);
    }


    public function getImages ()
    {
        //Retrieve all images from storage 
        $images = DoctorVerfiy::select('filename')->get(); 
        return response()->json([
            'images' => $images ,
            'message' => 'images fetching successfully',
        ]);
    }

    //this function it will depend on the rate of articles 
    public function deleteDoctor($doctorId)
    {
        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }

        // Delete associated messages first
        $chats = $doctor->chats;
        foreach ($chats as $chat) {
            $chat->messages()->delete();
        }

        // Delete associated likes
        $doctor->DoctorLikes()->delete();

        // Delete associated chats
        $doctor->chats()->delete();

        // Delete the doctor
        $doctor->delete();

        return response()->json(['message' => 'Doctor deleted successfully']);
    }


    // this function will updated from sireen 

    //     public function calculateArticlePercentage($articleId)
// {
//     $article = Article::find($articleId);

    //     if (!$article) {
//         return response()->json(['message' => 'Article not found'], 404);
//     }

    //     $likesCount = $article->likes()->count();
//     $dislikesCount = $article->dislikes()->count();

    //     $totalVotes = $likesCount + $dislikesCount;

    //     if ($totalVotes === 0) {
//         return response()->json(['message' => 'No votes found for the article'], 200);
//     }

    //     $likePercentage = ($likesCount / $totalVotes) * 100;
//     $dislikePercentage = ($dislikesCount / $totalVotes) * 100;

    //     return response()->json([
//         'like_percentage' => $likePercentage,
//         'dislike_percentage' => $dislikePercentage,
//     ]);
// }


    public function getAdminById($id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return response()->json(['message' => 'this admin does not exist']);
        } else {
            return response()->json([
                'admininfo' => $admin,
                'message' => 'Get Information of the admin complete it successfully . '
            ]);
        }
    }

}