<?php

namespace App\Models;
use App\Models\Doctor;
use App\Models\Notification;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Article extends Model
{
    use HasFactory,Searchable;
    protected $table='articles';
    protected $fillable=[
        'name',
        'specialityID',
        'content',
        'image',
        'date',
        'doctorID',
        'likes',
        'reports',
        'status',
        'reviews_count',
        'adminReview'
    ];
    public function Category():BelongsTo
    {
        return $this->belongsTo(Category::class, 'specialityID');
    }
    public function Doctor():BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctorID');
    }
    public function likes()
    {
        return $this->hasMany(ArticleLike::class,'articleID');
    }
    
    
    public function reports()
    {
        return $this->hasMany(ArticleReport::class,'articleID');
    }
    public function reviews() {
        return $this->hasMany(Review::class, 'articleID');
    }

    //change article status automatically depends on reviews status,count and difference in points of reviewers
    public function checkAndUpdateStatus()
    {
        $doctorCount=Doctor::where('email_verified_at' ,'!=', null)->count();
        $minreviews= min(3,$doctorCount-1);
        if ($this->reviews_count >= $minreviews && $this->status=='pending' ) {
            $reviews = $this->reviews;
            
            $acceptCount = $reviews->where('status', 'accept')->count();
            $rejectCount = $reviews->where('status', 'reject')->count();
            if ($acceptCount == $minreviews) {
                $this->status = 'published';
            } elseif ($rejectCount == $minreviews) {
                $this->status = 'rejected';
            } else {
                $avgAcceptPoints = $reviews->where('status', 'accept')->avg('doctor.points');
                $avgRejectPoints = $reviews->where('status', 'reject')->avg('doctor.points');
                $pointDifference = abs($avgAcceptPoints - $avgRejectPoints);
                
                if ($pointDifference <= 10) {
                    $this->status = 'adminChoice';
                } elseif ($avgAcceptPoints > $avgRejectPoints) {
                    $this->status = 'published';
                } else {
                    $this->status = 'rejected';
                }
                
            }
            $this->save();
            if($this->status=='published'||$this->status=='rejected'){
                $notification=new Notification();
                $notification->Type="Article Review";
                $notification->data=["status"=>$this->status,"articleID"=>$this->id,"articleTitle"=>$this->name];
                $notification->userID=$this->Doctor->id;
                $notification->userType="doctor";
                $notification->save();
            }
        }       
    }
    public function toSearchableArray()
    {

    
        return [
            'name' => $this->name,
            'content' => $this->content,
            'date' => $this->date,
        ];
    }
}