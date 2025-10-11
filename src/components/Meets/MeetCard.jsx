export default function MeetCard({ meet }) {
    return (
      <div className="p-3 border rounded shadow-sm bg-gray-50">
        <h3 className="font-semibold text-lg">{meet.titulo}</h3>
        <p>{meet.descripcion}</p>
        <p className="text-sm text-gray-600">
          📅 {new Date(meet.fecha_programada).toLocaleString()}
        </p>
        <a
          href={meet.enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Unirse a Google Meet
        </a>
      </div>
    )
  }
  