<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;

class Secretary extends Model
{
    use HasFactory ,HasApiTokens;

    protected $fillable = [
        'user_name',
        'password',
        'doctorID',
    ];

    
    protected $table='secretaries';
    public function doctor(): BelongsTo
    {
    return $this->belongsTo(Doctor::class, 'doctorID');
    }

}