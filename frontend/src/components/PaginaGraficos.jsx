import {React, useState, useEffect} from 'react'
import AxiosInstance from './axios'
import MyChartBox from './graficos/BoxChart'
import GarageIcon from '@mui/icons-material/Garage';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import PieChartComponent from './graficos/OcupacionChart';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import EstacionamientoChart from './graficos/DisponibilidadChart';
import EstanciaPromedioChart from './graficos/PromedioChart';
import MyChartBox2 from './graficos/BoxChart2';
import HeatmapChart from './graficos/MapaCalorChart';
import GraficoOcupacion from './graficos/PrediDispoChart';

const PaginaGraficos = () => {

    // Estados para almacenar los datos de los tres gráficos
    const [prophetData, setProphetData] = useState([]);
    const [dispoData, setDispoData] = useState([]);
    const [ocupacionData, setOcupacionData] = useState([]);
    const [filteredDispoData, setFilteredDispoData] = useState([]); // Nuevo estado para los datos filtrados
    const [loading, setLoading] = useState(true);  // Indicador de carga

    // Función para obtener los datos de todos los gráficos
    const GetData = async () => {
        try {
            const response = await AxiosInstance.get('grafico-data/');  // Llamar al endpoint agrupado
            setProphetData(response.data.prophet);  // Datos de predicciones Prophet
            setDispoData(response.data.dispo);      // Datos de disponibilidad
            setOcupacionData(response.data.ocupacion);  // Datos de ocupación

        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);  // Cambiar el estado de carga
        }
    };

        // Filtrar dispoData para mostrar solo horas
    useEffect(() => {
        if (dispoData.length > 0) {
            const formattedData = dispoData.map((item) => {
                const date = new Date(item.hora);
                const hora = date.getHours().toString().padStart(2, "0");
                const minutos = date.getMinutes().toString().padStart(2, "0");

                return {
                    ...item,
                    hora: `${hora}:${minutos}`, // Solo HH:MM
                };
            });

            setFilteredDispoData(formattedData); 
        }
    }, [dispoData]); 


    
    useEffect(() => {
        GetData();
    }, []);  

    if (loading) {
        return <div>Cargando...</div>;  // Mostrar algo mientras los datos se cargan
    }
    
    return(
        <div>
            <MyChartBox
                icon1 = {<ElectricRickshawIcon/>}
                title1 = {"Ocupacion"}
                chart1 = { <PieChartComponent/>}

                icon2 = {<GarageIcon/>}
                title2 = {"Disponibilidad"}
                chart2 = { <EstacionamientoChart/>}

                icon3 = {<DirectionsCarFilledIcon/>}
                title3 = {"Estancia Promedio en minutos"}
                chart3 = { <EstanciaPromedioChart data= {ocupacionData}/>}
            />

            <MyChartBox2
                icon1 = {<ElectricRickshawIcon/>}
                title1 = {"Tendencia prevista de entradas para hoy"}
                chart1 = { <HeatmapChart data = {filteredDispoData}/>}

                icon2 = {<GarageIcon/>}
                title2 = {"Espacios ocupados previstos para hoy"}
                chart2 = { <GraficoOcupacion data = {prophetData}/>}

            />
        </div>
    )
}

export default PaginaGraficos