<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne; 
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Laravel\Scout\Searchable;


class Doctor extends Model implements Authenticatable, MustVerifyEmailContract
{
    use HasFactory , HasApiTokens ,Notifiable,Searchable;

    
    protected $fillable = [
        'user_name',
        'email',
        'password',
        'points',
        'address',
        'about',
        'university',
        'phone',
        'available',
        'gender',
        'speciality',
        'email_verified_at',
        'verification_token',
        'new_email',
        'new_verification_token'
    ];
    
    protected $appends = ['Document', 'isVerfiy'];

    protected $guard = "doctors" ; 

    public function Patients(): HasMany
    {
        return $this->hasMany(Patient::class, 'doctor_id');
    }
    /*public function Schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'doctorID');
    }*/
    public function Category():BelongsTo
    {
        return $this->belongsTo(Category::class, 'speciality');
    }
    public function Secertary():HasOne
    {
        return $this->hasOne(Secertarie::class , 'doctor_id'); 
    }
    
    //this is the relationship between the doctors and the chats tables 
    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class, 'doctor_id');
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
    
    public function DoctorLikes(): HasMany
    {
        return $this->hasMany(Like::class, 'doctor_id');
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
    
    public function Articles():HasMany{
        return $this->hasMany(Article::class,'doctorID');

    }
    
    public function reviewedArticles()
    {
        return $this->belongsToMany(Review::class, 'reviews','doctorID','articleID');
    }
    public function toSearchableArray()
    {
        return [
        'user_name' => $this->user_name,
        'points' => $this->points,
        'address' => $this->address,
        'about' => $this->about,
        'university' => $this->university,
        'phone' => $this->phone,
        'gender' => $this->gender,
        'speciality' => $this->speciality
        ];
    }
    
    public function getDocumentAttribute()
    {
        $document = DoctorVerfiy::select('filename')
            ->where('doctor_id', $this->id)
            ->first();

        if ($document) {
            $url = $document->filename;
            return $url;
        }

        return null;
    }



    public function getIsVerfiyAttribute()
    {
        $doctorVerfiy = DoctorVerfiy::where('doctor_id', $this->id)->first();

        if ($doctorVerfiy) {
            return $doctorVerfiy->isVerfiy;
        }

        return false;
    }
}