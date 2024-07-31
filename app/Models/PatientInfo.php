<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\Patient;

class PatientInfo extends Model
{
    use HasFactory;
    protected $table='patientInfo';
    protected $fillable=['patientID','data','notes','appointments','appointmentsDone','Banks'];
    public function setDataAttribute($value)
    {
        $this->attributes['data'] = json_encode($value);
    }

    public function getDataAttribute($value)
    {
        return json_decode($value, true); // Cast to associative array
    }
    public function setNotesAttribute($value)
    {
        $this->attributes['notes'] = json_encode($value);
    }

    public function getNotesAttribute($value)
    {
        return json_decode($value, true); // Cast to associative array
    }
    public function patient(): BelongsTo
    {
    return $this->belongsTo(Patient::class, 'patientID');
    }
    public function setBanksAttribute($value)
    {
        $this->attributes['Banks'] = json_encode($value);
    }

    public function getBanksAttribute($value)
    {
        return json_decode($value, true); // Cast to associative array
    }

    
}