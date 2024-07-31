<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        "path",
        "doctor_id",
        "description",
        "category",
    ];

    protected $appends = ['doctor_name' , 'like' , 'report'];
    public function getDoctorNameAttribute()
    {
        // Assuming the foreign key column is 'doctor_id' in the posts table
        // and the doctor's name is stored in the 'name' column of the doctors table
        if ($this->doctor) {
            return $this->doctor->user_name;
        }

        return null;
    }
    
    protected $table = "posts";

    public function doctors(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function plikes():HasMany
    {
        return $this->hasMany(Post::class , 'post_id'); 
    }

    public function dlikes():HasMany
    {
        return $this->hasMany(Post::class , 'post_id'); 
    }

    public function getLikeAttribute ()
    {
        $like = Plike::where('post_id', $this->id)->count();
        if($like)
        {
            return $like; 
        }
        else 
        return 0;
    }    

    public function getReportAttribute () 
    {
        $dlike = Dlike::where('post_id', $this->id )->count();
        if ($dlike)
        {
            return $dlike ; 
        }
        else 
        return 0; 
    }

}
