<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;


class AdminController extends Controller
{
    public function AddFirstAdmin()
    {
        $Admin = new Admin();
        $Admin->id = 1 ;
        $Admin->user_name = 'khaled' ;
        $Admin->email = 'klora756@gmail.com' ;
        $Admin->password = Hash::make('klora1234');
        $Admin->save(); 
       return $Admin; 
    }
    public function AddSecondAdmin()
    {
        $Admin = new Admin();
        $Admin->id = 2 ;
        $Admin->user_name = 'Sireen' ;
        $Admin->email = 'sireen.takriti@gmail.com' ;
        $Admin->password = Hash::make('123456789');
        $Admin->save(); 
       return $Admin;
    }
}