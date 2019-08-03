CREATE SCHEMA `phoenixbabel` DEFAULT CHARACTER SET utf8;
CREATE TABLE `phoenixbabel`.`users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `salt` VARCHAR(45) NOT NULL,
  `gamepassword` VARCHAR(255) NULL,
  `friendlyname` VARCHAR(255) NOT NULL DEFAULT 'NewUser',
  `last_login` DATETIME NOT NULL DEFAULT NOW(),
  `created_at` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX (`username`))
  ENGINE=InnoDB
;
CREATE TABLE `phoenixbabel`.`messages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `sent_at` DATETIME NOT NULL DEFAULT NOW(),
  `from_fk` BIGINT NOT NULL,
  `to_fk` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`from_fk`),
  INDEX (`to_fk`),
  CONSTRAINT FOREIGN KEY (`from_fk`)
    REFERENCES `phoenixbabel`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (`to_fk`)
    REFERENCES `phoenixbabel`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
    ENGINE=InnoDB
;
CREATE TABLE `phoenixbabel`.`creatures` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `content` JSON NOT NULL,
  `sent_at` DATETIME NOT NULL DEFAULT NOW(),
  `from_fk` BIGINT NOT NULL,
  `to_fk` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`from_fk`),
  INDEX (`to_fk`))
  ENGINE=InnoDB
;
