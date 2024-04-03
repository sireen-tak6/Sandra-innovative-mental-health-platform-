<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Doctor;
use App\Models\Article;
use App\Models\Patient;
use App\Models\Like;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class SearchController extends Controller
{
    public function Search(Request $request)
    { 
        $userID=$request->userID;
        $userType=$request->userType;
        $query=$request->input('query');
        $articles=[];
        $doctors=[];
        if($request->input('article')==='true'){
            if($userType==='patient'){
                $patient=Patient::find($userID);
                $articles=Article::search($query)->where('status', 'published')->get();
                foreach ($articles as $article) {
                    $isLiked = $patient->likedArticles->contains($article->id);
                    $article->isLiked = $isLiked;
                    $textPath = $article->content;
                    try {
                        $textContent = Storage::get($textPath);   
                    } catch (\Exception $e) {
                        return response()->json(['status'=>500,'message'=> 'Error retrieving text content']);
                    }
                    $article->content=$textContent;
                };  
            }
            else{
                $articles=Article::search($query)->where('status', 'published')->get();
                foreach ($articles as $article) {
                    $article->isLiked = true;
                    $textPath = $article->content;
                    try {
                        $textContent = Storage::get($textPath);   
                    } catch (\Exception $e) {
                        return response()->json(['status'=>500,'message'=> 'Error retrieving text content']);
                    }
                    $article->content=$textContent;
                }; 
            }
            $articles->load('Category', 'Doctor');
        }
        
        if($request->input('doctor')==='true'){
            $doctors=Doctor::search($query)->get();
            $doctors->load('Category');
            foreach ($doctors as $doctor) {
                $doctor->likesCount = $doctor->DoctorLikes->count();
                if($userType==='patient'){
                    $isLiked=Like::where('doctor_id',$doctor->id)->where('patient_id',$userID)->count();
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
            };  

        }
      

        if(!$doctors&&!$articles){
            return response()->json(['status'=>400,'message'=>'there is no result']);

        }
        else{
            return response()->json(['status'=>200,'doctors'=>$doctors,'articles'=>$articles,'message'=>$request->input('article')]);
        }
    }
    
}