<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\Admin;
use App\Models\Patient;
use Illuminate\Support\Facades\Hash;
use League\CommonMark\Extension\SmartPunct\EllipsesParser;
use Illuminate\Support\Facades\Log;


class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

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
                'email' => 'required|email|string|unique:doctors,email',
               
            ]);
            $user=Doctor::find($userID);
        }
        else if($request->input('userType')==="admin"){
            return response()->json(['status'=>400,'message'=> "you can't update your account information"]);

        }
        else if($request->input('userType')==="patient"){
            $validator = $request->validate([
                'userName' => 'required|string',
                'email' => 'required|email|string|unique:patients,email',
                'userID' => 'required|integer', 
                'userType'=>'required|string'
            ]);
            $user=Patient::find($userID);
        }
        else{
            return response()->json(['status'=>400,'message'=> 'You must login first']);
        }
        if(!$user){
            return response()->json(['status'=>400,'message'=> 'user not found']);
        }
            try {    
                $user->email=$request->input('email');
                $user->user_name=$request->input('userName');
                $user->save();
                return response()->json(['status'=>200,'message'=> 'your password has been updated successfully']);
            } catch (\Exception $e) {
                return response()->json(['status'=>500,'message'=> 'Something went wrong']);
            }
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