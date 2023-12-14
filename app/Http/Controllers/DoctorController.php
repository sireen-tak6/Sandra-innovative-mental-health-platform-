<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\Article;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
class DoctorController extends Controller
{
    //this fucntion for get all doctors 
    public function getAllDoctor()
    {
       $doctor = Doctor::orderBy('created_at', 'desc')->get();
       return response([
           'doctors' => $doctor
           ,
           'message' => 'Fetch all doctor successfully '
       ]);

    }
    public function DoctorInfo($doctorId){
        try{
            
            $doctor=Doctor::find($doctorId);
            return response()->json(['status'=>200,'doctor'=>$doctor]);
        }
        catch(\Exception $e){
            return response()->json(['status'=>500,'message'=> $e]);

        }
    }
    public function DoctorArticles($doctorId){
        $articles=Article::where("doctorID",$doctorId)->where('status', 'published')->with('Category')->get();
        foreach ($articles as $article) {
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
}