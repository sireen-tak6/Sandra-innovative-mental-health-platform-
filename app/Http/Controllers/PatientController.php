<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PatientInfo;
use App\Models\SessionNote;

use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function getPatientById($id)
    {
        $user = Patient::where('id' , $id)->first(); 
        return response()->json(
            ['message' => 'fetching patient information\'s successfully .'
            , 'patient' => $user]
        ); 
    }

    public function getAllPatientInfo()
    {
        try{
            
            $users = Patient::with('information')->get();
            return response()->json(
                ['status' => 200
                ,'patients'=>$users]
            ); 
        
        }catch (\Exception $e) {  
            return response()->json(
                ['status' => 500
                ,'message'=>$e]
            ); 
        }
    }
    public function getPatientNotes(Request $request)
    {
        $userID=intval($request->userID);
        $patientID=intval($request->patientID);
        $userType=$request->userType;
        if($userType=="doctor"||$userType=="secretary"||($userType=="patient"&&$userID=$patientID)){
            try{
                $Notes = SessionNote::where('patientID',$patientID)->with('doctor','patient','appointment')->orderBy('created_at', 'desc')->get();
                return response()->json(
                    ['status' => 200
                    ,'Notes'=>$Notes]
                ); 
            }catch (\Exception $e) {  
                return response()->json(
                    ['status' => 500
                    ,'message'=>$e]
                ); 
            }
        }
        else{
            return response()->json(
                ['status' => 500
                ,'message'=>"You can't see patient's profiles."]
            ); 
        }
    }
    

}