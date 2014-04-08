<?php
class BitpugLayout {
    private $layoutPath;

    private function initConfig()
    {
        $this->layoutPath = 'app/layout/layout.phtml';
    }

    private function renderLayout()
    {
        include_once $this->layoutPath;
    }

    public function bootstrap()
    {
        $this->initConfig();
        $this->renderLayout();
    }
}
