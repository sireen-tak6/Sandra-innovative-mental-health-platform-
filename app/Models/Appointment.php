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
        'patientID',
        "pay",
        "duration",
        "timeType",
        "cost",
        "PatientBanks",
        "DoctorBanks", 
        "realPatientDuration",
        "realDuration",
        "endUser",
        "autoClose",
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
    public function Note():HasOne
    {
        return $this->hasOne(sessionNote::class , 'appointmentID'); 
    }
    public function setDoctorBanksAttribute($value)
    {
        $this->attributes['DoctorBanks'] = json_encode($value);
    }

    public function getDoctorBanksAttribute($value)
    {
        return json_decode($value, true); // Cast to associative array
    }
    public function setPatientBanksAttribute($value)
    {
        $this->attributes['PatientBanks'] = json_encode($value);
    }

    public function getPatientBanksAttribute($value)
    {
        return json_decode($value, true); // Cast to associative array
    }
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($appointment) {
            if($appointment->patientID!==null){

                $patientInfo = PatientInfo::where('patientID', $appointment->patientID)->first();
                if ($patientInfo) {
                    $appointment->PatientBanks = $patientInfo->Banks;
                }
                
            }
            $doctor=Doctor::find($appointment->doctorID);
            $appointment->DoctorBanks=$doctor->Banks;
        
            
        });
    }

}