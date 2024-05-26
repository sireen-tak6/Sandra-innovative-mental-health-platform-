<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;

class Appointment extends Model
{
    use HasFactory ,HasApiTokens;

    protected $fillable = [
        'day',
        'time',
        'date',
        'state',
        'type',
        'doctorID',
        'patientID'
    ];

    
    protected $table='appointments';
    public function Patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class , 'patientID'); 
    }   
    public function Doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class , 'doctorID'); 
    }

}