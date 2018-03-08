-- MySQL dump 10.13  Distrib 5.7.21, for osx10.13 (x86_64)
--
-- Host: localhost    Database: student_information_system
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `address_id` char(10) NOT NULL,
  `postal_code` char(5) DEFAULT NULL,
  `province` varchar(35) DEFAULT NULL,
  `city` varchar(35) DEFAULT NULL,
  `country` varchar(35) DEFAULT NULL,
  `other_address_details` varchar(35) DEFAULT NULL,
  `student_id` char(10) NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES ('2.1.1','57781','Jawa Timur','Surabaya','Indonesia','Jl. Sirojuadin 45, RT09/VII','1.1.1'),('2.1.2','57686','Jawa Timur','Pacitan','Indonesia','Jl.Timur 21, RT03/VII, Nampu','1.1.2'),('2.1.3','45434','Jawa Barat','Sukabumi','Indonesia','Jl.Laweyan 23, RT01/V, Jebres','1.1.3');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `degree`
--

DROP TABLE IF EXISTS `degree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `degree` (
  `degree_id` char(10) NOT NULL,
  `diploma` varchar(7) DEFAULT NULL,
  `bachelor` varchar(5) DEFAULT NULL,
  `magister` varchar(5) DEFAULT NULL,
  `student_id` char(10) NOT NULL,
  PRIMARY KEY (`degree_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `degree_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `degree`
--

LOCK TABLES `degree` WRITE;
/*!40000 ALTER TABLE `degree` DISABLE KEYS */;
INSERT INTO `degree` VALUES ('3.1.1','A.Md','','','1.1.1'),('3.1.2','A.Md','','','1.1.2'),('3.1.3','','S.S.T','','1.1.3');
/*!40000 ALTER TABLE `degree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `major`
--

DROP TABLE IF EXISTS `major`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `major` (
  `major_id` char(10) NOT NULL,
  `law` varchar(20) DEFAULT NULL,
  `engineering` varchar(20) DEFAULT NULL,
  `science` varchar(20) DEFAULT NULL,
  `economy` varchar(20) DEFAULT NULL,
  `physician` varchar(20) DEFAULT NULL,
  `animal_farm` varchar(20) DEFAULT NULL,
  `art` varchar(20) DEFAULT NULL,
  `sosial` varchar(20) DEFAULT NULL,
  `student_id` char(10) NOT NULL,
  PRIMARY KEY (`major_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `major_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `major`
--

LOCK TABLES `major` WRITE;
/*!40000 ALTER TABLE `major` DISABLE KEYS */;
INSERT INTO `major` VALUES ('4.1.1','Law','','','','','','','','1.1.1'),('4.1.2','','Telecommunication','','','','','','','1.1.2'),('4.1.3','','','','','','','','Music','1.1.3');
/*!40000 ALTER TABLE `major` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `student_id` char(10) NOT NULL,
  `first_name` varchar(15) DEFAULT NULL,
  `last_name` varchar(15) DEFAULT NULL,
  `middle_name` varchar(15) DEFAULT NULL,
  `place_of_birth` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email_address` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('1.1.1','Sisca','Kusuma','Putri','Wonogiri','1996-12-02','081215728635','sisca@gmail.com'),('1.1.2','Putra','Sugianto','Brilian','Semarang','1996-12-09','081687880997','putra@gmail.com'),('1.1.3','Mahendra','Jaya','Arga','Solo','1997-12-09','082534787990','arga@gmail.com');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-07 14:18:07
