// import { evaluate } from "mathjs";
import { useLiquid } from "../hooks/useLiquid";

export const Inputs: React.FC = () => {
    const { inputRef, datalistRef, inputValue, setInputValue, employees, remunerations, selectedRemuneration, setSelectedRemuneration } = useLiquid();

    const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') return setInputValue('');
        if (parseInt(event.target.value) >= 0) setInputValue(event.target.value);
    };

    const remunerationsOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === 'none') return;
        if (!remunerations) return;

        const targetRemuneration = event.target.value === remunerations.base.nombre ? remunerations.base : remunerations?.remunerations.find(remuneration => remuneration.nombre === event.target.value);
        if (!targetRemuneration) return;

        const newRemuneration = {
            ...targetRemuneration,
            unidades: 1,
            valor: targetRemuneration.tipo === 'relativa' ?
                remunerations.base.valor * targetRemuneration.valor / 100 :
                targetRemuneration.valor
        }
        setSelectedRemuneration(newRemuneration);
    }

    const selectedRemunerationUnitsOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (isNaN(value) || value < 0) return;
        if (!selectedRemuneration) return;
        setSelectedRemuneration({
            ...selectedRemuneration,
            unidades: parseInt(event.target.value)
        });
    };

    return (
        <div id='inputs'>
            <div className='inputs-option'>
                <label htmlFor='employee-file-number'>Ingrese el N° Legajo: </label>
                <input ref={inputRef} list='' autoComplete='off' id='employee-file-number' placeholder='1000, 1001, 1002...' value={inputValue} onChange={inputOnChange} />
                <datalist ref={datalistRef} id='employees-datalist' >
                    {
                        employees.map((employee, index) =>
                            <option key={index} value={employee.legajo} onClick={() => setInputValue(employee.legajo)}>
                                {employee.legajo} - {employee.apellido}, {employee.nombre}
                            </option>
                        )
                    }
                </datalist>
            </div>

            <div className="inputs-option remunerations">
                {/* periodo */}
                <label htmlFor='remunerations-period'>Seleccione el periodo: </label>
                <input type="text" id="remunerations-period" name="remunerations-period" value="2024" onChange={() => { }} />
                <label htmlFor='remunerations-select'>Seleccione la remuneración: </label>
                <select name='remunerations' id='remunerations-select' className='inputs-option' onChange={remunerationsOnChange}>
                    <option value='none'>---</option>
                    {
                        remunerations && (
                            <>
                                <option value={remunerations.base.nombre}>{remunerations?.base.nombre}</option>
                                {
                                    remunerations?.remunerations.map((remuneration) => (
                                        <option key={remuneration.remuneracion_id} value={remuneration.nombre}>{remuneration.nombre}</option>
                                    ))
                                }
                            </>
                        )
                    }
                </select>
                {
                    selectedRemuneration && (
                        <>
                            <label htmlFor="remuneration-units">Unidades: </label>
                            <div>

                                <input type="number" id="remuneration-units" name="remuneration-units" value={selectedRemuneration.unidades} onChange={selectedRemunerationUnitsOnChange} />
                                <span>{selectedRemuneration.tipo_unidad}</span>
                            </div>
                            <label htmlFor="remuneration-base-value">Valor base: </label>
                            <input type="number" id="remuneration-base-value" name="remuneration-base-value" value={selectedRemuneration.valor} onChange={() => { }} disabled />
                            <label htmlFor="remuneration-value">Valor: </label>
                            <input type="number" id="remuneration-value" name="remuneration-value" value={selectedRemuneration.valor * selectedRemuneration.unidades} onChange={() => { }} />
                        </>
                    )
                }
            </div>
        </div>
    )
}