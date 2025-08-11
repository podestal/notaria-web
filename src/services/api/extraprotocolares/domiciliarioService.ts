import APIClient from "../apiClient"

// id_domiciliario = models.AutoField(primary_key=True)
// num_certificado = models.CharField(max_length=10, blank=True, null=True)
// fec_ingreso = models.CharField(max_length=20, blank=True, null=True)
// num_formu = models.CharField(max_length=30, blank=True, null=True)
// nombre_solic = models.CharField(max_length=500, blank=True, null=True)
// tipdoc_solic = models.CharField(max_length=20, blank=True, null=True)
// numdoc_solic = models.CharField(max_length=50, blank=True, null=True)
// domic_solic = models.CharField(max_length=3000, blank=True, null=True)
// motivo_solic = models.CharField(max_length=3000, blank=True, null=True)
// distrito_solic = models.CharField(max_length=50, blank=True, null=True)
// texto_cuerpo = models.TextField(blank=True, null=True)
// justifi_cuerpo = models.TextField(blank=True, null=True)
// nom_testigo = models.CharField(max_length=500, blank=True, null=True)
// tdoc_testigo = models.CharField(max_length=20, blank=True, null=True)
// ndocu_testigo = models.CharField(max_length=50, blank=True, null=True)
// idestcivil = models.IntegerField(blank=True, null=True)
// sexo = models.CharField(max_length=3, blank=True, null=True)
// detprofesionc = models.TextField(blank=True, null=True)
// profesionc = models.TextField(blank=True, null=True)
// especificacion = models.CharField(max_length=30, blank=True, null=True)
// recibo_empresa = models.CharField(max_length=200, blank=True, null=True)
// fecha_ocupa = models.DateField(blank=True, null=True)
// declara_ser = models.CharField(max_length=200, blank=True, null=True)
// propietario = models.CharField(max_length=200, blank=True, null=True)
// recibido = models.CharField(max_length=200, blank=True, null=True)
// numero_recibo = models.CharField(max_length=60, blank=True, null=True)
// mes_facturado = models.CharField(max_length=60, blank=True, null=True)
// idusuario = models.IntegerField(blank=True, null=True)

export interface DomiciliarioPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Domiciliario[];
}

export interface Domiciliario {
    id_domiciliario: number;
    num_certificado: string;
    fec_ingreso: string;
    num_formu: string;
    nombre_solic: string;
    tipdoc_solic: string;
    numdoc_solic: string;
    domic_solic: string;
    motivo_solic: string;
    distrito_solic: string;
    texto_cuerpo: string;
    justifi_cuerpo: string;
    nom_testigo: string;
    tdoc_testigo: string;
    ndocu_testigo: string;
    idestcivil: number;
    sexo: string;
    detprofesionc: string;
    profesionc: string;
    especificacion: string;
    recibo_empresa: string;
    fecha_ocupa: string;
    declara_ser: string;
    propietario: string;
    recibido: string;
    numero_recibo: string;
    mes_facturado: string;
    idusuario: number;
}

export type CreateUpdateDomiciliario = Omit<Domiciliario, 'id_domiciliario'>

interface Props {
    domiciliarioId?: number;
}

export const getDomiciliarioServiceSingle = ({ domiciliarioId }: Props) => {
    let url = '/cert_domiciliario/';
    if (domiciliarioId) {
        url += `${domiciliarioId}/`;
    }
    return new APIClient<Domiciliario, CreateUpdateDomiciliario>(url);
}

const getDomiciliarioService = () => {
    return new APIClient<DomiciliarioPage, CreateUpdateDomiciliario>('/cert_domiciliario/');
}

export default getDomiciliarioService;