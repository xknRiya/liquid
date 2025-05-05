import { useLiquid } from "../hooks/useLiquid";
import { AllRemunerationsFront, Employee, Employer, Sector } from "../interfaces";

const EmployerInfo: React.FC<{ employer: Employer | undefined }> = ({ employer }) => {
    return (
        <div id='employer-info'>
            <p id='employer-name'>Nombre: <span id='employer-name-span'>{employer?.nombre}</span></p>
            <p id='employer-cuit'>CUIT: <span id='employer-cuit-span'>{employer?.cuit}</span></p>
            <p id='employer-address'>Dirección: <span id='employer-address-span'>{employer?.direccion_laboral}</span></p>
        </div>
    )
}

const EmployeeSectorInfo: React.FC<{ sector: Sector | undefined }> = ({ sector }) => {
    return (
        <div id='employee-sector-info'>
            <p id='employee-sector-ley'>Ley: <span id='employee-sector-ley-span'>{sector?.ley}</span></p>
            <p id='employee-sector-sindicato'>Sindicato: <span id='employee-sector-sindicato-span'>{sector?.sindicato}</span></p>
            <p id='employee-sector-obra-social'>Obra social: <span id='employee-sector-obra-social-span'>{sector?.obra_social}</span></p>
            <p id='employee-sector-cct'>CCT: <span id='employee-sector-cct-span'>{sector?.cct}</span></p>
        </div>
    );
}

const EmployeeInfo: React.FC<{ employee: Employee | undefined }> = ({ employee }) => {
    console.log(employee);
    return (
        <div id='employee-info'>
            <p id='employee-name'>Nombre: <span id='employee-name-span'>{employee ? `${employee.apellido}, ${employee.nombre}` : ''}</span></p>
            <p id='employee-cuit'>CUIT: <span id='employee-cuit-span'>{employee?.cuit}</span></p>
            <p id='employee-category'>Categoría: <span id='employee-category-span'>{employee?.categoria_nombre}</span></p>
            <p id='employee-sector'>Sector: <span id='employee-sector-span'>{employee?.sector.nombre_sector}</span></p>
            <EmployeeSectorInfo sector={employee?.sector} />
        </div>
    );
}
const RemunerationsTable: React.FC<{ employeeRemunerations: AllRemunerationsFront[] }> = ({ employeeRemunerations }) => {
    return (
        <div id='employee-remunerations'>
            <table id='employee-remunerations-table'>
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
                            <tr key={remuneration.remuneracion_id}>
                                <td>{remuneration.remuneracion_id}</td>
                                <td>{remuneration.nombre}</td>
                                <td>{remuneration.unidades}</td>
                                <td>{remuneration.valor && (remuneration.valor * remuneration.unidades).toFixed(2)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export const Preview: React.FC = () => {
    const { employeeRemunerations, employee, employer } = useLiquid();
    return (
        <div id='preview-container'>
            <EmployerInfo employer={employer} />
            <EmployeeInfo employee={employee} />
            <RemunerationsTable employeeRemunerations={employeeRemunerations} />
        </div>

    )
}