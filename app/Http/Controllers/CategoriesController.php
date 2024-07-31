<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
class CategoriesController extends Controller
{

    //select all categories
    public function getAll(){
        $Category= Category::all();
        return response()->json(['status'=>200,'Category'=>$Category]);
    }
    
    //insert Categories into database
    public function insert(){
        $cats=[  
            [
                'name'=>"Stress Management",
                'description'=>"Tips for coping with stress and daily pressures",
                'image'=>"../images/category/Stress-Management.png"
            ],  
            [
                'name'=>"Youth Mental Health",
                'description'=>"Guidance on issues affecting young people",
                'image'=>"../images/category/youth-mental-health-.jpg"
            ],  
            [
                'name'=>"Relationships",
                'description'=>"Improving personal connections and communication",
                'image'=>"../images/category/Relashionships.jpg"
            ],  
            [
                'name'=>"Self-Improvement",
                'description'=>"Tips for personal growth and well-being",
                'image'=>"../images/category/self-development.png"
            ],
            [
                'name'=>"Elderly Mental Health",
                'description'=>"Addressing psychological challenges in seniors",
                'image'=>"../images/category/Elderly-Mental-Health.jpg"
            ],
            [
                'name'=>"Therapy",
                'description'=>"Seeking and benefiting from psychological help",
                'image'=>"../images/category/therapist.jpg"
            ],  
            [
                'name'=>"Psychology Basics",
                'description'=>"Basics of psychology and understanding mental factors",
                'image'=>"../images/category/psychological-disorders.png"
            ],  
            [
                'name'=>"Culture & Mental Health",
                'description'=>"How culture impacts mental health",
                'image'=>"../images/category/MentalHealth.jpg"
            ],
       
        ];
        Category::insert($cats);
        return "hello";
    }
}