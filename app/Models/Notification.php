<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Admin;
class Notification extends Model
{
    use HasFactory;
    protected $table='notifications';
    protected $fillable=['type','data','userID','userType','read_at'];
    public function setDataAttribute($value)
    {
        $this->attributes['data'] = json_encode($value);
    }

    public function getDataAttribute($value)
    {
        return json_decode($value, true); // Cast to associative array
    }
    public function User()
    {
        if($this->userType=='doctor'){
            $user=Doctor::find($this->userID);
        }
        else if($this->userType=='patient'){
            $user=Patient::find($this->userID);
        }
        else{
            $user=Admin::find($this->userID);
 
        }
        return $user;
    }
}