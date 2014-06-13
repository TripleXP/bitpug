<?php
// Get layout class
require_once "app/lib/BitpugLayout.php";

// Define application environment and handle error reporting
if(preg_match('/local/', $_SERVER['HTTP_HOST']) ||
	preg_match('/nb/', $_SERVER['HTTP_HOST']) ||
	preg_match('/192.168.7.177/', $_SERVER['HTTP_HOST']))
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
define('HS_DELAY', 1);

// Databse connection
if(APPLICATION_ENV == 'development')
{
	define("DB_HOST", 'localhost');
	define("DB_USERNAME", 'root');
	define("DB_PASSWORD", '');
	define("DB_NAME", 'bitpug');
}
else
{
	define("DB_HOST", 'rdbms.strato.de');
	define("DB_USERNAME", 'U1493781');
	define("DB_PASSWORD", '');
	define("DB_NAME", 'DB1493781');
}

// SQL Dump
define("SQL_DUMP_FILE", 'asset/common/sql/defaultTables.sql');

// Create page from layout
$bitpug = new BitpugLayout;
$bitpug->bootstrap();
