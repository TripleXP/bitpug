-- Default tables for bitpug --

-- Highscores --

CREATE TABLE IF NOT EXISTS `highscores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `crdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;