<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;

class Schedule extends Model
{
    use HasFactory ,HasApiTokens;

    protected $fillable = [
        'day',
        'start_time',
        'status',
        'type',
        'doctorID',
    ];

    
    protected $table='schedules';
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctorID');
    }

}