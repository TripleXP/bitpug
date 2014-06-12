<?php

class DbConnect {
	private $host, $username, $password;
	public $db;

	public function __construct()
	{
		 $this->host = DB_HOST;
		 $this->username = DB_USERNAME;
		 $this->password = DB_PASSWORD;

		// Connects to host
		$this->_connectHost();

		// Check db
		if(!@file_exists('INSTALL.ED')) $this->_checkDb();
		else $this->db->select_db(DB_NAME);
	}

	private function _connectHost()
	{
		$this->db = new mysqli($this->host, $this->username, $this->password);
		if($this->db->connect_errno)
		{
			echo "Failed to connect to Database: " . $this->db->connect_error;
			exit;
		}
	}

	private function _checkDb()
	{
		$this->db->query("CREATE DATABASE IF NOT EXISTS " . DB_NAME . ";");
		$this->db->select_db(DB_NAME);

		if(@file_exists(SQL_DUMP_FILE))
		{
			$this->_createTablesFromDump();
		}
	}

	private function _createTablesFromDump()
	{
		if(!$this->db->multi_query(file_get_contents(SQL_DUMP_FILE)))
		{
			echo "ERROR DUMP: " . $this->db->error;
			exit;
		}

		$this->_setInstallFlag();
	}

	private function _setInstallFlag()
	{
		@fopen("INSTALL.ED", "w");
	}
}