import { useState } from "react";

interface Message {
  sender: "user" | "ia";
  text: string;
}

export default function ChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState(""); // Usaremos 'inputValue'
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    // 1. CORRECCIÓN: Usamos 'inputValue'
    if (!inputValue.trim()) return;

    // Guardamos el texto actual antes de borrarlo
    const currentMessage = inputValue;

    // 2. Limpiamos el input visualmente de inmediato
    setInputValue("");
    setIsLoading(true);

    // 3. Agregamos el mensaje del usuario a la lista
    // Usamos "prev" para asegurar que no perdemos mensajes si el usuario escribe rápido
    setMessages((prev) => [...prev, { text: currentMessage, sender: "user" }]);

    try {
      const response = await fetch('http://localhost:8080/api/v1/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 4. CORRECCIÓN: Enviamos 'currentMessage' (que viene de inputValue)
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) throw new Error('Error en el servidor');

      const data = await response.json();
      const botReply = data.response; 

      // 5. Agregamos la respuesta de la IA
      setMessages((prev) => [...prev, { text: botReply, sender: 'ia' }]); 

    } catch (error) {
      console.error("Error conectando con la IA:", error);
      setMessages((prev) => [...prev, { text: "Lo siento, tuve un error de conexión.", sender: 'ia' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "80px",
      right: "20px",
      width: "300px",
      height: "400px",
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "0 2px 5px rgba(0,5,30,0.9)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: 999
    }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: "#0f366d",
        color: "white",
        padding: "10px",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between"
      }}>
        Chat IA
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          ✖
        </button>
      </div>

      {/* Mensajes */}
      <div style={{
        flex: 1,
        padding: "10px",
        overflowY: "auto",
        backgroundColor: "#eaf2fc"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "10px" }}>
            <div style={{
              display: "inline-block",
              backgroundColor: msg.sender === "user" ? "#0f366d" : "#d4e4ff",
              color: msg.sender === "user" ? "white" : "black",
              padding: "8px 12px",
              borderRadius: "12px",
              maxWidth: "80%"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            <div style={{
              display: "inline-block",
              backgroundColor: "#d4e4ff",
              color: "#555",
              padding: "8px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontStyle: "italic"
            }}>
              Escribiendo...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", padding: "10px", gap: "5px" }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          // 6. CORRECCIÓN: Llamar a handleSendMessage
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Escribe..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #aaa",
            color: "black"
          }}
        />
        <button
          // 7. CORRECCIÓN: Llamar a handleSendMessage
          onClick={handleSendMessage}
          style={{
            backgroundColor: "#0f366d",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}