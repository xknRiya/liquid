export interface EmployeeMin {
    legajo: number;
    cuit: number;
    nombre: string;
    apellido: string;
}

// legajo INT GENERATED ALWAYS AS IDENTITY (START WITH 1000 INCREMENT BY 1) PRIMARY KEY,
// nombre VARCHAR(50) NOT NULL,
// apellido VARCHAR(25) NOT NULL,
// tipo_documento TIPO_DOCUMENTO NOT NULL,
// nro_documento VARCHAR(12) NOT NULL,
// fecha_nac DATE NOT NULL,
// direccion_legal VARCHAR(100) NOT NULL,
// direccion_real VARCHAR(100) NOT NULL,
// estado_civil ESTADO_CIVIL NOT NULL,
// telefono INT NOT NULL,
// email VARCHAR(50) NOT NULL,
// nivel_academico VARCHAR(50) NOT NULL,
// titulo_obtenido VARCHAR(50),
// cuit BIGINT NOT NULL,
// fecha_ingreso DATE NOT NULL,
// tipo_servicios VARCHAR(50) NOT NULL,
// sector_id INT NOT NULL,
// categoria_nombre VARCHAR(25) NOT NULL,
// modo_liquidacion MODO_LIQUIDACION NOT NULL,
// afiliado_sindicato AFILIADO_SINDICATO DEFAULT 'si',



export interface Sector {
    categoria_nombre: string;
    nombre_sector: string;
    ley: string;
    sindicato: string;
    obra_social: string;
    cct: string;
}

type TipoDocumento = "DNI" | "Pasaporte" | "CUIT";

type ModoLiquidacion = "por mes" | "por hora" | "por jornada";
type TipoServicios = "común" | "insalubre";

type EstadoCivil = "soltero" | "casado" | "viudo" | "divorciado";

export interface Employee extends EmployeeMin {
    tipo_documento: TipoDocumento;
    nro_documento: number;
    fecha_nac: string;
    direccion_legal: string;
    direccion_real: string;
    estado_civil: EstadoCivil;
    telefono: number;
    email: string;
    nivel_academico: string;
    titulo_obtenido: string;
    fecha_ingreso: string;
    tipo_servicios: TipoServicios;
    sector_id: number;
    categoria_nombre: string;
    modo_liquidacion: ModoLiquidacion;
    afiliado_sindicato: "si" | "no";
    sector: Sector;
}

export interface Employer {
    nombre: string;
    direccion_laboral: string;
    cuit: number;
}

export interface BaseRemuneration {
    remuneracion_id: number;
    sector_id: number;
    categoria_nombre: string;
    nombre: string;
    tipo: string;
    tipo_unidad?: string;
}

export interface BasicRemuneration extends BaseRemuneration {
    tipo: "absoluta";
    valor: number;
}

export interface RelativeRemuneration extends BaseRemuneration {
    tipo: "relativa";
    valor: number;
}

interface Reglas {
    formula: string;
    parametros: string[];
}

export interface FormulaRemuneration extends BaseRemuneration {
    tipo: "formula";
    reglas: Reglas;
}

export type AllRemunerations = BasicRemuneration | RelativeRemuneration;
export type AllRemunerationsFront = AllRemunerations & {
    unidades: number;
    valor: number;
};


type OtherRemunerations = BasicRemuneration | RelativeRemuneration;

export interface Remunerations {
    base: BasicRemuneration;
    remunerations: OtherRemunerations[];
}

export type Period = { month: number, year: number };
