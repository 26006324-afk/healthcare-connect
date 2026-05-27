"use client";

import {
  Accessibility,
  Bell,
  Bot,
  Send,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  CreditCard,
  Download,
  FileHeart,
  FileText,
  Headphones,
  HeartPulse,
  Home,
  LockKeyhole,
  Mail,
  Menu,
  Mic,
  Pill,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
  TextCursorInput,
  UserRoundCheck,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type InteractionMode = "texto" | "voz" | "accesible";
type ScreenName = "Inicio" | "Casos" | "Citas" | "Documentos" | "IA y soporte" | "Pagos" | "Perfil";
type Priority = "Normal" | "Alta";
type TicketStatus = "Nuevo" | "Clasificado por IA" | "En revision" | "Escalado a nivel 2" | "Resuelto";

type SupportCase = {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  status: TicketStatus;
  date: string;
  owner: string;
  note: string;
};

type Appointment = {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  doctor: string;
  status: string;
};

type MedicalDocument = {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
};

type Payment = {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: "Pendiente" | "Pagado" | "Registrado";
};

type IssueAnalysis = {
  category: string;
  priority: Priority;
  status: TicketStatus;
  response: string;
  article: string;
  empathic: boolean;
  ticketId: string;
};

const initialAppointments: Appointment[] = [
  {
    id: "APT-2048",
    title: "Medicina familiar",
    date: "28 mayo",
    time: "09:30",
    place: "UMF 24, consultorio 6",
    doctor: "Dra. Laura Rivera",
    status: "Confirmada"
  },
  {
    id: "APT-2049",
    title: "Laboratorio clinico",
    date: "30 mayo",
    time: "07:15",
    place: "Modulo de toma de muestras",
    doctor: "Ayuno de 8 horas",
    status: "Preparacion requerida"
  },
  {
    id: "APT-2050",
    title: "Cardiologia",
    date: "04 junio",
    time: "12:00",
    place: "Hospital General, piso 2",
    doctor: "Dr. Mateo Silva",
    status: "Pendiente de confirmar"
  }
];

const initialCases: SupportCase[] = [
  {
    id: "HC-1024",
    title: "Seguimiento de presion arterial",
    category: "Citas",
    priority: "Normal",
    status: "En revision",
    date: "Actualizado hoy",
    owner: "Equipo de cardiologia",
    note: "Se revisara la bitacora semanal y el ajuste de medicamento."
  },
  {
    id: "HC-1025",
    title: "Solicitud de incapacidad digital",
    category: "Documentos",
    priority: "Normal",
    status: "Clasificado por IA",
    date: "Vence manana",
    owner: "Mesa de apoyo",
    note: "Falta adjuntar comprobante de consulta externa."
  },
  {
    id: "HC-1026",
    title: "Aclaracion de copago",
    category: "Facturacion",
    priority: "Normal",
    status: "Resuelto",
    date: "10 mayo",
    owner: "Facturacion paciente",
    note: "Se valido el metodo de pago y se reenvio comprobante PDF."
  }
];

const initialDocuments: MedicalDocument[] = [
  { id: "DOC-01", title: "Resultados de laboratorio", type: "PDF", date: "23 mayo", status: "Nuevo" },
  { id: "DOC-02", title: "Receta electronica", type: "PDF", date: "21 mayo", status: "Vigente" },
  { id: "DOC-03", title: "Comprobante de vigencia", type: "PDF", date: "18 mayo", status: "Descargable" },
  { id: "DOC-04", title: "Resumen clinico", type: "PDF", date: "12 mayo", status: "Archivado" }
];

const initialPayments: Payment[] = [
  { id: "PAY-01", label: "Copago pendiente", value: "$240.00", detail: "Consulta de especialidad", status: "Pendiente" },
  { id: "PAY-02", label: "Metodo registrado", value: "Tarjeta 4821", detail: "Pago seguro habilitado", status: "Registrado" },
  { id: "PAY-03", label: "Ultimo pago", value: "$120.00", detail: "Laboratorio clinico, 18 mayo", status: "Pagado" }
];

const notifications = [
  {
    title: "Mensaje nuevo",
    text: "Tu coordinadora de atencion respondio la solicitud de incapacidad.",
    time: "Hace 12 min"
  },
  {
    title: "Recordatorio de medicamento",
    text: "Renovacion disponible para losartan 50 mg.",
    time: "Hoy, 08:00"
  },
  {
    title: "Documento validado",
    text: "La identificacion oficial fue aceptada en tu expediente.",
    time: "Ayer"
  }
];

const quickActions = [
  { label: "Agendar cita", icon: CalendarDays, target: "Citas" },
  { label: "Subir documento", icon: FileText, target: "Documentos" },
  { label: "Pedir receta", icon: Pill, target: "IA y soporte" },
  { label: "Hablar con apoyo", icon: Headphones, target: "IA y soporte" },
  { label: "Vacunacion", icon: Syringe, target: "Citas" },
  { label: "Directorio medico", icon: Stethoscope, target: "Perfil" }
] satisfies Array<{ label: string; icon: typeof CalendarDays; target: ScreenName }>;

const navItems = [
  { label: "Inicio", icon: Home },
  { label: "Casos", icon: ClipboardList },
  { label: "Citas", icon: CalendarClock },
  { label: "Documentos", icon: FileHeart },
  { label: "IA y soporte", icon: Bot },
  { label: "Pagos", icon: CreditCard },
] satisfies Array<{ label: ScreenName; icon: typeof Home }>;

const modeDetails: Record<InteractionMode, { label: string; status: string; helper: string; icon: typeof TextCursorInput }> = {
  texto: {
    label: "Texto",
    status: "Interaccion por texto activa",
    helper: "Los campos y mensajes estan optimizados para lectura y escritura.",
    icon: TextCursorInput
  },
  voz: {
    label: "Voz",
    status: "Guia por voz activa",
    helper: "Los controles principales se resaltan para navegacion hablada.",
    icon: Mic
  },
  accesible: {
    label: "Modo accesible",
    status: "Modo accesible activo",
    helper: "La vista usa texto mas grande, menos detalle secundario y mayor contraste.",
    icon: Accessibility
  }
};

const screenCopy: Record<ScreenName, { eyebrow: string; title: string; text: string }> = {
  Inicio: {
    eyebrow: "Atencion digital integrada",
    title: "Centro digital de atencion al paciente.",
    text: "Gestiona IA, tickets, citas, pagos y documentos desde un entorno de soporte clinico conectado."
  },
  Casos: {
    eyebrow: "Gestion de casos",
    title: "Casos de soporte activos",
    text: "Consulta, busca y crea tickets dinamicos con estado, categoria y prioridad."
  },
  Citas: {
    eyebrow: "Agenda de atencion",
    title: "Citas y preparacion clinica",
    text: "Agenda citas y recibe confirmaciones visuales inmediatas."
  },
  Documentos: {
    eyebrow: "Expediente digital",
    title: "Documentos medicos",
    text: "Busca y descarga PDFs clinicos desde una experiencia funcional."
  },
  "IA y soporte": {
    eyebrow: "Clasificacion automatica",
    title: "IA y soporte humano",
    text: "Escribe un problema, clasifica el caso, revisa historial, sugerencias y escalamiento."
  },
  Pagos: {
    eyebrow: "Pagos del paciente",
    title: "Pagos y facturacion",
    text: "Procesa pagos y visualiza confirmaciones de tus servicios."
  },
  Perfil: {
    eyebrow: "Cuenta y seguridad",
    title: "Perfil del paciente",
    text: "Datos del paciente, preferencias y configuracion de accesibilidad."
  }
};

function classifyIssue(text: string): IssueAnalysis {
  const value = text.toLowerCase();
  const hasAny = (words: string[]) => words.some((word) => value.includes(word));
  const priority: Priority = hasAny(["dolor", "ansiedad", "ayuda", "preocupado", "miedo", "urgente"]) ? "Alta" : "Normal";

  let category = "Soporte general";
  let article = "Articulo HC-000: Orientacion general para solicitudes de pacientes";
  let response = "Revise la informacion disponible en su portal, confirme sus datos y envie la solicitud para que el equipo de atencion le de seguimiento.";

  if (hasAny(["factura", "pago"])) {
    category = "Facturacion";
    article = "Articulo HC-214: Validar pago, comprobante y metodo registrado";
    response = "Te recomiendo revisar tu comprobante, verificar el metodo de pago y descargar nuevamente el PDF desde Pagos y facturacion.";
  } else if (hasAny(["documento", "pdf", "resultado"])) {
    category = "Documentos";
    article = "Articulo HC-118: Recuperar resultados, recetas y comprobantes PDF";
    response = "Te recomiendo buscar el documento por nombre, revisar su estado de validacion y descargar nuevamente el PDF desde Documentos medicos.";
  } else if (hasAny(["cita", "doctor"])) {
    category = "Citas";
    article = "Articulo HC-072: Confirmar cita, sede, horario e indicaciones previas";
    response = "Te recomiendo confirmar la fecha, revisar la sede asignada y verificar si necesitas ayuno o documentos antes de acudir.";
  }

  const empathic = hasAny(["ansiedad", "preocupado", "miedo", "urgente", "dolor"]);
  if (empathic) {
    response = `Siento que estes pasando por esto. Tu caso se marcara con prioridad alta. ${response} Si tienes dolor intenso o una emergencia, busca atencion inmediata.`;
  }

  return {
    category,
    priority,
    status: "Clasificado por IA",
    response,
    article,
    empathic,
    ticketId: `HC-${Math.floor(2000 + Math.random() * 7000)}`
  };
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<ScreenName>("Inicio");
  const [mode, setMode] = useState<InteractionMode>("texto");
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  const [accountPanelOpen, setAccountPanelOpen] = useState(false);
  const [casesList, setCasesList] = useState<SupportCase[]>(initialCases);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(initialAppointments);
  const [documentsList, setDocumentsList] = useState<MedicalDocument[]>(initialDocuments);
  const [paymentsList, setPaymentsList] = useState<Payment[]>(initialPayments);
  const [toast, setToast] = useState("");
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [assistantExpanded, setAssistantExpanded] = useState(true);

  const shellClass = useMemo(() => {
    if (mode === "voz") return "voice-mode";
    if (mode === "accesible") return "simplified-mode accessible-mode";
    return "text-mode";
  }, [mode]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

 const goToScreen = (screen: ScreenName) => {
  setActiveView(screen);
  setProfilePanelOpen(false);

  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  document.body.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const ActiveModeIcon = modeDetails[mode].icon;

  return (
    <main className={`px-4 py-4 pb-36 text-slate-800 sm:px-6 lg:px-8 lg:pb-6 ${shellClass}`}>
      {toast ? <Toast message={toast} /> : null}
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
          <div className="sticky top-0 z-50 flex items-center justify-between rounded-lg bg-white/80 p-2 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-mint-100 text-mint-700">
                <HeartPulse size={24} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-normal text-slate-900">HealthCare Connect</h1>
                <p className="text-sm text-slate-500">Portal digital del paciente</p>
              </div>
            </div>
            <div className="flex items-center gap-3">

  <button
  onClick={() => setAccountPanelOpen(!accountPanelOpen)}
  className="relative transition hover:scale-105"
>
    <img
      src="https://i.pravatar.cc/150?img=32"
      alt="Foto del paciente"
      className="h-11 w-11 rounded-full object-cover border border-white shadow-sm"
    />

    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></span>
  </button>

  <button
    className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700"
    onClick={() => setProfilePanelOpen(!profilePanelOpen)}
    aria-label="Abrir menu"
  >
    <Menu size={20} />
  </button>

</div>
          </div>

        <section className="flex flex-col gap-4">
          <header className="animate-soft-in rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-sm font-semibold text-mint-700">{screenCopy[activeView].eyebrow}</p>
                <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">{screenCopy[activeView].title}</h2>
                <p className="simplified-text mt-2 max-w-3xl text-sm leading-6 text-slate-600">{screenCopy[activeView].text}</p>
              </div>
            </div>
          </header>

          <ScreenContent
            activeView={activeView}
            goToScreen={goToScreen}
            aiMessages={aiMessages}
            setAiMessages={setAiMessages}
            casesList={casesList}
            setCasesList={setCasesList}
            appointmentsList={appointmentsList}
            setAppointmentsList={setAppointmentsList}
            documentsList={documentsList}
            setDocumentsList={setDocumentsList}
            paymentsList={paymentsList}
            setPaymentsList={setPaymentsList}
            notify={notify}
            mode={mode}
            setMode={setMode}
            activeIcon={ActiveModeIcon}
          />
        </section>
      </div>
<div className="fixed bottom-4 right-4 z-30">

 <div
  onClick={() => {
    if (!assistantExpanded) {
      setAssistantExpanded(true);
    }
  }}
  className={`
    rounded-[40px] bg-slate-900 text-white shadow-2xl transition-all duration-300
    ${assistantExpanded
      ? "w-[92vw] max-w-sm rounded-3xl p-4"
      : "flex h-16 w-16 items-center justify-center p-0"
    }
  `}
>
    {assistantExpanded && (
      <>

        <div className="flex items-start gap-3">

  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
    <Bot size={24} />
  </div>

  <div>
    <p className="text-sm font-semibold">
      Hola, Maya 👋
    </p>

    <p className="text-xs text-slate-300">
      ¿En qué puedo ayudarte hoy?
    </p>
  </div>

</div>

<div className="mt-4 flex w-full items-center gap-2 rounded-2xl bg-white p-3">

          <input
            type="text"
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            placeholder="Escribe tu duda..."
            className="flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none"
          />

          <button
            onClick={() => {

              if (!quickMessage.trim()) return;

              setAiMessages((prev) => [...prev, quickMessage]);

              goToScreen("IA y soporte");

              setQuickMessage("");
              setAssistantExpanded(false);

            }}
            className="grid min-w-[36px] h-9 place-items-center rounded-[40px] bg-emerald-600 text-white"
          >
            <Send size={18} />
          </button>

        </div>

      </>
    )}
{!assistantExpanded && <Bot size={26} />}
  </div>

</div>
     {/* <MobileNav activeView={activeView} goToScreen={goToScreen} /> */}

      {profilePanelOpen ? (
  <ProfilePanel
    mode={mode}
    setMode={setMode}
    activeIcon={ActiveModeIcon}
    closePanel={() => setProfilePanelOpen(false)}
    openProfile={() => goToScreen("Perfil")}
    goToScreen={goToScreen}
  />
) : null}
{accountPanelOpen ? (
  <div className="fixed right-6 top-20 z-50 w-64 rounded-2xl border border-white/60 bg-white/90 p-3 shadow-2xl backdrop-blur-md">

    <button
      onClick={() => {
        goToScreen("Perfil");
        setAccountPanelOpen(false);
      }}
      className="flex w-full items-center rounded-xl px-3 py-3 text-left text-slate-700 transition hover:bg-slate-100"
    >
      Perfil del paciente
    </button>

    <button
      className="flex w-full items-center rounded-xl px-3 py-3 text-left text-slate-700 transition hover:bg-slate-100"
    >
      Configuracion
    </button>

    <button
      className="flex w-full items-center rounded-xl px-3 py-3 text-left text-slate-700 transition hover:bg-slate-100"
    >
      Accesibilidad
    </button>

    <div className="my-2 border-t border-slate-200"></div>

    <button
      className="flex w-full items-center rounded-xl px-3 py-3 text-left text-red-500 transition hover:bg-red-50"
    >
      Cerrar sesion
    </button>

  </div>
) : null}
    </main>
  );
}

function NavButton({ item, active, onClick }: { item: (typeof navItems)[number]; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      className={`flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
        active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-white hover:text-slate-900"
      }`}
      onClick={onClick}
    >
      <span className="flex items-center gap-3">
        <Icon size={18} aria-hidden="true" />
        {item.label}
      </span>
      <ChevronRight size={16} aria-hidden="true" />
    </button>
  );
}

function AccessibilitySelector({
  mode,
  setMode,
  activeIcon: ActiveModeIcon
}: {
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
  activeIcon: typeof TextCursorInput;
}) {
  return (
    <section className="rounded-lg bg-slate-100 p-2" aria-label="Selector de interaccion multimodal">
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(modeDetails) as InteractionMode[]).map((option) => {
          const Icon = modeDetails[option].icon;
          const active = mode === option;
          return (
            <button
              key={option}
              onClick={() => setMode(option)}
              className={`interaction-control flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
                active ? "active bg-white text-slate-950 shadow-sm" : "text-slate-600"
              }`}
              aria-pressed={active}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{modeDetails[option].label}</span>
            </button>
          );
        })}
      </div>
      <div className="voice-highlight mt-3 flex items-center gap-2 rounded-lg bg-mint-50 px-3 py-3 text-sm text-mint-700">
        <ActiveModeIcon className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
        <div>
          <p className="font-bold">{modeDetails[mode].status}</p>
          <p className="simplified-text mt-1 text-mint-700/85">{modeDetails[mode].helper}</p>
        </div>
      </div>
    </section>
  );
}

type ScreenProps = {
  activeView: ScreenName;
  goToScreen: (screen: ScreenName) => void;
  casesList: SupportCase[];
  setCasesList: React.Dispatch<React.SetStateAction<SupportCase[]>>;
  appointmentsList: Appointment[];
  setAppointmentsList: React.Dispatch<React.SetStateAction<Appointment[]>>;
  documentsList: MedicalDocument[];
  setDocumentsList: React.Dispatch<React.SetStateAction<MedicalDocument[]>>;
  paymentsList: Payment[];
  setPaymentsList: React.Dispatch<React.SetStateAction<Payment[]>>;
  aiMessages: string[];
setAiMessages: React.Dispatch<React.SetStateAction<string[]>>;
  notify: (message: string) => void;
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
  activeIcon: typeof TextCursorInput;
};

function ScreenContent(props: ScreenProps) {
  if (props.activeView === "Inicio") return <InicioScreen {...props} />;
  if (props.activeView === "Casos") return <CasesScreen {...props} />;
  if (props.activeView === "Citas") return <AppointmentsScreen {...props} />;
  if (props.activeView === "Documentos") return <DocumentsScreen {...props} />;
  if (props.activeView === "IA y soporte") return <SupportScreen {...props} />;
  if (props.activeView === "Pagos") return <PaymentsScreen {...props} />;
  return <ProfileScreen mode={props.mode} setMode={props.setMode} activeIcon={props.activeIcon} />;
}

function InicioScreen({ goToScreen, casesList, appointmentsList }: ScreenProps) {
  return (
    <div className="animate-soft-in grid gap-4 xl:grid-cols-[1fr_370px]">
      
      <div className="grid gap-4">
        
        <QuickSummary casesList={casesList} />

        <section className="grid gap-4 lg:grid-cols-2">
          <PreviewCard title="Proximas citas" action="Ver agenda" onAction={() => goToScreen("Citas")}>
            {appointmentsList.slice(0, 2).map((item) => (
              <AppointmentCard key={item.id} item={item} compact />
            ))}
          </PreviewCard>

          <PreviewCard title="Casos activos" action="Ver casos" onAction={() => goToScreen("Casos")}>
            {casesList.slice(0, 2).map((item) => (
              <CaseCard key={item.id} item={item} compact />
            ))}
          </PreviewCard>
        </section>

      </div>

      <aside className="grid gap-4">
        <NotificationsPreview goToScreen={goToScreen} />
        <QuickActions goToScreen={goToScreen} />
      </aside>

    </div>
  );
}

function CasesScreen({ casesList, setCasesList, notify }: ScreenProps) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const filtered = casesList.filter((item) => `${item.title} ${item.category} ${item.status} ${item.note}`.toLowerCase().includes(query.toLowerCase()));

  const createCase = () => {
    if (!draft.trim()) return;
    const analysis = classifyIssue(draft);
    setCasesList((items) => [
      {
        id: analysis.ticketId,
        title: draft.slice(0, 68),
        category: analysis.category,
        priority: analysis.priority,
        status: analysis.status,
        date: "Creado ahora",
        owner: analysis.priority === "Alta" ? "Triage clinico" : "Atencion digital",
        note: analysis.response
      },
      ...items
    ]);
    setDraft("");
    notify("Nuevo caso creado y clasificado por IA");
  };

  return (
    <section className="animate-soft-in rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
      <SectionHeader title="Casos de soporte" text="Busqueda funcional, creacion dinamica y clasificacion automatica." action={<SearchBox value={query} setValue={setQuery} placeholder="Buscar casos" />} />
      <div className="mt-4 rounded-lg bg-mint-50 p-4">
        <label className="text-sm font-bold text-slate-800" htmlFor="nuevo-caso">Crear nuevo caso</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="nuevo-caso"
            className="min-h-12 flex-1 rounded-lg border border-mint-100 bg-white px-3 text-sm outline-none"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ej. Tengo problema con mi factura o necesito un resultado PDF"
          />
          <button onClick={createCase} className="rounded-lg bg-mint-700 px-4 py-3 text-sm font-bold text-white">Crear caso</button>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {filtered.map((item) => (
          <CaseCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function AppointmentsScreen({ appointmentsList, setAppointmentsList, notify }: ScreenProps) {
  const scheduleFake = () => {
    const next: Appointment = {
      id: `APT-${Math.floor(3000 + Math.random() * 5000)}`,
      title: "Consulta general",
      date: "06 junio",
      time: "10:45",
      place: "UMF 24, consultorio 3",
      doctor: "Dr. Arturo Vega",
      status: "Agendada en linea"
    };
    setAppointmentsList((items) => [next, ...items]);
    notify("Cita agendada exitosamente");
  };

  return (
    <section className="animate-soft-in rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
      <SectionHeader
        title="Agenda de citas"
        text="Agenda en linea con confirmacion visual inmediata."
        action={<button onClick={scheduleFake} className="flex items-center justify-center gap-2 rounded-lg bg-mint-700 px-4 py-2 text-sm font-semibold text-white"><CalendarDays size={17} aria-hidden="true" />Agendar cita</button>}
      />
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {appointmentsList.map((item) => (
          <AppointmentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function DocumentsScreen({ documentsList, setDocumentsList, notify }: ScreenProps) {
  const [query, setQuery] = useState("");
  const filtered = documentsList.filter((item) => `${item.title} ${item.status} ${item.type}`.toLowerCase().includes(query.toLowerCase()));

  const downloadFake = (id: string, title: string) => {
    setDocumentsList((items) => items.map((item) => (item.id === id ? { ...item, status: "Descargado ahora" } : item)));
    notify(`PDF descargado: ${title}`);
  };

  return (
    <section className="animate-soft-in rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
      <SectionHeader title="Expediente y documentos" text="Busqueda funcional y descarga de PDFs clinicos." action={<SearchBox value={query} setValue={setQuery} placeholder="Buscar documentos" />} />
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {filtered.map((item) => (
          <DocumentRow key={item.id} item={item} onDownload={() => downloadFake(item.id, item.title)} />
        ))}
      </div>
    </section>
  );
}

function SupportScreen({ casesList, setCasesList, notify, mode, setMode, activeIcon, aiMessages, setAiMessages}: ScreenProps) {
  const [problem, setProblem] = useState("");
  const [analysis, setAnalysis] = useState<IssueAnalysis | null>(null);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>("Nuevo");
  const [escalated, setEscalated] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [surveySent, setSurveySent] = useState(false);

  const similarCases = useMemo(() => {
    if (!analysis) return casesList.slice(0, 3);
    return casesList.filter((item) => item.category === analysis.category || item.priority === analysis.priority).slice(0, 3);
  }, [analysis, casesList]);
  const allMessages = [...aiMessages];

  const analyzeProblem = () => {
    if (!problem.trim()) return;
    const result = classifyIssue(problem);
    setAnalysis(result);
    setTicketStatus(result.status);
    setEscalated(false);
    setSurveySent(false);
    setStars(0);
    setComment("");
    setCasesList((items) => [
      {
        id: result.ticketId,
        title: problem.slice(0, 72),
        category: result.category,
        priority: result.priority,
        status: result.status,
        date: "Creado por IA ahora",
        owner: result.priority === "Alta" ? "Triage clinico" : "Asistente de atencion",
        note: result.response
      },
      ...items
    ]);
    notify("Caso clasificado y creado en la mesa de soporte");
  };

  const escalate = () => {
    if (!analysis) return;
    setTicketStatus("Escalado a nivel 2");
    setEscalated(true);
    setCasesList((items) => items.map((item) => (item.id === analysis.ticketId ? { ...item, status: "Escalado a nivel 2", owner: "Nivel 2 - especialista" } : item)));
    notify("Caso escalado exitosamente");
  };

  return (
    <div className="animate-soft-in grid gap-4 xl:grid-cols-[1fr_380px]">
      <section className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
        <SectionHeader title="Clasificacion e historial" text="Escribe un problema y la IA organiza categoria, prioridad, historial y estado." />
        <div className="mb-4 grid gap-3">
  {allMessages.map((message, index) => (
    <div
      key={index}
      className="ml-auto max-w-sm rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-lg"
    >
      {message}
    </div>
  ))}
</div>

        <textarea
          className="mt-4 min-h-32 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-mint-500"
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
          placeholder="Ej. Tengo ansiedad porque mi doctor no aparece en la cita y necesito ayuda urgente con mi resultado PDF."
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button onClick={analyzeProblem} className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white">Analizar y crear ticket</button>
          <button onClick={escalate} disabled={!analysis} className="rounded-lg bg-mint-700 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Escalar a nivel 2</button>
        </div>

        {analysis ? (
          <div className="mt-4 grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Metric label="Categoria detectada" value={analysis.category} />
              <Metric label="Prioridad" value={analysis.priority} danger={analysis.priority === "Alta"} />
              <Metric label="Estado del ticket" value={ticketStatus} />
            </div>
            <article className="rounded-lg bg-lavender-50 p-4">
              <div className="flex items-center gap-2 text-lavender-500">
                <Sparkles size={18} aria-hidden="true" />
                <p className="font-bold">Resolucion sugerida por IA</p>
              </div>
              <p className="simplified-text mt-3 text-sm leading-6 text-slate-700">{analysis.response}</p>
              <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700">{analysis.article}</p>
            </article>
            <section className="rounded-lg bg-slate-50 p-4">
              <h3 className="font-bold text-slate-950">Historial de casos similares</h3>
              <div className="mt-3 grid gap-2">
                {similarCases.map((item) => (
                  <CaseCard key={item.id} item={item} compact />
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </section>

      <aside className="grid gap-4">
        <AccessibilitySelector mode={mode} setMode={setMode} activeIcon={activeIcon} />
        <section className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
          <h3 className="text-lg font-bold text-slate-950">Consola de atencion</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <Metric label="Ticket actual" value={analysis?.ticketId ?? "Sin ticket"} />
            <Metric label="Cola" value={analysis?.priority === "Alta" ? "Triage clinico" : "Atencion digital"} />
            <Metric label="Compromiso de respuesta" value={analysis?.priority === "Alta" ? "15 min" : "24 h"} />
          </div>
          {escalated ? <p className="mt-4 rounded-lg bg-mint-50 p-3 text-sm font-bold text-mint-700">Caso escalado exitosamente</p> : null}
        </section>

        {escalated ? (
          <section className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
            <h3 className="text-lg font-bold text-slate-950">Encuesta de satisfaccion</h3>
            <div className="mt-4 flex gap-2" aria-label="Seleccionar estrellas">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} onClick={() => setStars(value)} className={`grid size-10 place-items-center rounded-lg ${value <= stars ? "bg-coral-50 text-coral-500" : "bg-slate-100 text-slate-400"}`}>
                  <Star size={20} fill={value <= stars ? "currentColor" : "none"} aria-hidden="true" />
                </button>
              ))}
            </div>
            <textarea className="mt-3 min-h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Comentario opcional" />
            <button onClick={() => { setSurveySent(true); notify("Encuesta enviada. Gracias por tu retroalimentacion."); }} className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white">Enviar respuesta</button>
            {surveySent ? <p className="mt-3 rounded-lg bg-mint-50 p-3 text-sm font-bold text-mint-700">Encuesta registrada.</p> : null}
          </section>
        ) : null}
      </aside>
    </div>
  );
}

function PaymentsScreen({ paymentsList, setPaymentsList, notify }: ScreenProps) {
  const payFake = () => {
    setPaymentsList((items) => items.map((item) => (item.id === "PAY-01" ? { ...item, status: "Pagado", detail: "Pago confirmado ahora" } : item)));
    notify("Pago confirmado");
  };

  return (
    <section className="animate-soft-in rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
      <SectionHeader title="Pagos y facturacion" text="Pago en linea con confirmacion visual." action={<button onClick={payFake} className="flex items-center justify-center gap-2 rounded-lg bg-mint-700 px-4 py-2 text-sm font-semibold text-white"><CreditCard size={17} aria-hidden="true" />Pagar ahora</button>} />
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {paymentsList.map((item) => (
          <article key={item.id} className="rounded-lg bg-slate-50 p-4">
            <ReceiptText className="text-skycare-700" size={20} aria-hidden="true" />
            <p className="mt-3 text-sm text-slate-500">{item.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-950">{item.value}</p>
            <p className="secondary-detail mt-1 text-sm text-slate-500">{item.detail}</p>
            <p className={`mt-3 inline-flex rounded-lg px-2 py-1 text-xs font-bold ${item.status === "Pagado" ? "bg-mint-50 text-mint-700" : "bg-coral-50 text-coral-500"}`}>{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileScreen({
  mode,
  setMode,
  activeIcon
}: {
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
  activeIcon: typeof TextCursorInput;
}) {
  return (
    <div className="animate-soft-in grid gap-4 xl:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
        <SectionHeader title="Datos del paciente" text="Informacion de contacto, unidad asignada y seguridad de cuenta." />
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {[["Nombre", "Maya Thompson"], ["NSS", "2048-52-11"], ["Correo", "maya@correo-salud.mx"], ["Telefono", "+52 55 2100 3040"], ["Unidad", "UMF 24"], ["Vigencia", "Activa"]].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 break-words font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
        <h3 className="text-lg font-bold text-slate-950">Seguridad y acceso</h3>
        <div className="mt-4 grid gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg bg-mint-700 px-4 py-3 text-sm font-semibold text-white"><ShieldCheck size={18} aria-hidden="true" />Verificar identidad</button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"><LockKeyhole size={18} aria-hidden="true" />Cambiar contrasena</button>
        </div>
      </section>
      <AccessibilitySelector mode={mode} setMode={setMode} activeIcon={activeIcon} />
    </div>
  );
}

function QuickSummary({ casesList }: { casesList: SupportCase[] }) {
  const highPriority = casesList.filter(
    (item) => item.priority === "Alta"
  ).length;

  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
  <div>
    <p className="text-sm font-semibold tracking-wide text-mint-700">
      Perfil clinico
    </p>

    <h3 className="text-xl font-bold text-slate-900">
      Datos del paciente
    </h3>
  </div>

  <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-mint-700">
    Vigencia activa
  </span>
</div>
  <div className="flex items-center gap-6 min-h-[260px]">

    <img
      src="https://i.pravatar.cc/150?img=32"
      alt="Paciente"
      className="h-44 w-44 rounded-3xl object-cover shadow-lg"
    />

    <div className="flex-1">
      <h3 className="text-2xl font-bold text-slate-900">
        Maya Thompson
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        NSS 2048-52-11
      </p>

      <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">

        <div>
          <span className="font-semibold">UMF:</span> 24
        </div>

        <div>
          <span className="font-semibold">Tipo de sangre:</span> O+
        </div>

        <div>
          <span className="font-semibold">Alergias:</span> Penicilina
        </div>

        <div>
          <span className="font-semibold">Contacto:</span> Laura Thompson
        </div>

        <div>
          <span className="font-semibold">Tel emergencia:</span> 55 1234 5678
        </div>

      </div>
    </div>
  </div>
</section>
  );
}
function PreviewCard({ title, action, onAction, children }: { title: string; action: string; onAction: () => void; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <button onClick={onAction} className="text-sm font-bold text-mint-700">{action}</button>
      </div>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function NotificationsPreview({ goToScreen }: { goToScreen: (screen: ScreenName) => void }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-950">Avisos recientes</h3>
        <Bell className="text-coral-500" size={21} aria-hidden="true" />
      </div>
      <div className="mt-4 grid gap-3">
        {notifications.map((item) => (
          <div key={item.title} className="flex items-start gap-3 rounded-lg bg-coral-50 p-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-coral-500" size={18} aria-hidden="true" />
            <div>
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm leading-6 text-slate-700">{item.text}</p>
              <p className="secondary-detail mt-1 text-xs font-semibold text-coral-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => goToScreen("IA y soporte")} className="mt-4 text-sm font-bold text-mint-700">Pedir ayuda con un aviso</button>
    </section>
  );
}

function QuickActions({ goToScreen }: { goToScreen: (screen: ScreenName) => void }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/90 p-4 shadow-soft">
      <h3 className="text-lg font-bold text-slate-950">Acciones rapidas</h3>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => goToScreen(item.target)} className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 transition hover:border-mint-100 hover:text-mint-700">
              <Icon size={21} aria-hidden="true" />
              <span className="text-center leading-5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AppointmentCard({ item, compact = false }: { item: Appointment; compact?: boolean }) {
  return (
    <article className="rounded-lg border border-slate-100 bg-skycare-50 p-4 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-slate-950">{item.title}</h4>
          <p className="simplified-text mt-2 text-sm leading-6 text-slate-600">{item.place}</p>
        </div>
        <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-skycare-700">{item.time}</span>
      </div>
      <div className={`mt-4 ${compact ? "text-sm" : "grid gap-2 text-sm"} text-slate-600`}>
        <p>{item.date}</p>
        <p>{item.doctor}</p>
        {!compact ? <p className="font-semibold text-mint-700">{item.status}</p> : null}
      </div>
    </article>
  );
}

function CaseCard({ item, compact = false }: { item: SupportCase; compact?: boolean }) {
  return (
    <article className="rounded-lg border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-mint-100 hover:bg-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-slate-950">{item.title}</h4>
            <span className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-600">{item.status}</span>
            <span className={`rounded-lg px-2 py-1 text-xs font-bold ${item.priority === "Alta" ? "bg-coral-50 text-coral-500" : "bg-mint-50 text-mint-700"}`}>{item.priority}</span>
          </div>
          <p className="mt-2 text-xs font-bold uppercase text-skycare-700">{item.category}</p>
          <p className="simplified-text mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
        </div>
        {!compact ? (
          <div className="text-sm text-slate-500 sm:text-right">
            <p>{item.id}</p>
            <p>{item.date}</p>
            <p>{item.owner}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function DocumentRow({ item, onDownload }: { item: MedicalDocument; onDownload: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-4 transition hover:bg-white">
      <div>
        <p className="font-semibold text-slate-900">{item.title}</p>
        <p className="text-sm text-slate-500">{item.type} - {item.date} - {item.status}</p>
      </div>
      <button onClick={onDownload} className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-slate-700" aria-label={`Descargar ${item.title}`}>
        <Download size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className={`rounded-lg p-4 ${danger ? "bg-coral-50" : "bg-slate-50"}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 font-bold ${danger ? "text-coral-500" : "text-slate-950"}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <p className="secondary-detail text-sm text-slate-500">{text}</p>
      </div>
      {action}
    </div>
  );
}

function SearchBox({ value, setValue, placeholder }: { value: string; setValue: (value: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
      <Search size={18} className="text-slate-400" aria-hidden="true" />
      <input value={value} onChange={(event) => setValue(event.target.value)} className="w-full bg-transparent text-sm outline-none sm:w-44" placeholder={placeholder} />
    </div>
  );
}

function MobileNav({ activeView, goToScreen }: { activeView: ScreenName; goToScreen: (screen: ScreenName) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-soft backdrop-blur lg:hidden" aria-label="Navegacion movil">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.label;
          return (
            <button key={item.label} onClick={() => goToScreen(item.label)} className={`flex min-w-[92px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-bold ${active ? "bg-slate-900 text-white" : "text-slate-600"}`}>
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ProfilePanel({
  mode,
  setMode,
  activeIcon,
  closePanel,
  openProfile,
goToScreen
}: {
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
  activeIcon: typeof TextCursorInput;
  closePanel: () => void;
  openProfile: () => void;
  goToScreen: (screen: ScreenName) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Panel de perfil y configuracion">
      <aside className="ml-auto flex h-full max-w-md flex-col overflow-y-auto rounded-lg bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-950">Perfil y configuracion</h3>
          <button onClick={closePanel} className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700" aria-label="Cerrar panel">
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 rounded-lg bg-skycare-50 p-4">
          <div className="flex items-center gap-3">
            <CircleUserRound className="text-skycare-700" size={32} aria-hidden="true" />
            <div>
              <p className="break-words font-bold text-slate-950">Maya Thompson</p>
              <p className="text-sm text-slate-500">NSS 2048-52-11</p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-2">
  {navItems.map((item) => {
    const Icon = item.icon;

    return (
      <button
        key={item.label}
        onClick={() => {
          goToScreen(item.label);
          closePanel();
        }}
        className="flex items-center justify-between rounded-lg px-4 py-3 text-left text-slate-700 transition hover:bg-slate-100"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} />
          <span className="font-medium">{item.label}</span>
        </div>

        <ChevronRight size={18} />
      </button>
    );
  })}
</div>
        <div className="mt-4">
          <AccessibilitySelector mode={mode} setMode={setMode} activeIcon={activeIcon} />
        </div>
        <div className="mt-auto grid gap-3 pt-4">
          <button onClick={openProfile} className="flex items-center justify-center gap-2 rounded-lg bg-mint-700 px-4 py-3 text-sm font-semibold text-white"><CircleUserRound size={18} aria-hidden="true" />Abrir perfil completo</button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"><Mail size={18} aria-hidden="true" />Preferencias de contacto</button>
        </div>
      </aside>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed right-4 top-4 z-50 animate-soft-in rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-soft">
      {message}
    </div>
  );
}
