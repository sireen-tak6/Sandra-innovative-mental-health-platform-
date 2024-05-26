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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->integer('day');
            $table->string('time');
            $table->string('date');
            $table->String('state')->default('onsite');
            $table->String('type')->default('waiting');
            $table->unsignedBigInteger('doctorID');
            $table->unsignedBigInteger('patientID')->nullable();
            $table->foreign('doctorID')->references('id')->on('doctors')->onDelete('cascade');
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
        Schema::dropIfExists('appointments');
    }
};