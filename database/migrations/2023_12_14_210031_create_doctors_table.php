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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('user_name'); 
            $table->string('email'); 
            $table->string('points')->default(0); 
            $table->string('password'); 
            $table->string('address')->nullable();
            $table->string('about')->nullable();
            $table->string('university')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('available')->default(false);
            $table->unsignedBigInteger('speciality')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('verification_token')->nullable();
            $table->foreign('speciality')->references('id')->on('speciality')->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};