<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\Notification;

class ArticleLike extends Model
{
    use HasFactory;
    protected $table='Articleslikes';
    protected $fillable=['patientID','articleID'];
    
    public function article()
    {
        return $this->belongsTo(Article::class,'articleID');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    
    //change doctors points automatically
    protected static function boot()
    {
        parent::boot();
        
        static::created(function ($like) {
            // Increment the likes_count for the associated article
            $like->article->increment('likes');
            // Check if the likes_count is a multiple of 5
            if ($like->article->likes % 5 === 0) {
                // Add one point to the publisher's points in the article table
                $like->article->Doctor->increment('points');

                // Find the reviews associated with this article and doctor with status 'accept'
                $reviews = $like->article->reviews()->where('status', 'accept')->get();

                // Add one point to each doctor's points in the reviews table
                $reviews->each(function ($review) {
                    $review->doctor->increment('points');
                });
            }
            $notification=new Notification();
            $notification->Type="Article Like";
            $notification->data=["likesCount"=>$like->article->likes,"articleID"=>$like->article->id,"patientID"=>$like->patientID,"articleCat"=>$like->article->specialityID,"articleTitle"=>$like->article->name];
            $notification->userID=$like->article->Doctor->id;
            $notification->userType="doctor";
            $notification->save();

        });
        static::deleted(function ($like) {
            // Decrement the likes_count for the associated article
            $prenotification=Notification::where('type',"Article Like")->where('data->articleID',$like->article->id)->where('data->patientID',$like->patientID)->latest()->get()->first();
            $like->article->decrement('likes');

            // Check if the likes_count is no longer a multiple of 5
            if ($like->article->likes % 5 === 4) {
                // Subtract one point from the publisher's points in the article table
                $like->article->Doctor->decrement('points');

                // Find the reviews associated with this article and doctor with status 'accept'
                $reviews = $like->article->reviews()->where('status', 'accept')->get();

                // Subtract one point from each doctor's points in the reviews table
                $reviews->each(function ($review) {
                    $review->doctor->decrement('points');
                });
            }
            $prenotification->delete();
        });
    }
}