export const defaultNews = [
  {
    id: crypto.randomUUID(),
    titulo: 'Programa de pausas activas para los colaboradores de Bogotá',
    resumen:
      'Talento Humano invita a todos los colaboradores a participar en las jornadas de pausas activas que se realizarán cada martes y jueves durante el mes de abril.',
    cuerpo:
      '<p>Talento Humano invita a todos los colaboradores de la sede Bogotá a participar activamente en las jornadas de pausas activas programadas para los meses de abril y mayo de 2026.</p><p>Las actividades se realizarán cada martes y jueves de 10:00 a.m. a 10:15 a.m. y de 3:00 p.m. a 3:15 p.m., en los espacios comunes de cada piso.</p><p>Para más información comuníquese con el área de Bienestar Laboral.</p>',
    categoria: 'Bienestar',
    imagen: null,
    fechaPublicacion: '2026-04-04T08:00:00Z',
    publicada: true,
  },
  {
    id: crypto.randomUUID(),
    titulo: 'Inscripciones abiertas: Curso de Excel Avanzado para personal administrativo',
    resumen:
      'Se abrieron las inscripciones para el curso de Excel Avanzado. Cupos limitados, inscríbete antes del 15 de abril.',
    cuerpo:
      '<p>El área de Capacitación y Desarrollo informa que se encuentran abiertas las inscripciones para el curso de Excel Avanzado, dirigido a personal administrativo.</p><p>El curso tendrá una duración de 20 horas distribuidas en 4 sesiones presenciales. Inicio: 22 de abril de 2026.</p><ul><li>Cupos disponibles: 20</li><li>Modalidad: Presencial</li><li>Lugar: Sala de cómputo edificio principal, piso 3</li></ul><p>Inscripciones: capacitacion.th@uniminuto.edu</p>',
    categoria: 'Capacitación',
    imagen: null,
    fechaPublicacion: '2026-04-03T08:00:00Z',
    publicada: true,
  },
  {
    id: crypto.randomUUID(),
    titulo: 'Actualización de la política de trabajo híbrido vigente desde mayo',
    resumen:
      'Se comunica a todos los colaboradores la actualización de los lineamientos de trabajo híbrido vigentes a partir del 1 de mayo de 2026.',
    cuerpo:
      '<p>La Dirección de Talento Humano informa la actualización de la política de trabajo híbrido que entrará en vigor el 1 de mayo de 2026.</p><p>Principales cambios:</p><ul><li>Mínimo 3 días presenciales por semana para cargos administrativos</li><li>Días de teletrabajo sujetos a acuerdo con el jefe inmediato</li><li>Reporte obligatorio de actividades en los días de trabajo remoto</li></ul>',
    categoria: 'Institucional',
    imagen: null,
    fechaPublicacion: '2026-04-01T08:00:00Z',
    publicada: true,
  },
  {
    id: crypto.randomUUID(),
    titulo: 'Convenio con Compensar: nuevos servicios de salud disponibles',
    resumen:
      'A partir de este mes los colaboradores pueden acceder a los nuevos servicios de salud preventiva y recreación incluidos en el convenio con Compensar.',
    cuerpo:
      '<p>Talento Humano comunica que los colaboradores afiliados a Compensar podrán acceder a los nuevos servicios incluidos en la renovación del convenio.</p><ul><li>Consultas de medicina preventiva sin costo adicional</li><li>Acceso a centros recreativos con tarifa preferencial</li><li>Programas de nutrición y bienestar</li><li>Descuento en servicios odontológicos</li></ul>',
    categoria: 'Beneficios',
    imagen: null,
    fechaPublicacion: '2026-03-28T08:00:00Z',
    publicada: true,
  },
  {
    id: crypto.randomUUID(),
    titulo: 'Semana de la salud mental: talleres del 21 al 25 de abril',
    resumen:
      'Del 21 al 25 de abril se realizará la Semana de la Salud Mental con talleres de mindfulness, charlas de psicología y espacios de escucha.',
    cuerpo:
      '<p>En el marco del Día Mundial de la Salud Mental, Talento Humano organiza la primera Semana de la Salud Mental de 2026.</p><p>Programación:</p><ul><li>Lunes 21: Charla "Manejo del estrés laboral" — Auditorio principal, 10:00 a.m.</li><li>Martes 22: Taller de mindfulness — Sala 204, 2:00 p.m.</li><li>Miércoles 23: Espacio de escucha con psicólogos — Oficina de Bienestar</li><li>Jueves 24: Cine foro temático — Auditorio B, 4:00 p.m.</li><li>Viernes 25: Actividad de integración — Cafetería, 12:00 m.</li></ul>',
    categoria: 'Bienestar',
    imagen: null,
    fechaPublicacion: '2026-03-26T08:00:00Z',
    publicada: true,
  },
  {
    id: crypto.randomUUID(),
    titulo: 'Lanzamiento del plan de formación y desarrollo 2026',
    resumen:
      'Talento Humano presenta el plan de formación y desarrollo para el año 2026, con más de 40 programas disponibles para todos los niveles.',
    cuerpo:
      '<p>La Dirección de Gestión Humana presenta el Plan de Formación y Desarrollo 2026 con el objetivo de fortalecer las competencias de todos los colaboradores.</p><ul><li>Más de 40 programas en áreas técnicas, habilidades blandas y liderazgo</li><li>Cursos virtuales a través de la plataforma institucional</li><li>Convenios con universidades y centros de educación continua</li><li>Programa de mentoría interna</li></ul>',
    categoria: 'Capacitación',
    imagen: null,
    fechaPublicacion: '2026-03-20T08:00:00Z',
    publicada: true,
  },
]

export const CATEGORIAS = ['General', 'SST', 'Bienestar', 'Capacitación', 'Institucional', 'Beneficios', 'Administración']

export const CATEGORIA_COLOR = {
  General:       '#000F26',
  SST:           '#dc2626',
  Bienestar:     '#00a651',
  Capacitación:  '#0C82B2',
  Institucional: '#B8860B',
  Beneficios:    '#7c3aed',
  Administración:'#0C82B2',
}
