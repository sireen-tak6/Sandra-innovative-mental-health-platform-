<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
        $Admin->email = 'siro1234@gmail.com' ;
        $Admin->password = Hash::make('siro1234');
        $Admin->save(); 
       return $Admin;
    }
}