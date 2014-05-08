<?php
require_once "app/lib/BitpugLayout.php";

// Define application environment
if(preg_match('/local/', $_SERVER['HTTP_HOST']))
{
	define('APPLICATION_ENV', 'development');
}
else
{
	define('APPLICATION_ENV', 'production');
}

// Create page from layout
$bitpug = new BitpugLayout;
$bitpug->bootstrap();