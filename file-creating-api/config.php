<?php

    class Config {
        const TEMP_DIRECTORY_NAME = 'temp';

        static function enableCors() {
            header('Content-type: text/html; charset=UTF-8');
            header('Access-Control-Allow-Origin: *'); 
            header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
        }

        static function createTempDirectory() {
            if(!file_exists(Config::TEMP_DIRECTORY_NAME)) {
                mkdir(Config::TEMP_DIRECTORY_NAME, 0777, true);
            }
        }
    }

?>
