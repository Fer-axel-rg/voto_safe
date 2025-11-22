package com.voto_safe.voto_safe.backend.service;

import com.voto_safe.voto_safe.backend.model.entity.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.UUID;

// Request
class ConsultasPeruRequest {
    public String token;
    @JsonProperty("type_document")
    public String typeDocument;
    @JsonProperty("document_number")
    public String documentNumber;

    public ConsultasPeruRequest(String token, String typeDocument, String documentNumber) {
        this.token = token;
        this.typeDocument = typeDocument;
        this.documentNumber = documentNumber;
    }
}

// Response
class ConsultasPeruResponse {
    public boolean success;
    public String message;
    public PersonaData data; 
}

class PersonaData {
    @JsonProperty("number")
    public String number;        
    @JsonProperty("full_name")
    public String fullName;      
    @JsonProperty("name")
    public String name;          
    @JsonProperty("surname")
    public String surname;       
    @JsonProperty("date_of_birth")
    public String dateOfBirth;   
}

@Service
public class ReniecService {

    @Autowired
    private RestTemplate restTemplate;

    private final String URL_API = "https://api.consultasperu.com/api/v1/query";
    // Tu token (asegúrate de que tenga saldo/peticiones disponibles)
    private final String TOKEN = "53c6514f2e6a9d421e1f21c1c6661331681578e2017fdb515a4c3490871fd219"; 

    // --- DATOS PARA LA GENERACIÓN ALEATORIA ---
    private final List<String> DISTRITOS_LIMA = Arrays.asList(
        "San Juan de Lurigancho", "San Martín de Porres", "Ate", "Comas", 
        "Villa El Salvador", "Villa María del Triunfo", "San Juan de Miraflores", 
        "Los Olivos", "Santiago de Surco", "Chorrillos", "Puente Piedra", 
        "Cercado de Lima", "Carabayllo", "El Agustino", "Independencia", 
        "Santa Anita", "La Victoria", "Rímac", "San Borja", "San Miguel", "Miraflores"
    );

    private final List<String> DEPARTAMENTOS_PROVINCIA = Arrays.asList(
        "Arequipa", "Cusco", "La Libertad", "Piura", "Junín", "Lambayeque", 
        "Puno", "Ancash", "Ica", "Loreto", "Cajamarca", "San Martín", "Tacna"
    );

    public Usuario obtenerDatosReniec(String dni) {
        Usuario nuevoUsuario = new Usuario();
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ConsultasPeruRequest bodyRequest = new ConsultasPeruRequest(TOKEN, "dni", dni);
            HttpEntity<ConsultasPeruRequest> requestEntity = new HttpEntity<>(bodyRequest, headers);

            ResponseEntity<ConsultasPeruResponse> response = restTemplate.postForEntity(
                URL_API, 
                requestEntity, 
                ConsultasPeruResponse.class
            );

            ConsultasPeruResponse respuestaApi = response.getBody();

            if (respuestaApi != null && respuestaApi.success && respuestaApi.data != null) {
                PersonaData datos = respuestaApi.data;

                nuevoUsuario.setIdUsuario(UUID.randomUUID().toString());
                nuevoUsuario.setDni(datos.number);
                nuevoUsuario.setNombres(datos.name);
                nuevoUsuario.setApellidos(datos.surname);
                
                // Fecha Nacimiento (si la API la da, la usamos)
                if (datos.dateOfBirth != null && !datos.dateOfBirth.isEmpty()) {
                    try {
                        nuevoUsuario.setFechaNacimiento(LocalDate.parse(datos.dateOfBirth)); 
                    } catch (Exception e) { /* Ignorar error fecha */ }
                }

                // 🎲 GENERAR UBICACIÓN ALEATORIA PONDERADA (Aquí está la magia)
                generarUbicacionPonderada(nuevoUsuario);
                
                nuevoUsuario.setTipoUsuario("user");
                nuevoUsuario.setActivo(true);
                nuevoUsuario.setTelefono(generarTelefono());
                
                return nuevoUsuario;
            }

        } catch (Exception e) {
            System.err.println("⚠️ ERROR API: " + e.getMessage());
        }

        return generarUsuarioSimulado(dni);
    }

    // --- LÓGICA DE PROBABILIDAD (60% Lima / 40% Provincia) ---
    private void generarUbicacionPonderada(Usuario u) {
        Random random = new Random();
        int suerte = random.nextInt(100); // Genera número entre 0 y 99

        if (suerte < 60) { 
            // 0 a 59 (60% de probabilidad) -> ES DE LIMA
            u.setDepartamento("Lima");
            u.setProvincia("Lima");
            // Elegimos un distrito real de la lista
            String distritoRandom = DISTRITOS_LIMA.get(random.nextInt(DISTRITOS_LIMA.size()));
            u.setDistrito(distritoRandom);
            // Dirección ficticia
            u.setDireccion("Av. " + distritoRandom + " #" + (random.nextInt(900) + 100));

        } else {
            // 60 a 99 (40% de probabilidad) -> ES DE PROVINCIA
            String depto = DEPARTAMENTOS_PROVINCIA.get(random.nextInt(DEPARTAMENTOS_PROVINCIA.size()));
            u.setDepartamento(depto);
            u.setProvincia(depto); // Simplificamos (Provincia = Nombre Depto)
            u.setDistrito("Cercado");
            u.setDireccion("Jr. " + depto + " #" + (random.nextInt(500) + 100));
        }
    }

    private Usuario generarUsuarioSimulado(String dni) {
        Usuario u = new Usuario();
        u.setIdUsuario(UUID.randomUUID().toString());
        u.setDni(dni);
        u.setNombres("Usuario Test");
        u.setApellidos("Sin Conexión");
        
        // También aplicamos la lógica random al usuario simulado
        generarUbicacionPonderada(u);
        
        u.setTipoUsuario("user");
        u.setActivo(true);
        u.setTelefono(generarTelefono());
        return u;
    }
    
    private String generarTelefono() {
        return "9" + (10000000 + new Random().nextInt(90000000));
    }
}