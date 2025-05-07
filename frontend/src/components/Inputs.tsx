// import { evaluate } from "mathjs";
import { useLiquid } from "../hooks/useLiquid";

interface InputContainerProps {
    id: string;
    label: string;
    value: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
    type?: string;
    placeholder?: string;
    ref?: React.RefObject<HTMLInputElement | null>;
    prefix?: string;
    [key: string]: unknown;
};

export const InputContainer: React.FC<InputContainerProps> = ({ label, id, value, onChange, children, type, placeholder, ref, prefix, ...props }) => {
    return (
        <div id={id}>
            <label htmlFor={id}>{label}</label>
            {
                prefix &&
                <span>{prefix}</span>
            }
            <input ref={ref} type={type || 'text'} name={id} value={value} autoComplete='off' onChange={onChange} placeholder={placeholder || 'Some text'} {...props} />
            {children}
        </div>
    );
};

export const Inputs: React.FC = () => {
    const {
        inputRef,
        datalistRef,
        inputValue,
        setInputValue,
        employees,
        remunerations,
        selectedRemuneration,
        setSelectedRemuneration,
        period,
        setPeriod
    } = useLiquid();


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
                <InputContainer
                    label="N° Legajo: "
                    ref={inputRef}
                    id='employee-file-number'
                    value={inputValue}
                    onChange={inputOnChange}
                    placeholder="1000, 1001, 1002...">
                    <datalist ref={datalistRef} id='employees-datalist' >
                        {
                            employees.map((employee, index) =>
                                <option key={index} value={employee.legajo} onClick={() => setInputValue((employee.legajo).toString())}>
                                    {employee.legajo} - {employee.apellido}, {employee.nombre}
                                </option>
                            )
                        }
                    </datalist>
                </InputContainer>
            </div>

            <div className="inputs-option remunerations">
                <div id="remunerations-period">
                    <label htmlFor='remunerations-period'>Período: </label>
                    <input type="text" id="remunerations-period-month" name="remunerations-period-month" value={period.month} onChange={(event) => {
                        const newPeriod = { month: parseInt(event.target.value) || 0, year: period.year };
                        if (newPeriod.month > 12 || newPeriod.month < 0) return;
                        setPeriod(newPeriod)
                    }} />
                    <span> / </span>
                    <input type="text" id="remunerations-period-year" name="remunerations-period-year" value={period.year} onChange={(event) => {
                        const newPeriod = { month: period.month, year: parseInt(event.target.value) || 0 };
                        if (newPeriod.year < 0 || newPeriod.year > (new Date()).getFullYear()) return;
                        setPeriod(newPeriod)
                    }} />
                </div>
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
                            <InputContainer label={`Unidades` + (selectedRemuneration.tipo_unidad != null ? ` (${selectedRemuneration.tipo_unidad})` : '') + ': '} id="remuneration-units" value={selectedRemuneration.unidades} onChange={selectedRemunerationUnitsOnChange} type="number" />
                            <InputContainer label="Valor base: " id="remuneration-base-value" prefix="$" value={selectedRemuneration.valor.toFixed(2)} onChange={() => { }} disabled />
                            <InputContainer label="Valor: " id="remuneration-value" prefix="$" value={(selectedRemuneration.valor * selectedRemuneration.unidades).toFixed(2)} onChange={() => { }} disabled />
                        </>
                    )
                }
            </div>
        </div>
    )
}