<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Secretary;
use App\Models\Complaint;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use App\Models\Notification;
use Illuminate\Support\Facades\Storage;


class ComplaintController extends Controller
{
    public function markComplaintAsDone(Request $request){
        $validator=$request->validate([
            'userID'=>'required|exists:admins,id',
            'userType'=>'required|string|in:admin'  ,
            'complaintID'=>'required|exists:complaints,id'
        ]);
        $complaintID=intval( $request->input('complaintID'));

        try{
            $complaint=Complaint::find($complaintID);
            if($complaint && $complaint->status!="deleted"){
                $complaint->status="managed";
                $complaint->save();
                return response()->json(['status'=>200,'message' =>"Changes saved successfully."]);

            }
            else{
                return response()->json(['status'=>500,'message' =>"Complaint not exist."]);

            }
        }catch(\Exception $e){
            return response()->json(['status'=>500,'message'=>$e]);

        }
    }
    
    public function deleteComplaint(Request $request){
        $validator=$request->validate([
            'userID'=>'required|integer',
            'userType'=>'required|string|in:doctor,patient,secretary'  ,
            'complaintID'=>'required|exists:complaints,id'
        ]);
        $complaintID=intval( $request->input('complaintID'));
        $userID=intval( $request->input('userID'));

        try{
            $complaint=Complaint::find($complaintID);
            if($complaint)
            {
                if($request->userType=="secretary"){
                    $secretary=Secretary::find($userID);
                    $doctor=$secretary->doctor;
                    
                }
                if(($request->userType=="doctor"&&$complaint->doctorID=$userID)||($request->userType=="patient"&&$complaint->patientID=$userID)||(($request->userType=="secretary"&&$complaint->doctorID=$doctor->id))){
                    $complaint->status="deleted";
                    $complaint->save();
                    return response()->json(['status'=>200,'message' =>"Changes saved successfully."]);
                
                }
                else{
                    return response()->json(['status'=>500,'message' =>"You can't delete this complaint."]);

                }

            }
            else{
                return response()->json(['status'=>500,'message' =>"Complaint not exist."]);

            }
        }catch(\Exception $e){
            return response()->json(['status'=>500,'message'=>$e]);

        }
    }
    public function getComplaints(Request $request){
        $validator = $request->validate([
            'userID'=>'required|integer',
            'userType'=>'required|string|in:doctor,patient,secretary,admin',    
        ]);
        $userID=intval( $request->input('userID'));
        if($request->userType=="admin"){
            $complaints=Complaint::with('doctor','patient')->orderBy('created_at', 'desc')->get();
        }
        else{
            if($request->userType!=="patient"){
                if($request->userType=="secretary"){
                    $secretary=Secretary::find($userID);
                    $user=$secretary->doctor; 
                    $userID=$user->id;
                }
                $complaints=Complaint::where("doctorID",$userID)->where('status','!=','deleted')->with('Doctor')->get();           
            }
            else{
                $complaints=Complaint::where("patientID",$userID)->where('status','!=','deleted')->with('Patient')->get();              
            }
        }
        if($complaints){

            return response()->json(['status'=>200,'complaints' =>$complaints]);
        }
        else{
            return response()->json(['status'=>500,'message' =>"error"]);
        }
        
    }

    public function AddComplaint(Request $request)
    {
        $validator = $request->validate([
            'userID'=>'required|integer',
            'userType'=>'required|string|in:doctor,patient,secretary',
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'number' => 'required|string',
            'email' => 'required|email',
            'description' => 'required|string',
        ]);
        $images = $request->hasFile('photo0'); // Assuming the key in FormData is 'photos'

  
        try{
            $userID=intval( $request->input('userID'));
            $userType=$request->input('userType');
            if($userType=='secretary'){
                $secretary=Secretary::find($userID);
                $user=$secretary->doctor;
            }
            else{
                if($userType=="doctor"){
                    $user=Doctor::find($userID);
                }
                else{
                    $user=Patient::find($userID);
                }
            }
            if($user){
                $complaint=new Complaint();
                $complaint->firstName=$request->firstName;
                $complaint->lastName=$request->lastName;
                $complaint->number=$request->number;
                $complaint->email=$request->email;
                $complaint->description=$request->description;
                $complaint->status="waiting";
                $complaint->userType=$request->userType=="secretary"?"doctor":$request->userType;
                $complaint->patientID=$request->userType=="patient"?$user->id:null;
                $complaint->doctorID=$request->userType!="patient"?$user->id:null;
                $count=Complaint::count();
                $imagePath0=null;
                $imagePath1=null;
                $imagePath2=null;
                
                if($request->hasFile('photo0')){         
                    $imagefile=$request->file('photo0');
                    $imageextension =  Str::uuid()->toString() . '.' . $imagefile->getClientOriginalExtension();
                    $imagename0=$count.'.'.$imageextension;
                    $imagePath0 = $imagefile->Move('ComplaintsImages/',$imagename0);
                }if($request->hasFile('photo1')){         
                    $imagefile=$request->file('photo1');
                    $imageextension =  Str::uuid()->toString() . '.' . $imagefile->getClientOriginalExtension();
                    $imagename1=$count.'.'.$imageextension;
                    $imagePath1 = $imagefile->Move('ComplaintsImages/',$imagename1);
                }if($request->hasFile('photo2')){         
                    $imagefile=$request->file('photo2');
                    $imageextension =  Str::uuid()->toString() . '.' . $imagefile->getClientOriginalExtension();
                    $imagename2=$count.'.'.$imageextension;
                    $imagePath2 = $imagefile->Move('ComplaintsImages/',$imagename2);
                }
               
                
                // Encode the image array as JSON
                
                // Set the encoded JSON string to the 'images' field
                $complaint->firstImage = $imagePath0;
                $complaint->secondImage = $imagePath1;
                $complaint->thirdImage = $imagePath2;

                try{
                    $complaint->save();     
                    return response()->json(['status'=>200,'massage'=>"Your comaplint added successfully."]);
                }
                catch(\Exception $e){
                    return response()->json(['status'=>500,'message'=>"Something went wrong"]);

                }
            }           
            else{
                return response()->json(['status'=>500,'message' =>"No User"]);
            }
        }catch(\Exception $e){
            return response()->json(['status'=>500,'message' =>$e]);

        }
    }
}