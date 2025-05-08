import { useLiquid } from "../hooks/useLiquid";
import {
    // AllRemunerationsFront,
    Employee,
    Employer
} from "../interfaces";

const regex = /^(\d{2})(\d{8})(\d{1})$/;

const formatCuit = (cuit: number | undefined) => {
    if (!cuit) return '';
    const matches = String(cuit).match(regex);
    if (!matches) return '';
    return `${matches[1]}-${matches[2]}-${matches[3]}`;
};

const EmployerInfo: React.FC<{ employer: Employer | undefined }> = ({ employer }) => {
    return (
        <div id='employer-info'>
            <p id='employer-name'>Nombre: <span id='employer-name-span'>{employer?.nombre}</span></p>
            <p id='employer-cuit'>CUIT: <span id='employer-cuit-span'>{formatCuit(employer?.cuit)}</span></p>
            <p id='employer-address'>Dirección: <span id='employer-address-span'>{employer?.direccion_laboral}</span></p>
        </div>
    )
}

const EmployeeSectorInfo: React.FC<{ employee: Employee | undefined }> = ({ employee }) => {
    return (
        <div id='employee-sector-info'>
            <p id='employee-sector-ley'>Ley: <span id='employee-sector-ley-span'>{employee ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(employee.sector.ley) : ''}</span></p>
            <p id='employee-sector-sindicato'>Sindicato: <span id='employee-sector-sindicato-span'>{employee?.sector.sindicato}</span></p>
            <p id='employee-sector-obra-social'>Obra social: <span id='employee-sector-obra-social-span'>{employee?.sector.obra_social}</span></p>
            <p id='employee-sector-cct'>CCT: <span id='employee-sector-cct-span'>{employee?.sector.cct}</span></p>
        </div>
    );
};

const PeriodInfo: React.FC = () => {
    const { employee, period } = useLiquid();
    return (
        <div id='period-info'>
            <p> Período: {String(period.month).padStart(2, '0')} / {period.year} </p>
            {employee && (
                <>
                    <p>
                        Fecha de ingreso: <span className="no-wrap"> {employee?.fecha_ingreso} </span>
                    </p>
                    <p>
                        Antigüedad:  {(new Date(employee.fecha_ingreso)).getFullYear() - period.year} años
                    </p>
                </>
            )
            }

        </div >

    );
}

const EmployeeInfo: React.FC<{ employee: Employee | undefined }> = ({ employee }) => {
    return (
        <div id='employee-info'>
            <p id='employee-name'>Nombre: <span id='employee-name-span'>{employee ? `${employee.apellido}, ${employee.nombre}` : ''}</span></p>
            <p id='employee-cuit'>CUIT: <span id='employee-cuit-span'>{formatCuit(employee?.cuit)}</span></p>
            <p id='employee-category'>Categoría: <span id='employee-category-span'>{employee?.categoria_nombre}</span></p>
            <p id='employee-sector'>Sector: <span id='employee-sector-span'>{employee?.sector.nombre_sector}</span></p>
            <EmployeeSectorInfo employee={employee} />
            <PeriodInfo />
        </div>
    );
}

// const RemunerationsTable: React.FC<{ employeeRemunerations: AllRemunerationsFront[], requiredRemunerations: AllRemunerationsFront[] }> = ({ employeeRemunerations, requiredRemunerations }) => {
const RemunerationsTable: React.FC = () => {
    const { employeeRemunerations, requiredRemunerations, totalEmployeeRemunerations, totalEmployeeConcepts } = useLiquid();
    return (
        <div id='employee-remunerations'>
            <table id='employee-remunerations-table' className='preview-table'>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Unidades</th>
                        <th>Importe</th>
                    </tr>
                </thead>
                <tbody id='employee-remunerations-table-body'>
                    {
                        employeeRemunerations?.sort((a, b) => a.remuneracion_id - b.remuneracion_id).map((remuneration) => (
                            <tr key={remuneration.remuneracion_id} className='employee-remunerations-row'>
                                <td>{remuneration.remuneracion_id}</td>
                                <td>{remuneration.nombre}</td>
                                <td>{remuneration.unidades}</td>
                                <td className="employee-remunerations-table-value">{remuneration.valor && (remuneration.valor).toFixed(2)}</td>
                            </tr>
                        ))
                    }
                    {
                        employeeRemunerations.length > 0 && (
                            <tr className="bold">
                                <td></td>
                                <td>TOTAL REMUNERATIVO</td>
                                <td></td>
                                <td>{totalEmployeeRemunerations.toFixed(2)}</td>
                            </tr>
                        )
                    }
                    {
                        requiredRemunerations?.sort((a, b) => a.remuneracion_id - b.remuneracion_id).map((remuneration) => (
                            <tr key={remuneration.remuneracion_id} className='employee-remunerations-row'>
                                <td>{remuneration.remuneracion_id}</td>
                                <td>{remuneration.nombre}</td>
                                <td>{remuneration.unidades}</td>
                                <td className="employee-remunerations-table-value">{remuneration.valor && (remuneration.valor).toFixed(2)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <table id="employee-remunerations-total" className='preview-table'>
                <tbody>
                    <tr className='employee-remunerations-row  bold'>
                        <td>Total</td>
                        <td></td>
                        <td></td>
                        <td className="employee-remunerations-table-value">{totalEmployeeConcepts.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div >
    );
}

export const Preview: React.FC = () => {
    // const { employeeRemunerations, employee, employer, requiredRemunerations } = useLiquid();
    const { employee, employer } = useLiquid();

    return (
        <div id='preview-container'>
            <EmployerInfo employer={employer} />
            <EmployeeInfo employee={employee} />
            {/* <RemunerationsTable employeeRemunerations={employeeRemunerations} requiredRemunerations={requiredRemunerations} /> */}
            <RemunerationsTable />
        </div>

    )
}