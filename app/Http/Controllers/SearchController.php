<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Doctor;
use App\Models\Article;
use App\Models\Patient;
use App\Models\Appointment;
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
    public function SearchAppointment(Request $request)
    { 
        $userID=intval($request->userID);
        $userType=$request->userType;
        $query=$request->input('query');
        $appointments=[];
        $Doctors=Doctor::search($query)->get();
        $Patients=Patient::search($query)->get();
        $existingAppointmentIDs = []; // Track existing appointment IDs
        $searchResults = Appointment::search($query)->get();
        $appointmentIDs = $searchResults->pluck('id')->toArray();
        if($userType=="patient"){
            $app3 = Appointment::whereIn('id', $appointmentIDs)
            ->where('patientID',$userID)->where('type','!=' ,'Canceled')->with('doctor','patient')->get();
    
        }
        else if($userType=="admin"){
            $app3 = Appointment::whereIn('id', $appointmentIDs)->with('doctor','patient')
            ->get();

        }
        else{
            if($userType=="secretary")
            {
                $secretary=Secretary::find($userID);
                $doctorID=$secretary->doctorID;
                $app3=Appointment::whereIn('id', $appointmentIDs)
                ->where('doctorID',$doctorID)->where('type','!=','Canceled')->with('doctor','patient')->get();
                
            }
            else{
                if($userID==$doctor->id){
                    $app3=Appointment::whereIn('id', $appointmentIDs)
                    ->where('doctorID',$doctorID)->where('type','!=','Canceled')->with('doctor','patient')->get();
                }
            }
        }
        foreach ($app3 as $appointment) {
            if (!in_array($appointment->id, $existingAppointmentIDs)) {
                $appointments[] = $appointment;
                $existingAppointmentIDs[] = $appointment->id;
            }
        }
        foreach ($Doctors as $doctor) {
            try {
                if($userType=="patient"){
                    $app=Appointment::where('doctorID',$doctor->id)->where('patientID',$userID)->where('type','!=','Canceled')->with('doctor','patient')->get();
                }
                else if($userType=="admin"){
                    $app=Appointment::where('doctorID',$doctor->id)->with('doctor','patient')->get();
                }
                else{
                    if($userType=="secretary")
                    {
                        $secretary=Secretary::find($userID);
                        $doctorID=$secretary->doctorID;
                        if($doctor->id==$doctorID){
                            $app=Appointment::where('doctorID',$doctor->id)->where('type','!=','Canceled')->with('doctor','patient')->get();
                        }
                    }
                    else{
                        if($userID==$doctor->id){
                            $app=Appointment::where('doctorID',$doctor->id)->where('type','!=','Canceled')->with('doctor','patient')->get();
                        }
                    }
                    
                }
            } catch (\Exception $e) {
                return response()->json(['status'=>500,'message'=> 'Error retrieving text content']);
            }
            foreach ($app as $appointment) {
                if (!in_array($appointment->id, $existingAppointmentIDs)) {
                    $appointments[] = $appointment;
                    $existingAppointmentIDs[] = $appointment->id;
                }
            }
        };  
        foreach ($Patients as $patient) {
            try {
                if($userType=="patient"&&$patient->id==$userID){
                    $app2=Appointment::where('patientID',$patient->id)->where('type','!=','Canceled')->with('doctor','patient')->get();
                }
                else if($userType=="admin"){
                    $app2=Appointment::where('patientID',$patient->id)->with('doctor','patient')->get();

                }
                else{
                    if($userType=="secretary")
                    {
                        $secretary=Secretary::find($userID);
                        $doctorID=$secretary->doctorID;
                        $app2=Appointment::where('doctorID',$doctorID)->where('patientID',$patient->id)->where('type','!=','Canceled')->with('doctor','patient')->get();
                        
                    }
                    else{
                        $app2=Appointment::where('doctorID',$userID)->where('patientID',$patient->id)->where('type','!=','Canceled')->with('doctor','patient')->get();
                    }  
                }
            } catch (\Exception $e) {
                return response()->json(['status'=>500,'message'=> 'Error retrieving text content']);
            }
            foreach ($app2 as $appointment) {
                if (!in_array($appointment->id, $existingAppointmentIDs)) {
                    $appointments[] = $appointment;
                    $existingAppointmentIDs[] = $appointment->id;
                }
            }
        }
            
        return response()->json(['status'=>200,'appointments'=>$appointments]);
        
    }
    
}