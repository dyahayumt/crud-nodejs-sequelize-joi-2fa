-- MySQL dump 10.13  Distrib 5.7.21, for osx10.13 (x86_64)
--
-- Host: localhost    Database: student_info
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
-- Temporary table structure for view `frek`
--

DROP TABLE IF EXISTS `frek`;
/*!50001 DROP VIEW IF EXISTS `frek`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `frek` AS SELECT 
 1 AS `month`,
 1 AS `freq`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `freq_gen`
--

DROP TABLE IF EXISTS `freq_gen`;
/*!50001 DROP VIEW IF EXISTS `freq_gen`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `freq_gen` AS SELECT 
 1 AS `gender`,
 1 AS `freq_gender`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `frequency`
--

DROP TABLE IF EXISTS `frequency`;
/*!50001 DROP VIEW IF EXISTS `frequency`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `frequency` AS SELECT 
 1 AS `date_time`,
 1 AS `count(*)`*/;
SET character_set_client = @saved_cs_client;

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
  `gender` enum('M','F') NOT NULL,
  `place_of_birth` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email_address` varchar(30) DEFAULT NULL,
  `date_time` date DEFAULT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('1.1.1','Sisca','Kusuma','Putri','F','Wonogiri','1996-12-02','082137383728','siska@gmail.com','2018-01-12'),('1.1.2','Putra','Sugianto','Brilian','M','Semarang','1996-12-09','081687880997','putra@gmail.com','2018-02-01'),('1.1.3','Mahendra','Jaya','Arga','M','Solo','1997-12-09','082828282893','arga@gmail.com','2018-02-01'),('1.1.4','Dyah','Firmanda','Ananda','F','Wonogiri','1994-08-19','081238363829','dyah@gmail.com','2018-03-12'),('1.1.5','Soraya','Parmita','Fauziana','F','Semarang','1993-12-19','082372837462','soraya@gmail.com','2018-02-12'),('1.1.6','Azma','Hendrawan','Putri','F','Kudus','1995-08-12','081237828123','azma@gmail.com','2018-03-12'),('1.1.7','Keisha','Putri','Kirana','F','Wonogiri','1993-03-12','081391029123','keisha@gmail.com','2018-03-12'),('1.1.8','Mila','Lita','Fio','F','Semarang','1994-06-12','mila@gmail.com','mila@gmail.com','2018-01-12'),('1.1.9','Diana','Wardana','Kusuma','F','Semarang','1996-12-21','081213781888','kusuma@gmail.com','2018-01-12'),('1.2.1','Firman','Putra','Syah','M','Malang','2018-04-24','081218992327','firman@gmail.com','2018-03-12'),('1.2.2','Retna','Kumbara','Putra','F','Solo','1999-08-12','081928128128','kumara@gmail.com','2018-02-12');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `frek`
--

/*!50001 DROP VIEW IF EXISTS `frek`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `frek` AS select month(`student`.`date_time`) AS `month`,count(0) AS `freq` from `student` group by `student`.`date_time` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `freq_gen`
--

/*!50001 DROP VIEW IF EXISTS `freq_gen`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `freq_gen` AS select `student`.`gender` AS `gender`,count(`student`.`gender`) AS `freq_gender` from `student` group by `student`.`gender` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `frequency`
--

/*!50001 DROP VIEW IF EXISTS `frequency`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `frequency` AS select `student`.`date_time` AS `date_time`,count(0) AS `count(*)` from `student` group by `student`.`date_time` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-13 12:46:24
