import type { Cliente2 } from "../../services/api/clienteService"
import type { Documento } from "../../services/taxes/documentosService"
import type { CreateUpdatePersona } from "../../services/taxes/personasService"
import { toDateInputValue } from "../formatLocalDate"
import {
    getDefaultPersonaFechaNacimiento,
    getDocumentKind,
} from "../../components/taxes/personas/personaFormShared"

const normalizeDocumento = (value: string): string => value.replace(/\D/g, "")

export const resolveTaxDocumentoId = (
    cliente: Cliente2,
    documentos: Documento[] = [],
): number => {
    const digits = normalizeDocumento(cliente.numdoc || "")
    const isJuridica = cliente.tipper === "J" || digits.length === 11

    const kind = isJuridica ? "ruc" : digits.length === 8 ? "dni" : "other"
    const match = documentos.find(
        (doc) => getDocumentKind(doc.id_documento, documentos) === kind,
    )
    if (match) return match.id_documento

    if (kind === "ruc") {
        const byId = documentos.find((doc) => doc.id_documento === 4)
        if (byId) return byId.id_documento
    }

    return documentos[0]?.id_documento ?? 0
}

const buildNombresFromCliente = (cliente: Cliente2): string =>
    [cliente.prinom, cliente.segnom]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(" ")

export const cliente2ToPersonaPayload = (
    cliente: Cliente2,
    documentos: Documento[] = [],
): CreateUpdatePersona => {
    const documento = resolveTaxDocumentoId(cliente, documentos)
    const numeroDocumento = (cliente.numdoc || "").trim()
    const email = cliente.email?.trim() || null
    const isJuridica = cliente.tipper === "J" || normalizeDocumento(numeroDocumento).length === 11

    if (isJuridica) {
        const razonSocial = (cliente.razonsocial || cliente.nombre || "").trim().toUpperCase()
        const nombreComercial = (cliente.nombre || "").trim().toUpperCase()
        const direccion = (cliente.domfiscal || cliente.direccion || "").trim().toUpperCase()

        return {
            nombres: "0",
            apellido_paterno: "0",
            apellido_materno: "0",
            razon_social: razonSocial,
            nombre_comercial: nombreComercial || "0",
            documento,
            numero_documento: numeroDocumento,
            direccion,
            fecha_nacimiento: getDefaultPersonaFechaNacimiento(),
            nombre_completo: razonSocial,
            email,
        }
    }

    const nombres = buildNombresFromCliente(cliente).toUpperCase()
    const apellidoPaterno = (cliente.apepat || "").trim().toUpperCase()
    const apellidoMaterno = (cliente.apemat || "").trim().toUpperCase()
    const direccion = (cliente.direccion || "").trim().toUpperCase()
    const fechaNacimiento =
        toDateInputValue(cliente.cumpclie) || getDefaultPersonaFechaNacimiento()
    const nombreCompleto = [nombres, apellidoPaterno, apellidoMaterno]
        .filter(Boolean)
        .join(" ")

    return {
        nombres,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        razon_social: "0",
        nombre_comercial: "0",
        documento,
        numero_documento: numeroDocumento,
        direccion,
        fecha_nacimiento: fechaNacimiento,
        nombre_completo: nombreCompleto,
        email,
    }
}
