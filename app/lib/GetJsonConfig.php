<?php
class GetJsonConfig {

    private $jsonConfig;

    private function initPath ()
    {
        $this->jsonConfig = file_get_contents(realpath("../config.json"));
    }

    public function getJsonConfig()
    {
        return $this->jsonConfig;
    }
}