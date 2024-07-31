<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sessionNotes', function (Blueprint $table) {
            $table->id();
            $table->String('Notes',2500)->nullable();
            $table->String('preMed',2500)->nullable();
            $table->String('postMed',2500)->nullable();
            $table->unsignedBigInteger('patientID');
            $table->unsignedBigInteger('doctorID');
            $table->unsignedBigInteger('appointmentID');
            $table->foreign('patientID')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('doctorID')->references('id')->on('doctors')->onDelete('cascade');
            $table->foreign('appointmentID')->references('id')->on('appointments')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('session_notes');
    }
};