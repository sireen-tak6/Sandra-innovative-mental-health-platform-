<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Secretary;
use App\Models\DoctorVerfiy;
use App\Models\Schedule;
use App\Models\PatientInfo;
use App\Models\Doctor;
use App\Models\SessionNote;
use App\Models\Article;
use Illuminate\Support\Facades\Hash;
use App\Models\Notification;
use Carbon\Carbon;


class AppointmentController extends Controller
{
    // for adding schedule from doctor or secretary
    public function addSchedule(Request $request)
    {
        $userID=$request->userID;
        $userType=$request->userType;
        if($userType=="doctor"){
            $user=Doctor::find($userID);
            $doctorID=$userID;

        }
        else if($userType=="secretary"){
            $user=Secretary::find($userID);
            $doctorID=$user->doctorID;
        }
        else{    
            return response()->json([
                'status' => 500,
                'message' =>"you can't add any schedule" ,
            ]);
        }
        //turning to list from string
        $onsiteschedules = json_decode($request->onsite, true);
        $onlinsechedules = json_decode($request->online, true);
        $newTimes2=[];
        $newTimes=[];
        $removedTimes=[];
        $removedTimes2=[];

        //check new and removed times 
        if ($onlinsechedules !== null) {
            foreach ($onlinsechedules as $scheduleData) {
                $day = $scheduleData['day'];
                $existingTimes = Schedule::where('day', $day)->where('type','online')->pluck('start_time')->toArray(); // Get existing times for this day
                
                $newTimes = array_diff($scheduleData['times'], $existingTimes); // New times
                $removedTimes = array_diff($existingTimes, $scheduleData['times']); // Removed times
               
                // Process new times (store them in the database)
                foreach ($newTimes as $newTime) {
                    // Extract data and create a new Schedule object
                    $schedule = new Schedule([
                        'day' => $day,
                        'start_time' => $newTime,
                        'status'=>"availabe",
                        'type'=>"online",
                        'doctorID'=>$doctorID,
                    ]);
                    $schedule->save();
                }
            
                // Process removed times (delete them from the database)
                if (count($removedTimes) > 0) {
                    // Use IDs or filtering based on your approach
                    // Schedule::whereIn('id', $removedAppointmentIds)->delete();
                    // OR
                    Schedule::where('day', $day)->where('type',"online")
                    ->whereIn('start_time', $removedTimes)
                    ->delete();
                }
            }
        
        }
        if ($onsiteschedules !== null) {
            foreach ($onsiteschedules as $scheduleData2) {
                $day2 = $scheduleData2['day'];
                $existingTimes2 = Schedule::where('day', $day2)->where('type','onsite')->pluck('start_time')->toArray(); // Get existing times for this day
            
                $newTimes2 = array_diff($scheduleData2['times'], $existingTimes2); // New times
                $removedTimes2 = array_diff($existingTimes2, $scheduleData2['times']); // Removed times
            
                // Process new times (store them in the database)
                foreach ($newTimes2 as $newTime2) {
                    // Extract data and create a new Schedule object
                    $schedule2 = new Schedule([
                        'day' => $day2,
                        'start_time' => $newTime2,
                        'status'=>"availabe",
                        'type'=>"onsite",
                        'doctorID'=>$doctorID,
                    ]);
                    $schedule2->save();
                }
                
                // Process removed times (delete them from the database)
                if (count($removedTimes2) > 0) {
                    // Use IDs or filtering based on your approach
                    // Schedule::whereIn('id', $removedAppointmentIds)->delete();
                    // OR
                    Schedule::where('day', $day2)->where('type',"onsite")
                    ->whereIn('start_time', $removedTimes2)
                    ->delete();
                }
            }
        }

        //check for days not in the new lists
        $daysToDelete = array_diff(range(0, 6), array_column($onlinsechedules, 'day'));

        if (!empty($daysToDelete)) {
            Schedule::whereIn('day', $daysToDelete)
                ->where('type', 'online')
                ->delete();
        }
        $daysToDelete = array_diff(range(0, 6), array_column($onsiteschedules, 'day'));

        if (!empty($daysToDelete)) {
            Schedule::whereIn('day', $daysToDelete)
                ->where('type', 'onsite')
                ->delete();
        }
        
        return response()->json([
            'message' => 'Schedule created successfully!',
            'status' => 200,
            $newTimes,
            $newTimes2,
            $removedTimes,
            $removedTimes2,
        ]);
    }

    public function getSchedule(Request $request)
    {
        $userID=$request->userID;
        $userType=$request->userType;
        if($userType=="doctor"){
            $doctorID=$userID;

        }
        else if($userType=="secretary"){
            $user=Secretary::find($userID);
            $doctorID=$user->doctorID;
        }
        else if($userType=="patient"){
            $doctorID=$request->doctorID;
        }
        else{    
            return response()->json([
                'status' => 500,
                'message' =>"you can't add any schedule" ,
            ]);
        }        
        $onlinsechedules = [];
        $onsitesechedules = [];
        $days=range(0,6);
        try{
            $doctor=Doctor::find($doctorID);
            if(!$doctor){
                return response()->json(['status'=>404,'message' =>"this doctor not found"]);
            }
            foreach ($days as $day) {
                $times = Schedule::where('doctorID',$doctorID)->where('day',$day)->where('type','online')->pluck('start_time')->toArray(); // Get all times
                if(count($times)>0){
                    $onlinsechedules[] = [
                        'day' => $day,
                        'times' => $times,
                    ];
                }
                $times = Schedule::where('doctorID',$doctorID)->where('day',$day)->where('type','onsite')->pluck('start_time')->toArray(); // Get all times
                if(count($times)>0){
                    $onsitesechedules[] = [
                        'day' => $day,
                        'times' => $times,
                    ];
                }
            }
            return response()->json([
                'status'=>200,
                'onlinsechedules' => $onlinsechedules,
                'onsitesechedules' => $onsitesechedules,
                'Banks'=> $doctor->Banks,
                'hasBank'=>$doctor->Banks!==null?true:false,
                'doctor'=>$doctor
            ]);
        } catch (\Exception $e) {
            return response()->json(['status'=>404,'message' =>$e->message]);
        }
    }
    
    public function getReservedAppointments(Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        $doctorID=$request->doctorID;
        $type=intval($request->type);
        $now1 = now()->toIso8601String();
        $now = now();
        $changeAppointments = Appointment::where(function ($query) {
            $query->where('type', '!=', 'done')->where('type','!=','Canceled'); // Exclude "done" appointments
        })
        ->get();
        foreach($changeAppointments as $appointment){
            if($appointment->timeType=="Hours"){
                $now = now();
                $BeforeTime=$now->subHours(intval($appointment->duration))->toIso8601String();
              
            }
            else{
                $now = now();
                $BeforeTime=$now->subMinutes(intval($appointment->duration))->toIso8601String();
            }
            $dayAfter = now()->addDays(1)->toIso8601String();
            $dayBefore = now()->subDay(1)->toIso8601String();
            $d = Carbon::parse($appointment->date)->addHours(3)->toIso8601String();

            if($appointment->state=="online" && $d < $now1 && $d < $BeforeTime && ($appointment->realPatientDuration!=0 || $appointment->realDuration!=0)){
                $appointment->type="done";
                $appointment->endUser="system";
                $appointment->autoClose=true;
                $appointment->save();
            }
            else if($d < $dayAfter && $appointment->type == "approved" && $appointment->state=="online"){
                $appointment->type="Canceled";
                $appointment->save();

            }
            else if($d < $BeforeTime ){
                $appointment->type="past";
                $appointment->save();

            }

            }
       

       
        if($doctorID){
            $doctor=Doctor::find($doctorID);
            if(!$doctor){            
                return response()->json(['status'=>500,'message'=>"there is something wrong"]);
            }
        }
        if($userType=="patient"){
            if($doctorID){
                if(!$type||$type==0){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['approved', 'waiting','past','paid','done'])->with('doctor','patient')->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['waiting'])->with('doctor','patient')->get();
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['approved','paid'])->with('doctor','patient')->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['past'])->with('doctor','patient')->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('state','online')->with('doctor','patient')->get();

                }else if($type==5){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('state','onsite')->with('doctor','patient')->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['done'])->with('doctor','patient')->get();
                }else if($type==7){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['paid'])->with('doctor','patient')->get();
                }else if($type==8){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['Canceled'])->with('doctor','patient')->get();
                }
                foreach($existingAppointments as $appointment){
                    if($appointment->timeType=="Hours"){
                        $now = now();
                        $BeforeTime=$now->subHours(intval($appointment->duration))->toIso8601String();
                      
                    }
                    else{
                        $now = now();
                        $BeforeTime=$now->subMinutes(intval($appointment->duration))->toIso8601String();
                    }
                    if($appointment->date <= $now1 && $appointment->date >= $BeforeTime){
                        $appointment->now=true;
                    }
                    else{
                        $appointment->now=false;
    
                    }
                }
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments,'doctor'=>$doctor]);
            }
            else{
                if(!$type||$type==0){
                    $existingAppointments = Appointment::where('patientID',$userID)->with('doctor','patient')->where('type','!=','Canceled')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', [ 'waiting'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();                    
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['approved','paid'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['past'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('patientID',$userID)->where('state','online')->with('doctor','patient')->where('type','!=','Canceled')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }else if($type==5){
                    $existingAppointments = Appointment::where('patientID',$userID)->where('state','onsite')->with('doctor','patient')->where('type','!=','Canceled')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['done'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }else if($type==7){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['paid'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }else if($type==8){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['Canceled'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                foreach($existingAppointments as $appointment){
                    if($appointment->timeType=="Hours"){
                        $now = now();
                        $BeforeTime=$now->subHours(intval($appointment->duration))->toIso8601String();
                      
                    }
                    else{
                        $now = now();
                        $BeforeTime=$now->subMinutes(intval($appointment->duration))->toIso8601String();
                    }
                    if($appointment->date <= $now1 && $appointment->date >= $BeforeTime){
                        $appointment->now=true;
                    }
                    else{
                        $appointment->now=false;
    
                    }
                }
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments]);

            }
        }
        else if($userType!="admin"){
            if($doctorID){
                if(!$type){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['approved', 'waiting','past','paid','done'])->with('doctor','patient')->get();
                }
                else if($type==0){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->with('doctor','patient')->where('type','!=','Canceled')->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['waiting'])->with('doctor','patient')->get();   
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['approved','paid'])->with('doctor','patient')->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['past'])->with('doctor','patient')->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('state','online')->with('doctor','patient')->where('type','!=','Canceled')->get();

                }
                else if($type==5){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('state','onsite')->with('doctor','patient')->where('type','!=','Canceled')->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['done'])->with('doctor','patient')->get();
                } else if($type==7){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['paid'])->with('doctor','patient')->get();
                } else if($type==8){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['Canceled'])->with('doctor','patient')->get();
                }
                foreach($existingAppointments as $appointment){
                    if($appointment->timeType=="Hours"){
                        $now = now();
                        $BeforeTime=$now->subHours(intval($appointment->duration))->toIso8601String();
                      
                    }
                    else{
                        $now = now();
                        $BeforeTime=$now->subMinutes(intval($appointment->duration))->toIso8601String();
                    }
                    if($appointment->date <= $now1 && $appointment->date >= $BeforeTime){
                        $appointment->now=true;
                    }
                    else{
                        $appointment->now=false;
    
                    }
                }
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments,'doctor'=>$doctor]);
            }
            else if($userType=="secretary"){
                $secretary=Secretary::find($userID);
                
                if(!$type){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->whereIn('type', ['approved', 'waiting','past','paid','done'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==0){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->where('type','!=','Canceled')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->whereIn('type', ['waiting'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->whereIn('type', ['approved','paid'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->whereIn('type', ['past'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->where('state','online')->where('type','!=','Canceled')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==5){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->where('state','onsite')->where('type','!=','Canceled')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->whereIn('type', ['done'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();   
                }else if($type==7){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->whereIn('type', ['paid'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();   
                }else if($type==8){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('doctor','patient')->whereIn('type', ['Canceled'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();   
                }
                foreach($existingAppointments as $appointment){
                    if($appointment->timeType=="Hours"){
                        $now = now();
                        $BeforeTime=$now->subHours(intval($appointment->duration))->toIso8601String();
                      
                    }
                    else{
                        $now = now();
                        $BeforeTime=$now->subMinutes(intval($appointment->duration))->toIso8601String();
                    }
                    if($appointment->date <= $now1 && $appointment->date >= $BeforeTime){
                        $appointment->now=true;
                    }
                    else{
                        $appointment->now=false;
    
                    }
                }
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments]);
            }
            else{
                if(!$type){
                    $existingAppointments = Appointment::where('doctorID',$userID)->whereIn('type', ['approved', 'waiting','past','paid','done'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==0){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->where('type','!=','Canceled')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->whereIn('type', ['waiting'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->whereIn('type', ['approved','paid'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->whereIn('type', ['past'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->where('state','online')->where('type','!=','Canceled')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==5){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->where('state','onsite')->where('type','!=','Canceled')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->whereIn('type', ['done'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }else if($type==7){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->whereIn('type', ['paid'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }else if($type==8){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('doctor','patient')->whereIn('type', ['Canceled'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                foreach($existingAppointments as $appointment){
                    if($appointment->timeType=="Hours"){
                        $now = now();
                        $BeforeTime=$now->subHours(intval($appointment->duration))->toIso8601String();
                      
                    }
                    else{
                        $now = now();
                        $BeforeTime=$now->subMinutes(intval($appointment->duration))->toIso8601String();
                    }
                    if($appointment->date <= $now1 && $appointment->date >= $BeforeTime){
                        $appointment->now=true;
                    }
                    else{
                        $appointment->now=false;
    
                    }
                }
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments]);
            }
        }
        else{
            if(!$type||$type==0){
                $existingAppointments = Appointment::with('doctor','patient')->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get();
            }
            else if($type==1){
                $existingAppointments = Appointment::whereIn('type', [ 'waiting'])->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();                    
            }
            else if($type==2){
                $existingAppointments = Appointment::whereIn('type', ['approved','paid'])->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
            }
            else if($type==3){
                $existingAppointments = Appointment::whereIn('type', ['past'])->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
            }
            else if($type==4){
                $existingAppointments = Appointment::where('state','online')->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
            }else if($type==5){
                $existingAppointments = Appointment::where('state','onsite')->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
            }
            else if($type==6){
                $existingAppointments = Appointment::whereIn('type', ['done'])->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
            }else if($type==7){
                $existingAppointments = Appointment::whereIn('type', ['paid'])->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
            }else if($type==8){
                $existingAppointments = Appointment::whereIn('type', ['Canceled'])->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
            }
            foreach($existingAppointments as $appointment){
                if($appointment->timeType=="Hours"){
                    $now = now();
                    $BeforeTime=$now->subHours(intval($appointment->duration))->toIso8601String();
                  
                }
                else{
                    $now = now();
                    $BeforeTime=$now->subMinutes(intval($appointment->duration))->toIso8601String();
                }
                if($appointment->date <= $now1 && $appointment->date >= $BeforeTime){
                    $appointment->now=true;
                }
                else{
                    $appointment->now=false;

                }
            }
            return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments]);
    }
    }
    public function DeleteAppointment(Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        $doctorID=$request->doctorID;
        $appointmentId=$request->appointmentId;
        if($userType=="patient"){
            if($doctorID){
                try{  
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('patientID',$userID)->where('date', $request->date)->where('time',$request->time)->where('state',$request->state)->whereIn('type', ['approved', 'waiting','past','paid'])->get();
                    if($existingAppointments){
                        foreach($existingAppointments as $ap){
                            $ap->type="Canceled";
                            $ap->save();
                        }
                        return response()->json(['status'=>200,'message' =>'deleted successfully']); 
                    }
                } catch (\Exception $e) {
                    return response()->json(['status'=>404,'message' =>$e->message]);
                }
            }
            else if($request->appointmentId){
                try{  
                    $existingAppointments = Appointment::where('id',$appointmentId)->whereIn('type', ['approved', 'waiting','past','paid'])->get();
                    if($existingAppointments){
                        foreach($existingAppointments as $ap){
                            $ap->type="Canceled";
                            $ap->save();
                        }
                        return response()->json(['status'=>200,'message' =>'deleted successfully']); 
                    }
                } catch (\Exception $e) {
                    return response()->json(['status'=>404,'message' =>$e->message]);
                }
            }
        }
        else {
            $appointmentID=$request->appointmentId;
            if($appointmentID){
                try{    
                    $appo=Appointment::find($appointmentID);
                    if($appo){
                        if($appo->patientID!==null){
                            
                            $notification=new Notification();
                            $notification->Type="Appointment Cancel";
                            $notification->data=["appointmentID"=>$appointmentID,"date"=>$appo->date,"time"=>$appo->time,"doctorName"=>$appo->doctor->user_name];
                            $notification->userID=$appo->patientID;
                            $notification->userType="patient";
                            $notification->save();
                        }
                        $appo->type="Canceled";    
                        $appo->save();
                        return response()->json(['status'=>200,'message' =>"the appointment deleted succseefully"]);
                    }
                    else{
                        return response()->json(['status'=>404,'message' =>"the appointment not exist"]);    
                    }
                }catch(\Exception $e){
                    return response()->json(['status'=>500,'message' =>$e]);
                }
            }
            return response()->json(['status'=>404,'message' =>"you can't delete appointments"]);
        }
    }
    
    
    public function approveAppointment(Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        if($userType=="patient"||$userType=="admin"){
            return response()->json(['status'=>500,'message' =>"you can't approve appointments"]);   
        }
        else {
            $appointmentID=$request->appointmentId;
            if($appointmentID){    
                $appo=Appointment::find($appointmentID);
                if($appo){
                    if($appo->patientID!==null){
                        $notification=new Notification();
                        $notification->Type="Appointment approve";
                        $notification->data=["appointmentID"=>$appointmentID,"date"=>$appo->date,"time"=>$appo->time,"doctorName"=>$appo->doctor->user_name];
                        $notification->userID=$appo->patientID;
                        $notification->userType="patient";
                        $notification->save();
                    }
                    $appo->type="approved";    
                    $appo->save();
                    $appos=Appointment::where('id','!=',$appo['id'])->where('date',$appo['date'])->where('time',$appo['time'])->where('state',$appo['state'])->where('doctorID',$appo['doctorID'])->get();
                    foreach($appos as $ap){
                        $ap->type="Canceled";
                        $ap->save();
                    }
                    return response()->json(['status'=>200,'message' =>"the appointment added succseefully"]);

                }
                else{
                    return response()->json(['status'=>404,'message' =>"the appointment not exist"]);    
                }
            }
            return response()->json(['status'=>404,'message' =>"you can't add appointments"]);

        }
    }
    
    public function PaidAppointment(Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        if($userType=="patient"||$userType=="admin"){
            return response()->json(['status'=>500,'message' =>"you can't approve appointments"]);   
        }
        else {
            $appointmentID=$request->appointmentId;
            if($appointmentID){    
                $appo=Appointment::find($appointmentID);
                if($appo){
                    if($appo->patientID!==null){
                        $notification=new Notification();
                        $notification->Type="Appointment paid";
                        $notification->data=["appointmentID"=>$appointmentID,"date"=>$appo->date,"time"=>$appo->time,"doctorName"=>$appo->doctor->user_name];
                        $notification->userID=$appo->patientID;
                        $notification->userType="patient";
                        $notification->save();
                    }
                    $appo->type="paid";    
                    $appo->save();
                    $appos=Appointment::where('id','!=',$appo['id'])->where('date',$appo['date'])->where('time',$appo['time'])->where('state',$appo['state'])->where('doctorID',$appo['doctorID'])->get();
                    foreach($appos as $ap){
                        $ap->type="Canceled";
                        $ap->save();
                    }
                    return response()->json(['status'=>200,'message' =>"the appointment paid succseefully"]);

                }
                else{
                    return response()->json(['status'=>404,'message' =>"the appointment not exist"]);    
                }
            }
            return response()->json(['status'=>404,'message' =>"you can't pay for appointments"]);

        }
    }
    
    public function DoneAppointment(Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        if($userType=="patient"||$userType=="admin"){
            return response()->json(['status'=>500,'message' =>"you can't Done appointments"]);   
        }
        else {
            $appointmentID=$request->appointmentId;
            if($appointmentID){    
                $appo=Appointment::find($appointmentID);
                if($appo){
                    if($appo->patientID!==null){
                        $notification=new Notification();
                        $notification->Type="Appointment End";
                        $notification->data=["appointmentID"=>$appointmentID,"date"=>$appo->date,"time"=>$appo->time,"doctorName"=>$appo->doctor->user_name];
                        $notification->userID=$appo->patientID;
                        $notification->userType="patient";
                        $notification->save();
                    }
                    $appo->type="done";    
                    $appo->endUser=$userType=="secretary"||$userType=="doctor"?"doctor":"system";    
                    $appo->save();
                    
                    return response()->json(['status'=>200,'message' =>"the appointment done succseefully"]);

                }
                else{
                    return response()->json(['status'=>404,'message' =>"the appointment not exist"]);    
                }
            }
            return response()->json(['status'=>404,'message' =>"you can't done appointments"]);

        }
    }
    public function AddAppointment(Request $request){

        $userID=$request->userID;
        $userType=$request->userType;
        $doctorID=$request->doctorID;
        if($doctorID){
            $doctor=Doctor::find($doctorID);
            iF(!$doctor){
                return response()->json([
                    'status' => 500,
                    'message' =>"Something went wrong." ,
                ]);
            }
        }
        if($userType=="admin"){
            return response()->json([
                'status' => 500,
                'message' =>"you can't add any appointment." ,
            ]);

        }
        else{    
            try{

                $onsitesAppointments = json_decode($request->onsite, true);
                $onlinesAppointment = json_decode($request->online, true);
                $newTimes2=[];
                $newTimes=[];
                $removedTimes=[];
                $removedTimes2=[];
                if ($onsitesAppointments !== null) {
                    foreach ($onsitesAppointments as $Appointment) {
                        $date = $Appointment['date'];
                        $existingAppointments = Appointment::where('doctorID',$doctorID)->where('date', $date)->where('time',$Appointment['time'])->where('state','onsite')->where('type','approved')->count();
                        // Get count of approved appointments for this date and time
                        if($existingAppointments>0){
                            return response()->json(['status'=>500,'message' =>"You can't book this appointment, it's already booked."]);
                        }
                        else{
                            $existingUserAppointments = Appointment::where('doctorID',$doctorID)->where('date', $date)->where('time',$Appointment['time'])->where('state','onsite')->where('patientID',$userID)->count(); // Get count of approved appointments for this date and time
                            if($existingUserAppointments>0){
                                return response()->json(['status'=>500,'message' =>"You already booked this appointment"]);

                            }
                            else{
                                if($userType!=="patient"){
                                    $newAppointment = new Appointment([
                                        'day' => $Appointment['day'],
                                        'time' =>$Appointment['time'] ,
                                        'date'=>$date,
                                        'type'=>"approved",
                                        'state'=>"onsite",
                                        'doctorID'=>$doctorID,
                                        "pay"=>"cash",
                                        "duration"=>$doctor->time,
                                        "cost"=>$doctor->cost,
                                        "timeType"=>$doctor->timeType,
                                        
                                    ]);
                                    $appos=Appointment::where('id','!=',$newAppointment['id'])->where('date',$newAppointment['date'])->where('time',$newAppointment['time'])->where('state',$newAppointment['state'])->where('doctorID',$newAppointment['doctorID'])->get();
                                    foreach($appos as $ap){
                                        if($ap->patientID!==null)
                                        {
                                            
                                            $notification=new Notification();
                                            $notification->Type="Appointment Cancel";
                                            $notification->data=["appointmentID"=>$newAppointment->id,"date"=>$ap->date,"time"=>$ap->time,"doctorName"=>$ap->doctor->user_name];
                                            $notification->userID=$ap->patientID;
                                            $notification->userType="patient";
                                            $notification->save();
                                        }
                                        $ap->type="Canceled";
                                        $ap->save();
                                    }
                                }
                                else{                                   
                                    
                                    $newAppointment = new Appointment([
                                        'day' => $Appointment['day'],
                                        'time' =>$Appointment['time'] ,
                                        'date'=>$date,
                                        'type'=>"waiting",
                                        'state'=>"onsite",
                                        'doctorID'=>$doctorID,
                                        'patientID'=>$userID,
                                        "pay"=>$request->pay,
                                        "duration"=>$doctor->time,
                                        "cost"=>$doctor->cost,
                                        "timeType"=>$doctor->timeType,

                                    ]);

                                }
                               
                                try {
                                    $newAppointment->save();
                                } catch (\Exception $e) {
                                    // Log the error message
                                    \Log::error('Error saving appointment: ' . $e->getMessage());
                                    return response()->json(['error' =>  $e->getMessage()], 500);
                                }                            

                                $notification=new Notification();
                                $notification->Type="Appointment";
                                $notification->data=["appointmentID"=>$newAppointment->id,"date"=>$newAppointment->date,"time"=>$newAppointment->time,"doctorName"=>$newAppointment->doctor->user_name];
                                $notification->userID=$newAppointment->doctor->Secretary->id;
                                $notification->userType="secretary";
                                $notification->save();
                            
                            }
                        }
                       
                        
                    }
                }if ($onlinesAppointment !== null) {
                    foreach ($onlinesAppointment as $Appointment) {
                        $date = $Appointment['date'];
                        $existingAppointments = Appointment::where('doctorID',$doctorID)->where('date', $date)->where('time',$Appointment['time'])->where('state','online')->where('type','approved')->count();
                        // Get count of approved appointments for this date and time
                        if($existingAppointments>0){
                            return response()->json(['status'=>500,'message' =>"You can't book this appointment, it's already booked."]);
                        }
                        else{
                            $existingUserAppointments = Appointment::where('doctorID',$doctorID)->where('date', $date)->where('time',$Appointment['time'])->where('state','online')->where('patientID',$userID)->count(); // Get count of approved appointments for this date and time
                            if($existingUserAppointments>0){
                                return response()->json(['status'=>500,'message' =>"You already booked this appointment"]);
                            }
                            else{
                                if($userType!=="patient"){
                                    $newAppointment = new Appointment([
                                        'day' => $Appointment['day'],
                                        'time' =>$Appointment['time'] ,
                                        'date'=>$date,
                                        'type'=>"approved",
                                        'state'=>"online",
                                        'doctorID'=>$doctorID,
                                        "pay"=>"cash",
                                        "duration"=>$doctor->time,
                                        "cost"=>$doctor->cost,
                                        "timeType"=>$doctor->timeType,
                                    ]);
                                    $appos=Appointment::where('id','!=',$newAppointment['id'])->where('date',$newAppointment['date'])->where('time',$newAppointment['time'])->where('state',$newAppointment['state'])->where('doctorID',$newAppointment['doctorID'])->get();
                                    foreach($appos as $ap){
                                        if($ap->patientID!==null)
                                        {
                                            
                                            $notification=new Notification();
                                            $notification->Type="Appointment Cancel";
                                            $notification->data=["appointmentID"=>$newAppointment->id,"date"=>$ap->date,"time"=>$ap->time,"doctorName"=>$ap->doctor->user_name];
                                            $notification->userID=$ap->patientID;
                                            $notification->userType="patient";
                                            $notification->save();
                                        }
                                        $ap->type="Canceled";
                                        $ap->save();
                                    }
                                }
                                else{

                                    $newAppointment = new Appointment([
                                        'day' => $Appointment['day'],
                                        'time' =>$Appointment['time'] ,
                                        'date'=>$date,
                                        'type'=>"waiting",
                                        'state'=>"online",
                                        'doctorID'=>$doctorID,
                                        'patientID'=>$userID,
                                        "pay"=>$request->pay,
                                        "duration"=>$doctor->time,
                                        "cost"=>$doctor->cost,
                                        "timeType"=>$doctor->timeType,

                                    ]);
                                }
                                $newAppointment->save();
                                $notification=new Notification();
                                $notification->Type="Appointment";
                                $notification->data=["appointmentID"=>$newAppointment->id,"date"=>$newAppointment->date,"time"=>$newAppointment->time,"doctorName"=>$newAppointment->doctor->user_name];
                                $notification->userID=$newAppointment->doctor->Secretary->id;
                                $notification->userType="secretary";
                                $notification->save();
                            }
                        }
                       
                        
                    }
                }
                return response()->json(['status'=>200,'message' =>"done"]);

            } catch (\Exception $e) {
                return response()->json(['status'=>404,'message' =>$e]);
            }
        }
        
    }
    public function setBanks(Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        $patientID=$request->patientID;
        try{

            if($userType=="patient"){
                $Banks = json_decode($request->input('Banks'), true); // Decode JSON data
                if($Banks){
                    
                    $patientInfo=PatientInfo::where("patientID",$userID)->limit(1)->first();
                    $patientInfo->Banks=$Banks;
                    $patientInfo->save();
                    return response()->json(['status'=>200,'message' =>"Bank Information added successfully"]);

                }
                return response()->json(['status'=>400,'message' =>"you don't hvae information"]);

                
            }
            else if($userType=="doctor"||$userType=="secretary"){
                $Cost=$request->input("sessionCost");
                $Time=$request->input("sessionTime");
                $type=$request->input("sessionTimeType");
                if($userType=="secretary"){
                    $secretary=Secretary::find($userID);
                    $doctorID=$secretary->doctorID;
                }
                else{
                    $doctorID=$userID;
                }
                $Banks = json_decode($request->input('Banks'), true); // Decode JSON data
                if($Banks){
                    $doctor=Doctor::find($doctorID);
                    $doctor->Banks=$Banks;
                    $doctor->save();

                }
                if($Cost&&$Time&&$type){
                    $doctor=Doctor::find($doctorID);
                    $doctor->time=$Time;
                    $doctor->cost=$Cost;
                    $doctor->timeType=$type;
                    $doctor->save();
                    
                    
                }
                return response()->json(['status'=>200,'message' =>"Bank Information added successfully"]);

            }
            return response()->json(['status'=>500,'message' =>"you can't add your Banks Information"]);

        }                
        catch (\Exception $e) {
            return response()->json(['status'=>500,'message' =>$e]);

        }
    }
    public function haveAppointment(Request $request){
        $now1 = now()->toIso8601String();
        $now = now();
        $Appointments = Appointment::where('state', "online")
        ->where('type', 'paid')
        ->where('doctorID', $request->doctorID)
        ->where('patientID', $request->patientID)
        ->get();
        $count=0;
        $app=null;
        foreach($Appointments as $appointment){
            if($appointment->timeType=="Hours"){
                $now = now();
                $BeforeTime=$now->subHours(intval($appointment->duration))->toIso8601String();
              
            }
            else{
                $now = now();
                $BeforeTime=$now->subMinutes(intval($appointment->duration))->toIso8601String();
            }
            $d = Carbon::parse($appointment->date)->addHours(3)->toIso8601String();
            if($d <= $now1 && $d >= $BeforeTime){
                $count++;
                $app=$appointment;
            }
        }
        return response()->json(['status'=>200,'haveAccount' =>$count==0?false:true,'appointment'=>$app,'s'=>$Appointments]);

    }
    
    public function addSessionNote(Request $request){
        $userID=intval($request->userID);
        $patientID=intval($request->patientID);
        $doctorID=intval($request->doctorID);
        $userType=$request->userType;
        $appointmentID=intval($request->appointmentID);
        if($userType=="doctor"){
            try{
                
                $appointment=Appointment::find($appointmentID);
                if($appointment){
                    $Note=new SessionNote();
                    $Note->Notes=$request->Notes;
                    $Note->preMed=$request->preMed;
                    $Note->postMed=$request->postMed;
                    $Note->patientID=$request->patientID;
                    $Note->doctorID=$request->doctorID;
                    $Note->appointmentID=$request->appointmentID;
                    $Note->save();
                    
                    return response()->json(['status'=>200,'message'=>"Note saved successfully"]);
                }
                return response()->json(['status'=>200,'message'=>"the appointment not found"]);

            }
            catch(\Exception $e){
                return response()->json(['status'=>500,'message'=>$e]);

            }
            
        }
        return response()->json(['status'=>200,'message'=>"you can't add notes"]);

    }


public function endSession(Request $request){
    $userID=intval($request->userID);
    $userType=$request->userType;
    $appointmentID=intval($request->appointmentID);
    $autoClose=intval($request->autoClose);
    $newDuration=$request->duration;

    try{
            $appointment=Appointment::find($appointmentID);
            if($appointment){
                if($userType=="doctor")
                {

                    $currentDuration=$appointment->realDuration;
                }
                else{
                    $currentDuration=$appointment->realPatientDuration;

                }
                $updatedDuration=$this->addTime($currentDuration,$newDuration);
                if($userType=="doctor")
                {
                    $appointment->realDuration = $updatedDuration;
                }
                else{
                    $appointment->realPatientDuration = $updatedDuration;
                }
                if($autoClose){
                    if($userType=="doctor" && $appointment->endUser==null){
                        $appointment->endUser="patient";
                    }                    
                    else if($appointment->endUser==null){
                        $appointment->endUser="doctor";
                    }
                }
                else{
                    if($appointment->endUser==null){
                        $appointment->endUser=$userType;
                    }
                }
                if($appointment->autoClose==null){
                    $appointment->autoClose=$autoClose;
                }
                $appointment->type="done";
                $appointment->save();
                return response()->json(['status'=>200,'message'=>"Session end successfully"]);
            }
            return response()->json(['status'=>200,'message'=>"the session not found"]);

        }
        catch(\Exception $e){
            return response()->json(['status'=>500,'message'=>$e]);

        }
        
    }

     function convertToMinutesAndSeconds($duration) {
        $minutes = floor($duration);
        $seconds = ($duration - $minutes) * 100;
        return [$minutes, $seconds];
    }
    
     function convertToFractionalMinutes($minutes, $seconds) {
        return $minutes + ($seconds / 60);
    }
     function addTime($old,$new){
        list($currentMinutes, $currentSeconds) = $this->convertToMinutesAndSeconds($old);
        list($newMinutes, $newSeconds) = $this->convertToMinutesAndSeconds($new);
        
        // Add the minutes and seconds separately
        $totalMinutes = $currentMinutes + $newMinutes;
        $totalSeconds = $currentSeconds + $newSeconds;
        
        // Handle overflow of seconds
        if ($totalSeconds >= 60) {
            $totalMinutes += floor($totalSeconds / 60);
            $totalSeconds = $totalSeconds % 60;
        }
        $totalSeconds = $totalSeconds / 100;
        $updatedDuration=$totalMinutes+$totalSeconds;
        return $updatedDuration;
    }
    public function breakSession(Request $request){
        $userID=intval($request->userID);
        $userType=$request->userType;
        $appointmentID=intval($request->appointmentID);
        $newDuration=$request->duration;
        try{
                $appointment=Appointment::find($appointmentID);
                if($appointment){
                    if($userType=="doctor")
                    {

                        $currentDuration=$appointment->realDuration;
                    }
                    else{
                        $currentDuration=$appointment->realPatientDuration;

                    }
                    $updatedDuration=$this->addTime($currentDuration,$newDuration);
                    if($userType=="doctor")
                    {
                        $appointment->realDuration = $updatedDuration;
                    }
                    else{
                        $appointment->realPatientDuration = $updatedDuration;
                    }
                    $appointment->save();
                    return response()->json(['status'=>200,'message'=>"Session break successfully"]);
                }
                return response()->json(['status'=>200,'message'=>"the session not found"]);
    
            }
            catch(\Exception $e){
                return response()->json(['status'=>500,'message'=>$e]);
    
            }
            
        }
    
    
}