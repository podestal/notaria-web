import { FormEvent, useMemo, useState } from "react";
import SimpleInput from "../../../../ui/SimpleInput";
import { CreateUpdateAbogado } from "../../../../../services/api/abogadosService";

export interface AbogadoFormValues {
    razonsocial: string;
    direccion: string;
    distrito: string;
    documento: string;
    telefono: string;
    matricula: string;
    fax: string;
    sede_colegio: string;
}

interface Props {
    initialValues: AbogadoFormValues;
    onSubmit: (values: CreateUpdateAbogado) => Promise<void> | void;
    submitLabel: string;
    loading?: boolean;
    onCancel?: () => void;
}

const toNullable = (value: string) => {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
};

const AbogadoForm = ({ initialValues, onSubmit, submitLabel, loading = false, onCancel }: Props) => {
    const [form, setForm] = useState<AbogadoFormValues>(initialValues);
    const [nameError, setNameError] = useState("");
    const [documentoError, setDocumentoError] = useState("");

    const documentoDigits = form.documento.replace(/\D/g, "");
    const isValidDocumentoLength = documentoDigits.length === 8 || documentoDigits.length === 11;

    const isInvalid = useMemo(() => {
        return !form.razonsocial.trim() || !isValidDocumentoLength;
    }, [form.razonsocial, isValidDocumentoLength]);

    const validate = () => {
        let ok = true;
        if (!form.razonsocial.trim()) {
            setNameError("Razon social es requerida");
            ok = false;
        }
        if (!isValidDocumentoLength) {
            setDocumentoError("Documento debe tener 8 o 11 numeros");
            ok = false;
        }
        return ok;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit({
            razonsocial: toNullable(form.razonsocial),
            direccion: toNullable(form.direccion),
            distrito: toNullable(form.distrito),
            // Backend stores as CharField, so we send a sanitized numeric string.
            documento: documentoDigits,
            telefono: toNullable(form.telefono),
            matricula: toNullable(form.matricula),
            fax: toNullable(form.fax),
            sede_colegio: toNullable(form.sede_colegio),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <SimpleInput
                label="Razon Social"
                value={form.razonsocial}
                setValue={(value) => {
                    setForm((prev) => ({ ...prev, razonsocial: value }));
                    setNameError("");
                }}
                error={nameError}
                horizontal
                required
                fullWidth
            />
            <SimpleInput
                label="Documento"
                value={form.documento}
                setValue={(value) => {
                    const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
                    setForm((prev) => ({ ...prev, documento: digitsOnly }));
                    setDocumentoError("");
                }}
                error={documentoError}
                horizontal
                required
                fullWidth
            />
            <SimpleInput
                label="Telefono"
                value={form.telefono}
                setValue={(value) => setForm((prev) => ({ ...prev, telefono: value }))}
                horizontal
                fullWidth
            />
            <SimpleInput
                label="Matricula"
                value={form.matricula}
                setValue={(value) => setForm((prev) => ({ ...prev, matricula: value }))}
                horizontal
                fullWidth
            />
            <SimpleInput
                label="Direccion"
                value={form.direccion}
                setValue={(value) => setForm((prev) => ({ ...prev, direccion: value }))}
                horizontal
                fullWidth
            />
            <SimpleInput
                label="Distrito"
                value={form.distrito}
                setValue={(value) => setForm((prev) => ({ ...prev, distrito: value }))}
                horizontal
                fullWidth
            />
            <SimpleInput
                label="Fax"
                value={form.fax}
                setValue={(value) => setForm((prev) => ({ ...prev, fax: value }))}
                horizontal
                fullWidth
            />
            <SimpleInput
                label="Sede Colegio"
                value={form.sede_colegio}
                setValue={(value) => setForm((prev) => ({ ...prev, sede_colegio: value }))}
                horizontal
                fullWidth
            />

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading || isInvalid}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Guardando..." : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default AbogadoForm;
