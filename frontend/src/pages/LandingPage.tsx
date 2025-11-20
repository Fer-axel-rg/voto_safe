import iconOnpe from "./../img/landing/iconoonpe.png";
import iconCheck from "./../img/landing/VOTA CON RESPOSIBILIDAD AMIGO (3).png";
import { useEffect, useState } from "react";

// Imágenes
import img1 from "./../img/landing/VotaConResponsabilidad1.png";
import img2 from "./../img/landing/VotaConResponsabilidad2.png";
import img3 from "./../img/landing/VotaConResponsabilidad3.png";

// Componentes
import ModalInfo from "./../components/landingPage/moreInfo";
import DniPanel from "./../components/landingPage/DniPanel";
import DniInfoPanel from "./../components/landingPage/DniInfoPanel";

const images = [img1, img2, img3];

const LandingPage = () => {
    const [index, setIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [pasoActual, setPasoActual] = useState<'inicio' | 'dni' | 'DniInfo'>('inicio');

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col overflow-hidden relative">

            {/* --- HEADER --- */}
            <div className="w-full h-20 bg-white shadow-sm flex items-center px-6 md:px-12 z-10 flex-shrink-0">
                <img
                    src={iconOnpe}
                    className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                    alt="Logo ONPE"
                />
            </div>

            {/* --- BODY CONTENT --- */}
            {/* CAMBIO: Quitamos 'items-center' global para que no lo baje tanto.
          Usamos 'pt-10' o 'lg:pt-20' para controlarlo manualmente desde arriba.
      */}
            <div className="flex-1 flex flex-col md:flex-row justify-center w-full max-w-[1600px] mx-auto p-6 md:px-12 lg:px-20 gap-10 lg:gap-24 pt-8 md:pt-16 lg:pt-20">

                {/* --- COLUMNA IZQUIERDA (CARRUSEL) --- */}
                {/* CAMBIO: Aumenté max-w para PC (lg:max-w-[600px]) */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end items-start animate-fadeIn">
                    <div className="relative w-full max-w-[350px] md:max-w-[500px] lg:max-w-[600px] aspect-square">
                        <img
                            src={images[index]}
                            alt="Campaña voto responsable"
                            className="w-full h-full object-contain rounded-3xl shadow-2xl transition-all duration-700 hover:scale-[1.02]"
                        />
                        {/* Decoración de fondo más grande */}
                        <div className="absolute -z-10 top-6 -left-6 w-full h-full bg-blue-950/10 rounded-3xl"></div>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA (CONTENIDO DINÁMICO) --- */}
                {/* items-start para que empiece arriba y no se centre verticalmente contra la imagen */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-start pt-4 md:pt-10">

                    {/* VISTA: INICIO */}
                    {pasoActual === 'inicio' && (
                        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-2xl animate-fadeIn">

                            {/* CAMBIO: Textos mucho más grandes en LG y XL */}
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-blue-950 font-poppins leading-tight mb-6 lg:mb-8">
                                ELECCIONES <br className="hidden md:block" /> GENERALES <span className="text-blue-600">2026</span>
                            </h1>

                            <div className="flex items-center justify-center md:justify-start w-full mb-8">
                                <img
                                    src={iconCheck}
                                    alt="Check icon"
                                    // CAMBIO: Icono más grande
                                    className="w-20 md:w-24 lg:w-28"
                                />
                            </div>

                            {/* CAMBIO: Texto de párrafo más grande */}
                            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-medium mb-10 lg:mb-12 max-w-xl">
                                Realiza tu voto seguro, resuelve tus dudas para un voto
                                responsable y siempre con previo estudio.
                            </p>

                            {/* CAMBIO: Botón más grande y robusto */}
                            <button
                                onClick={() => setPasoActual('dni')}
                                className="w-full sm:w-2/3 md:w-auto md:px-16 py-4 lg:py-5 bg-blue-950 text-white text-xl lg:text-2xl font-semibold rounded-2xl shadow-xl 
                           hover:bg-blue-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                INICIAR VOTO
                            </button>
                        </div>
                    )}

                    {/* VISTA: DNI */}
                    {pasoActual === 'dni' && (
                        <div className="w-full max-w-lg lg:max-w-xl mx-auto md:mx-0 animate-fadeIn mt-4 lg:mt-8">
                            <DniPanel
                                onVolver={() => setPasoActual('inicio')}
                                onIngresar={() => setPasoActual('DniInfo')}
                            />
                        </div>
                    )}

                    {/* VISTA: INFO DNI */}
                    {pasoActual === 'DniInfo' && (
                        <div className="w-full max-w-lg lg:max-w-xl mx-auto md:mx-0 animate-fadeIn mt-4 lg:mt-8">
                            <DniInfoPanel
                                onVolver={() => setPasoActual('dni')}
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* --- BOTÓN AYUDA --- */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 lg:w-20 lg:h-20 bg-blue-950 text-white rounded-full shadow-2xl 
                   flex items-center justify-center text-3xl lg:text-4xl font-bold z-40
                   hover:scale-110 hover:bg-blue-800 transition-all duration-300"
            >
                ?
            </button>

            <ModalInfo open={showModal} onClose={() => setShowModal(false)} />

        </div>
    );
};

export default LandingPage;