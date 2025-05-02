import React, { useState } from "react";
import AxiosInstance from "./axios";  // Tu instancia de Axios para las peticiones HTTP

const PaginaAutos = () => {
    const [matricula, setMatricula] = useState("");  // Para almacenar el valor del input
    const [auto, setAuto] = useState(null);  // Para almacenar la información del auto
    const [error, setError] = useState("");  // Para manejar los mensajes de error

    // Manejar el cambio en el input de la matrícula
    const handleInputChange = (event) => {
        setMatricula(event.target.value);
    };

    // Manejar la búsqueda de autos
    const handleBuscar = async () => {
        if (!matricula) {
            setError("Por favor, ingresa una matrícula.");
            return;
        }
        
        try {
            // Hacemos la consulta con la matrícula proporcionada
            const response = await AxiosInstance.get(`/autos/${matricula}`);
            
            // Si el auto existe, lo mostramos
            if (response.data) {
                setAuto(response.data);
                setError("");  // Limpiar error si se encuentra el auto
            } else {
                setAuto(null);
                setError("No se encontró automovil con la matrícula introducida.");
            }
        } catch (error) {
            console.error("Error al buscar el auto:", error);
            setError("Ocurrió un error al realizar la búsqueda.");
        }
    };

    return (
        <div>
            <h1>Busqueda de Vehiculos</h1>

            {/* Formulario de búsqueda */}
            <div>
                <input
                    type="text"
                    value={matricula}
                    onChange={handleInputChange}
                    placeholder="Ingrese la matrícula del auto"
                />
                <button onClick={handleBuscar}>Buscar</button>
            </div>

            {/* Mostrar el mensaje de error */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Mostrar los resultados */}
            {auto && (
                <div>
                    <h2>Auto Encontrado:</h2>
                    <p><strong>Placa:</strong> {auto.placa}</p>
                    <p><strong>Tipo:</strong> {auto.tipo}</p>
                    <p><strong>Modelo:</strong> {auto.modelo}</p>
                    <p><strong>Color:</strong> {auto.color}</p>
                    <p><strong>Responsable:</strong> {auto.usuario}</p>

                    {/* Aquí puedes mostrar más columnas del auto si las tienes */}
                </div>
            )}
        </div>
    );
};

export default PaginaAutos;
