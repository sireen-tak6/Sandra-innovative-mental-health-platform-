<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Plike;
use App\Http\Controllers\PlikeController;
use App\Http\Controllers\DlikeController;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class PostController extends Controller
{

    //it's finish 
    public function store(Request $request)
    {
        $request->validate([
            'path' => 'required|file|mimetypes:video/avi,video/mpeg,video/quicktime,video/mp4,image/jpeg,image/png|max:20000',
            'description' => 'required',
            'doctor_id' => 'required|exists:doctors,id',
            'category' => 'required',
        ]);

        $imagefile=$request->file('path');
        $imageextension =  Str::uuid()->toString() . '.' . $imagefile->getClientOriginalExtension();
        $imagename='5'.'.'.$imageextension;
        $videoPath2='Videos/'.$imagename;
        $videoPath = $imagefile->Move('Videos/',$imagename);
        $post = Post::create([
            'path' => $videoPath2,
            'description' => $request->input('description'),
            'doctor_id' => $request->input('doctor_id'),
            'category' => $request->input('category'),
        ]);

        return response()->json(['message' => 'File stored successfully', 'post' => $post], 201);


    }

    //this method just for retrieve the video without any constrained 


    public function show($id)
    {
        $post = Post::with('doctor')->findOrFail($id);

        return response()->json(['posts' => $post], 200);
    }


    //still in work  
    public function getAllPosts()
    {
        $posts = Post::orderBy('created_at', 'desc')->get();

      

        $posts = $posts->sortBy(function ($post) {
            // Get the number of likes
            $likeController = new PlikeController();
            $likes = $likeController->showPostLikes($post->id)->original['likes'];

            // Get the number of reports 
            $dlikeController = new DlikeController();
            $reports = $dlikeController->showPostDlikes($post->id)->original['report'];

            // return sort by reports in descending order and likes in ascending order
            return [$reports, -$likes];
        });

        return response([
            'posts' => $posts->values()->all(),
        ]);
    }

    public function deletePost($id)
    {
        $post = Post::find($id);

        if (!$post) {
            // Post not found
            return response()->json(['error' => 'Post not found'], 404);
        }

        $post->delete();

        // Post deleted successfully
        return response()->json(['message' => 'Post deleted successfully']);
    }


    public function getPostSharedByDoctor($id)
    {
        $posts = Post::where('doctor_id', $id)->get();

        if ($posts->isEmpty()) {
            return response()->json(['posts' => []]);
        }

        return response()->json(['posts' => $posts]);
    }


    public function suggestionPost($id)
    {
        // Retrieve Plike model 
        $plikeRecords = Plike::where('patient_id', $id)->get();

        $postIds = $plikeRecords->pluck('post_id')->toArray();

        // Retrieve posts 
        $posts = Post::whereIn('id', $postIds)->get();

        return response()->json([
            'posts' => $posts,
        ]);
    }


    public function getPostsBySameCategory(Request $request, $category)
    {
        $posts = Post::where('category', $category)->get();

        $posts->transform(function ($post) {
            $post->path = url('' . $post->path);
            return $post;
        });

        $posts->sortByDesc(function ($post) {
            // Get the number of likes 
            $likeController = new PlikeController();
            $likes = $likeController->showPostLikes($post->id)->original['likes'];

            // Get the number of reports
            $dlikeController = new DlikeController();
            $reports = $dlikeController->showPostDlikes($post->id)->original['report'];

            // Sort the posts by likes and reports 
            return [$likes, -$reports];
        });

        return response()->json([
            'posts' => $posts,
            'message' => 'Posts retrieved successfully',
        ]);
    }



    


}