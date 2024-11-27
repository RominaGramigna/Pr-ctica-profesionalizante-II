CREATE DATABASE  IF NOT EXISTS `guarderia` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `guarderia`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: guarderia
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alimentos`
--

DROP TABLE IF EXISTS `alimentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alimentos` (
  `ID_Alimento` int NOT NULL,
  `alimento` varchar(50) NOT NULL,
  `peso` varchar(10) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `ID_Marca` int DEFAULT NULL,
  `ID_Rubro` int DEFAULT NULL,
  `vencimiento` date DEFAULT NULL,
  `fechaIngreso` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Alimento`),
  KEY `marca_idx` (`ID_Marca`),
  KEY `rubro_idx` (`ID_Rubro`),
  CONSTRAINT `marca` FOREIGN KEY (`ID_Marca`) REFERENCES `marcas` (`ID_marca`),
  CONSTRAINT `rubro` FOREIGN KEY (`ID_Rubro`) REFERENCES `rubros` (`ID_rubro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alimentos`
--

LOCK TABLES `alimentos` WRITE;
/*!40000 ALTER TABLE `alimentos` DISABLE KEYS */;
INSERT INTO `alimentos` VALUES (1,'Amarguito','900g',7,1,1,'2024-10-15','2024-10-22 00:00:00');
/*!40000 ALTER TABLE `alimentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `ID_Categoria` int NOT NULL,
  `Descripcion` varchar(45) DEFAULT NULL,
  `Anotaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_Categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Infantil',NULL),(2,'Adultos','');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colaboradores`
--

DROP TABLE IF EXISTS `colaboradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colaboradores` (
  `ID_colaborador` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `dni` int DEFAULT NULL,
  `tipo_colaborador` varchar(45) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `telefono` varchar(14) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `fechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_colaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colaboradores`
--

LOCK TABLES `colaboradores` WRITE;
/*!40000 ALTER TABLE `colaboradores` DISABLE KEYS */;
INSERT INTO `colaboradores` VALUES (1,'Gonza','Silvera',43132863,'Particular','roldan 265','3471259712','no','2024-10-16 20:01:10'),(2,'Ale','Silvera',12,'','','','','2024-11-24 15:39:04');
/*!40000 ALTER TABLE `colaboradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condiciones`
--

DROP TABLE IF EXISTS `condiciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condiciones` (
  `ID_condicion` int NOT NULL,
  `descripcion` varchar(25) DEFAULT NULL,
  `anotaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_condicion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condiciones`
--

LOCK TABLES `condiciones` WRITE;
/*!40000 ALTER TABLE `condiciones` DISABLE KEYS */;
INSERT INTO `condiciones` VALUES (1,'no',NULL),(2,'si',NULL),(3,'enfermo',NULL);
/*!40000 ALTER TABLE `condiciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donaciones`
--

DROP TABLE IF EXISTS `donaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donaciones` (
  `ID_Donacion` int NOT NULL,
  `ID_colaborador` int NOT NULL,
  `monto` float DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `ID_Tipo` int DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `fechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Donacion`),
  KEY `TIpoDonacion_idx` (`ID_Tipo`),
  KEY `Colaborador_idx` (`ID_colaborador`),
  CONSTRAINT `Colaborador` FOREIGN KEY (`ID_colaborador`) REFERENCES `colaboradores` (`ID_colaborador`),
  CONSTRAINT `TIpoDonacion` FOREIGN KEY (`ID_Tipo`) REFERENCES `donacionestipos` (`ID_Tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donaciones`
--

LOCK TABLES `donaciones` WRITE;
/*!40000 ALTER TABLE `donaciones` DISABLE KEYS */;
INSERT INTO `donaciones` VALUES (1,1,50000,1,1,'','2024-11-24 15:37:38'),(2,1,1,1,1,'Pantalon Jean azul','2024-11-26 15:01:57'),(3,1,0,1,2,'Jeans Azules','2024-11-26 16:03:01');
/*!40000 ALTER TABLE `donaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donacionestipos`
--

DROP TABLE IF EXISTS `donacionestipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donacionestipos` (
  `ID_Tipo` int NOT NULL,
  `Tipo` varchar(45) DEFAULT NULL,
  `Anotaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_Tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donacionestipos`
--

LOCK TABLES `donacionestipos` WRITE;
/*!40000 ALTER TABLE `donacionestipos` DISABLE KEYS */;
INSERT INTO `donacionestipos` VALUES (1,'Dinero',''),(2,'Ropa','');
/*!40000 ALTER TABLE `donacionestipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `infantes`
--

DROP TABLE IF EXISTS `infantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `infantes` (
  `ID_Infante` int NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `apellido` varchar(25) DEFAULT NULL,
  `genero` varchar(45) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `ID_tutor` int NOT NULL,
  `ID_condicion` int DEFAULT NULL,
  `fechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  `dni` int NOT NULL,
  `obra_social` varchar(20) DEFAULT NULL,
  `medico_cabecera` varchar(45) DEFAULT NULL,
  `hospital_pref` varchar(45) DEFAULT NULL,
  `medicacion` varchar(45) DEFAULT NULL,
  `recibir_auxilio` varchar(2) DEFAULT NULL,
  `recibir_atencion_med` varchar(2) DEFAULT NULL,
  `fotos_redes` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`ID_Infante`),
  KEY `tutor_idx` (`ID_tutor`),
  KEY `condicion_idx` (`ID_condicion`),
  CONSTRAINT `condicion` FOREIGN KEY (`ID_condicion`) REFERENCES `condiciones` (`ID_condicion`),
  CONSTRAINT `tutor` FOREIGN KEY (`ID_tutor`) REFERENCES `tutores` (`ID_tutor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `infantes`
--

LOCK TABLES `infantes` WRITE;
/*!40000 ALTER TABLE `infantes` DISABLE KEYS */;
INSERT INTO `infantes` VALUES (1,'Cele','Nidea','Hombre','2003-10-11',1,1,'2024-09-25 20:02:17',44231640,'no','no','no','no','no','no','no'),(3,'Nena','Lito','Nene','1222-12-11',1,1,'2024-10-25 17:03:10',1,'no','no','no','no','no','no','no');
/*!40000 ALTER TABLE `infantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `juguetes`
--

DROP TABLE IF EXISTS `juguetes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `juguetes` (
  `ID_Juguete` int NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `ID_Tipo` int DEFAULT NULL,
  `tamaño` varchar(20) DEFAULT NULL,
  `edadminima` char(2) DEFAULT NULL,
  `fechaingreso` datetime DEFAULT CURRENT_TIMESTAMP,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`ID_Juguete`),
  KEY `tipo_idx` (`ID_Tipo`),
  CONSTRAINT `tipo` FOREIGN KEY (`ID_Tipo`) REFERENCES `tipojuguetes` (`ID_tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `juguetes`
--

LOCK TABLES `juguetes` WRITE;
/*!40000 ALTER TABLE `juguetes` DISABLE KEYS */;
INSERT INTO `juguetes` VALUES (1,'Camion rojo',1,'Mediano','8','2024-10-22 00:00:00',12);
/*!40000 ALTER TABLE `juguetes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libros`
--

DROP TABLE IF EXISTS `libros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `libros` (
  `ID_Libro` int NOT NULL,
  `Libro` varchar(45) DEFAULT NULL,
  `ID_Categoria` int DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  `FechaIngreso` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Libro`),
  KEY `Categoria_idx` (`ID_Categoria`),
  CONSTRAINT `Categoria` FOREIGN KEY (`ID_Categoria`) REFERENCES `categorias` (`ID_Categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libros`
--

LOCK TABLES `libros` WRITE;
/*!40000 ALTER TABLE `libros` DISABLE KEYS */;
INSERT INTO `libros` VALUES (1,'El Principito',1,5,'2024-11-20 17:35:46');
/*!40000 ALTER TABLE `libros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcas` (
  `ID_marca` int NOT NULL,
  `descripcion` varchar(20) DEFAULT NULL,
  `anotaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_marca`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcas`
--

LOCK TABLES `marcas` WRITE;
/*!40000 ALTER TABLE `marcas` DISABLE KEYS */;
INSERT INTO `marcas` VALUES (1,'Marolio','Ninguna');
/*!40000 ALTER TABLE `marcas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monedas`
--

DROP TABLE IF EXISTS `monedas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monedas` (
  `ID_moneda` int NOT NULL,
  `descripcion` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_moneda`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monedas`
--

LOCK TABLES `monedas` WRITE;
/*!40000 ALTER TABLE `monedas` DISABLE KEYS */;
/*!40000 ALTER TABLE `monedas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal`
--

DROP TABLE IF EXISTS `personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal` (
  `ID_personal` int NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `dni` int DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `correo` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `dias_laborales` varchar(45) DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_finalizacion` time DEFAULT NULL,
  `condicion_med` varchar(45) DEFAULT NULL,
  `emergencias` varchar(100) DEFAULT NULL,
  `dias_vacaciones` int DEFAULT NULL,
  `inicio_vacaciones` date DEFAULT NULL,
  `finalizacion_vacaciones` date DEFAULT NULL,
  PRIMARY KEY (`ID_personal`),
  KEY `ROL_idx` (`id_rol`),
  CONSTRAINT `ROL` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`ID_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal`
--

LOCK TABLES `personal` WRITE;
/*!40000 ALTER TABLE `personal` DISABLE KEYS */;
INSERT INTO `personal` VALUES (1,'Jose','Gomez',12365241,1,'no','no','3471236598','Lunes a Viernes','08:00:00','18:00:00','no','no',12,'2024-03-11','2024-03-26');
/*!40000 ALTER TABLE `personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preparaciones`
--

DROP TABLE IF EXISTS `preparaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preparaciones` (
  `ID_Preparacion` int NOT NULL,
  `Preparacion` varchar(45) NOT NULL,
  `NroItem` int NOT NULL,
  `ID_Alimento` int NOT NULL,
  `Cantidad` int DEFAULT NULL,
  `FechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Preparacion`,`NroItem`),
  KEY `Alimento_idx` (`ID_Alimento`),
  CONSTRAINT `Alimento` FOREIGN KEY (`ID_Alimento`) REFERENCES `alimentos` (`ID_Alimento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preparaciones`
--

LOCK TABLES `preparaciones` WRITE;
/*!40000 ALTER TABLE `preparaciones` DISABLE KEYS */;
INSERT INTO `preparaciones` VALUES (1,'fideos',1,1,2,'2024-11-26 15:53:56'),(2,'raul2',1,1,9,'2024-11-26 15:54:46'),(3,'raul',1,1,3,'2024-11-26 15:58:04');
/*!40000 ALTER TABLE `preparaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `ID_rol` int NOT NULL,
  `rol` varchar(45) DEFAULT NULL,
  `anotaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'cocinero','no');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rubros`
--

DROP TABLE IF EXISTS `rubros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rubros` (
  `ID_rubro` int NOT NULL,
  `descripcion` varchar(20) DEFAULT NULL,
  `anotaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_rubro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rubros`
--

LOCK TABLES `rubros` WRITE;
/*!40000 ALTER TABLE `rubros` DISABLE KEYS */;
INSERT INTO `rubros` VALUES (1,'Bebidas',NULL);
/*!40000 ALTER TABLE `rubros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salidas`
--

DROP TABLE IF EXISTS `salidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salidas` (
  `ID_Salida` int NOT NULL,
  `Recibe` varchar(45) NOT NULL,
  `NroItem` int NOT NULL,
  `ID_Donacion` int NOT NULL,
  `Cantidad` int NOT NULL,
  `FechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Salida`,`NroItem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salidas`
--

LOCK TABLES `salidas` WRITE;
/*!40000 ALTER TABLE `salidas` DISABLE KEYS */;
INSERT INTO `salidas` VALUES (1,'Julio',1,3,2,'2024-11-26 16:10:56');
/*!40000 ALTER TABLE `salidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipojuguetes`
--

DROP TABLE IF EXISTS `tipojuguetes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipojuguetes` (
  `ID_tipo` int NOT NULL,
  `descripcion` varchar(25) DEFAULT NULL,
  `anotaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipojuguetes`
--

LOCK TABLES `tipojuguetes` WRITE;
/*!40000 ALTER TABLE `tipojuguetes` DISABLE KEYS */;
INSERT INTO `tipojuguetes` VALUES (1,'Camiones',NULL),(2,'Bloques','');
/*!40000 ALTER TABLE `tipojuguetes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutores`
--

DROP TABLE IF EXISTS `tutores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutores` (
  `ID_tutor` int NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `apellido` varchar(25) DEFAULT NULL,
  `telefono` varchar(14) DEFAULT NULL,
  `direccion` varchar(20) DEFAULT NULL,
  `parentezco` varchar(20) DEFAULT NULL,
  `fechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  `dni` int DEFAULT NULL,
  `correo` varchar(45) DEFAULT NULL,
  `telefono_alternativo` varchar(14) DEFAULT NULL,
  `ocupacion` varchar(45) DEFAULT NULL,
  `empresa` varchar(45) DEFAULT NULL,
  `direccion_trabajo` varchar(45) DEFAULT NULL,
  `telefono_trabajo` varchar(14) DEFAULT NULL,
  PRIMARY KEY (`ID_tutor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutores`
--

LOCK TABLES `tutores` WRITE;
/*!40000 ALTER TABLE `tutores` DISABLE KEYS */;
INSERT INTO `tutores` VALUES (1,'raulo','raulito','','no','papi','2024-09-25 20:01:31',22333111,'no','','oficinista','Transur','Roldan 1480','3471662589');
/*!40000 ALTER TABLE `tutores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `ID_Usuario` int NOT NULL,
  `Usuario` varchar(45) DEFAULT NULL,
  `Contraseña` varchar(45) DEFAULT NULL,
  `ID_Tipo` int DEFAULT NULL,
  `FechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Usuario`),
  KEY `TIpoUsuario_idx` (`ID_Tipo`),
  CONSTRAINT `TIpoUsuario` FOREIGN KEY (`ID_Tipo`) REFERENCES `usuariostipo` (`ID_Tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Guarderia','Guarde123',1,'2024-11-22 12:59:27');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuariostipo`
--

DROP TABLE IF EXISTS `usuariostipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuariostipo` (
  `ID_Tipo` int NOT NULL,
  `Tipo` varchar(45) DEFAULT NULL,
  `Anotaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID_Tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuariostipo`
--

LOCK TABLES `usuariostipo` WRITE;
/*!40000 ALTER TABLE `usuariostipo` DISABLE KEYS */;
INSERT INTO `usuariostipo` VALUES (1,'Administrador',NULL),(2,'Operador','No hará lo mismo que el administrador.'),(3,'Negrito','');
/*!40000 ALTER TABLE `usuariostipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vwalimentos`
--

DROP TABLE IF EXISTS `vwalimentos`;
/*!50001 DROP VIEW IF EXISTS `vwalimentos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwalimentos` AS SELECT 
 1 AS `ID_Alimento`,
 1 AS `alimento`,
 1 AS `ID_Marca`,
 1 AS `Marca`,
 1 AS `ID_Rubro`,
 1 AS `Rubro`,
 1 AS `Cantidad`,
 1 AS `FechaIngreso`,
 1 AS `Peso`,
 1 AS `Vencimiento`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwdonaciones`
--

DROP TABLE IF EXISTS `vwdonaciones`;
/*!50001 DROP VIEW IF EXISTS `vwdonaciones`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwdonaciones` AS SELECT 
 1 AS `ID_Donacion`,
 1 AS `ID_Colaborador`,
 1 AS `Colaborador`,
 1 AS `ID_Tipo`,
 1 AS `Tipo`,
 1 AS `Monto`,
 1 AS `Cantidad`,
 1 AS `Descripcion`,
 1 AS `fechaAlta`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwinfantes`
--

DROP TABLE IF EXISTS `vwinfantes`;
/*!50001 DROP VIEW IF EXISTS `vwinfantes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwinfantes` AS SELECT 
 1 AS `ID_Infante`,
 1 AS `NombreInfante`,
 1 AS `ApellidoInfante`,
 1 AS `DNIInfante`,
 1 AS `GeneroInfante`,
 1 AS `FechaNacimiento`,
 1 AS `ObraSocial`,
 1 AS `MedicoCabecera`,
 1 AS `HospitalPreferido`,
 1 AS `Medicacion`,
 1 AS `RecibirAuxilio`,
 1 AS `RecibirAtencionMedica`,
 1 AS `FotosRedes`,
 1 AS `ID_Tutor`,
 1 AS `NombreTutor`,
 1 AS `ApellidoTutor`,
 1 AS `Direccion`,
 1 AS `DNITutor`,
 1 AS `Parentezco`,
 1 AS `ID_Condicion`,
 1 AS `Condicion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwjuguetes`
--

DROP TABLE IF EXISTS `vwjuguetes`;
/*!50001 DROP VIEW IF EXISTS `vwjuguetes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwjuguetes` AS SELECT 
 1 AS `ID_Juguete`,
 1 AS `Nombre`,
 1 AS `Tamaño`,
 1 AS `EdadMinima`,
 1 AS `ID_Tipo`,
 1 AS `Tipo`,
 1 AS `FechaIngreso`,
 1 AS `Cantidad`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwlibros`
--

DROP TABLE IF EXISTS `vwlibros`;
/*!50001 DROP VIEW IF EXISTS `vwlibros`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwlibros` AS SELECT 
 1 AS `ID_Libro`,
 1 AS `Libro`,
 1 AS `ID_Categoria`,
 1 AS `Categoria`,
 1 AS `Cantidad`,
 1 AS `FechaIngreso`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwpersonal`
--

DROP TABLE IF EXISTS `vwpersonal`;
/*!50001 DROP VIEW IF EXISTS `vwpersonal`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwpersonal` AS SELECT 
 1 AS `ID_Personal`,
 1 AS `Nombre`,
 1 AS `Apellido`,
 1 AS `DNI`,
 1 AS `ID_Rol`,
 1 AS `Rol`,
 1 AS `Direccion`,
 1 AS `Correo`,
 1 AS `Telefono`,
 1 AS `Dias_Laborales`,
 1 AS `Hora_Inicio`,
 1 AS `Hora_Finalizacion`,
 1 AS `Condicion_Med`,
 1 AS `Emergencias`,
 1 AS `Dias_Vacaciones`,
 1 AS `Inicio_Vacaciones`,
 1 AS `Finalizacion_Vacaciones`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwpreparaciones`
--

DROP TABLE IF EXISTS `vwpreparaciones`;
/*!50001 DROP VIEW IF EXISTS `vwpreparaciones`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwpreparaciones` AS SELECT 
 1 AS `ID_Preparacion`,
 1 AS `Preparacion`,
 1 AS `NroItem`,
 1 AS `ID_Alimento`,
 1 AS `Alimento`,
 1 AS `Cantidad`,
 1 AS `FechaAlta`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwsalidas`
--

DROP TABLE IF EXISTS `vwsalidas`;
/*!50001 DROP VIEW IF EXISTS `vwsalidas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwsalidas` AS SELECT 
 1 AS `ID_Salida`,
 1 AS `Recibe`,
 1 AS `NroItem`,
 1 AS `ID_Donacion`,
 1 AS `Descripcion`,
 1 AS `Cantidad`,
 1 AS `FechaAlta`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwtutores`
--

DROP TABLE IF EXISTS `vwtutores`;
/*!50001 DROP VIEW IF EXISTS `vwtutores`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwtutores` AS SELECT 
 1 AS `ID_Tutor`,
 1 AS `NombreTutor`,
 1 AS `ApellidoTutor`,
 1 AS `DNI`,
 1 AS `Parentezco`,
 1 AS `ID_Infante`,
 1 AS `Direccion`,
 1 AS `Correo`,
 1 AS `Telefono`,
 1 AS `Telefono_Alternativo`,
 1 AS `Ocupacion`,
 1 AS `Empresa`,
 1 AS `Direccion_Trabajo`,
 1 AS `Telefono_Trabajo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vwusuarios`
--

DROP TABLE IF EXISTS `vwusuarios`;
/*!50001 DROP VIEW IF EXISTS `vwusuarios`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vwusuarios` AS SELECT 
 1 AS `ID_Usuario`,
 1 AS `Usuario`,
 1 AS `Contraseña`,
 1 AS `ID_Tipo`,
 1 AS `Tipo`,
 1 AS `FechaAlta`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vwalimentos`
--

/*!50001 DROP VIEW IF EXISTS `vwalimentos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwalimentos` AS select `alimentos`.`ID_Alimento` AS `ID_Alimento`,`alimentos`.`alimento` AS `alimento`,`marcas`.`ID_marca` AS `ID_Marca`,`marcas`.`descripcion` AS `Marca`,`rubros`.`ID_rubro` AS `ID_Rubro`,`rubros`.`descripcion` AS `Rubro`,`alimentos`.`cantidad` AS `Cantidad`,`alimentos`.`fechaIngreso` AS `FechaIngreso`,`alimentos`.`peso` AS `Peso`,`alimentos`.`vencimiento` AS `Vencimiento` from ((`alimentos` join `marcas` on((`alimentos`.`ID_Marca` = `marcas`.`ID_marca`))) join `rubros` on((`alimentos`.`ID_Rubro` = `rubros`.`ID_rubro`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwdonaciones`
--

/*!50001 DROP VIEW IF EXISTS `vwdonaciones`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwdonaciones` AS select `d`.`ID_Donacion` AS `ID_Donacion`,`c`.`ID_colaborador` AS `ID_Colaborador`,`c`.`nombre` AS `Colaborador`,`dt`.`ID_Tipo` AS `ID_Tipo`,`dt`.`Tipo` AS `Tipo`,`d`.`monto` AS `Monto`,`d`.`cantidad` AS `Cantidad`,`d`.`descripcion` AS `Descripcion`,`d`.`fechaAlta` AS `fechaAlta` from ((`donaciones` `d` join `donacionestipos` `dt` on((`dt`.`ID_Tipo` = `d`.`ID_Tipo`))) join `colaboradores` `c` on((`c`.`ID_colaborador` = `d`.`ID_colaborador`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwinfantes`
--

/*!50001 DROP VIEW IF EXISTS `vwinfantes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwinfantes` AS select `infantes`.`ID_Infante` AS `ID_Infante`,`infantes`.`nombre` AS `NombreInfante`,`infantes`.`apellido` AS `ApellidoInfante`,`infantes`.`dni` AS `DNIInfante`,`infantes`.`genero` AS `GeneroInfante`,`infantes`.`fechaNacimiento` AS `FechaNacimiento`,`infantes`.`obra_social` AS `ObraSocial`,`infantes`.`medico_cabecera` AS `MedicoCabecera`,`infantes`.`hospital_pref` AS `HospitalPreferido`,`infantes`.`medicacion` AS `Medicacion`,`infantes`.`recibir_auxilio` AS `RecibirAuxilio`,`infantes`.`recibir_atencion_med` AS `RecibirAtencionMedica`,`infantes`.`fotos_redes` AS `FotosRedes`,`tutores`.`ID_tutor` AS `ID_Tutor`,`tutores`.`nombre` AS `NombreTutor`,`tutores`.`apellido` AS `ApellidoTutor`,`tutores`.`direccion` AS `Direccion`,`tutores`.`dni` AS `DNITutor`,`tutores`.`parentezco` AS `Parentezco`,`condiciones`.`ID_condicion` AS `ID_Condicion`,`condiciones`.`descripcion` AS `Condicion` from ((`infantes` join `tutores` on((`tutores`.`ID_tutor` = `infantes`.`ID_tutor`))) join `condiciones` on((`condiciones`.`ID_condicion` = `infantes`.`ID_condicion`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwjuguetes`
--

/*!50001 DROP VIEW IF EXISTS `vwjuguetes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwjuguetes` AS select `j`.`ID_Juguete` AS `ID_Juguete`,`j`.`nombre` AS `Nombre`,`j`.`tamaño` AS `Tamaño`,`j`.`edadminima` AS `EdadMinima`,`t`.`ID_tipo` AS `ID_Tipo`,`t`.`descripcion` AS `Tipo`,`j`.`fechaingreso` AS `FechaIngreso`,`j`.`cantidad` AS `Cantidad` from (`juguetes` `j` join `tipojuguetes` `t` on((`t`.`ID_tipo` = `j`.`ID_Tipo`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwlibros`
--

/*!50001 DROP VIEW IF EXISTS `vwlibros`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwlibros` AS select `libros`.`ID_Libro` AS `ID_Libro`,`libros`.`Libro` AS `Libro`,`categorias`.`ID_Categoria` AS `ID_Categoria`,`categorias`.`Descripcion` AS `Categoria`,`libros`.`Cantidad` AS `Cantidad`,`libros`.`FechaIngreso` AS `FechaIngreso` from (`libros` join `categorias` on((`categorias`.`ID_Categoria` = `libros`.`ID_Categoria`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwpersonal`
--

/*!50001 DROP VIEW IF EXISTS `vwpersonal`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwpersonal` AS select `p`.`ID_personal` AS `ID_Personal`,`p`.`nombre` AS `Nombre`,`p`.`apellido` AS `Apellido`,`p`.`dni` AS `DNI`,`r`.`ID_rol` AS `ID_Rol`,`r`.`rol` AS `Rol`,`p`.`direccion` AS `Direccion`,`p`.`correo` AS `Correo`,`p`.`telefono` AS `Telefono`,`p`.`dias_laborales` AS `Dias_Laborales`,`p`.`hora_inicio` AS `Hora_Inicio`,`p`.`hora_finalizacion` AS `Hora_Finalizacion`,`p`.`condicion_med` AS `Condicion_Med`,`p`.`emergencias` AS `Emergencias`,`p`.`dias_vacaciones` AS `Dias_Vacaciones`,`p`.`inicio_vacaciones` AS `Inicio_Vacaciones`,`p`.`finalizacion_vacaciones` AS `Finalizacion_Vacaciones` from (`personal` `p` join `roles` `r` on((`r`.`ID_rol` = `p`.`id_rol`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwpreparaciones`
--

/*!50001 DROP VIEW IF EXISTS `vwpreparaciones`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwpreparaciones` AS select `preparaciones`.`ID_Preparacion` AS `ID_Preparacion`,`preparaciones`.`Preparacion` AS `Preparacion`,`preparaciones`.`NroItem` AS `NroItem`,`alimentos`.`ID_Alimento` AS `ID_Alimento`,`alimentos`.`alimento` AS `Alimento`,`preparaciones`.`Cantidad` AS `Cantidad`,`preparaciones`.`FechaAlta` AS `FechaAlta` from (`preparaciones` join `alimentos` on((`preparaciones`.`ID_Alimento` = `alimentos`.`ID_Alimento`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwsalidas`
--

/*!50001 DROP VIEW IF EXISTS `vwsalidas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwsalidas` AS select `s`.`ID_Salida` AS `ID_Salida`,`s`.`Recibe` AS `Recibe`,`s`.`NroItem` AS `NroItem`,`d`.`ID_Donacion` AS `ID_Donacion`,`d`.`descripcion` AS `Descripcion`,`s`.`Cantidad` AS `Cantidad`,`s`.`FechaAlta` AS `FechaAlta` from (`salidas` `s` join `donaciones` `d` on((`d`.`ID_Donacion` = `s`.`ID_Donacion`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwtutores`
--

/*!50001 DROP VIEW IF EXISTS `vwtutores`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwtutores` AS select `t`.`ID_tutor` AS `ID_Tutor`,`t`.`nombre` AS `NombreTutor`,`t`.`apellido` AS `ApellidoTutor`,`t`.`dni` AS `DNI`,`t`.`parentezco` AS `Parentezco`,`i`.`ID_Infante` AS `ID_Infante`,`t`.`direccion` AS `Direccion`,`t`.`correo` AS `Correo`,`t`.`telefono` AS `Telefono`,`t`.`telefono_alternativo` AS `Telefono_Alternativo`,`t`.`ocupacion` AS `Ocupacion`,`t`.`empresa` AS `Empresa`,`t`.`direccion_trabajo` AS `Direccion_Trabajo`,`t`.`telefono_trabajo` AS `Telefono_Trabajo` from (`tutores` `t` join `infantes` `i` on((`i`.`ID_tutor` = `t`.`ID_tutor`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vwusuarios`
--

/*!50001 DROP VIEW IF EXISTS `vwusuarios`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vwusuarios` AS select `u`.`ID_Usuario` AS `ID_Usuario`,`u`.`Usuario` AS `Usuario`,`u`.`Contraseña` AS `Contraseña`,`ut`.`ID_Tipo` AS `ID_Tipo`,`ut`.`Tipo` AS `Tipo`,`u`.`FechaAlta` AS `FechaAlta` from (`usuarios` `u` join `usuariostipo` `ut` on((`ut`.`ID_Tipo` = `u`.`ID_Tipo`))) */;
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

-- Dump completed on 2024-11-26 17:55:12
