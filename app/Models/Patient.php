<?php

namespace App\Models ;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\Authenticatable;

class Patient extends Model implements Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'user_name',
        'email',
        'password',
        'available',       
        'email_verified_at',
        'verification_token',
        'new_email',
        'new_verification_token'
    ];

 


    //this the relationship between the patients table and the chats table 
    public function chats ():HasMany
    {
        return $this->hasMany(Chat::class , 'patiet_id'); 
    }

    public function Appointments ():HasMany
    {
        return $this->hasMany(Appointment::class , 'patientID'); 
    }
    
    public function getAuthIdentifierName()
    {
        return 'id'; // Replace with the name of the primary key column in the patients table
    }

    public function getAuthIdentifier()
    {
        return $this->getKey();
    }
    public function getAuthPassword()
    {
        return $this->password;
    }

    public function getRememberToken()
    {
        return $this->remember_token;
    }

    public function setRememberToken($value)
    {
        $this->remember_token = $value;
    }

    public function getRememberTokenName()
    {
        return 'remember_token';
    }
    public function likedArticles()
    {
        return $this->belongsToMany(Article::class, 'Articleslikes','patientID','articleID')->withTimestamps();
    }

    
    public function reportedArticles()
    {
        return $this->belongsToMany(Article::class, 'ArticlesReports','patientID','articleID');
    }
    
    // this section for verfiy by email 
    public function hasVerifiedEmail()
    {
        return $this->email_verified_at !== null;
    }

    public function markEmailAsVerified()
    {
        $this->email_verified_at = now();
        $this->save();
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail);
    }
    
    public function getEmailForVerification()
    {
        return $this->email;
    }
}