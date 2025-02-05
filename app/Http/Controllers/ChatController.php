<?php

namespace App\Http\Controllers;


use App\Models\Chat;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Models\Notification;
use Carbon\Carbon;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{


    //when the patient open chat with doctor i will called this function 
    //here i just using the chats table in this function   
    public function openChat($user_type, $user_id, $other_user_id)
    {
        if ($user_type === 'patient') {
            $patient = Patient::find($user_id);
            $doctor = Doctor::find($other_user_id);
        } elseif ($user_type === 'doctor') {
            $patient = Patient::find($other_user_id);
            $doctor = Doctor::find($user_id);
        } else {
            return response()->json(['message' => 'Invalid user type.'], 404);
        }
    
        // Check if both the patient and doctor exist
        if (!$patient || !$doctor) {
            return response()->json(['message' => 'Cannot start this chat.'], 404);
        }
    
        // Generate unique prefixed IDs for patient and doctor
        $prefixed_patient_id = 'P-' . $patient->id;
        $prefixed_doctor_id = 'D-' . $doctor->id;
    
        // Check if a chat already exists between the patient and doctor
        $chat = Chat::where('patient_id', $patient->id)
            ->where('doctor_id', $doctor->id)
            ->first();
    
        if ($chat) {
            // If a chat already exists, return the chat information along with prefixed patient and doctor IDs
            return response()->json([
                'message' => 'Chat already exists.',
                'chat' => $chat,
                'patient_id' => $prefixed_patient_id,
                'doctor_id' => $prefixed_doctor_id,
                'patient_name' => $patient->user_name,
                'doctor_name' => $doctor->user_name,
            ]);
        }
    
        // If a chat does not exist, create a new chat
        $chat = Chat::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
        ]);
    
        return response()->json([
            'message' => 'Chat created successfully',
            'chat' => $chat,
            'patient_id' => $prefixed_patient_id,
            'doctor_id' => $prefixed_doctor_id,
            'patient_name' => $patient->user_name,
            'doctor_name' => $doctor->user_name,
        ]);
    }


    //here the for show the user what he has of chats 
    public function showChat($id)
    {
        $patientChats = Chat::where('patient_id', $id)->get();
        $doctorChats = Chat::where('doctor_id', $id)->get();

        if ($patientChats->count() > 0) {
            $doctorIds = $patientChats->pluck('doctor_id')->toArray();
            $doctors = Doctor::whereIn('id', $doctorIds)->get();

            $patientChatsWithId = $patientChats->map(function ($chat) {
                $chat['chat_id'] = $chat->id;
                return $chat;
            });

            return response()->json([
                'chats' => $patientChatsWithId,
                'users' => $doctors,
            ]);
        } elseif ($doctorChats->count() > 0) {
            $patientIds = $doctorChats->pluck('patient_id')->toArray();
            $patients = Patient::whereIn('id', $patientIds)->get();

            $doctorChatsWithId = $doctorChats->map(function ($chat) {
                $chat['chat_id'] = $chat->id;
                return $chat;
            });

            return response()->json([
                'chats' => $doctorChatsWithId,
                'users' => $patients,
            ]);
        } else {
            return response()->json(['message' => 'No Chats Available'], 200);
        }
    }



    //when doctor or patient send message i will call this function  
    public function sendMessage($sender_id, $recever_id, Request $request)
    {
        //to sure from data that send in the class Request 
        $message = $request->validate([
            "message" => 'string',
        ]);

        // Check if the sender is a patient or doctor
        $sender = Patient::where('id', $sender_id)->first();
        if (!$sender) {
            $sender = Doctor::where('id', $sender_id)->first();
            if (!$sender) {
                return response()->json(['message' => 'Invalid sender ID.'], 404);
            }
        }
        $recever = Patient::where('id', $recever_id)->first();
        if (!$recever) {
            $recever = Doctor::where('id', $recever_id)->first();
            if (!$recever) {
                return response()->json(['message' => 'Invalid recever ID.'], 404);
            }
        }

        //check if the chat exist between the patient and doctor and take the id of this chat to add for messages table 
        $chat = null;
        if ($chat = Chat::where('patient_id', $sender->id)->where('doctor_id', $recever->id)->first()) {
            //create record in messages table 
            $Message = Message::create([
                'message' => $message['message'],
                'sender_id' => $sender->id,
                'recever_id' => $recever->id,
                'chat_id' => $chat->id,
            ]);
            $notification=Notification::where('type','Message')->where('userID',$recever->id)->where('data->senderID',$sender->id)->where("data->chatID",$chat->id)->whereNull("read_at")->limit(1)->first();
            
            if($notification){
                $notification->created_at=Carbon::now();
                $notification->save();           
            }
            else{
                
                $notification=new Notification();
                $notification->Type="Message";
                $notification->data=["senderID"=>$sender->id,"senderName"=>$sender->user_name,"chatID"=>$chat->id];
                $notification->userID=$recever->id;
                $notification->userType="doctor";
                $notification->save();
            }
            return response()->json([
                'message' => $Message,
                'sender_id' => $sender->id,
                'recever_id' => $recever->id,
                'sender_name' => $sender->user_name,
                'recever_name' => $recever->user_name,
                'chat_id' => $chat->id,
            ]);
        } else if ($chat = Chat::where('patient_id', $recever->id)->where('doctor_id', $sender->id)->first()) {
            //create record in messages table 
            $Message = Message::create([
                'message' => $message['message'],
                'sender_id' => $sender->id,
                'recever_id' => $recever->id,
                'chat_id' => $chat->id,
            ]);
            $notification=Notification::where('type','Message')->where('userID',$recever->id)->where('data->senderID',$sender->id)->where("data->chatID",$chat->id)->whereNull("read_at")->limit(1)->first();
            if($notification){
             $notification->created_at=Carbon::now();
             $notification->save();   
            }
            else{
                $notification=new Notification();
                $notification->Type="Message";
                $notification->data=["senderID"=>$sender->id,"senderName"=>$sender->user_name,"chatID"=>$chat->id];
                $notification->userID=$recever->id;
                $notification->userType="patient";
                $notification->save();
            }
            return response()->json([
                'message' => $Message,
                'sender_id' => $sender->id,
                'recever_id' => $recever->id,
                'sender_name' => $sender->user_name,
                'recever_name' => $recever->user_name,
                'chat_id' => $chat->id,
            ]);

        } else if (!$chat) {
            // If the chat doesn't exist, you may need to handle this case appropriately
            return response()->json(['message' => 'Chat does not exist.'], 404);
        }

    }


    //when doctor or patient open the chat i will call this function to show the message if exist 
    public function showMessages(Request $request, $id)
    {
        $chat = Chat::where('id', $id)->first();

        if (!$chat) {
            return response()->json(['error' => 'Chat not found'], 404);
        }

        // Fetch all the messages of this chat
        $messages = Message::where('chat_id', $chat->id)->get();
        
       
        return response()->json([
            'messages' => $messages,
            'chat' => $chat,
            'status'=>200,
          
        ]);
    }

    public function GetChatByID($id)
    {
        $chat_id = Chat::where('id', $id)->first();
        if ($chat_id) {
            return $chat_id;
        } else {
            return response()->json(
                [
                    'message' => 'This chat does not exist ',
                ]
            );
        }
    }


    //this function for delete chat 
    public function deleteChat($id, $user_id)
    {
        $chat = Chat::find($id);

        if ($chat) {
            // to delete the messages associated by it 
            $chat->messages()->delete();

            // to delet the chat 
            $chat->delete();

            // to show the list of the user
            return $this->showChat($user_id);
        }

        return response()->json(['message' => 'the chat does not exist'], 404);
    }



}