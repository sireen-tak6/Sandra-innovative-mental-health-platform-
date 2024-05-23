<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\SignupRequestDoctor;

use App\Models\Doctor;
use App\Models\Admin;
use App\Models\Patient;
use App\Models\Secretary;
use App\Mail\SignupVerificationEmail; 
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use League\CommonMark\Extension\SmartPunct\EllipsesParser;
use App\Mail\DoctorVerificationEmail;


class AuthController extends Controller
{

    // signup funciton for patients 
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();


        $user = new Patient;
        $idExists = true;

        while ($idExists) {
            $uniqueId = mt_rand(100000, 999999); // Generate a random ID

            // Check if the generated ID exists in the Doctor model
            $idExists1 = Doctor::where('id', $uniqueId)->exists();
            $idExists3=Patient::where('id', $uniqueId)->exists();
            $idExists=$idExists1||$idExists3;
        }
        $verificationToken = Str::random(32);

        $user->id = $uniqueId;
        $user->user_name = $data['user_name'];
        $user->email = $data['email'];
        $user->password = bcrypt($data['password']);
        $user->verification_token = $verificationToken;
        $user->save();
        
        Mail::to($user->email)->send(new SignupVerificationEmail($user));
        $token = $user->createToken('token')->plainTextToken;


        return response([
            'user' => $user,
            'token' => $token,
            'message' => "Now dear you have to verify your email to complete signup , and can login to our website"

        ]);
    }
 //this function for doctor signup 
 public function signupDoctor(SignupRequestDoctor $request)
 {
     try {
         $data = $request->validated();
         // Generate a verification token
         $verificationToken = Str::random(32);
         if (isset($data['id'])) {
            $existingPatient = Patient::where('id', $data['id'])->first();
            $existingDoctor = Doctor::where('id', $data['id'])->first();
            if ($existingPatient||$existingDoctor) {
                // Generate a new unique ID for the doctor
                $newId = $this->generateUniqueDoctorId();
                $data['id'] = $newId;
            }
        }
         $user = Doctor::create([
             'user_name' => $data['user_name'],
             'email' => $data['email'],
             'password' => bcrypt($data['password']),
             'id' => $data['id'] ?? null,

         ]);
         // Assign the verification token to the doctor's record
         $user->verification_token = $verificationToken;
         $user->save();
         Mail::to($user->email)->send(new DoctorVerificationEmail($user));
         $token = $user->createToken('token')->plainTextToken;

         return response(['status'=>200,
             'user' => $user,
             'token' => $token,
             'message' => ['Now you have to verify you email and enjoy in our services.']
         ]);
     } catch (er) {

         return response(['error' => ['error' => 'someting went wrong']], 0);
     }
 }
 //this function just for generate unique id for the doctor after check if the id exist in the patient model 
 private function generateUniqueDoctorId()
 {
     $newId = mt_rand(1000000, 9999999); // Generate a random ID
     $existingPatient = Patient::where('id', $newId)->first();
     $existingDoctor = Doctor::where('id', $newId)->first();

     if ($existingPatient||$existingDoctor) {
         // If the generated ID already exists in the Patient model, generate a new one recursively
         return $this->generateUniqueDoctorId();
     }
     return $newId;
 }
 //this function to verify the patient email before create the record of the doctor 
 public function verifyEmailUser($token)
 {
     // Find the patient with the given verification token
     $patient = Patient::where('verification_token', $token)->first();

     // If the patient is not found, return an error response
     if (!$patient) {
         return response()->json(['error' => 'Invalid verification token.'], 400);
     }

     $patient->email_verified_at = Carbon::parse($patient->email_verified_at);
     $email_verified_at = $patient->email_verified_at->toDateTimeString();
     $patient->save();

     // Update the patient's status as verified and clear the verification token
     $patient->update([
         'email_verified_at' => $email_verified_at,
     ]);

     // Pass data to the view
     $data = [
         'message' => 'Email verification successful. You can now log in.',
         'email_verified_at' => $email_verified_at,
     ];

     // just to show the view 
     return view('verification-success', $data);
 }
 //this function to verify the doctor email before create the record of the doctor 
 public function verifyEmail($token)
 {
     // Find the doctor with the given verification token
     $doctor = Doctor::where('verification_token', $token)->first();
     // If the doctor is not found, return an error response
     if (!$doctor) {
         return response()->json(['error' => 'Invalid verification token.'], 400);
     }
     $doctor->email_verified_at = Carbon::parse($doctor->email_verified_at);
     $email_verified_at = $doctor->email_verified_at->toDateTimeString();
     $doctor->save();
     // Update the doctor's status as verified and clear the verification token
     $doctor->update([
         'email_verified_at' => $email_verified_at,
     ]);
     // Return a success response
     $data=[
         'message' => 'Email verification successful , You can now log in.',
         'email_verified_at' => $email_verified_at
     ];
     return view('verification-success', $data);

 }
     // login function

     public function login(LoginRequest $request)
     {
         $user = null;
 
 
 
         if (Patient::where('email', $request->email)->first()) {
             $user = Patient::where('email', $request->email)->first();
             $passwordHash = $user->password;
             if($user->email_verified_at != null)
             { 
               if (Hash::check($request->password, $passwordHash)) {
                   $user_id = $user->id;
                   $user->available = 1; // Update the available attribute to 1
                   $user->save();
                   $token = $user->createToken('token')->plainTextToken;
                   $macAddr = exec('getmac');

                   return response()->json([
                    'user' => $user,
                    'user_id' => $user_id,
                    "token" => $token,
                    'user_type' => 'patient',

                ]);
            } else {
                return response()->json([
                    'error' => 'The Email or Password Not Correct',
                ]);
            }
             } else {
                 return response()->json([
                    "message" => "you have to verify your email before login"
                 ]);
             }
 
         } else if (Doctor::where('email', $request->email)->first()) {
            $user = Doctor::where('email', $request->email)->first();
            $passwordHash = $user->password;
            if ($user->email_verified_at != null) {
                if (Hash::check($request->password, $passwordHash)) {
                    $user_id = $user->id;
                    $user->available = 1; // Update the available attribute to 1
                    $user->save();
                    $token = $user->createToken('token')->plainTextToken;
                    
                    return response()->json([
                        'user' => $user,
                        'user_id' => $user_id,
                        'token' => $token,
                        'Secretary'=>$user->Secretary()!==null,
                        'user_type' => 'doctor',
                        'message' => 'Email verify successfully',
                        

                    ]);
                } else {
                    return response()->json([
                        'message' => 'Password or Email Not Correct',
                    ]);
                }
            } else {
                return response()->json(["message" => "you have to verify your email"]);
            }
        } else if (Admin::where('email', $request->email)->first()) {
            $user = Admin::where('email', $request->email)->first();
            $passwordHash = $user->password;
            if (Hash::check($request->password, $passwordHash)) {
                $user = Admin::where('email', $request->email)->first();
                $user_id = $user->id;
                $token = $user->createToken('token')->plainTextToken;
              
                return response()->json([
                    'user' => $user,
                    'user_id' => $user_id,
                    'token' => $token,
                    'user_type' => 'admin',
                    'user_name'=>$user->user_name

                ]);
            } else {
                return response()->json([
                    'error' => 'The Password or Email Not Correct ',
                ]);
            }
        } /*else if (Secertarie::where('email', $request->email)->first()) {
            $user = Secertarie::where('email', $request->email)->first();
            $passwordHash = $request->password;
            if (Hash::check($request->password, $passwordHash)) {
                $user_id = $user->id;
                $token = $user->createToken('token')->plainTextToken;
              
                return response()->json([
                    'user' => $user,
                    'user_id' => $user_id,
                    'token' => $token,
                    'user_type' => 'admin',
                    'user_name'=>$user->user_name

                ]);
            } else {
                return response()->json([
                    'error' => 'The Email or Password Not Correct',
                ]);
            }

        } */else {
            return response()->json([
                'error' => 'Invalid User',
            ]);
        }
    }
    
    public function SecretaryLogin(Request $request)
    {
        $user = null;
        if ($user=Secretary::where('user_name', $request->UserName)->first()) {
           $passwordHash = $user->password;
           if (Hash::check($request->password, $passwordHash)) {
               $user_id = $user->id;
               $token = $user->createToken('token')->plainTextToken;
               return response()->json([
                   'user' => $user,
                   'user_id' => $user_id,
                   'token' => $token,
                   'user_type' => 'secretary',
                   'user_name'=>$user->user_name

               ]);
           } else {
               return response()->json([
                   'error' => 'The User Name or Password Not Correct',
               ]);
           }

       } else {
           return response()->json([
               'error' => 'Invalid User',
           ]);
       }
   }
    public function logout($type, $id)
    {
        if ($type == "patient") {
            $user = Patient::find($id);
            if ($user) {
                $user->available = 0;
                $user->save();
                return response()->json(['message' => 'Patient logged out successfully']);
            }
        } else if ($type == "doctor") {
            $user = Doctor::find($id);
            if ($user) {
                $user->available = 0;
                $user->save();
                return response()->json(['message' => 'Doctor logged out successfully']);
            }
        } else {
            return response()->json(['message' => 'Invalid user']);
        }
    }


} 