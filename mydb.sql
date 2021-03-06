-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`PERSON`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`PERSON` ;

CREATE TABLE IF NOT EXISTS `mydb`.`PERSON` (
  `PERSON_ID` INT NOT NULL AUTO_INCREMENT,
  `PERSON_FIRSTNAME` VARCHAR(45) NULL,
  `PERSON_LASTNAME` VARCHAR(45) NULL,
  `PERSON_EMAIL` VARCHAR(45) NULL,
  `PERSON_PASSWORD` CHAR(60) NULL,
  `PERSON_PHONE` VARCHAR(45) NULL,
  PRIMARY KEY (`PERSON_ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`RESTAURANT`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`RESTAURANT` ;

CREATE TABLE IF NOT EXISTS `mydb`.`RESTAURANT` (
  `RESTAURANT_ID` INT NOT NULL AUTO_INCREMENT,
  `RESTAURANT_NAME` VARCHAR(45) NULL,
  `RESTAURANT_OWNER` INT NULL,
  `RESTAURANT_POSTCODE` VARCHAR(45) NULL,
  `RESTAURANT_STREET` VARCHAR(45) NULL,
  `RESTAURANT_CITY` VARCHAR(45) NULL,
  `RESTAURANT_TABLE_COUNT` INT NULL,
  `RESTAURANT_PRE_BOOK` TINYINT NULL,
  `RESTAURANT_LATITUDE` DECIMAL(10,8) NOT NULL,
  `RESTAURANT_LONGITUDE` DECIMAL(11,8) NOT NULL,
  `RESTAURANT_CATEGORIES` VARCHAR(255) NULL,
  PRIMARY KEY (`RESTAURANT_ID`),
  INDEX `R_OWN_PERSON_idx` (`RESTAURANT_OWNER` ASC),
  CONSTRAINT `R_OWN_PERSON`
    FOREIGN KEY (`RESTAURANT_OWNER`)
    REFERENCES `mydb`.`PERSON` (`PERSON_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`STATUS`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`STATUS` ;

CREATE TABLE IF NOT EXISTS `mydb`.`STATUS` (
  `STATUS_ID` VARCHAR(25) NOT NULL,
  `STATUS_DESCRIPTION` VARCHAR(45) NULL,
  PRIMARY KEY (`STATUS_ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`ORDER_HEADER`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`ORDER_HEADER` ;

CREATE TABLE IF NOT EXISTS `mydb`.`ORDER_HEADER` (
  `ORDER_ID` INT NOT NULL AUTO_INCREMENT,
  `RESTAURANT_ID` INT NULL,
  `ORDER_STATUS` VARCHAR(25) NULL,
  `ORDER_FROM_SOCKET_ID` VARCHAR(45) NOT NULL,
  `ORDER_TABLE` INT NOT NULL,
  `ORDER_PROFILE_ID` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`ORDER_ID`),
  INDEX `ORD_RESTAURANT_idx` (`RESTAURANT_ID` ASC),
  INDEX `ORDER_STATUS_idx` (`ORDER_STATUS` ASC),
  CONSTRAINT `ORD_RESTAURANT`
    FOREIGN KEY (`RESTAURANT_ID`)
    REFERENCES `mydb`.`RESTAURANT` (`RESTAURANT_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ORDER_STATUS`
    FOREIGN KEY (`ORDER_STATUS`)
    REFERENCES `mydb`.`STATUS` (`STATUS_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`MENUTYPE`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`MENUTYPE` ;

CREATE TABLE IF NOT EXISTS `mydb`.`MENUTYPE` (
  `MENU_TYPE_ID` VARCHAR(25) NOT NULL,
  `MENU_DESCRIPTION` VARCHAR(45) NULL,
  PRIMARY KEY (`MENU_TYPE_ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`REVIEW`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`REVIEW` ;

CREATE TABLE IF NOT EXISTS `mydb`.`REVIEW` (
  `REVIEW_ID` INT NOT NULL AUTO_INCREMENT,
  `RESTAURANT_ID` INT NULL,
  `REVIEW_COMMENTS` VARCHAR(45) NULL,
  `REVIEW_RATING` INT NULL,
  `REVIEW_PERSON_ID` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`REVIEW_ID`),
  INDEX `REVIEW_RESTAURANT_idx` (`RESTAURANT_ID` ASC),
  CONSTRAINT `REVIEW_RESTAURANT`
    FOREIGN KEY (`RESTAURANT_ID`)
    REFERENCES `mydb`.`RESTAURANT` (`RESTAURANT_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`PRODUCT`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`PRODUCT` ;

CREATE TABLE IF NOT EXISTS `mydb`.`PRODUCT` (
  `PRODUCT_ID` INT NOT NULL AUTO_INCREMENT,
  `PRODUCT_PRICE` DECIMAL(15,2) NULL,
  `PRODUCT_NAME` VARCHAR(45) NULL,
  `PRODUCT_MENU_TYPE` VARCHAR(25) NULL,
  `RESTAURANT_ID` INT NULL,
  `PRODUCT_REVIEW_ID` INT NULL,
  `PRODUCT_DESCRIPTION` VARCHAR(255) NULL,
  PRIMARY KEY (`PRODUCT_ID`),
  INDEX `PROD_REST_idx` (`RESTAURANT_ID` ASC),
  INDEX `MENU_TYPE_idx` (`PRODUCT_MENU_TYPE` ASC),
  INDEX `PROD_REVIEW_idx` (`PRODUCT_REVIEW_ID` ASC),
  CONSTRAINT `PROD_REST`
    FOREIGN KEY (`RESTAURANT_ID`)
    REFERENCES `mydb`.`RESTAURANT` (`RESTAURANT_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MENU_TYPE`
    FOREIGN KEY (`PRODUCT_MENU_TYPE`)
    REFERENCES `mydb`.`MENUTYPE` (`MENU_TYPE_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `PROD_REVIEW`
    FOREIGN KEY (`PRODUCT_REVIEW_ID`)
    REFERENCES `mydb`.`REVIEW` (`REVIEW_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`ORDER_ITEM`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`ORDER_ITEM` ;

CREATE TABLE IF NOT EXISTS `mydb`.`ORDER_ITEM` (
  `ORDERITEM_ID` INT NOT NULL AUTO_INCREMENT,
  `ORDER_ID` INT NULL,
  `QUANTITY` INT NULL,
  `PRODUCT_ID` INT NULL,
  `ORDER_CUSTOM` VARCHAR(255) NULL,
  PRIMARY KEY (`ORDERITEM_ID`),
  INDEX `ORD_ID_ORD_ITM_idx` (`ORDER_ID` ASC),
  INDEX `ORD_ITM_PROD_idx` (`PRODUCT_ID` ASC),
  CONSTRAINT `ORD_ID_ORD_ITM`
    FOREIGN KEY (`ORDER_ID`)
    REFERENCES `mydb`.`ORDER_HEADER` (`ORDER_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ORD_ITM_PROD`
    FOREIGN KEY (`PRODUCT_ID`)
    REFERENCES `mydb`.`PRODUCT` (`PRODUCT_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`PAYMENT_METHOD`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`PAYMENT_METHOD` ;

CREATE TABLE IF NOT EXISTS `mydb`.`PAYMENT_METHOD` (
  `PAYMENT_METHOD_ID` INT NOT NULL AUTO_INCREMENT,
  `PAYMENT_METHOD_TYPE` VARCHAR(15) NULL,
  `PERSON_ID` INT NULL,
  `PAYMENT_CARD` CHAR(16) NULL,
  `PAYMENT_EXPIRY` DATE NULL,
  `PAYMENT_CVC` CHAR(3) NULL,
  PRIMARY KEY (`PAYMENT_METHOD_ID`),
  INDEX `PAY_PERSON_idx` (`PERSON_ID` ASC),
  CONSTRAINT `PAY_PERSON`
    FOREIGN KEY (`PERSON_ID`)
    REFERENCES `mydb`.`PERSON` (`PERSON_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`RESTAURANT_IMAGE`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`RESTAURANT_IMAGE` ;

CREATE TABLE IF NOT EXISTS `mydb`.`RESTAURANT_IMAGE` (
  `IMAGE_ID` INT NOT NULL AUTO_INCREMENT,
  `RESTAURANT_ID` INT NOT NULL,
  `PATH` VARCHAR(255) NULL,
  PRIMARY KEY (`IMAGE_ID`, `RESTAURANT_ID`),
  INDEX `RESTAURANT_ID_idx` (`RESTAURANT_ID` ASC),
  CONSTRAINT `RESTAURANT_ID`
    FOREIGN KEY (`RESTAURANT_ID`)
    REFERENCES `mydb`.`RESTAURANT` (`RESTAURANT_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`FOOD_CATEGORY`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`FOOD_CATEGORY` ;

CREATE TABLE IF NOT EXISTS `mydb`.`FOOD_CATEGORY` (
  `CATEGORY_ID` INT NOT NULL AUTO_INCREMENT,
  `CATEGORY_DESCRIPTION` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`CATEGORY_ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`RESTAURANT_CATEGORY`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`RESTAURANT_CATEGORY` ;

CREATE TABLE IF NOT EXISTS `mydb`.`RESTAURANT_CATEGORY` (
  `RESTAURANT_CATEGORY_ID` INT NOT NULL AUTO_INCREMENT,
  `RESTAURANT_ID` INT NOT NULL,
  `CATEGORY_ID` INT NOT NULL,
  PRIMARY KEY (`RESTAURANT_CATEGORY_ID`, `RESTAURANT_ID`, `CATEGORY_ID`),
  INDEX `RESTAURANT_ID_idx` (`RESTAURANT_ID` ASC),
  INDEX `CATEGORY_idx` (`CATEGORY_ID` ASC),
  CONSTRAINT `RESTAURANT_CATEGORY`
    FOREIGN KEY (`RESTAURANT_ID`)
    REFERENCES `mydb`.`RESTAURANT` (`RESTAURANT_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `CATEGORY`
    FOREIGN KEY (`CATEGORY_ID`)
    REFERENCES `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`FOOD_ALLERGY`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`FOOD_ALLERGY` ;

CREATE TABLE IF NOT EXISTS `mydb`.`FOOD_ALLERGY` (
  `FOOD_ALLERGY_ID` INT NOT NULL AUTO_INCREMENT,
  `FOOD_ALLERGY_DESCRIPTION` VARCHAR(255) NULL,
  PRIMARY KEY (`FOOD_ALLERGY_ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`FOOD_ALLERGY_PRODUCT`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`FOOD_ALLERGY_PRODUCT` ;

CREATE TABLE IF NOT EXISTS `mydb`.`FOOD_ALLERGY_PRODUCT` (
  `PRODUCT_ID` INT NOT NULL,
  `FOOD_ALLERGY_ID` INT NOT NULL,
  PRIMARY KEY (`PRODUCT_ID`, `FOOD_ALLERGY_ID`),
  INDEX `ALLERGY_ID_idx` (`FOOD_ALLERGY_ID` ASC),
  CONSTRAINT `PRODUCT`
    FOREIGN KEY (`PRODUCT_ID`)
    REFERENCES `mydb`.`PRODUCT` (`PRODUCT_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ALLERGY_ID`
    FOREIGN KEY (`FOOD_ALLERGY_ID`)
    REFERENCES `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
set global sql_mode='';

-- -----------------------------------------------------
-- Data for table `mydb`.`STATUS`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`STATUS` (`STATUS_ID`, `STATUS_DESCRIPTION`) VALUES ('CREATED', 'Created');
INSERT INTO `mydb`.`STATUS` (`STATUS_ID`, `STATUS_DESCRIPTION`) VALUES ('COMPLETED', 'Completed');
INSERT INTO `mydb`.`STATUS` (`STATUS_ID`, `STATUS_DESCRIPTION`) VALUES ('CONFIRMED', 'Confirmed');
INSERT INTO `mydb`.`STATUS` (`STATUS_ID`, `STATUS_DESCRIPTION`) VALUES ('DECLINED', 'Declined');
INSERT INTO `mydb`.`STATUS` (`STATUS_ID`, `STATUS_DESCRIPTION`) VALUES ('WTFORCONF', 'Waiting For Confirmation');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`MENUTYPE`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`MENUTYPE` (`MENU_TYPE_ID`, `MENU_DESCRIPTION`) VALUES ('MT_STARTER', 'Starter');
INSERT INTO `mydb`.`MENUTYPE` (`MENU_TYPE_ID`, `MENU_DESCRIPTION`) VALUES ('MT_SNK', 'Snack');
INSERT INTO `mydb`.`MENUTYPE` (`MENU_TYPE_ID`, `MENU_DESCRIPTION`) VALUES ('MT_DRINK', 'Drink');
INSERT INTO `mydb`.`MENUTYPE` (`MENU_TYPE_ID`, `MENU_DESCRIPTION`) VALUES ('MT_DSRT', 'Desert');
INSERT INTO `mydb`.`MENUTYPE` (`MENU_TYPE_ID`, `MENU_DESCRIPTION`) VALUES ('MT_MAIN', 'Main');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`FOOD_CATEGORY`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (1, 'Chinese');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (2, 'Mexican');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (3, 'Italian');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (4, 'Japanese');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (5, 'Greek');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (6, 'French');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (7, 'Thai');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (8, 'Spanish');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (9, 'Indian');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (10, 'American');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (11, 'British');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (12, 'African');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (13, 'Vietnamiese');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (14, 'Turkish');
INSERT INTO `mydb`.`FOOD_CATEGORY` (`CATEGORY_ID`, `CATEGORY_DESCRIPTION`) VALUES (15, 'Polish');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`FOOD_ALLERGY`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (1, 'Nuts');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (2, 'Fish');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (3, 'Shellfish');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (4, 'Milk');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (5, 'Eggs');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (6, 'Soy');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (7, 'Wheat');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (8, 'Gluten');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (9, 'Chicken');
INSERT INTO `mydb`.`FOOD_ALLERGY` (`FOOD_ALLERGY_ID`, `FOOD_ALLERGY_DESCRIPTION`) VALUES (10, 'Beef');

COMMIT;

