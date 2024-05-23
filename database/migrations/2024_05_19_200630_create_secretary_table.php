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
        Schema::create('secretaries', function (Blueprint $table) {
            $table->id();
            $table->string('user_name');
            $table->string('password');
            $table->unsignedBigInteger('doctorID');
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
        //
    }
};