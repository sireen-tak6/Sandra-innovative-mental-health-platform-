<?php

namespace App\Http\Controllers;

use App\Models\Patient;
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
        $users = Patient::all();
        return response()->json(
            ['message' => 'fetching all patients information successfully.'
            ,'patients'=>$users]
        ); 
    }
    

}