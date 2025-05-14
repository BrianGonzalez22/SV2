// ReportePlantilla.jsx
const ReportePlantilla = ({ reporte }) => (
    <div id="reporte-pdf" style={{ width: '800px', padding: '20px', backgroundColor: 'white' }}>
      <img src="/img/logo_dependencia_281.png" alt="Escuela" style={{ width: '150px'}} />
      <h2>📊 Reporte de Ocupación</h2>
      <p><strong>Desde:</strong> {new Date(reporte.fecha_inicio).toLocaleString()}</p>
      <p><strong>Hasta:</strong> {new Date(reporte.fecha_fin).toLocaleString()}</p>
      <p><strong>Ocupación Promedio:</strong> {reporte.ocupacion_promedio?.toFixed(2)}%</p>
      <p><strong>Tiempo Promedio:</strong> {reporte.tiempo_promedio}</p>
      <h4>Distribución por Rol:</h4>
      <ul>
        {reporte.roles.map((rol, idx) => (
          <li key={idx}>{rol.rol}: {rol.cantidad}</li>
        ))}
      </ul>
      <img src={`data:image/png;base64,${reporte.grafico}`} alt="Gráfico" style={{ maxWidth: '100%' }} />
    </div>
  );
  
  export default ReportePlantilla;