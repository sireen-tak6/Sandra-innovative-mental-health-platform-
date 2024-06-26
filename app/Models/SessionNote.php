<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;

class SessionNote extends Model
{
    use HasFactory ,HasApiTokens;

    protected $fillable = [
        'Notes',
        'preMed',
        'postMed',
        'patientID',
        'doctorID',
        'appointmentID'
    ];

    
    protected $table='sessionNotes';
    public function doctor(): BelongsTo
    {
    return $this->belongsTo(Doctor::class, 'doctorID');
    }
    public function patient(): BelongsTo
    {
    return $this->belongsTo(Patient::class, 'patientID');
    }
    public function appointment(): BelongsTo
    {
    return $this->belongsTo(Appointment::class, 'appointmentID');
    }

}