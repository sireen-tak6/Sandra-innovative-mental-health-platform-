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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image');
            $table->string('content');
            $table->unsignedBigInteger('specialityID');
            $table->unsignedBigInteger('doctorID');
            $table->string('status');
            $table->integer('reviews_count')->default(0);
            $table->string('adminReview',500)->nullable();
            $table->integer('likes');
            $table->integer('reports');
            $table->datetime('date');
            $table->foreign('specialityID')->references('id')->on('speciality')->onDelete('cascade');
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
        Schema::dropIfExists('articles');
    }
};