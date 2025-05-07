DROP TABLE IF EXISTS empleador;

DROP TABLE IF EXISTS empleado;

DROP TABLE IF EXISTS remuneracion CASCADE;

DROP TABLE IF EXISTS categoria CASCADE;

DROP TABLE IF EXISTS sector CASCADE;

DROP TYPE IF EXISTS tipo_remuneracion;

DROP TYPE IF EXISTS TIPO_SERVICIOS;

DROP TYPE IF EXISTS MODO_LIQUIDACION;

DROP TYPE IF EXISTS ESTADO_CIVIL;

DROP TYPE IF EXISTS TIPO_DOCUMENTO;

DROP TYPE IF EXISTS NIVEL_ACADEMICO;

DROP TYPE IF EXISTS AFILIADO_SINDICATO;

CREATE TABLE sector (
	sector_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nombre VARCHAR(25) NOT NULL,
	ley INT NOT NULL,
	sindicato VARCHAR(50) NOT NULL,
	obra_social VARCHAR(25) NOT NULL,
	cct VARCHAR(6) NOT NULL
);

CREATE TABLE categoria (
	sector_id INT NOT NULL,
	categoria_nombre VARCHAR(25) NOT NULL,
	PRIMARY KEY (sector_id, categoria_nombre),
	FOREIGN KEY (sector_id) REFERENCES sector(sector_id)
);

CREATE TYPE TIPO_REMUNERACION AS ENUM('absoluta', 'relativa', 'formula');

CREATE TYPE TIPO_CONCEPTO AS ENUM('remunerativo', 'descuento', 'retencion');

CREATE TABLE remuneracion (
	remuneracion_id INT GENERATED ALWAYS AS IDENTITY,
	sector_id INT NOT NULL,
	categoria_nombre VARCHAR(25) NOT NULL,
	nombre VARCHAR(30) NOT NULL,
	valor FLOAT DEFAULT '0',
	tipo TIPO_REMUNERACION DEFAULT 'absoluta',
	tipo_unidad VARCHAR(15),
	tipo_concepto TIPO_CONCEPTO DEFAULT 'remunerativo',
	reglas JSONB,
	PRIMARY KEY (remuneracion_id),
	FOREIGN KEY (sector_id) REFERENCES sector(sector_id),
	FOREIGN KEY (sector_id, categoria_nombre) REFERENCES categoria(sector_id, categoria_nombre)
);

CREATE TABLE empleador (
	nombre VARCHAR(100) NOT NULL,
	direccion_laboral VARCHAR(100) NOT NULL,
	cuit BIGINT PRIMARY KEY NOT NULL,
	sector VARCHAR(30) NOT NULL
);

CREATE TYPE ESTADO_CIVIL AS ENUM('soltero', 'casado', 'viudo', 'divorciado');

CREATE TYPE TIPO_DOCUMENTO AS ENUM('CUIT', 'CUIL', 'DNI', 'PASAPORTE');

CREATE TYPE NIVEL_ACADEMICO AS ENUM(
	'primario incompleto',
	'primario completo',
	'secundario incompleto',
	'secundario completo',
	'terciario/universidad incompleto',
	'terciario/universidad completo',
	'terciario/universidad cursando'
);

CREATE TYPE TIPO_SERVICIOS AS ENUM('común', 'insalubre');

CREATE TYPE MODO_LIQUIDACION AS ENUM('por hora', 'por mes');

CREATE TYPE AFILIADO_SINDICATO AS ENUM('si', 'no');

CREATE TABLE empleado (
	legajo INT GENERATED ALWAYS AS IDENTITY (START WITH 1000 INCREMENT BY 1) PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL,
	apellido VARCHAR(25) NOT NULL,
	tipo_documento TIPO_DOCUMENTO NOT NULL,
	nro_documento VARCHAR(12) NOT NULL,
	fecha_nac DATE NOT NULL,
	direccion_legal VARCHAR(100) NOT NULL,
	direccion_real VARCHAR(100) NOT NULL,
	estado_civil ESTADO_CIVIL NOT NULL,
	telefono INT NOT NULL,
	email VARCHAR(50) NOT NULL,
	nivel_academico VARCHAR(50) NOT NULL,
	titulo_obtenido VARCHAR(50),
	cuit BIGINT NOT NULL,
	fecha_ingreso DATE NOT NULL,
	tipo_servicios VARCHAR(50) NOT NULL,
	sector_id INT NOT NULL,
	categoria_nombre VARCHAR(25) NOT NULL,
	modo_liquidacion MODO_LIQUIDACION NOT NULL,
	afiliado_sindicato AFILIADO_SINDICATO DEFAULT 'si',
	FOREIGN KEY (sector_id) REFERENCES sector(sector_id),
	FOREIGN KEY (sector_id, categoria_nombre) REFERENCES categoria(sector_id, categoria_nombre)
);

CREATE OR REPLACE FUNCTION get_next_id(p_tipo TIPO_CONCEPTO)
RETURNS INT AS $$
DECLARE siguiente_id INT;
BEGIN
    LOCK TABLE remuneracion IN EXCLUSIVE MODE;
    SELECT
        COALESCE(MAX(remuneracion_id), 0) + 1 INTO siguiente_id
    FROM
        remuneracion
    WHERE
        tipo_concepto = p_tipo;
    RETURN siguiente_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generar_remuneracion_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.remuneracion_id := get_next_id(NEW.tipo_concepto);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER remuneracion_insert_trigger
BEFORE INSERT ON remuneracion
FOR EACH ROW
EXECUTE FUNCTION generar_remuneracion_id();


INSERT INTO
	sector (nombre, ley, sindicato, obra_social, cct)
VALUES
	(
		'Comercio',
		'20744',
		'Empleados de comercio y artículos civiles',
		'OSECAC',
		'130/75'
	),
	('Rurales', '26727', 'UATRE', 'OSPRERA', '511/05'),
	(
		'Construcción',
		'22250',
		'UOCRA',
		'OSPECOM',
		'76/75'
	);

INSERT INTO
	categoria (sector_id, categoria_nombre)
VALUES
	(1, 'Administrativo A'),
	(1, 'Maestranza B');

INSERT INTO
	remuneracion (sector_id, categoria_nombre, nombre, valor, tipo)
VALUES
	(
		1,
		'Administrativo A',
		'Sueldo Básico',
		815260,
		'absoluta'
	),
	(
		1,
		'Administrativo A',
		'Presentismo',
		8.33,
		'relativa'
	),
	-- (1, 'Administrativo A', 'Vacaciones proporcionales 2024', 56, 'relativa'),
	(
		1,
		'Maestranza B',
		'Sueldo Básico',
		808339,
		'absoluta'
	);

INSERT INTO
	remuneracion (
		sector_id,
		categoria_nombre,
		nombre,
		tipo,
		valor,
		tipo_unidad
	)
VALUES
	(
		1,
		'Administrativo A',
		'Vacaciones proporcionales 2024',
		'relativa',
		'4',
		'días'
	);

INSERT INTO
	empleado (
		nombre,
		apellido,
		tipo_documento,
		nro_documento,
		fecha_nac,
		direccion_legal,
		direccion_real,
		estado_civil,
		telefono,
		email,
		nivel_academico,
		titulo_obtenido,
		cuit,
		fecha_ingreso,
		tipo_servicios,
		sector_id,
		categoria_nombre,
		modo_liquidacion
	)
VALUES
	(
		'Daniel',
		'Perez',
		'DNI',
		'32548692',
		TO_DATE('12/12/2001', 'DD/MM/YYYY'),
		'Calle 123',
		'Calle 123',
		'divorciado',
		123456789,
		'daniel@gmail.com',
		'primario completo',
		NULL,
		20325486929,
		TO_DATE('12/2024', 'MM/YYY'),
		'-',
		1,
		'Administrativo A',
		'por mes'
	),
	(
		'John',
		'Doe',
		'CUIT',
		'20372568451',
		TO_DATE('03/08/1990', 'DD/MM/YYYY'),
		'Una Calle 456',
		'Una Calle 456',
		'casado',
		21156439,
		'john@gmail.com',
		'primario completo',
		NULL,
		20211564391,
		TO_DATE('09/2024', 'MM/YYY'),
		'-',
		1,
		'Maestranza B',
		'por mes'
	);

INSERT INTO
	empleador (nombre, direccion_laboral, cuit, sector)
VALUES
	(
		'Algo SRL',
		'Calle Falsa 123',
		20752514752,
		'Comercio'
	);