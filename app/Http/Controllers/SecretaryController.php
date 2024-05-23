<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\SecretaryRequest;
use App\Models\Secretary;
use App\Models\Doctor;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SecretaryController extends Controller
{
    //add new secretary account (only one for each doctor)
    public function AddSecretary(SecretaryRequest $request){
        $data = $request->validated();
        $userID=intval( $data['userID']);
        $userType=$data['userType'];
        if($userType=="doctor"){
            $user=Secretary::where('doctorID',$userID)->limit(1)->first();
            if($user){
                return response()->json(['status'=>404,'message'=> "you already have a secretary account"]);
            }
            else{
                
                $user = new Secretary();
                try{
                    $user->user_name = $data['user_name'];
                    $user->password = bcrypt($data['password']);
                    $user->doctorID=$userID;
                    $user->save();
                    $token = $user->createToken('token')->plainTextToken;
                    return response([
                        'status'=>200,
                        'user' => $user,
                        'token' => $token,
                        'message' => "Your secretary account added successfully."
                    ]);
                }catch (\Exception $e) {
                    return response()->json(['status'=>500,'message'=> 'the process in error']);
                }
            }
        }
        else{
            return response()->json(['status'=>404,'message'=> "you can't add secretary"]);
        }        
    }
    
    //change secretary's info 
    public function UpdateSecretary(Request $request)
    {
        $userType=$request->input('userType');
        $userID=intval( $request->input('userID'));
        if ($request->input('userType')==="doctor") {
            $validator = $request->validate([
                'userName' => 'required|string',
                'changeUserName'=>'required|integer',
                'changePassword'=>'required|integer'
            ]);
            if($request->input('changePassword') ){
                $validator2 = $request->validate([
                    'SecretaryPassword' => 'required|string',
                    'ConfirmPassword' => 'required|string',
                    'password'=>'required|string',
                ]); 
            }
            if($request->input('changeUserName'))
            {
                $validator3 = $request->validate([
                    'userName' => 'required|string|unique:secretaries,user_name',
                ]);
            }
            $user=Doctor::find($userID);
        }
        else if($userType){
            return response()->json(['status'=>400,'message'=> "you can't update your account information"]);

        }
        else{
            return response()->json(['status'=>400,'message'=> 'You must login first']);
        }
        if(!$user){
            return response()->json(['status'=>400,'message'=> 'user not found']);
        }
        
        try {   
            if($request->input('changePassword')==1){
                $passwordHash = $user->password;
                if (Hash::check($request->input('password'), $passwordHash)) {
                    if($request->input('SecretaryPassword')==$request->input('ConfirmPassword')){
                        $user->Secretary->password=bcrypt($request->input('SecretaryPassword'));
                        $user->Secretary->save();
                        return response()->json(['status'=>200,'message'=> 'the password changed successfully']);
                    }
                }
                else{
                    return response()->json(['status'=>404,'message'=> 'your password is wrong']);
                }
            }
            if($request->input('changeUserName')==1){
                $user->Secretary->user_name=$request->input('userName');        
                $user->Secretary->save();
            }
            return response()->json(['status'=>200,'message'=> 'your information has been updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['status'=>500,'message'=> $e->getMessage()]);
        }
    }

    
    //get secretary username for settings page 
    public function getSecretaryUserName(Request $request)
    {
        $validator = $request->validate([
            'userType' => 'required|string',
            'userID'=>'required|integer|exists:doctors,id'
        ]);
        $userType=$request->input('userType');
        $userID=intval( $request->input('userID'));
        if($userType=="doctor"){
            try {   
                $secretary=Secretary::where('doctorID',$userID)->limit(1)->first();
                if($secretary){
                    return response()->json(['status'=>200,'secretary'=>$secretary ]);
                }
                else{
                    return response()->json(['status'=>200,'message'=> 'your information has been updated successfully']);
                }
            
            } catch (\Exception $e) {
                return response()->json(['status'=>500,'message'=> 'Something went wrong']);
            }
        }
    }
 
}