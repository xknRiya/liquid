import { useState } from 'react'
import './Sheet.css'

export const Row = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='row'>
            {children}
        </div>
    )
}

export const Column = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='column'>
            {children}
        </div>
    )
}

const Input = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    return (
        <div className="inputs-option">
            <div className="row">
                <p className={className}>
                    {children}
                </p>
                <input type="text" />
            </div>
        </div>
    )
}

export const Sheet: React.FC = () => {

    const [currentPage, setCurrentPage] = useState(1);
    // const [formData, setFormData] = useState({
    //     nombre: '',
    //     email: '',
    //     telefono: '',
    //     direccion: '',
    //     ciudad: '',
    //     pais: '',
    // });

    const totalPages = 4;

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };

    const handlePrev = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    return (
        <div id='sheet'>
            <p>Página {currentPage} de {totalPages}</p>
            {currentPage === 0 && (
                <>
                    <Row>
                        <Input>
                            Empleador
                        </Input>
                        <Input>
                            CUIT:
                        </Input>
                    </Row>

                    <Row>
                        <Input>
                            Nombre y apellido o denominación
                        </Input>
                    </Row>
                </>
            )}

            {currentPage === 1 && (
                <>
                    <Row>
                        <div className='title'>
                            Datos del empleado
                        </div>
                    </Row>
                    <Row>
                        <Input>
                            Apellido y nombre
                        </Input>
                    </Row>
                    <Row>
                        <Input>
                            CUIL
                        </Input>
                    </Row>
                </>
            )}
            {currentPage === 2 && (
                <>
                    <Row>
                        <Row>
                            <Input>
                                Fecha Inicio
                            </Input>
                            <Input>
                                Fecha Cese
                            </Input>
                        </Row>
                        <Input>
                            Obra Social
                        </Input>
                    </Row>
                    <Row>
                        <Input>
                            Modalidad de contrato
                        </Input>
                        <Input>
                            Situación de Revista
                        </Input>
                    </Row>
                    <Row>
                        <Input>
                            ART vigente
                        </Input>
                        <Input>
                            Regimen
                        </Input>
                    </Row>
                    <Row>
                        <Input>
                            Contrato
                        </Input>
                        <Input>
                            Agropecuario
                        </Input>
                    </Row>
                </>
            )}
            {currentPage === 3 && (
                <>
                    <Row>
                        <Input>
                            Tipo servicio
                        </Input>
                    </Row>
                    <Row>
                        <Input>
                            Convenio colectivo
                        </Input>
                    </Row>
                    <Row>
                        <Input>
                            Categoría
                        </Input>
                        <Input>
                            Puesto
                        </Input>
                    </Row>
                    <Row>
                        <Input>
                            Retrib. pactada
                        </Input>
                        <Input>
                            Mod. Liq.
                        </Input>
                    </Row>
                </>
            )}
            {currentPage === 4 && (
                <>
                    <Row>
                        <Input>
                            Domicilio de explotación
                        </Input>
                    </Row>
                    <Row>
                        <Input>Actividad económica</Input>
                    </Row>
                    <Row>
                        <Input className='title'>
                            Alta
                        </Input>
                    </Row>
                    <Column>
                        <Column>
                            <Input>
                                Clave
                            </Input>
                            <Input>
                                Fecha - hora envío
                            </Input>
                        </Column>
                    </Column>
                </>
            )}
            <div id='sheet-buttons'>

                {currentPage > 1 && (
                    <button
                        type="button"
                        onClick={handlePrev}
                    >
                        &larr; Anterior
                    </button>
                )}
                {currentPage < totalPages && (
                    <button
                        type="button"
                        onClick={handleNext}
                    >
                        Siguiente &rarr;
                    </button>
                )}

                {currentPage === totalPages && (
                    <button
                        type="submit"
                        className='submit-button'
                        onClick={handleButton}
                    >
                        Enviar Formulario
                    </button>
                )}
            </div>
        </div>
    );
}