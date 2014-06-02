<?php
// Define application environment and handle error reporting
if(preg_match('/local/', $_SERVER['HTTP_HOST']) ||
	preg_match('/nb/', $_SERVER['HTTP_HOST']))
{
	define('APPLICATION_ENV', 'development');
	ini_set('display_errors', '1');
	error_reporting(E_ALL);
}
else
{
	define('APPLICATION_ENV', 'production');
	ini_set('display_errors', '0');
	error_reporting(0);
}

// Global password
define('GLOBAL_PASSWORD', '73j&)1!ßß34');

// Highscore request delay (minutes)
define('HS_DELAY', -5);

// Databse connection
define("DB_HOST", 'localhost');
define("DB_USERNAME", 'root');
define("DB_PASSWORD", 'nb132ma');

// Database (should not be changed)
define("DB_NAME", 'bitpug');

// SQL Dump
define("SQL_DUMP_FILE", 'asset/common/sql/defaultTables.sql');

// Get layout class
require_once "app/lib/BitpugLayout.php";

// Create page from layout
$bitpug = new BitpugLayout;
$bitpug->bootstrap();