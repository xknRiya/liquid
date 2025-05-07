// import { evaluate } from "mathjs";
import {
    useEffect,
    useRef,
    // useState
} from "react";
import { useLiquid } from "../hooks/useLiquid";
import { OtherRemunerations } from "../interfaces";

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

const InputContainer: React.FC<InputContainerProps> = ({ label, id, value, onChange, children, type, placeholder, ref, prefix, ...props }) => {
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

// const DropdownInput: React.FC<InputContainerProps> = ({ label, id, value, children, type, placeholder, ref, prefix, ...props }) => {
//     const [show, setShow] = useState(false);
//     const { remunerations, setSelectedRemuneration } = useLiquid();

//     const handleOptionClick = (remuneration: OtherRemunerations) => {
//         if (!remuneration) return;
//         if (!remunerations) return;
//         const newRemuneration = {
//             ...remuneration,
//             unidades: 1,
//             valor: remuneration.tipo === 'relativa' ?
//                 remunerations.base.valor * remuneration.valor / 100 :
//                 remuneration.valor
//         };
//         setSelectedRemuneration(newRemuneration);
//     };

//     return (
//         <div id={id}>
//             <label htmlFor={id}>{label}</label>
//             {
//                 prefix &&
//                 <span>{prefix}</span>
//             }
//             <input ref={ref} type={type || 'text'} name={id} value={value} autoComplete='off' onFocus={() => setShow(true)} onBlur={() => setShow(false)} placeholder={placeholder || 'Some text'} {...props} readOnly />
//             <div className='dropdown-menu'>
//                 <datalist id='remunerations-datalist' className={show ? 'show' : ''}>
//                     {children}
//                 </datalist>
//             </div>
//         </div >
//     )
// };

export const Inputs: React.FC = () => {
    const {
        inputValue,
        setInputValue,
        employees,
        remunerations,
        selectedRemuneration,
        setSelectedRemuneration,
        period,
        setPeriod
    } = useLiquid();

    const inputRef = useRef<HTMLInputElement>(null);
    const datalistRef = useRef<HTMLDataListElement>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target instanceof HTMLElement ? event.target : undefined;
            if (!target) return;
            const father = target.parentElement;
            if (!father) return;
            const datalists = document.querySelectorAll('.dropdown-menu > datalist');
            datalists.forEach(datalist => datalist.classList.remove('show'));

            if (target.classList.contains('trigger')) {
                const dropdown = father.querySelector('.dropdown-menu > datalist');
                if (!dropdown) return;

                if (target.id === 'remunerations-input' && !remunerations) {
                    target.classList.add('error');
                } else {
                    target.classList.remove('error');
                    dropdown.classList.add('show');
                };
            };
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [remunerations]);

    const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') return setInputValue('');
        if (parseInt(event.target.value) >= 0) setInputValue(event.target.value);
    };

    const handleOptionClick = (remuneration: OtherRemunerations) => {
        if (!remuneration) return;
        if (!remunerations) return;
        const newRemuneration = {
            ...remuneration,
            unidades: 1,
            valor: remuneration.tipo === 'relativa' ?
                remunerations.base.valor * remuneration.valor / 100 :
                remuneration.valor
        };
        setSelectedRemuneration(newRemuneration);
    };

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
                    placeholder="1000, 1001, 1002..."
                    className='trigger'>
                    <div className="dropdown-menu">

                        <datalist ref={datalistRef} id='employees-datalist' >
                            {
                                employees.map((employee, index) =>
                                    <option key={index} value={employee.legajo} onClick={() => setInputValue((employee.legajo).toString())}>
                                        {employee.legajo} - {employee.apellido}, {employee.nombre}
                                    </option>
                                )
                            }
                        </datalist>
                    </div>
                </InputContainer>
            </div>
            {/* <div className="inputs-option">
                <DropdownInput
                    label="Seleccione la remuneración: "
                    id='remunerations-select'
                    value={selectedRemuneration?.nombre || ''}
                    placeholder="Seleccione la remuneración"
                    className='trigger'>
                    {remunerations?.base &&
                        <>
                            <option value={remunerations.base.nombre} onClick={() => handleOptionClick(remunerations.base)}>{remunerations?.base.nombre}</option>
                            {
                                remunerations?.remunerations.map((remuneration) => (
                                    <option key={remuneration.remuneracion_id} value={remuneration.nombre} onClick={() => handleOptionClick(remuneration)}>{remuneration.nombre}</option>
                                ))
                            }
                        </>
                    }
                </DropdownInput>
            </div> */}

            <div className="inputs-option remunerations">
                <div id="remunerations-period">
                    <label htmlFor='remunerations-period'>Período: </label>
                    <input type="text" id="remunerations-period-month" name="remunerations-period-month" value={period.month} onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                            e.currentTarget.value = String(parseInt(e.currentTarget.value) - 1);
                        } else if (e.key === 'ArrowUp') {
                            e.currentTarget.value = String(parseInt(e.currentTarget.value) + 1);
                        }
                        console.log('onkeydown')
                    }}
                        onChange={(event) => {
                            console.log('onchange')
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
                <div id="select-remuneration">
                    <label htmlFor='remunerations-select'>Seleccione la remuneración: </label>

                    <input type="text" value={selectedRemuneration?.nombre} className='trigger' id="remunerations-input" readOnly />
                    <div className="dropdown-menu">
                        <datalist id='remunerations-datalist'>
                            {remunerations?.base &&
                                <>
                                    <option value={remunerations.base.nombre} onClick={() => handleOptionClick(remunerations.base)}>{remunerations?.base.nombre}</option>
                                    {
                                        remunerations?.remunerations.map((remuneration) => (
                                            <option key={remuneration.remuneracion_id} value={remuneration.nombre} onClick={() => handleOptionClick(remuneration)}>{remuneration.nombre}</option>
                                        ))
                                    }
                                </>
                            }
                        </datalist>
                    </div>
                </div>
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
        </div >
    )
}