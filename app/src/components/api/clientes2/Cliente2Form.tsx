import React, { useState } from 'react'
import useNotificationsStore from '../../../hooks/store/useNotificationsStore'
import SimpleInput from '../../ui/SimpleInput'
import SearchableDropdownInput from '../../ui/SearchableDropdownInput'
import DateInput from '../../ui/DateInput'
import SimpleSelector from '../../ui/SimpleSelector'
import { UseMutationResult } from '@tanstack/react-query'
import { UpdateCliente2Data } from '../../../hooks/api/cliente2/useUpdateCliente2'
import { Cliente2 } from '../../../services/api/clienteService'
import {
    omitResidenteFieldsForJuridicaPatch,
    residenteForClientePayload,
} from '../../../utils/clienteFormValidation'
import { Ubigeo } from '../../../services/api/ubigeoService'
import { Cargo } from '../../../services/api/cargosService'
import { Profesion } from '../../../services/api/profesionesService'
import { Nacionalidad } from '../../../services/api/nacionalidadesService'
import { GIRO_NEGOCIO, SEDES_REGISTRALES } from '../../../data/patrimonialData'
import SimpleSelectorStr from '../../ui/SimpleSelectosStr'
import useAuthStore from '../../../store/useAuthStore'
import ClienteContratanteFormLayout, {
    ClienteDropdownField,
    ClienteFormSection,
    clienteFormBackButtonClass,
} from '../clientes/shared/ClienteContratanteFormLayout'
import { isRequiredTextMissing, isRequiredValueMissing } from '../../../utils/clienteFormValidation'

interface Props {
    dni: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
    setCliente2: React.Dispatch<React.SetStateAction<Cliente2 | null>>
    cliente2?: Cliente2 | null
    nacionalidades: Nacionalidad[]
    profesiones: Profesion[]
    cargos: Cargo[]
    ubigeos: Ubigeo []
    updateCliente2: UseMutationResult<Cliente2, Error, UpdateCliente2Data>
    selectedTipoPersona: number
}

const civilStatusOptions = [
    { value: 0, label: 'Seleccionar Estado Civil' },
    { value: 1, label: 'Soltero' },
    { value: 2, label: 'Casado' },
    { value: 3, label: 'Divorciado' },
    { value: 4, label: 'Viudo' },
    { value: 5, label: 'Conviviente' },
]

const sexOptions = [
    { value: 0, label: 'Seleccionar Sexo' },
    { value: 1, label: 'Masculino' },
    { value: 2, label: 'Femenino' },
]

const normalizeForCompare = (value: unknown): string => {
    if (value === null || value === undefined) return ''
    return String(value).trim()
}

const getChangedFields = <T extends Record<string, any>>(next: T, prev?: Record<string, any> | null): Partial<T> => {
    if (!prev) return next
    const changed: Partial<T> = {}
    Object.keys(next).forEach((key) => {
        const nextVal = next[key]
        const prevVal = prev[key]
        if (normalizeForCompare(nextVal) !== normalizeForCompare(prevVal)) {
            changed[key as keyof T] = nextVal
        }
    })
    return changed
}

const Cliente2Form = ({ 
    dni, 
    setShowContratanteForm, 
    setShowClienteForm, 
    setCliente2,
    cliente2,
    nacionalidades,
    profesiones,
    cargos,
    ubigeos, 
    updateCliente2,
    selectedTipoPersona,
    }: Props) => {


        const { setMessage, setShow, setType } = useNotificationsStore()
        const access = useAuthStore(s => s.access_token) || ''

        const [apepat, setApepat] = useState(cliente2 ? cliente2.apepat : '')
        const [apemat, setApemat] = useState( cliente2 ? cliente2.apemat : '')
        const [prinom, setPrinom] = useState(cliente2 ? cliente2.prinom : '')
        const [segnom, setSegnom] = useState(cliente2 ? cliente2.segnom : '')
        const [direccion, setDireccion] = useState(cliente2 ? cliente2.direccion : '')
        const [nombre, setNombre] = useState(cliente2 ? `${prinom} ${segnom} ${apepat} ${apemat}` : '')
        const [ubigeo, setUbigeo] = useState<{ id: string; label: string } | null>(() => {
            if (cliente2 && cliente2.idubigeo) {
              const match = ubigeos.find(ubi => ubi.coddis === cliente2.idubigeo);
              if (match) {
                return {
                  id: match.coddis,
                  label: `${match.nomdpto} - ${match.nomprov} - ${match.nomdis}`,
                };
              }
            }
            return null;
          });
          
        const [naturalFrom, setNaturalFrom] = useState(cliente2 ? (cliente2.natper || '') : '')
    
        const [civilStatus, setCivilStatus] = useState(cliente2 ? civilStatusOptions.find( option => option.value === cliente2.idestcivil)?.value : 0)
        const [gender, setGender] = useState(cliente2 ? sexOptions.find( option => option.label[0] === cliente2.sexo)?.value : 0)
        const [nationality, setNationality] = useState<{ id: string; label: string } | null>(() => {
            if (cliente2 && cliente2.nacionalidad) {
              const match = nacionalidades.find(nacionalidad => nacionalidad.idnacionalidad === parseInt(cliente2.nacionalidad || '0'));
              if (match) {
                return {
                  id: (match.idnacionalidad).toString(),
                  label: match.descripcion,
                };
              }
            }
            return null;
          })
        const [birthdate, setBirthdate] = useState(cliente2 ? cliente2.cumpclie || '' : '')
        const [resident, setResident] = useState(1)
    
        const [profesion, setProfesion] = useState<{ id: string; label: string } | null>(() => {
            const detalleProf = (cliente2?.detaprofesion || '').trim()
            if (detalleProf) {
                const match = profesiones.find(
                    profesion => profesion.desprofesion.trim().toLowerCase() === detalleProf.toLowerCase()
                )
                return {
                    id: match ? match.idprofesion.toString() : (cliente2?.idprofesion ? cliente2.idprofesion.toString() : '0'),
                    label: detalleProf,
                }
            }
            if (cliente2?.idprofesion) {
                const match = profesiones.find(profesion => profesion.idprofesion === cliente2.idprofesion)
                if (match) {
                    return {
                        id: (match.idprofesion).toString(),
                        label: match.desprofesion,
                    }
                }
            }
            return null
          })
        const [cargo, setCargo] = useState<{ id: string; label: string } | null>(() => {
            const detalleCargo = (cliente2?.profocupa || '').trim()
            if (detalleCargo) {
                const match = cargos.find(
                    c => c.descripcrapro.trim().toLowerCase() === detalleCargo.toLowerCase()
                )
                return {
                    id: match ? match.idcargoprofe.toString() : (cliente2?.idcargoprofe ? cliente2.idcargoprofe.toString() : '0'),
                    label: detalleCargo,
                }
            }
            if (cliente2?.idcargoprofe) {
                const match = cargos.find(c => c.idcargoprofe === cliente2.idcargoprofe)
                if (match) {
                    return {
                        id: (match.idcargoprofe).toString(),
                        label: match.descripcrapro,
                    }
                }
            }
            return null
          })
        const [profesionInput, setProfesionInput] = useState(() => (cliente2?.detaprofesion || profesion?.label || '').trim())
        const [cargoInput, setCargoInput] = useState(() => (cliente2?.profocupa || cargo?.label || '').trim())
    
        const [celphone, setCellphone] = useState(cliente2 ? cliente2.telcel || '' : '')
        const [officePhone, setOfficePhone] = useState(cliente2 ? cliente2.telofi || '' : '')
        const [fixedPhone, setFixedPhone] = useState(cliente2 ? cliente2.telfijo || '' : '')
        const [email, setEmail] = useState(cliente2 ? cliente2.email || '' : '')
    
        // Error handling states
        const [apepatError, setApepatError] = useState('')
        const [apematError, setApematError] = useState('')
        const [prinomError, setPrinomError] = useState('') 
        const [direccionError, setDireccionError] = useState('')
        const [ubigeoError, setUbigeoError] = useState('')
        const [civilStatusError, setCivilStatusError] = useState('')
        const [genderError, setGenderError] = useState('')
        const [nationalityError, setNationalityError] = useState('')
        const [birthdateError, setBirthdateError] = useState('')
        const [profesionError, setProfesionError] = useState('')
        const [cargoError, setCargoError] = useState('')

        // JURIDICAL PERSON
        const [razonSocial, setRazonSocial] = useState(cliente2 ? cliente2.razonsocial : '')
        const [domFiscal, setDomFiscal] = useState(cliente2 ? cliente2.domfiscal : '')
        const [fechaConstitucion, setFechaConstitucion] = useState(cliente2 ? cliente2.fechaconstitu || '' : '')
        const [numeroDeRegistro, setNumeroDeRegistro] = useState(cliente2 ? cliente2.numregistro || '' : '')
        // const [objetoSocial, setObjetaSocial] = useState(cliente1 ? cliente1.detaprofesion || '' : '')
        const [correoDeEmpresa, setCorreoDeEmpresa] = useState(cliente2 ? cliente2.email || '' : '')
        const [selectedSedeRegistral, setSelectedSedeRegistral] = useState<{ id: string; label: string } | null>(() => { 
            if (cliente2 && cliente2.idsedereg) {
                const match = SEDES_REGISTRALES.find(sede => parseInt(sede.idsedereg) === cliente2.idsedereg);
                if (match) {
                return {
                    id: match.idsedereg,
                    label: match.dessede,
                };
                }
            }
            return null;
            }
        )
        const [numeroPartida, setNumeroPartida] = useState(cliente2 ? cliente2.numpartida : '')
        const [teleEmpresa, setTeleEmpresa] = useState(cliente2 ? cliente2.telempresa || '' : '')
        const [ciiu, setCiiu] = useState(cliente2 ? cliente2.actmunicipal || '' : '')
        const [contacEmpresa, setContacEmpresa] = useState(cliente2 ? cliente2.contacempresa || '' : '')

        const [razonSocialError, setRazonSocialError] = useState('')
        const [domFiscalError, setDomFiscalError] = useState('')
        const [ciiuError, setCiiuError] = useState('')
        const [contacEmpresaError, setContacEmpresaError] = useState('')

        const clearFieldErrors = () => {
            setApepatError('')
            setApematError('')
            setPrinomError('')
            setDireccionError('')
            setUbigeoError('')
            setCivilStatusError('')
            setGenderError('')
            setNationalityError('')
            setBirthdateError('')
            setProfesionError('')
            setCargoError('')
            setRazonSocialError('')
            setDomFiscalError('')
            setCiiuError('')
            setContacEmpresaError('')
        }
        
        const handleSubmit = (e: React.FormEvent) => {
            
            e.preventDefault()
            clearFieldErrors()

            if (selectedTipoPersona === 1) {

                if (isRequiredTextMissing(apepat)) {
                    setApepatError('Apellido Paterno es requerido')
                    setType('error')
                    setMessage('Apellido Paterno es requerido')
                    setShow(true)
                    return
                }
        
                if (isRequiredTextMissing(prinom)) {
                    setPrinomError('Primer Nombre es requerido')
                    setType('error')
                    setMessage('Primer Nombre es requerido')
                    setShow(true)
                    return
                }
        
                if (isRequiredTextMissing(apemat)) {
                    setApematError('Apellido Materno es requerido')
                    setType('error')
                    setMessage('Apellido Materno es requerido')
                    setShow(true)
                    return
                }
        
                const nombreNatural = `${apepat} ${apemat}, ${prinom} ${segnom}`.trim()
        
                if (isRequiredTextMissing(direccion)) {
                    setDireccionError('Dirección es requerida')
                    setType('error')
                    setMessage('Dirección es requerida')
                    setShow(true)
                    return
                }
        
                if (!ubigeo) {
                    setUbigeoError('Ubigeo es requerido')
                    setType('error')
                    setMessage('Ubigeo es requerido')
                    setShow(true)
                    return
                }
        
                if (civilStatus === 0) {
                    setCivilStatusError('Estado Civil es requerido')
                    setType('error')
                    setMessage('Estado Civil es requerido')
                    setShow(true)
                    return
                }
        
                if (gender === 0) {
                    setGenderError('Sexo es requerido')
                    setType('error')
                    setMessage('Sexo es requerido')
                    setShow(true)
                    return  
                }
        
                if (nationality === null) {
                    setNationalityError('Nacionalidad es requerida')
                    setType('error')
                    setMessage('Nacionalidad es requerida')
                    setShow(true)
                    return
                }
        
                if (isRequiredTextMissing(birthdate)) {
                    setBirthdateError('Fecha de Nacimiento es requerida')
                    setType('error')
                    setMessage('Fecha de Nacimiento es requerida')
                    setShow(true)
                    return
                }
        
                const rawBirthdate = birthdate.split('/')
        
                if (rawBirthdate.length !== 3 || rawBirthdate[0].length !== 2 || rawBirthdate[1].length !== 2 || rawBirthdate[2].length !== 4) {
                    setBirthdateError('Fecha de Nacimiento debe ser en formato DD/MM/AAAA')
                    setType('error')
                    setMessage('Fecha de Nacimiento debe ser en formato DD/MM/AAAA')
                    setShow(true)
                    return
                }
        
                if (parseInt(rawBirthdate[0]) < 1 || parseInt(rawBirthdate[0]) > 31) {
                    setBirthdateError('Día de Nacimiento debe ser entre 01 y 31')
                    setType('error')
                    setMessage('Día de Nacimiento debe ser entre 01 y 31')
                    setShow(true)
                    return  
                }
        
                if (parseInt(rawBirthdate[1]) < 1 || parseInt(rawBirthdate[1]) > 12) {
                    setBirthdateError('Mes de Nacimiento debe ser entre 01 y 12')
                    setType('error')
                    setMessage('Mes de Nacimiento debe ser entre 01 y 12')
                    setShow(true)
                    return  
                }
        
                if (parseInt(rawBirthdate[2]) < 1900 || parseInt(rawBirthdate[2]) > new Date().getFullYear()) {
                    setBirthdateError('Año de Nacimiento debe ser válido')
                    setType('error')
                    setMessage('Año de Nacimiento debe ser válido')
                    setShow(true)
                    return  
                }
        
                const profesionText = (profesionInput.trim() || profesion?.label?.trim() || '')
                const cargoText = (cargoInput.trim() || cargo?.label?.trim() || '')

                if (!profesionText) {
                    setProfesionError('Profesión es requerida')
                    setType('error')
                    setMessage('Profesión es requerida')
                    setShow(true)
                    return
                }
        
                if (!cargoText) {
                    setCargoError('Cargo es requerido')
                    setType('error')
                    setMessage('Cargo es requerido')
                    setShow(true)
                    return
                }
                const matchedProfesion = profesiones.find(
                    p => p.desprofesion.trim().toLowerCase() === profesionText.toLowerCase()
                )
                const matchedCargo = cargos.find(
                    c => c.descripcrapro.trim().toLowerCase() === cargoText.toLowerCase()
                )
                const profesionIdFromSelected = profesion?.id ? Number.parseInt(profesion.id, 10) : Number.NaN
                const cargoIdFromSelected = cargo?.id ? Number.parseInt(cargo.id, 10) : Number.NaN
                const cargoId = matchedCargo
                    ? matchedCargo.idcargoprofe
                    : !Number.isNaN(cargoIdFromSelected)
                        ? cargoIdFromSelected
                        : (cliente2?.idcargoprofe || 0)
                // Keep selected/matched profession ID even when the text is edited.
                const profesionIdForCustomText = matchedProfesion
                    ? matchedProfesion.idprofesion
                    : !Number.isNaN(profesionIdFromSelected)
                        ? profesionIdFromSelected
                        : (cliente2?.idprofesion || 0)
        
                const fullPayload = {
                    tipper: 'N',
                    apepat,
                    apemat,
                    prinom,
                    segnom,
                    nombre: nombreNatural,
                    direccion,
                    idubigeo: ubigeo.id,
                    resedent: residenteForClientePayload(selectedTipoPersona, resident),
                    idtipdoc: 1,
                    numdoc: dni,
                    email,
                    nacionalidad: nationality.id,
                    idestcivil: civilStatus,
                    sexo: gender === 1 ? 'M' : 'F',
                    telfijo: fixedPhone,
                    telcel: celphone,
                    telofi: officePhone,
                    idcargoprofe: cargoId,
                    idprofesion: profesionIdForCustomText,
                    detaprofesion: profesionText,
                    cumpclie: birthdate,
                    razonsocial: '',
                    domfiscal: '',
                    idsedereg: 0,
                    numpartida: '',
                    telempresa: '',
                    actmunicipal: '',
                    contacempresa: '',
                    ubigeo_plantilla: '',
                    fechaconstitu: '',
                    profesion_plantilla: profesionText,
                    tipocli: 'N',
                    residente: residenteForClientePayload(selectedTipoPersona, resident),
                    fechaing: '',
                    dirfer: '',
                    profocupa: cargoText,
                    conyuge: '',
                    natper: naturalFrom,
                }

                const changedPayload = getChangedFields(fullPayload, cliente2 || undefined)
                // Backend expects profession id to persist even when only the label changes.
                changedPayload.idprofesion = profesionIdForCustomText
                // Same rule for cargo: keep selected cargo id while profocupa text changes.
                changedPayload.idcargoprofe = cargoId
                if (Object.keys(changedPayload).length === 0) {
                    setType('success')
                    setMessage('No hay cambios para guardar')
                    setShow(true)
                    return
                }

                updateCliente2.mutate({
                    access,
                    cliente: changedPayload as any
                }, {
                    onSuccess: (data) => {
                        console.log('Cliente actualizado:', data)
                        setType('success')
                        setMessage('Cliente actualizado exitosamente')
                        setShow(true)
                        setShowClienteForm(false)
                        setShowContratanteForm(true)
                        // setCliente1(data)
                        setCliente2(data)
        
                    },
                    onError: (error) => {
                        console.error('Error al actualizar cliente:', error)
                        setType('error')
                        setMessage('Error al actualizar cliente')
                        setShow(true)
                    }   
                })
            }
            
            if (selectedTipoPersona === 2) {
                if (isRequiredTextMissing(razonSocial)) {
                    setRazonSocialError('Razón Social es requerida')
                    setType('error')
                    setMessage('Razón Social es requerida')
                    setShow(true)
                    return
                }
    
                if (isRequiredTextMissing(domFiscal)) {
                    setDomFiscalError('Domicilio Fiscal es requerido')
                    setType('error')
                    setMessage('Domicilio Fiscal es requerido')
                    setShow(true)
                    return
                }
    
                if (ubigeo === null) {
                    setUbigeoError('Ubigeo es requerido')
                    setType('error')
                    setMessage('Ubigeo es requerido')
                    setShow(true)
                    return
                }
    
                if (isRequiredValueMissing(ciiu)) {
                    setCiiuError('CIIU es requerido')
                    setType('error')
                    setMessage('CIIU es requerido')
                    setShow(true)
                    return
                }
    
                if (isRequiredTextMissing(contacEmpresa)) {
                    setContacEmpresaError('Objeto social es requerido')
                    setType('error')
                    setMessage('Objeto social es requerido')
                    setShow(true)
                    return
                }
                const fullPayload = {
                    tipper: 'J',
                    apepat,
                    apemat,
                    prinom,
                    segnom,
                    nombre,
                    direccion,
                    idubigeo: ubigeo.id,
                    resedent: residenteForClientePayload(selectedTipoPersona, resident),
                    idtipdoc: 1,
                    numdoc: dni,
                    email,
                    nacionalidad: '',
                    idestcivil: civilStatus,
                    sexo: '',
                    telfijo: fixedPhone,
                    telcel: celphone,
                    telofi: officePhone,
                    idcargoprofe: 0,
                    idprofesion: 0,
                    detaprofesion: '',
                    cumpclie: '',
                    razonsocial: razonSocial,
                    domfiscal: domFiscal,
                    idsedereg: selectedSedeRegistral ? parseInt(selectedSedeRegistral.id) : 0,
                    numpartida: numeroPartida,
                    telempresa: teleEmpresa,
                    actmunicipal: ciiu,
                    contacempresa: contacEmpresa,
                    ubigeo_plantilla: '',
                    fechaconstitu: fechaConstitucion,
                    numregistro: numeroDeRegistro,
                    profesion_plantilla: '',
                    tipocli: 'J',
                    residente: residenteForClientePayload(selectedTipoPersona, resident),
                    fechaing: '',
                    dirfer: '',
                    profocupa: '',
                    conyuge: '',
                    natper: '',
                }

                const changedPayload = omitResidenteFieldsForJuridicaPatch(
                    getChangedFields(fullPayload, cliente2 || undefined),
                    selectedTipoPersona
                )
                if (Object.keys(changedPayload).length === 0) {
                    setType('success')
                    setMessage('No hay cambios para guardar')
                    setShow(true)
                    return
                }

                updateCliente2.mutate({
                    access,
                    cliente: changedPayload as any
                }, {
                    onSuccess: (data) => {
                        console.log('Cliente actualizado:', data)
                        setType('success')
                        setMessage('Cliente actualizado exitosamente')
                        setShow(true)
                        setShowClienteForm(false)
                        setShowContratanteForm(true)
                        // setCliente1(data)
                        setCliente2(data)
        
                    },
                    onError: (error) => {
                        console.error('Error al actualizar cliente:', error)
                        setType('error')
                        setMessage('Error al actualizar cliente')
                        setShow(true)
                    }   
                })

            }
    
        }


    const handleBackToContratante = () => {
        setShowClienteForm(false)
        setShowContratanteForm(true)
    }

    const formFooter = (
        <>
            <button type="button" onClick={handleBackToContratante} className={clienteFormBackButtonClass}>
                Volver al contratante
            </button>
            <button type="submit" form="cliente2-form" className={clienteFormBackButtonClass}>
                {cliente2 ? "Actualizar cliente" : "Crear cliente"}
            </button>
        </>
    )

  return (
    <ClienteContratanteFormLayout
        title="Editar cliente"
        subtitle={dni ? `Documento: ${dni}` : undefined}
        onBack={handleBackToContratante}
        footer={formFooter}
    >
    <form id="cliente2-form" onSubmit={handleSubmit} className="space-y-4">
        {selectedTipoPersona === 1 && (
        <>
        <ClienteFormSection title="Datos personales">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SimpleInput
                    label="Apellido Paterno"
                    value={apepat}
                    setValue={setApepat}
                    required
                    error={apepatError}
                    setError={setApepatError}
                    fullWidth
                />
                <SimpleInput
                    label="Apellido Materno"
                    value={apemat}
                    setValue={setApemat}
                    required
                    error={apematError}
                    setError={setApematError}
                    fullWidth
                />
                <SimpleInput
                    label="Primer Nombre"
                    value={prinom}
                    setValue={setPrinom}
                    required
                    error={prinomError}
                    setError={setPrinomError}
                    fullWidth
                />
                <SimpleInput
                    label="Segundo Nombre"
                    value={segnom}
                    setValue={setSegnom}
                    fullWidth
                />
            </div>
        </ClienteFormSection>

        <ClienteFormSection title="Ubicación">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SimpleInput
                    label="Dirección"
                    value={direccion}
                    setValue={setDireccion}
                    required
                    error={direccionError}
                    setError={setDireccionError}
                    fullWidth
                />
                <ClienteDropdownField label="Ubigeo" required error={ubigeoError}>
                    <SearchableDropdownInput
                        options={ubigeos.map((ubi) => ({
                            id: ubi.coddis,
                            label: `${ubi.nomdpto} - ${ubi.nomprov} - ${ubi.nomdis}`,
                        }))}
                        selected={ubigeo}
                        setSelected={setUbigeo}
                        placeholder="Buscar ubigeo"
                        required
                        error={ubigeoError}
                        setError={setUbigeoError}
                    />
                </ClienteDropdownField>
            </div>
        </ClienteFormSection>

        <ClienteFormSection title="Identidad">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SimpleSelector
                    label="Estado Civil"
                    setter={setCivilStatus}
                    options={civilStatusOptions}
                    required
                    error={civilStatusError}
                    setError={setCivilStatusError}
                    defaultValue={civilStatus}
                />
                <SimpleSelector
                    label="Sexo"
                    setter={setGender}
                    defaultValue={gender}
                    options={sexOptions}
                    required
                    error={genderError}
                    setError={setGenderError}
                />
                <ClienteDropdownField label="Nacionalidad" required error={nationalityError}>
                    <SearchableDropdownInput
                        options={nacionalidades.map((nat) => ({
                            id: nat.idnacionalidad.toString(),
                            label: nat.descripcion,
                        }))}
                        selected={nationality}
                        setSelected={setNationality}
                        placeholder="Buscar nacionalidad"
                        required
                        error={nationalityError}
                        setError={setNationalityError}
                    />
                </ClienteDropdownField>
                <SimpleSelector
                    label="Residente"
                    setter={setResident}
                    defaultValue={resident}
                    options={[
                        { value: 1, label: "Sí" },
                        { value: 0, label: "No" },
                    ]}
                    required
                />
                <SimpleInput
                    label="Natural de"
                    value={naturalFrom}
                    setValue={setNaturalFrom}
                    fullWidth
                />
                <DateInput
                    label="Fecha de Nacimiento"
                    value={birthdate}
                    setValue={setBirthdate}
                    required
                    error={birthdateError}
                    setError={setBirthdateError}
                />
            </div>
        </ClienteFormSection>

        <ClienteFormSection title="Profesión y cargo">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ClienteDropdownField label="Profesión" required error={profesionError}>
                    <SearchableDropdownInput
                        options={profesiones.map((prof) => ({
                            id: prof.idprofesion.toString(),
                            label: prof.desprofesion,
                        }))}
                        selected={profesion}
                        setSelected={setProfesion}
                        onInputChange={setProfesionInput}
                        placeholder="Buscar profesión"
                        required
                        error={profesionError}
                        setError={setProfesionError}
                    />
                </ClienteDropdownField>
                <ClienteDropdownField label="Cargo" required error={cargoError}>
                    <SearchableDropdownInput
                        options={cargos.map((car) => ({
                            id: car.idcargoprofe.toString(),
                            label: car.descripcrapro,
                        }))}
                        selected={cargo}
                        setSelected={setCargo}
                        onInputChange={setCargoInput}
                        placeholder="Buscar cargo"
                        required
                        error={cargoError}
                        setError={setCargoError}
                    />
                </ClienteDropdownField>
            </div>
        </ClienteFormSection>

        <ClienteFormSection title="Contacto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SimpleInput label="Teléfono Celular" value={celphone} setValue={setCellphone} fullWidth />
                <SimpleInput label="Teléfono Oficina" value={officePhone} setValue={setOfficePhone} fullWidth />
                <SimpleInput label="Teléfono Fijo" value={fixedPhone} setValue={setFixedPhone} fullWidth />
                <SimpleInput label="Email" value={email} setValue={setEmail} fullWidth />
            </div>
        </ClienteFormSection>
        </>
        )}
        {selectedTipoPersona === 2 && (
        <>
        <ClienteFormSection title="Datos de la empresa">
            <div className="grid grid-cols-1 gap-4">
                <SimpleInput
                    label="Razón Social"
                    value={razonSocial}
                    setValue={setRazonSocial}
                    required
                    fullWidth
                    error={razonSocialError}
                    setError={setRazonSocialError}
                />
                <SimpleInput
                    label="Domicilio Fiscal"
                    value={domFiscal}
                    setValue={setDomFiscal}
                    required
                    fullWidth
                    error={domFiscalError}
                    setError={setDomFiscalError}
                />
                <ClienteDropdownField label="Ubigeo" required error={ubigeoError}>
                    <SearchableDropdownInput
                        options={ubigeos.map((ubi) => ({
                            id: ubi.coddis,
                            label: `${ubi.nomdpto} - ${ubi.nomprov} - ${ubi.nomdis}`,
                        }))}
                        selected={ubigeo}
                        setSelected={setUbigeo}
                        placeholder="Buscar ubigeo"
                        required
                        error={ubigeoError}
                        setError={setUbigeoError}
                    />
                </ClienteDropdownField>
            </div>
        </ClienteFormSection>

        <ClienteFormSection title="Información registral">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DateInput
                    label="Fecha de constitución"
                    value={fechaConstitucion}
                    setValue={setFechaConstitucion}
                />
                <SimpleInput
                    label="Número de Registro"
                    value={numeroDeRegistro}
                    setValue={setNumeroDeRegistro}
                    fullWidth
                />
                <SimpleSelectorStr
                    label="Sede Registral"
                    defaultValue={selectedSedeRegistral ? selectedSedeRegistral.id : "0"}
                    setter={(value: string) =>
                        setSelectedSedeRegistral(value ? { id: value, label: "" } : null)
                    }
                    options={[
                        { value: "0", label: "Seleccionar Sede Registral" },
                        ...SEDES_REGISTRALES.map((sede) => ({
                            value: sede.idsedereg,
                            label: sede.dessede,
                        })),
                    ]}
                />
                <SimpleInput
                    label="Número de Partida"
                    value={numeroPartida}
                    setValue={setNumeroPartida}
                    fullWidth
                />
            </div>
        </ClienteFormSection>

        <ClienteFormSection title="Contacto y actividad">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SimpleInput label="Teléfono" value={teleEmpresa} setValue={setTeleEmpresa} fullWidth />
                <SimpleSelectorStr
                    label="CIIU"
                    setter={setCiiu}
                    options={[
                        { value: "0", label: "Seleccionar CIIU" },
                        ...GIRO_NEGOCIO.map((giro) => ({
                            value: giro.coddivi,
                            label: giro.nombre,
                        })),
                    ]}
                    defaultValue={ciiu}
                    required
                    error={ciiuError}
                    setError={setCiiuError}
                />
                <div className="sm:col-span-2">
                    <SimpleInput
                        label="Objeto Social"
                        value={contacEmpresa}
                        setValue={setContacEmpresa}
                        required
                        fullWidth
                        error={contacEmpresaError}
                        setError={setContacEmpresaError}
                    />
                </div>
                <div className="sm:col-span-2">
                    <SimpleInput
                        label="Correo de la Empresa"
                        value={correoDeEmpresa}
                        setValue={setCorreoDeEmpresa}
                        fullWidth
                    />
                </div>
            </div>
        </ClienteFormSection>
        </>
        )}
    </form>
    </ClienteContratanteFormLayout>
  )
}

export default Cliente2Form