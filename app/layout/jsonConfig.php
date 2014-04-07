<?php
    require_once "../lib/GetJsonConfig.php";
    $jsonConfig = new GetJsonConfig;
?>

<?= $jsonConfig->getJsonConfig() ?>