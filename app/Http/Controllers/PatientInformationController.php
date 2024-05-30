<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Secretary;
use App\Models\DoctorVerfiy;
use App\Models\Schedule;
use App\Models\Doctor;
use App\Models\Article;
use App\Models\PatientInfo;
use Illuminate\Support\Facades\Hash;
use App\Models\Notification;


class PatientInformationController extends Controller
{
    // for adding schedule from doctor or secretary
    public function AddInfo(Request $request)
    {
       
        $userID=$request->userID;
        $userType=$request->userType;
        $data = json_decode($request->input('data'), true); // Decode JSON data
      
        if($userType=="patient"){
            $user=Patient::find($userID);
            if($user){
                $info=PatientInfo::where("patientID",$userID)->get();
                if(count($info)>0){
                    try{
                    $patientInfo = $info->first();
                    $patientInfo['data']=$data;
                    $patientInfo->save();
                    }catch(\Exception $e){
                        return response()->json(['status'=>500,'message'=> $e]);
            
                    }
                   
                }
                else{
                    try{
                        
                        $info=new PatientInfo();
                        $info->patientID=$userID;
                        $info['data']=$data;
                        $info->save();
                    }catch(\Exception $e){
                        return response()->json(['status'=>500,'message'=> $e]);
            
                    }
                }
                return response()->json([
                    'status' => 200,
                    'message' =>"your info added successfully" ,
                ]);
            }
            else{
                return response()->json([
                    'status' => 500,
                    'message' =>"user not found" ,
                ]);
            }
        }
        else{    
            return response()->json([
                'status' => 500,
                'message' =>"you can't add any informaion" ,
            ]);
        }
       
    }
    public function getInfo(Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        $patientID=$request->patientID;
        if($userType=="patient"){
            $Info=PatientInfo::where("patientID",$userID)->with('Patient')->get();
            if(count($Info)>0){
                return response()->json([
                    'status' => 200,
                    'Info' =>$Info,
                ]);
            }
            else{
                return response()->json([
                    'status' => 404,
                    'message' =>"you don't have any information yet" ,
                ]);
            }
        }  
        else if($userType=="admin"){
            return response()->json([
                'status' => 500,
                'message' =>"you don't have any information yet" ,
            ]);
        }      
        else{
            if($patientID){
                $Info=PatientInfo::where("patientID",$patientID)->with('Patient')->get();
                if(count($Info)>0){
                    return response()->json([
                        'status' => 200,
                        'Info' =>$Info,
                    ]);
                }
                else{
                    return response()->json([
                        'status' => 404,
                        'message' =>"this patient doesn't have any information yet" ,
                    ]);
                }

            }else{
                return response()->json([
                    'status' => 500,
                    'message' =>"you didn't choose a patient" ,
                ]); 
            }
        }
        
    }
    
}