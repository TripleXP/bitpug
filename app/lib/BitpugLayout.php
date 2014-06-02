<?php

require_once "HighscoreHandler.php";

class BitpugLayout extends HighscoreHandler{
    private $layoutPath;

    private function initConfig()
    {
        $this->layoutPath = 'app/layout/layout.phtml';
    }

    private function renderLayout()
    {
        include_once $this->layoutPath;
    }

    private function checkHighscore()
    {
        if(isset($_GET['hs']) && $_GET['hs'] == true)
        {
            if(isset($_GET['username']) &&
                isset($_GET['level']) &&
                isset($_GET['points']))
            {
                $this->writeHighscore($_GET['username'], $_GET['level'], $_GET['points']);
            }
            else
            {
                echo "false";
            }
            exit;
        }
    }

    public function bootstrap()
    {
        $this->checkHighscore();
        $this->initConfig();
        $this->renderLayout();
    }
}
