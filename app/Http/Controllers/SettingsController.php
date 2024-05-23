<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\Admin;
use App\Models\Patient;
use App\Models\Secretary;
use Illuminate\Support\Facades\Hash;
use League\CommonMark\Extension\SmartPunct\EllipsesParser;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Models\Notification;

use Illuminate\Support\Facades\Mail;
use App\Mail\ChangeEmail;

class SettingsController extends Controller
{

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

     //show doctor's info
    public function show(Request $request)
    {
        
        $userID=intval( $request->input('userID'));

        if ($request->input('userType')==="doctor") {
            $user=Doctor::find($userID);
        }
        else if($request->input('userType')==="admin"){
            $user=Admin::find($userID);
        }
        else if($request->input('userType')==="patient"){
            $user=Patient::find($userID);
        }
        else{
            return response()->json(['status'=>400,'message'=> 'You must login first']);
        }
        if(!$user){
            return response()->json(['status'=>400,'message'=> 'user not found']);
        }
        return response()->json(['status'=>200,'user'=> $user]);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

     //change account password
    public function ChangePassword(Request $request)
    {
        $validator = $request->validate([
            'oldPassword' => 'required|string',
            'newPassword' => 'required|string',
            
        ]);

        $userID=intval( $request->input('userID'));
        
        if ($request->input('userType')==="doctor") {
            $user=Doctor::find($userID);
        }
        else if($request->input('userType')==="admin"){
            $user=Admin::find($userID);
        }
        else if($request->input('userType')==="patient"){
            $user=Patient::find($userID);
        }
        else if ($request->input('userType')==="secretary"){
            $user=Secretary::find($userID);
        } 
        else{
            return response()->json(['status'=>400,'message'=> 'You must login first']);
        }
        if(!$user){
            return response()->json(['status'=>400,'message'=> 'user not found']);
        }
        $passwordHash = $user->password;
        if (Hash::check($request->input('oldPassword'), $passwordHash)) {    
            try {    
                $user->password=bcrypt($request->input('newPassword'));
                $user->save();
                return response()->json(['status'=>200,'message'=> 'your password has been updated successfully']);
            } catch (\Exception $e) {
                return response()->json(['status'=>500,'message'=> 'Something went wrong']);
            }
        }
        else{
            return response()->json(['status'=>400,'message'=> 'Please check your old password']);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

     
 
    //change doctor's info 
    public function updateAccount(Request $request)
    {
        $userType=$request->input('userType');
        $userID=intval( $request->input('userID'));
        if ($request->input('userType')==="doctor") {
            $validator = $request->validate([
                'userName' => 'required|string',
                'email' => 'required|email|string',
                'changeUserName'=>'required|integer',
                'changeEmail'=>'required|integer'
            ]);
            if($request->input('changeEmail') ){
                $validator2 = $request->validate([
                    'password' => 'required|string',
                ]); 
            }
            $user=Doctor::find($userID);
        }
        else if($userType==="admin"){
            return response()->json(['status'=>400,'message'=> "you can't update your account information"]);

        }
        else if($userType==="patient"){
            $validator = $request->validate([
                'userName' => 'required|string',
                'email' => 'required|email|string',
                'userID' => 'required|integer', 
                'userType'=>'required|string',
                'changeUserName'=>'required|integer',
                'changeEmail'=>'required|integer'
            ]);
            if($request->input('changeEmail') ){
                $validator2 = $request->validate([
                    'password' => 'required|string',
                    'email' => 'required|email|string|unique:doctors,email|unique:patients,email',
                ]); 
            }
            $user=Patient::find($userID);
        }
        else{
            return response()->json(['status'=>400,'message'=> 'You must login first']);
        }
        if(!$user){
            return response()->json(['status'=>400,'message'=> 'user not found']);
        }
        
        try {   
            if($request->input('changeEmail')==1){

                $passwordHash = $user->password;
                if (Hash::check($request->input('password'), $passwordHash)) {
                    $verificationToken = Str::random(32);
                    $user->new_verification_token = $verificationToken;
                    $user->new_email=$request->input('email');
                    $user->save();
                    Mail::to($user->new_email)->send(new ChangeEmail($user));
                    $notification=new Notification();
                    $notification->Type="Email Change";
                    $notification->data=["newEmail"=>$user->new_email];
                    $notification->userID=$user->id;
                    $notification->userType=$userType;
                    $notification->save();
                    return response()->json(['status'=>200,'message'=> 'please verify your new email to complete the change']);

                   
                }
                else{
                    return response()->json(['status'=>404,'message'=> 'your password is wrong']);

                }
            }
            if($request->input('changeUserName')==1){
                $user->user_name=$request->input('userName');        
                $user->save();
            }
            return response()->json(['status'=>200,'message'=> 'your information has been updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['status'=>500,'message'=> 'Something went wrong']);
        }
    }
    public function verifyEmail($token)
    {
        // Find the doctor with the given verification token
        $doctor = Doctor::where('new_verification_token', $token)->first();
        $patient=Patient::where('new_verification_token',$token)->first();
        // If the doctor is not found, return an error response
        if (!$doctor&&!$patient) {
            return response()->json(['error' => 'Invalid verification token.'], 400);
        }
        if($patient){
            $user=$patient;
        }
        else{
          $user=$doctor;  
        }
        $user->email_verified_at = Carbon::parse($user->email_verified_at);
        $email_verified_at = $user->email_verified_at->toDateTimeString();
        $user->email=$user->new_email;
        $user->verification_token=$user->new_verification_token;
        $user->new_verification_token=NULL;
        $user->new_email=NULL;
        $user->save();
        // Update the doctor's status as verified and clear the verification token
        $user->update([
            'email_verified_at' => $email_verified_at,
        ]);
        // Return a success response
        $data=[
            'message' => 'Email verification successful , You can now log in.',
            'email_verified_at' => $email_verified_at
        ];
        $notification=new Notification();
        $notification->Type="Email verified";
        $notification->data=["email"=>$user->email];
        $notification->userID=$user->id;
        if($patient){
            $notification->userType="patient";
        }
        else{
            $notification->userType="doctor";
        }
        $notification->save();
        return view('change-success', $data);
   
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

     //delete the account
    public function destroy(Request $request)
    {
        
        $validator = $request->validate([
            'password' => 'required|string',
          
        ]);
        
        $userID=intval( $request->input('userID'));
        
        if ($request->input('userType')==="doctor") {
            $user=Doctor::find($userID);
        }
        else if($request->input('userType')==="admin"){
            return response()->json(['status'=>400,'message'=> "you can't delete your account"]);
        }
        else if($request->input('userType')==="patient"){
            $user=Patient::find($userID);
        }
        else{
            return response()->json(['status'=>400,'message'=> 'You must login first']);
        }
        if(!$user){
            return response()->json(['status'=>400,'message'=> 'user not found']);
        }
        $passwordHash = $user->password;
        if (Hash::check($request->input('password'), $passwordHash)) {
            try {    
                $user->delete();
                return response()->json(['status'=>200,'message'=> 'your account has been deleted successfully']);
            } catch (\Exception $e) {
                return response()->json(['status'=>500,'message'=> 'Something went wrong']);
            }
        }
        else{
            return response()->json(['status'=>400,'message'=> 'Please check your password']);
        }
    }
    
    public function PersonalInfo(Request $request)
    {
        $validatedData = $request->validate([
            'userID' => 'required|exists:doctors,id',
            'userType' => 'required|string', // Assuming 'user_type' is the key in the request
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'speciality' => 'nullable|integer|exists:speciality,id|',
            'about' => 'nullable|string',
            'university' => 'string|max:100|nullable',
            'gender'=>'boolean|nullable'

        ]);
        if($validatedData['userType']==="admin"||$validatedData['userType']==="patient"){
            return response()->json(['status'=>400,'message'=> "you can't update your personal information"]);

        }
        $doctor = Doctor::findOrFail($validatedData['userID']);
        if(!$doctor){
            // Find the doctor by ID
            return response()->json(['status'=>400,'message'=> 'user not found']);
        }
        try{
            // Update the doctor's information with the validated data
            $doctor->update($validatedData); 
            return response()->json(['status'=>200,'message'=> 'your personal information has been updated successfully']);
        }
        catch (\Exception $e) {
            return response()->json(['status'=>500,'message'=> 'Something went wrong']);
        }
        
    
        
    }
}