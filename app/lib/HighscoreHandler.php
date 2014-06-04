<?php

require_once "DbConnect.php";

class HighscoreHandler extends DbConnect {
	private $username, $level, $points, $ip, $location, $lastRow;

	public function writeHighscore($username, $level, $points)
	{
		$this->username = $this->db->real_escape_string($username);
		$this->level = $this->db->real_escape_string($level);
		$this->points = $this->db->real_escape_string($points);
		$this->location = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
		$this->ip = $_SERVER['REMOTE_ADDR'];

		$ipResult = $this->db->query("SELECT * FROM `highscores` WHERE ip = '" . $this->ip . "';");
		$this->lastRow = null;
		while($row = $ipResult->fetch_object())
		{
			$this->lastRow = $row;
		}

		if($this->lastRow == null)
		{
			$this->_write();
		}
		else
		{
			$diff = round((time() - strtotime($this->lastRow->crdate))/60);
			if($diff > HS_DELAY)
			{
				$this->_write();
			}
		}
	}

	public function listHighscores()
	{
		echo "<table>";
		echo "<tr>";
		echo "<td>Username</td><td>Level</td><td>Points</td><td>Location</td>";
		echo "</tr>";
		$result = $this->db->query("SELECT * FROM `highscores`");
		while($row = $result->fetch_object())
		{
			echo "<tr>";
			echo "<td>" . $row->username . "</td>";
			echo "<td>" . $row->level . "</td>";
			echo "<td>" . $row->points . "</td>";
			echo "<td>" . $row->location . "</td>";
			echo "</tr>";
		}
		echo "</table>";
		exit;
	}

	private function _write()
	{
		if($this->lastRow !== null)
		{
			if($this->points >= $this->lastRow->points)
			{
				$this->db->query("DELETE FROM `highscores`
					WHERE id = ". $this->lastRow->id .";");

				$this->db->query("DELETE FROM `highscores`
					WHERE ip = '" . $this->ip . "';");
			}

			if($this->points > $this->lastRow->points)
			{
				$this->db->query("INSERT INTO `highscores`
					(username, level, points, location, ip)
						VALUES
					('" . $this->username . "', '" . $this->level . "', '" . $this->points . "', '" . $this->location . "', '" . $this->ip . "');");
			}
		}
		else
		{
			$this->db->query("INSERT INTO `highscores`
					(username, level, points, location, ip)
						VALUES
					('" . $this->username . "', '" . $this->level . "', '" . $this->points . "', '" . $this->location . "', '" . $this->ip . "');");
		}
	}
}