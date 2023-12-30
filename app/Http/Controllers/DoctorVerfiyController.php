<?php

namespace App\Http\Controllers;

use App\Models\DoctorVerfiy;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; 

class DoctorVerfiyController extends Controller
{

    //this function for verfiy the doctor by his or her document or photo it's work
    // in the front i have to send the doctor id with the document or photp 
    public function uploadFile(Request $request, $doctorId)
    { 
        // Check if a file already exists for the doctor
        $existingFile = DoctorVerfiy::where('doctor_id', $doctorId)->first();
        if ($existingFile) {
            $existingFile->delete(); 
             // Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,pdf|max:2048', // Adjust the allowed file types and maximum size as needed
        ]);
        // Get the file from the request
        $file = $request->file('file');
        // Generate a unique file name
        $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
        // Save the file to a designated storage location
        //$file->storeAs('app/uploads', $fileName);
        //$file->storeAs('public/storage' , $fileName );
        Storage::disk('public')->putFileAs('app/uploads' , $request->file , $fileName);   
       try{
           $fileModel = new DoctorVerfiy();
           
           $fileModel->filename = $fileName;
           $fileModel->original_filename = $file->getClientOriginalName();
           $fileModel->doctor_id = $doctorId; // Associate the file with the doctor
           $fileModel->isVerfiy = 0; 
           $fileModel->save();
        } // Save the file information in the database
        catch (\Exception $e) {
            return response()->json([
                'message' => $e,
                'document' => $fileModel
            ]);
        }
        // Return a response with the uploaded file information
        return response()->json([
            'message' => 'File uploaded successfully',
            'document' => $fileModel
        ]);
        }
    
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,pdf|max:2048', // Adjust the allowed file types and maximum size as needed
        ]);
    
        // Get the file from the request
        $file = $request->file('file');
    
        // Generate a unique file name
        $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
    
        // Save the file to a designated storage location
        //$file->storeAs('app/uploads', $fileName); 
        //$file->storeAs('storage' , $fileName);
        Storage::disk('public')->putFileAs('app/uploads' , $request->file , $fileName);   
        

        // Save the file information in the database
        $fileModel = new DoctorVerfiy();
        $fileModel->filename = $fileName;
        $fileModel->original_filename = $file->getClientOriginalName();
        $fileModel->doctor_id = $doctorId; // Associate the file with the doctor
        $fileModel->isVerfiy = 0; 
        $fileModel->save();
    
        // Return a response with the uploaded file information
        return response()->json([
            'message' => 'File uploaded successfully',
            'document' => $fileModel
        ]);
    }
}