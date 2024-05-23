<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\SecretaryRequest;
use App\Models\Secretary;
use Illuminate\Support\Facades\Auth;

class SecertaryController extends Controller
{
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
}