<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Article;
use App\Models\Like;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
class DoctorController extends Controller
{
    //this fucntion for get all doctors 
    public function getAllDoctor()
    {
       $doctor = Doctor::with("Category")->orderBy('created_at', 'desc')->get();

       return response([
           'doctors' => $doctor
           ,
           'message' => 'Fetch all doctor successfully '
       ]);

    }
    public function DoctorInfo($doctorId,Request $request){
        try{
           
            $userID=$request->userID;
            $userType=$request->userType;
            
            $doctor=Doctor::with("Category")->find($doctorId);
            if(!$doctor){
                return response()->json(['status'=>402,'message'=>"user not found"]);

            }
            $doctor->likesCount = $doctor->DoctorLikes->count();
            $doctor->articlesCount = $doctor->Articles()->where('status','published')->count();
            if($userType==="patient"){
                
                $isLiked=Like::where('doctor_id',$doctorId)->where('patient_id',$userID)->count();
                if($isLiked>0){
                    $doctor->isLiked=true;
                }
                else{
                    $doctor->isLiked=false;
                }
            }
            else{
                $doctor->isLiked=true;
            }
            return response()->json(['status'=>200,'doctor'=>$doctor]);
        }
        catch(\Exception $e){
            return response()->json(['status'=>500,'message'=> $e]);

        }
    }
    public function DoctorArticles($doctorId,Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        if($userType==='patient'){
            $patient=Patient::find($userID);
            $articles=Article::whereDoesntHave('reports', function ($query) use ($patient) {
                $query->where('patientID', $patient->id);
            })->where("doctorID",$doctorId)->where('status', 'published')->with('Category')->get();
            foreach ($articles as $article) {
                $isLiked = $patient->likedArticles->contains($article->id);
                $article->isLiked = $isLiked;
            }   
        }
        else{
            $articles=Article::where("doctorID",$doctorId)->where('status', 'published')->with('Category')->get();
            
        }
        foreach ($articles as $article) {
            $isLiked = false;
            $textPath = $article->content;
            try {
                $textContent = Storage::get($textPath);
            } catch (\Exception $e) {
                return response()->json(['status'=>500,'message'=> 'Something went wrong']);
            }
            $article->content=$textContent;
        }
        return response()->json(['status'=>200,'Articles'=>$articles]);
    }
    
    //this function for detect if this doctor is verfiy or not 
    public function isVerfiyDoctor($id)
    {
        $isVerfiy = DoctorVerfiy::select('isVerfiy')->where('doctor_id' , $id)->get(); 
        return response()->json(
            [
                'isVerfiy' => $isVerfiy, 
                'message' => 'the data fetching successfully' , 
            ]
        );
    }
}