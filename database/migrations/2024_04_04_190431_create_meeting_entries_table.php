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
        Schema::create('meeting_entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id')->nullable(); 
            $table->foreign('patient_id')->references('id')
                ->on('patients')
                ->onDelete('cascade');
            $table->unsignedBigInteger('doctor_id')->nullable(); 
            $table->foreign('doctor_id')->references('id')
                ->on('doctors')
                ->onDelete('cascade'); 
            $table->string('url')->nullable(); 
            $table->string('status')->nullable();
            $table->string('name')->nullable();
            $table->bigInteger('random_user')->nullable();   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_entries');
    }
};
