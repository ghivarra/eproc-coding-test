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
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('website', 200)->nullable();
            $table->year('founded_at');
            $table->bigInteger('user_id')->unsigned()->index();
            $table->timestamps();
            $table->softDeletes();

            // assign foreign key
            $table->foreign('user_id')->references('id')->on('users')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::create('fields', function(Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('subfields', function(Blueprint $table) {
            $table->id();
            $table->bigInteger('field_id')->unsigned()->index();
            $table->string('name');

            // assign foreign key
            $table->foreign('field_id')->references('id')->on('fields')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('catalogs', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('title', 500);
            $table->string('number', 255);
            $table->string('method', 500);
            $table->string('location', 500);
            $table->string('qualification', 1000);
            $table->integer('value')->unsigned();
            $table->bigInteger('vendor_id')->unsigned()->index();
            $table->text('description');
            $table->date('register_date_start');
            $table->date('register_date_end');
            $table->timestamps();
            $table->softDeletes();

            // assign foreign key
            $table->foreign('vendor_id')->references('id')->on('vendors')->restrictOnDelete()->cascadeOnUpdate();
        });

        Schema::create('catalogs_fields_subfields', function(Blueprint $table) {
            $table->id();
            $table->bigInteger('catalog_id')->unsigned()->index();
            $table->bigInteger('field_id')->unsigned()->index();
            $table->bigInteger('subfield_id')->unsigned()->index();

            // assign foreign key
            $table->foreign('catalog_id')->references('id')->on('catalogs')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('field_id')->references('id')->on('fields')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('subfield_id')->references('id')->on('subfields')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // drop foreign keys first then table
        Schema::table('catalogs_fields_subfields', function(Blueprint $table) {
            $table->dropForeign('catalogs_fields_subfields_catalog_id_foreign');
            $table->dropForeign('catalogs_fields_subfields_field_id_foreign');
            $table->dropForeign('catalogs_fields_subfields_subfield_id_foreign');
        });

        Schema::table('catalogs', function (Blueprint $table) {
            $table->dropForeign("catalogs_subfield_id_foreign");
        });

        Schema::table('subfields', function (Blueprint $table) {
            $table->dropForeign("subfields_field_id_foreign");
        });

        Schema::table('vendors', function (Blueprint $table) {
            $table->dropForeign("vendors_user_id_foreign");
        });       

        // drop tables
        Schema::dropIfExists('catalogs_fields_subfields');
        Schema::dropIfExists('catalogs');
        Schema::dropIfExists('subfields');
        Schema::dropIfExists('fields');
        Schema::dropIfExists('vendors');
    }
};
