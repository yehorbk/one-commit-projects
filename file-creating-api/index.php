<?php

    require_once("config.php");
    require_once("file.php");

    Config::enableCors();
    Config::createTempDirectory();

    $inputData = json_decode(file_get_contents('php://input'));
    $file = new File($inputData->name,
        $inputData->type, $inputData->content);

    $path = Config::TEMP_DIRECTORY_NAME."/"
        .$file->getName().".".$file->getType();
    $handle = fopen($path, 'w') or die('Cannot open file: '.$path);
    fwrite($handle, $file->getContent());
    fclose($handle);

    echo $path;

?>
