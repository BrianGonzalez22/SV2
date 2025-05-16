// ReportePlantilla.jsx
const ReportePlantilla = ({ reporte }) => (
    <div
    id="reporte-pdf"
    style={{
      width: '794px',
      height: '1123px', // Altura de una hoja A4 a 96dpi aprox.
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0
    }}
>
  {/* Encabezado (banner superior) */}
  <div>
    <img
      src="/img/topBanner.jpg"
      alt="Escuela"
      style={{ width: '100%', display: 'block', margin: 0, padding: 0 }}
    />
  </div>

  {/* Contenido central */}
  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
    <div style={{ maxWidth: '700px', width: '100%', padding: '20px', textAlign: 'center' }}>
      <h2>📊 Reporte de Ocupación</h2>
      <p><strong>Desde:</strong> {new Date(reporte.fecha_inicio).toLocaleString()}</p>
      <p><strong>Hasta:</strong> {new Date(reporte.fecha_fin).toLocaleString()}</p>
      <p><strong>Ocupación Promedio:</strong> {reporte.ocupacion_promedio?.toFixed(2)}%</p>
      <p><strong>Tiempo Promedio:</strong> {reporte.tiempo_promedio}</p>
      <h4>Distribución por Rol:</h4>
      <ul style={{ listStylePosition: 'inside', paddingLeft: 0 }}>
        {reporte.roles.map((rol, idx) => (
          <li key={idx}>{rol.rol}: {rol.cantidad}</li>
        ))}
      </ul>
      <img
        src={`data:image/png;base64,${reporte.grafico}`}
        alt="Gráfico"
        style={{ maxWidth: '100%', margin: '20px auto' }}
      />
    </div>
  </div>

  {/* Pie de página */}
  <div>
    <img
      src="/img/baner.png"
      alt="Pie de página"
      style={{ width: '100%', display: 'block', margin: 0, padding: 0 }}
    />
  </div>
</div>

  );
  
  export default ReportePlantilla;