<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Notification;
use Carbon\Carbon;

class ArticleReport extends Model
{
    use HasFactory;
    
    protected $table='ArticlesReports';
    protected $fillable=['patientID','articleID'];
    public function article()
    {
        return $this->belongsTo(Article::class,'articleID');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    //change doctors points 
    protected static function boot()
    {
        parent::boot();
        static::created(function ($report) {
            // Increment the reports_count for the associated article
            $report->article->increment('reports');
            // Check if the reports_count is a multiple of 3
            if ($report->article->reports % 3 === 0) {
                $report->article->Doctor->decrement('points');
                $reviews = $report->article->reviews();
                // Add one point to each doctor's points in the reviews table
                $reviews->each(function ($review) {
                    if($review->status==="reject"){
                        $review->doctor->increment('points');
                    }
                    else{
                        $review->doctor->decrement('points');

                    }
                });
            }
            $prenotification=Notification::where('type','Article Report')->where('data->articleID',$report->article->id)->whereNull("read_at")->limit(1)->first();
            if($prenotification){
                $count=intval($prenotification->data->count);
                $count=$count+1;
                $prenotification->data->count=$count;
                $prenotification->created_at=Carbon::now();
                $prenotification->save();
            }
            else{
                $notification=new Notification();
                $notification->Type="Article Report";
                $notification->data=["count"=>1,"articleID"=>$report->article->id,"articleCat"=>$report->article->specialityID,"articleTitle"=>$report->article->name];
                $notification->userID=$report->article->Doctor->id;
                $notification->userType="doctor";
                $notification->save();
            }
        });
    }
}