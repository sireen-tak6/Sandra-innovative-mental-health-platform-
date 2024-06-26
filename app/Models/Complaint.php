<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model // Assuming this table represents appointments
{
    protected $fillable = [
        'patientID',
        'doctorID',
        'userType',
        'firstName',
        'lastName',
        'number',
        'email',
        'description',
        'firstImage',
        'secondImage',
        'thirdImage',
        'status'
    ];
    protected $table='complaints';

    public function Patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class,'patientID'); // Assuming your patient model is named 'Patient'
    }

    public function Doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class,'doctorID'); // Assuming your doctor model is named 'Doctor'
    }

}