<?php

namespace App\Http\Controllers;

use App\Models\Plike;
use Illuminate\Http\Request;

class PlikeController extends Controller
{
    public function addPostLike($post_id, $patient_id)
    {
        $like = Plike::where('post_id', $post_id)->where('patient_id', $patient_id)->first();

        if ($like) {
            $like->delete();
            return response()->json(['message' => 'Like removed successfully'], 200);
        } else {
            $newLike = new Plike();
            $newLike->post_id = $post_id;
            $newLike->patient_id = $patient_id;
            $newLike->islike = 1;
            $newLike->save();
            return response()->json(
                [
                    'message' => 'Like added for the post successfully',
                    'post_id' => $post_id,
                    'islike' => $newLike->islike
                ],
                200
            );
        }
    }




    public function showPostLikes($post_id)
    {
        $like = Plike::where('post_id', $post_id)->count();

        if ($like) {
            return response()->json(['likes' => $like], 200);
        } else {
            return response()->json(['likes' => 0]);
        }
    }





}
