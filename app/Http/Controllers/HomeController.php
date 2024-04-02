<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\Article;
use App\Models\Patient;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;


class HomeController extends Controller
{
    public function numbers(){
        $articles=Article::where('status', 'published')->count();
        $doctors=Doctor::where('email_verified_at' ,'!=', null)->count();
        $users=Patient::where('email_verified_at' ,'!=', null)->count();
        return response()->json(['status'=>200,'articles'=> $articles,'doctors'=>$doctors,'users'=>$users]);

    }
    public function BestArticles(){
        try{
            $articles = Article::where('status', 'published')->with('Category','Doctor')->orderBy('likes', 'desc')->get();
            foreach ($articles as $article) {
                $textPath = $article->content;
                try {    
                    $textContent = Storage::get($textPath);                    
                } catch (\Exception $e) {
                    return response()->json(['status'=>500,'message'=> 'Something went wrong']);
                }
                $article->content=$textContent;    
            }
            
            
            return response()->json(['status'=>200,'articles'=> $articles]);

        }
        catch(\Exception $e){
            return response()->json(['status'=>500,'message'=> $e]);

        }  
    }

    
    //this fucntion for get all doctors 
    public function getBestDoctors()
    {
        try{

            $doctors = Doctor::with("Category")->orderBy('points', 'desc')->get();
            $verifiedDoctors=$doctors->filter(function ($doctor) {
                return $doctor->isVerfiy;
            });
            foreach($verifiedDoctors as $doctor)
            {
                $doctor->likesCount = $doctor->DoctorLikes->count();
                
            }
            
            return response([
                'doctors' => $verifiedDoctors
                ,
                'message' => 'Fetch all doctor successfully '
            ]);
        }
        catch(\Exception $e){
            return response()->json(['status'=>500,'message'=> $e]);

        }            
    }

}