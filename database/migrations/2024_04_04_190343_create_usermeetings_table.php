<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usermeetings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id')->nullable(); 
            $table->unsignedBigInteger('doctor_id')->nullable(); 
            $table->string('app_id')->nullable(); 
            $table->string('channel')->nullable(); 
            $table->string('appCertificate')->nullable();
            $table->string('url')->nullable();  
            $table->string('uid')->nullable();
            $table->foreign('patient_id')->references('id')
                ->on('patients')
                ->onDelete('cascade');
            $table->foreign('doctor_id')->references('id')
                ->on('doctors')
                ->onDelete('cascade');    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usermeetings');
    }
};
