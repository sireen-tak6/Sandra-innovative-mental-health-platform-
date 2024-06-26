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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patientID')->nullable();
            $table->unsignedBigInteger('doctorID')->nullable();
            $table->String('userType');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('number');
            $table->string('email');
            $table->string('description');
            $table->string("firstImage")->nullable();
            $table->string("secondImage")->nullable();
            $table->string("thirdImage")->nullable();
            $table->String("status")->default("workingOn");
            $table->foreign('patientID')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('doctorID')->references('id')->on('doctors')->onDelete('cascade');
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
        Schema::dropIfExists('complaints');
    }
};