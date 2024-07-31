<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dlike extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'patient_id',
        'post_id',
        'report',
    ];
    protected $table = 'dlikes'; 

    public function patients():BelongsTo
    {
        return $this->belongsTo(Patient::class , 'patient_id'); 
    }

    public function posts():BelongsTo
    {
        return $this->belongsTo(Post::class , 'post_id'); 
    }
}
