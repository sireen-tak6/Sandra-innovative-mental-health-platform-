<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;

class DoctorController extends Controller
{
   //this fucntion for get all doctors 
   public function getAllDoctor()
   {
       $doctor = Doctor::orderBy('created_at', 'desc')->get();
       return response([
           'doctors' => $doctor
           ,
           'message' => 'Fetch all doctor successfully '
       ]);

   }
}