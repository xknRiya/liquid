import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AllRemunerationsFront, Employee, EmployeeMin, Employer, Remunerations } from "../interfaces";
import debounce from "just-debounce-it";


interface LiquidContextType {
    inputRef: React.RefObject<HTMLInputElement | null>;
    datalistRef: React.RefObject<HTMLDataListElement | null>;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    employer?: Employer;
    employees: EmployeeMin[];
    employee?: Employee;
    remunerations?: Remunerations;
    selectedRemuneration?: AllRemunerationsFront;
    setSelectedRemuneration: (remuneration: AllRemunerationsFront) => void;
    employeeRemunerations: AllRemunerationsFront[];
    // setEmployeeRemunerations: (remunerations: AllRemunerationsFront[]) => void;
}

export const LiquidContext = React.createContext<LiquidContextType | null>(null);

export const LiquidProvider = ({ children }: { children: React.ReactNode }) => {

    const [inputValue, setInputValue] = useState('')
    const [remunerations, setRemunerations] = useState<Remunerations>()
    const [employee, setEmployee] = useState<Employee>()
    const [employees, setEmployees] = useState<EmployeeMin[]>([])
    const [employer, setEmployer] = useState<Employer>()

    const [employeeRemunerations, setEmployeeRemunerations] = useState<AllRemunerationsFront[]>([])
    const [selectedRemuneration, setSelectedRemuneration] = useState<AllRemunerationsFront>()

    const inputRef = useRef<HTMLInputElement>(null);
    const datalistRef = useRef<HTMLDataListElement>(null);

    const legajoSet = useMemo(() => new Set(employees.map(employee => employee.legajo)), [employees])

    const debouncedGetEmployees = useCallback(debounce((query: string) => {
        if (query.length > 2) {
            fetch(`http://localhost:3000/employees/inexact/${query}`)
                .then(res => res.json())
                .then(data =>
                    setEmployees(data)
                )
                .catch(err => console.log(err))
        }
    }, 300), [employee]);

    const debouncedGetEmployee = useCallback(
        debounce((employeeLegajo: string) => {
            employees.forEach(employee => {
                if (employee.legajo == employeeLegajo) {
                    fetch(`http://localhost:3000/employee/${employeeLegajo}`)
                        .then(res => res.json())
                        .then(data => {
                            const newEmployee = {
                                ...data.employee,
                                sector: data.sector
                            };
                            setEmployee(newEmployee)
                        })
                        .catch(err => console.log(err))
                }
            })
        }, 500), [employees]);


    useEffect(() => {
        setEmployeeRemunerations([])
        if (employee) {
            fetch(`http://localhost:3000/remunerations/${employee?.sector_id}/category/${employee?.categoria_nombre}`)
                .then(res => res.json())
                .then(data => setRemunerations(data))
                .catch(err => console.log(err))
        }
    }, [employee])

    useEffect(() => {
        fetch(`http://localhost:3000/employer`)
            .then(res => res.json())
            .then(data => setEmployer(data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (legajoSet.has(inputValue)) {
            debouncedGetEmployee(inputValue);
        } else {
            debouncedGetEmployees(inputValue);
        };
    }, [inputValue])

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (event.target === inputRef.current) {
                datalistRef.current?.classList.add('show');
            } else if (event.target != datalistRef.current) {
                if (datalistRef.current) {
                    datalistRef.current.classList.remove('show');
                }
            };
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        if (!selectedRemuneration) return;
        const indexOfSelectedRemuneration = employeeRemunerations.findIndex(remuneration => remuneration.remuneracion_id === selectedRemuneration.remuneracion_id);
        let newEmployeeRemunerations = [...employeeRemunerations];

        if (selectedRemuneration.unidades === 0 && indexOfSelectedRemuneration != -1) newEmployeeRemunerations = [...newEmployeeRemunerations.slice(0, indexOfSelectedRemuneration), ...newEmployeeRemunerations.slice(indexOfSelectedRemuneration + 1)];
        else if (indexOfSelectedRemuneration === -1) newEmployeeRemunerations.push(selectedRemuneration);
        else newEmployeeRemunerations[indexOfSelectedRemuneration] = selectedRemuneration;

        setEmployeeRemunerations(newEmployeeRemunerations);

    }, [selectedRemuneration])

    return (
        <LiquidContext.Provider value={{
            inputRef,
            datalistRef,
            inputValue,
            setInputValue,
            employer,
            employees,
            employee,
            remunerations,
            selectedRemuneration,
            setSelectedRemuneration,
            employeeRemunerations,
            // setEmployeeRemunerations,
        }}>
            {children}
        </LiquidContext.Provider>
    );
};