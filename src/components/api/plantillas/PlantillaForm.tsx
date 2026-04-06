import { useRef, useState } from 'react'
import { FileText, Upload, X, Loader2, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import useCreateTemplate from '../../../hooks/api/templates/useCreateTemplate'
import useGetTipoActo from '../../../hooks/api/tipoActo/useGetTipoActo'
import useAuthStore from '../../../store/useAuthStore'
import useNotificationsStore from '../../../hooks/store/useNotificationsStore'
import useKardexTypesStore from '../../../hooks/store/useKardexTypesStore'
import getTitleCase from '../../../utils/getTitleCase'
import { TipoActo } from '../../../services/api/tipoActosService'

const PlantillaForm = () => {
  const access = useAuthStore(s => s.access_token) || ''
  const { setMessage, setShow, setType } = useNotificationsStore()
  const { kardexTypes } = useKardexTypesStore()
  const createTemplate = useCreateTemplate()

  const [nametemplate, setNametemplate] = useState('')
  const [selectedKardexType, setSelectedKardexType] = useState<number>(kardexTypes[0]?.idtipkar ?? 0)
  const [selectedActo, setSelectedActo] = useState<TipoActo | null>(null)
  const [searchText, setSearchText] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [document, setDocument] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const [nameError, setNameError] = useState('')
  const [typeError, setTypeError] = useState('')
  const [actosError, setActosError] = useState('')
  const [documentError, setDocumentError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const kardexOptions = kardexTypes.map(kt => ({
    value: kt.idtipkar,
    label: getTitleCase(kt.nomtipkar),
  }))

  const { data: tipoActos, isLoading: isLoadingActos } = useGetTipoActo({ access })

  const filteredOptions = (tipoActos ?? [])
    .filter(acto => acto.idtipkar === selectedKardexType)
    .filter(acto => acto.desacto.toLowerCase().includes(searchText.toLowerCase()))

  const handleSelectActo = (acto: TipoActo) => {
    setSelectedActo(acto)
    setActosError('')
    setSearchText('')
    setDropdownOpen(false)
  }

  const handleClearActo = () => {
    setSelectedActo(null)
    setSearchText('')
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  const validateForm = () => {
    let valid = true
    if (!nametemplate.trim()) { setNameError('El nombre es obligatorio'); valid = false }
    if (!selectedKardexType) { setTypeError('Seleccione un tipo de kardex'); valid = false }
    if (!selectedActo) { setActosError('Seleccione un acto'); valid = false }
    if (!document) { setDocumentError('Debe adjuntar un documento'); valid = false }
    return valid
  }

  const handleFileChange = (file: File | null) => {
    if (!file) return
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setDocumentError('Solo se aceptan archivos .doc o .docx')
      return
    }
    setDocumentError('')
    setDocument(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    handleFileChange(e.dataTransfer.files?.[0] ?? null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !document || !selectedActo) return

    createTemplate.mutate(
      {
        access,
        nametemplate,
        fktypekardex: selectedKardexType,
        codeacts: selectedActo.idtipoacto,
        contract: selectedActo.desacto,
        document,
      },
      {
        onSuccess: () => {
          setType('success')
          setMessage('Plantilla creada correctamente')
          setShow(true)
          setNametemplate('')
          setSelectedKardexType(kardexTypes[0]?.idtipkar ?? 0)
          setSelectedActo(null)
          setSearchText('')
          setDocument(null)
        },
        onError: (error: any) => {
          setType('error')
          setMessage(error?.response?.data?.message || 'Error al crear la plantilla')
          setShow(true)
        },
      }
    )
  }

  const isLoading = createTemplate.isPending

  return (
    <div className="mx-auto p-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 rounded-xl p-2.5">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Nueva Plantilla</h2>
          <p className="text-xs text-slate-400 mt-0.5">Completa los campos y adjunta el documento Word</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">

        {/* Row 1: Name + Tipo Kardex */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="pl-1 text-xs font-semibold text-slate-600">
              Nombre de la plantilla <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nametemplate}
              onChange={(e) => { setNametemplate(e.target.value); setNameError('') }}
              placeholder="Nombre de la plantilla"
              className={`w-full bg-white text-slate-700 border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2
                ${nameError ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-300'}`}
            />
            {nameError && <p className="text-xs text-red-500 px-1">{nameError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="pl-1 text-xs font-semibold text-slate-600">
              Tipo de Kardex <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedKardexType}
              onChange={(e) => {
                setSelectedKardexType(Number(e.target.value))
                setTypeError('')
                setSelectedActo(null)
                setSearchText('')
                setDropdownOpen(false)
              }}
              className={`w-full bg-white text-slate-700 border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2
                ${typeError ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-300'}`}
            >
              {kardexOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {typeError && <p className="text-xs text-red-500 px-1">{typeError}</p>}
          </div>
        </div>

        {/* Acto Section */}
        <div className="flex flex-col gap-2">
          <label className="pl-1 text-xs font-semibold text-slate-600">
            Acto <span className="text-red-500">*</span>
          </label>

          {/* Selected acto chip */}
          {selectedActo && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{selectedActo.desacto}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Código: {selectedActo.idtipoacto}
                  {selectedActo.actosunat ? ` · Sunat: ${selectedActo.actosunat}` : ''}
                  {selectedActo.actouif ? ` · UIF: ${selectedActo.actouif}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearActo}
                className="text-slate-400 hover:text-red-500 transition-colors shrink-0 p-1 rounded-full hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Search input + dropdown */}
          {isLoadingActos ? (
            <p className="text-xs text-slate-400 animate-pulse">Cargando actos...</p>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setActosError('') }}
                  onFocus={() => setDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  placeholder={selectedActo ? 'Cambiar acto...' : 'Buscar acto...'}
                  className={`w-full bg-white text-slate-700 border rounded-md py-2 pl-3 pr-9 focus:outline-none focus:ring-2 text-sm
                    ${actosError ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-300'}`}
                />
                <ChevronDown
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                  >
                    {filteredOptions.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">Sin resultados</p>
                    ) : (
                      filteredOptions.map(acto => (
                        <button
                          key={acto.idtipoacto}
                          type="button"
                          onMouseDown={() => handleSelectActo(acto)}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0
                            ${selectedActo?.idtipoacto === acto.idtipoacto ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                        >
                          <span className="block truncate">{acto.desacto}</span>
                          <span className="text-xs text-slate-400">
                            {acto.idtipoacto}
                            {acto.actosunat ? ` · Sunat: ${acto.actosunat}` : ''}
                            {acto.actouif ? ` · UIF: ${acto.actouif}` : ''}
                          </span>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {actosError && (
            <p className="text-xs text-red-500 px-1">{actosError}</p>
          )}
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-2">
          <label className="pl-1 text-xs font-semibold text-slate-600">
            Documento <span className="text-red-500">*</span>
          </label>

          {document ? (
            <div className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded-lg px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-blue-100 rounded-lg p-2 shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{document.name}</p>
                  <p className="text-xs text-slate-400">{(document.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setDocument(null); setDocumentError('') }}
                className="text-slate-400 hover:text-red-500 transition-colors shrink-0 p-1 rounded-full hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg py-10 px-6 cursor-pointer transition-all duration-200
                ${dragOver
                  ? 'border-blue-400 bg-blue-50 scale-[1.01]'
                  : documentError
                    ? 'border-red-300 bg-red-50'
                    : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50'
                }`}
            >
              <div className={`rounded-full p-3 ${dragOver ? 'bg-blue-100' : 'bg-white'} shadow-sm`}>
                <Upload className={`w-6 h-6 ${dragOver ? 'text-blue-500' : 'text-slate-400'}`} />
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Arrastra tu archivo aquí o{' '}
                  <span className="text-blue-600 font-semibold">haz clic para seleccionar</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Soporta .doc y .docx</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".doc,.docx"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />

          {documentError && (
            <p className="text-xs text-red-500 px-1">{documentError}</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors
              ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Crear Plantilla
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}

export default PlantillaForm
