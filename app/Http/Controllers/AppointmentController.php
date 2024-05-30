<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Secretary;
use App\Models\DoctorVerfiy;
use App\Models\Schedule;
use App\Models\Doctor;
use App\Models\Article;
use Illuminate\Support\Facades\Hash;
use App\Models\Notification;


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

        $pastAppointments = Appointment::where(function ($query) {
            $query->whereDate('date', '<', now()->format('Y-m-d')) // Before today's date
                  ->where('type', '!=', 'done'); // Exclude "done" appointments
        })
        ->get();
        foreach($pastAppointments as $past)
        {
            $past->type="past";
            $past->save();
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
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['approved', 'waiting'])->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['waiting'])->get();
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['approved'])->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['past'])->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('state','online')->whereIn('type', ['approved','waiting'])->get();

                }else if($type==5){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('state','onsite')->whereIn('type', ['approved','waiting'])->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['done'])->get();
                }
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments,'doctor'=>$doctor]);
            }
            else{
                if(!$type||$type==0){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['approved', 'waiting'])->with('doctor','patient')->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', [ 'waiting'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();                    
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['approved'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['past'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('patientID',$userID)->where('state','online')->whereIn('type', ['approved', 'waiting'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }else if($type==5){
                    $existingAppointments = Appointment::where('patientID',$userID)->where('state','onsite')->whereIn('type', ['approved', 'waiting'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('patientID',$userID)->whereIn('type', ['done'])->with('doctor','patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments]);

            }
        }
        else if($userType!="admin"){
            if($doctorID){
                if(!$type||$type==0){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['waiting'])->get();   
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['approved'])->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['past'])->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('state','online')->get();

                }
                else if($type==5){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('state','onsite')->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->whereIn('type', ['done'])->get();
                }
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments,'doctor'=>$doctor]);
            }
            else if($userType=="secretary"){
                $secretary=Secretary::find($userID);
                
                if(!$type||$type==0){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('patient')->whereIn('type', ['waiting'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('patient')->whereIn('type', ['approved'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('patient')->whereIn('type', ['past'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('patient')->where('state','online')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==5){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('patient')->where('state','onsite')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('doctorID',$secretary->doctorID)->with('patient')->whereIn('type', ['done'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();   
                }
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments]);
            }
            else{
                if(!$type||$type==0){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('patient')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==1){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('patient')->whereIn('type', ['waiting'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==2){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('patient')->whereIn('type', ['approved'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==3){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('patient')->whereIn('type', ['past'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==4){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('patient')->where('state','online')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==5){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('patient')->where('state','onsite')->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
                else if($type==6){
                    $existingAppointments = Appointment::where('doctorID',$userID)->with('patient')->whereIn('type', ['done'])->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
                }
               
                return response()->json(['status'=>200,'onsiteappointments' =>$existingAppointments]);
            }
        }
        else{
            return response()->json(['status'=>500,'message'=>"you don't have appointments"]);
        }
    }
    public function DeleteAppointment(Request $request){
        $userID=$request->userID;
        $userType=$request->userType;
        $doctorID=$request->doctorID;
        if($userType=="patient"){
            if($doctorID){
                try{  
                    $existingAppointments = Appointment::where('doctorID',$doctorID)->where('patientID',$userID)->where('date', $request->date)->where('time',$request->time)->where('state',$request->state)->whereIn('type', ['approved', 'waiting'])->get();
                    if($existingAppointments){
                        foreach($existingAppointments as $ap){
                            $ap->delete();
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
                    $appo->delete();    
                    return response()->json(['status'=>200,'message' =>"the appointment deleted succseefully"]);

                }
                else{
                    return response()->json(['status'=>404,'message' =>"the appointment not exist"]);    
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
                        $ap->delete();
                    }
                    return response()->json(['status'=>200,'message' =>"the appointment deleted succseefully"]);

                }
                else{
                    return response()->json(['status'=>404,'message' =>"the appointment not exist"]);    
                }
            }
            return response()->json(['status'=>404,'message' =>"you can't delete appointments"]);

        }
    }
    public function AddAppointment(Request $request){

        $userID=$request->userID;
        $userType=$request->userType;
        $doctorID=$request->doctorID;
        if($userType=="admin"){
            return response()->json([
                'status' => 500,
                'message' =>"you can't add any appointment" ,
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
                                        $ap->delete();
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
                                        'patientID'=>$userID
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
                                        $ap->delete();
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
                                        'patientID'=>$userID
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
                return response()->json(['status'=>404,'message' =>$e->message]);
            }
        }
        
    }
}