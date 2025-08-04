import { useState } from "react";
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo";
import { Libro } from "../../../../services/api/extraprotocolares/librosService";
import moment from "moment";
import SimpleInput from "../../../ui/SimpleInput";
import Calendar from "../../../ui/Calendar";
import SimpleSelector from "../../../ui/SimpleSelector";
import { NUMERO_LIBROS } from "../../../../data/librosData";

interface Props {
    libro?: Libro
}

const LibroForm = ({ libro }: Props) => {

    const user = useUserInfoStore(state => state.user);
    const [cronologico, setCronologico] = useState<string>(libro?.numlibro ? `${libro.numlibro}-${libro.ano}` : '');
    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        libro?.fecing
        ? moment.utc(libro.fecing, "YYYY-MM-DD").hour(12).toDate()
        : (new Date())
    );
    const [numeroLibro, setNumeroLibro] = useState(libro?.idnlibro || 0);

  return (
    <div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="N Cronológico"
                value={cronologico}
                setValue={setCronologico}
                horizontal
                disabled
            />
            <div className="grid grid-cols-3 items-center gap-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Fecha de ingreso</p>
                <Calendar
                    selectedDate={fechaIngreso}
                    setSelectedDate={setFechaIngreso}   
                />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelector
                label="N Libro"
                defaultValue={numeroLibro}
                setter={setNumeroLibro}
                options={[
                    { value: 0, label: 'Seleccione un libro' },
                    ...NUMERO_LIBROS.map(libro => ({ value: libro.idnlibro, label: libro.desnlibro }))
                ]}
            />

        </div>
    </div>
  )
}

export default LibroForm