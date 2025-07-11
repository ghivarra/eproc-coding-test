<?php

namespace Database\Seeders;

use App\Models\Field;
use App\Models\Subfield;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->fieldSeeder();
        $this->subfieldSeeder();
    }

    //=================================================================================================

    private function fieldSeeder(): void
    {
        $fields = [
            ['name' => 'Konstruksi - Jasa Pelaksana'], // id = 1
            ['name' => 'Sistem Informasi - Jasa Pelaksana'], // id = 2
        ];

        Field::insert($fields);
    }

    //=================================================================================================

    private function subfieldSeeder(): void
    {
        $subfields = [
            ['field_id' => 1, 'name' => 'Pelaksana konstruksi jalan raya dan rel kereta api'],
            ['field_id' => 1, 'name' => 'Pelaksana konstruksi bangunan jenis rumah hunian'],
            ['field_id' => 2, 'name' => 'Pelaksana pembuatan jaringan komunikasi dan internet bangunan'],
            ['field_id' => 2, 'name' => 'Pelaksana pembuatan dan pengembangan aplikasi'],
        ];

        Subfield::insert($subfields);
    }

    //=================================================================================================
}
