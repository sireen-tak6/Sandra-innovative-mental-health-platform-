<?php

namespace App\Http\Controllers;

use App\Models\Dlike;
use Illuminate\Http\Request;

class DlikeController extends Controller 
{
    public function addPostDlike($post_id, $patient_id)
    {
        $dlike = Dlike::where('post_id', $post_id)->where('patient_id', $patient_id)->first();

        if ($dlike) {
            $dlike->delete();
            return response()->json(['message' => 'disLike removed successfully'], 200);
        } else {
            $newLike = new Dlike();
            $newLike->post_id = $post_id;
            $newLike->patient_id = $patient_id;
            $newLike->report = 1;
            $newLike->save();
            return response()->json(
                [
                    'message' => 'dLike added for the post successfully',
                    'post_id' => $post_id,
                    'islike' => $newLike->report 
                ],
                200
            );
        }
    }




    public function showPostDlikes($post_id)
    {
        $dlike = Dlike::where('post_id', $post_id)->count();

        if ($dlike) {
            return response()->json(['report' => $dlike], 200);
        } else {
            return response()->json(['report' => 0]);
        }
    }
}
