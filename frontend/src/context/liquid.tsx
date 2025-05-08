import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AllRemunerationsFront, Employee, EmployeeMin, Employer, Period, Remunerations } from "../interfaces";
import debounce from "just-debounce-it";

import mockDB from "../mocks/mock.json";

const VITE_USE_DB = import.meta.env.VITE_USE_DB;

interface LiquidContextType {
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    employer?: Employer;
    employees: EmployeeMin[];
    employee?: Employee;
    remunerations?: Remunerations;
    selectedRemuneration?: AllRemunerationsFront;
    setSelectedRemuneration: (remuneration: AllRemunerationsFront) => void;
    employeeRemunerations: AllRemunerationsFront[];
    period: Period;
    setPeriod: (period: Period) => void;
    requiredRemunerations: AllRemunerationsFront[];
    totalEmployeeRemunerations: number;
    totalEmployeeConcepts: number;
    // setEmployeeRemunerations: (remunerations: AllRemunerationsFront[]) => void;
}

export const LiquidContext = React.createContext<LiquidContextType | null>(null);

export const LiquidProvider = ({ children }: { children: React.ReactNode }) => {

    const useDB = VITE_USE_DB === 'true';

    const [inputValue, setInputValue] = useState('')
    const [remunerations, setRemunerations] = useState<Remunerations>()
    const [employee, setEmployee] = useState<Employee>()
    const [employees, setEmployees] = useState<EmployeeMin[]>([])
    const [employer, setEmployer] = useState<Employer>()
    const [period, setPeriod] = useState({ month: 3, year: 2025 });

    const [employeeRemunerations, setEmployeeRemunerations] = useState<AllRemunerationsFront[]>([])
    const [selectedRemuneration, setSelectedRemuneration] = useState<AllRemunerationsFront>()

    const [requiredRemunerations, setRequiredRemunerations] = useState<AllRemunerationsFront[]>([])

    const [totalEmployeeRemunerations, setTotalEmployeeRemunerations] = useState<number>(0)
    const [totalEmployeeConcepts, setTotalEmployeeConcepts] = useState<number>(0)

    const legajoSet = useMemo(() => new Set(employees.map(employee => employee.legajo)), [employees])

    const debouncedGetEmployees = useCallback(debounce((query: number) => {
        if (`${query}`.length > 2) {
            if (useDB) {
                fetch(`http://localhost:3000/employees/inexact/${query}`)
                    .then(res => res.json())
                    .then(data => setEmployees(data))
                    .catch(err => console.log(err))
            } else {
                const newEmployees = mockDB.employees.map(employee => {
                    return {
                        legajo: employee.legajo as number,
                        cuit: employee.cuit as number,
                        nombre: employee.nombre as string,
                        apellido: employee.apellido as string,
                    }
                });
                setEmployees(newEmployees);
            }
        }
    }, 300), [employee]);

    const debouncedGetEmployee = useCallback(
        debounce((employeeLegajo: number) => {
            employees.forEach(employee => {
                if (employee.legajo == employeeLegajo) {
                    if (useDB) {
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
                    } else {
                        const newEmployee = mockDB.employees.find(employee => employee.legajo === employeeLegajo);
                        if (!newEmployee) return;
                        setEmployee(newEmployee as Employee);
                    }
                }
            })
        }, 500), [employees]);


    useEffect(() => {
        setEmployeeRemunerations([])
        if (employee) {
            if (useDB) {
                fetch(`http://localhost:3000/remunerations/${employee.sector_id}/category/${employee.categoria_nombre}`)
                    .then(res => res.json())
                    .then(data => setRemunerations(data))
                    .catch(err => console.log(err))
            } else {
                Object.keys(mockDB.remunerations).forEach(key => {
                    if (key === employee.categoria_nombre) {
                        const response = mockDB.remunerations[key as keyof typeof mockDB.remunerations]
                        const processedRemunerations = response.remunerations.map(remuneration => {
                            return {
                                ...remuneration,
                                unidades: 1,
                                valor: remuneration.tipo === 'relativa' && remuneration.obligatorio ?
                                    totalEmployeeRemunerations * remuneration.valor_base / 100 :
                                    remuneration.valor_base
                            }
                        })

                        const newRemunerations = {
                            base: {
                                ...response.base,
                                unidades: 1,
                                valor: response.base.valor_base
                            },
                            remunerations: processedRemunerations.filter(remuneration => !remuneration.obligatorio)
                        }

                        if (!newRemunerations) return;
                        const newRequiredRemunerations = processedRemunerations.filter(remuneration =>
                            remuneration.obligatorio
                        )

                        setRequiredRemunerations(newRequiredRemunerations as AllRemunerationsFront[]);
                        setRemunerations(newRemunerations as Remunerations);
                        setEmployeeRemunerations([newRemunerations.base] as AllRemunerationsFront[]);
                    }
                })
            }
        }
    }, [employee])

    useEffect(() => {
        const newEmployeeRemunerations = employeeRemunerations.map(remuneration => {
            return {
                ...remuneration,
                valor: remuneration.tipo === 'relativa' && remuneration.obligatorio ?
                    totalEmployeeRemunerations * remuneration.valor_base / 100 * remuneration.unidades :
                    remuneration.valor
            }
        })
        setEmployeeRemunerations(newEmployeeRemunerations)

        const newRequiredRemunerations = requiredRemunerations.map(remuneration => {
            return {
                ...remuneration,
                valor: remuneration.tipo === 'relativa' && remuneration.obligatorio ?
                    totalEmployeeRemunerations * remuneration.valor_base / 100 * remuneration.unidades :
                    remuneration.valor
            }
        });
        setRequiredRemunerations(newRequiredRemunerations)
    }, [totalEmployeeRemunerations])

    useEffect(() => {
        const newTotalEmployeeConcepts = requiredRemunerations.reduce((acum, remuneration) => acum + remuneration.valor, totalEmployeeRemunerations);
        setTotalEmployeeConcepts(newTotalEmployeeConcepts);
    }, [requiredRemunerations, totalEmployeeRemunerations])

    useEffect(() => {
        if (useDB) {
            fetch(`http://localhost:3000/employer`)
                .then(res => res.json())
                .then(data => setEmployer(data))
                .catch(err => console.log(err))
        } else {
            setEmployer(mockDB.employer);
        }
    }, [])

    useEffect(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) return;
        if (legajoSet.has(value)) {
            debouncedGetEmployee(value);
        } else {
            debouncedGetEmployees(value);
        };
    }, [inputValue, legajoSet])

    useEffect(() => {
        if (!selectedRemuneration) return;
        const indexOfSelectedRemuneration = employeeRemunerations.findIndex(remuneration => remuneration.remuneracion_id === selectedRemuneration.remuneracion_id);
        let newEmployeeRemunerations = [...employeeRemunerations];

        if (selectedRemuneration.unidades === 0 && indexOfSelectedRemuneration != -1) {
            newEmployeeRemunerations = [...newEmployeeRemunerations.slice(0, indexOfSelectedRemuneration), ...newEmployeeRemunerations.slice(indexOfSelectedRemuneration + 1)]
        } else if (indexOfSelectedRemuneration === -1) {
            newEmployeeRemunerations.push(selectedRemuneration)
        } else {
            newEmployeeRemunerations[indexOfSelectedRemuneration] = {
                ...selectedRemuneration,
                valor: selectedRemuneration.tipo === 'relativa' && remunerations ?
                    (remunerations?.base.valor * selectedRemuneration.valor_base / 100) * selectedRemuneration.unidades :
                    selectedRemuneration.valor_base * selectedRemuneration.unidades
            };
        };
        setEmployeeRemunerations([...newEmployeeRemunerations]);
    }, [selectedRemuneration])

    useEffect(() => {
        setSelectedRemuneration(undefined)
    }, [employee])

    useEffect(() => {
        const newTotalEmployeeRemunerations = employeeRemunerations.reduce((acum, remuneration) => acum + remuneration.valor, 0);
        setTotalEmployeeRemunerations(newTotalEmployeeRemunerations);
    }, [employeeRemunerations])

    return (
        <LiquidContext.Provider value={{
            inputValue,
            setInputValue,
            employer,
            employees,
            employee,
            remunerations,
            selectedRemuneration,
            setSelectedRemuneration,
            employeeRemunerations,
            period,
            setPeriod,
            requiredRemunerations,
            totalEmployeeRemunerations,
            totalEmployeeConcepts
        }}>
            {children}
        </LiquidContext.Provider>
    );
};