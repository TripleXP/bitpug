<?php
    require_once "../lib/GetJsonConfig.php";
    $jsonConfig = new GetJsonConfig;
?>

<?= preg_replace('!/\*.*?\*/!s', '', $jsonConfig->getJsonConfig()) ?>