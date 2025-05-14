import './Sheet.css'

const Row = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='row'>
            {children}
        </div>
    )
}

const Column = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='column'>
            {children}
        </div>
    )
}

const Input = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    return (
        <>
            <p className={className}>
                {children}
            </p>
            <input type="text" />
        </>
    )
}

export const Sheet: React.FC = () => {
    return (
        <div id='sheet'>

            <div className='row'>
                <Input>
                    Empleador
                </Input>
                <Input>
                    CUIT:
                </Input>

            </div>

            <div className='row'>
                <Input>
                    Nombre y apellido o denominación
                </Input>
            </div>
            <div className='row'>
                <Input className='title'>
                    Datos del empleado
                </Input>
            </div>
            <div className='row'>
                <Input>
                    Apellido y nombre
                </Input>
            </div>
            <div className='row'>
                <Input>
                    CUIL
                </Input>
            </div>
            <div className='row'>
                <div className="row">
                    <Input>
                        Fecha Inicio
                    </Input>
                    <Input>
                        Fecha Cese
                    </Input>
                </div>
                <Input>
                    Obra Social
                </Input>
            </div>
            <div className="row">
                <Input>
                    Modalidad de contrato
                </Input>
                <Input>
                    Situación de Revista
                </Input>
            </div>
            <div className='row'>
                <Input>
                    ART vigente
                </Input>
                <Input>
                    Regimen
                </Input>
            </div>
            <div className='row'>
                <Input>
                    Contrato
                </Input>
                <Input>
                    Agropecuario
                </Input>
            </div>
            <div className='row'>
                <Input>
                    Tipo servicio
                </Input>
            </div>
            <div className="row">
                <Input>
                    Convenio colectivo
                </Input>
            </div>
            <div className='row'>
                <Input>
                    Categoría
                </Input>
                <Input>
                    Puesto
                </Input>
            </div>
            <div className='row'>
                <Input>
                    Retrib. pactada
                </Input>
                <Input>
                    Mod. Liq.
                </Input>
            </div>
            <div className="row">
                <Input>
                    Domicilio de explotación
                </Input>
            </div>
            <div className="row">
                <Input>Actividad económica</Input>
            </div>
            <div className='row'>
                <Input className='title'>
                    Alta
                </Input>
            </div>
            <div className='column'>
                <div className='column'>
                    <Input>
                        Clave
                    </Input>
                    <Input>
                        Fecha - hora envío
                    </Input>
                </div>
                <div className='column'>
                    <Input>
                        Firma empleador y fecha de notificación
                    </Input>
                </div>
            </div>
        </div>
    );
}