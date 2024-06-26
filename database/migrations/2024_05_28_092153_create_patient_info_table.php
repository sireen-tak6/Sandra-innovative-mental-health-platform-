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
        Schema::create('patientInfo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patientID');
            $table->text("data");
            $table->text("notes")->nullable();
            $table->integer("appointments")->nullable();
            $table->integer("appointmentsDone")->nullable();          
            $table->text("Banks")->nullable(); 
            $table->foreign('patientID')->references('id')->on('patients')->onDelete('cascade');
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
        Schema::dropIfExists('patientInfo');
    }
};