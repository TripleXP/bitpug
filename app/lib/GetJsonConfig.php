<?php
class GetJsonConfig {

    private $jsonConfig;

    private function initPath()
    {
        $path = '../config.json';
        $this->jsonConfig = file_get_contents($path);
    }

    public function getJsonConfig()
    {
        $this->initPath();
        return $this->jsonConfig;
    }
}