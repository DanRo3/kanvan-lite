"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Importa tu TaskCard o define aquí si tienes otro path
import TaskCard from "@/components/task-component/task-card";

interface Developer {
  id: string;
  email: string;
  photoUrl?: string | null;
}

interface Risk {
  descripcion: string;
  impacto: "bajo" | "medio" | "alto";
}

function getRandomColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 60%, 70%)`;
}

// Avatar component con botones + y -
const ProjectAvatars: React.FC<{
  developers: Developer[];
  onAdd: () => void;
  onRemove: () => void;
}> = ({ developers, onAdd, onRemove }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 8,
      }}
    >
      {/* Botón eliminar dev (−) */}
      <button
        onClick={onRemove}
        aria-label="Eliminar desarrolladores"
        style={{
          backgroundColor: "transparent",
          border: "1px solid #4ade80",
          color: "#4ade80",
          fontWeight: "700",
          fontSize: 24,
          borderRadius: 8,
          width: 36,
          height: 36,
          cursor: "pointer",
          marginRight: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(74, 222, 128, 0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "transparent";
        }}
      >
        −
      </button>

      {/* Avatares */}
      <div
        style={{
          display: "flex",
          gap: "-10px",
          alignItems: "center",
          overflowX: "auto",
          flexWrap: "nowrap",
          scrollbarWidth: "thin",
        }}
      >
        {developers.map((dev, idx) => {
          const hasPhoto = !!dev.photoUrl;
          const initial = dev.email[0].toUpperCase();
          const bgColor = getRandomColor(dev.email);
          return (
            <div
              key={dev.id}
              title={dev.email}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "2px solid #121212",
                background: hasPhoto ? "none" : bgColor,
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: idx === 0 ? 0 : -10,
                color: "#222",
                fontWeight: "700",
                fontSize: "1rem",
                flexShrink: 0,
                userSelect: "none",
                cursor: "default",
              }}
            >
              {hasPhoto ? (
                <img
                  src={dev.photoUrl!}
                  alt={dev.email}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón añadir dev (+) */}
      <button
        onClick={onAdd}
        aria-label="Agregar desarrolladores"
        style={{
          backgroundColor: "transparent",
          border: "1px solid #4ade80",
          color: "#4ade80",
          fontWeight: "700",
          fontSize: 24,
          borderRadius: 8,
          width: 36,
          height: 36,
          cursor: "pointer",
          marginLeft: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(74, 222, 128, 0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "transparent";
        }}
      >
        +
      </button>
    </div>
  );
};

export default function Page() {
  const params = useParams();
  const { id } = params;

  // Estados para el proyecto editable
  const [projectName, setProjectName] = useState("Proyecto " + (id ?? ""));
  const [dueDate, setDueDate] = useState("2025-09-01");
  const [pointsDone, setPointsDone] = useState(12);
  const [pointsTotal, setPointsTotal] = useState(20);
  const [description, setDescription] = useState(
    `Esta es la descripción completa y editable para el proyecto ${id ?? ""}.
Lorem ipsum dolor sit amet, consectetur adipiscing elit...`
  );
  const [developers, setDevelopers] = useState<Developer[]>([
    { id: "1", email: "ana@example.com", photoUrl: null },
    {
      id: "2",
      email: "jose@example.com",
      photoUrl: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    { id: "3", email: "luisa@example.com", photoUrl: null },
  ]);

  const [risks, setRisks] = useState<Risk[]>([
    {
      descripcion: "Retraso en proveedores",
      impacto: "alto",
    },
    {
      descripcion: "Falta de recursos humanos",
      impacto: "medio",
    },
    {
      descripcion: "Pruebas insuficientes",
      impacto: "bajo",
    },
  ]);

  // Estado del proyecto
  const [status, setStatus] = useState<"green" | "yellow" | "red">("green");

  // Simulación de tareas con estados para cada columna
  const [tasks, setTasks] = useState([
    {
      id: "t1",
      name: "Diseñar interfaz de usuario",
      status: "red",
      developers: developers.slice(0, 1),
      href: "#",
    },
    {
      id: "t2",
      name: "Implementar autenticación",
      status: "yellow",
      developers: developers.slice(0, 2),
      href: "#",
    },
    {
      id: "t3",
      name: "Revisar pruebas unitarias",
      status: "green",
      developers: developers.slice(1, 3),
      href: "#",
    },
    {
      id: "t4",
      name: "Desplegar a producción",
      status: "green",
      developers: developers.slice(0, 3),
      href: "#",
    },
    {
      id: "t5",
      name: "Test de carga",
      status: "yellow",
      developers: [developers[1]],
      href: "#",
    },
  ]);

  // Filtrar tareas por estado para cada columna
  const pendientes = tasks.filter((t) => t.status === "red");
  const enProgreso = tasks.filter((t) => t.status === "yellow");
  const completadas = tasks.filter((t) => t.status === "green");
  const desplegadas = tasks.filter((t) => t.status === "green"); // Si quieres diferente color para desplegadas, ajusta!!

  // Calcula días restantes
  const calcDaysRemaining = () => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };
  const [daysRemaining, setDaysRemaining] = useState(calcDaysRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysRemaining(calcDaysRemaining());
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [dueDate]);

  // Colores estado
  const statusColors: Record<typeof status, string> = {
    green: "#4ade80",
    yellow: "#facc15",
    red: "#f87171",
  };

  // Handlers ficticios agregar/quitar devs
  const addDeveloper = () => {
    const newId = (developers.length + 1).toString();
    setDevelopers((prev) => [
      ...prev,
      { id: newId, email: `nuevo${newId}@example.com`, photoUrl: null },
    ]);
  };
  const removeDeveloper = () => {
    setDevelopers((prev) => prev.slice(0, Math.max(prev.length - 1, 0)));
  };

  return (
    <main
      style={{
        padding: 40,
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#e0e0e0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
      }}
    >
      {/* Cuadro estado esquina superior derecha */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          minWidth: 100,
          height: 48,
          padding: "0 12px",
          backgroundColor: statusColors[status],
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: 14,
          color: "#121212",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
        title={`Estado: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>

      {/* Nombre editable */}
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: 12,
          width: "100%",
          background: "transparent",
          border: "none",
          color: "#4ade80",
          outline: "none",
          cursor: "text",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
        aria-label="Nombre del proyecto editable"
      />

      {/* Contenedor fila fecha y tareas */}
      <div
        style={{
          display: "flex",
          gap: 48, // más espacio entre fecha y puntos
          flexWrap: "wrap",
          marginBottom: 12,
          color: "#c2c2c2",
          fontWeight: 600,
          fontSize: "1.1rem",
          alignItems: "flex-start", // para alinear al tope los hijos
        }}
      >
        {/* Fecha editable */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              fontSize: "1.1rem",
              color: "#e0e0e0",
              background: "transparent",
              border: "1px solid #4ade80",
              borderRadius: 8,
              padding: "4px 8px",
              cursor: "text",
              outline: "none",
              width: 180,
              fontWeight: 600,
            }}
            aria-label="Fecha de entrega editable"
          />
          <span>Quedan {daysRemaining} días para finalizar</span>
        </div>

        {/* Contador puntos con cada etiqueta encima del input y slash en columna */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Puntos obtenidos - columna */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>Puntos obtenidos</span>
            <input
              type="number"
              min={0}
              max={pointsTotal}
              value={pointsDone}
              onChange={(e) => {
                let val = parseInt(e.target.value);
                if (isNaN(val)) val = 0;
                if (val > pointsTotal) val = pointsTotal;
                if (val < 0) val = 0;
                setPointsDone(val);
              }}
              style={{
                width: 60,
                fontWeight: 700,
                fontSize: "1.1rem",
                textAlign: "right",
                border: "1px solid #4ade80",
                borderRadius: 8,
                backgroundColor: "transparent",
                color: "#e0e0e0",
                outline: "none",
                padding: "2px 6px",
                cursor: "text",
              }}
              aria-label="Puntos obtenidos editables"
            />
          </div>

          {/* Slash en columna centrado */}
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#c2c2c2",
              alignSelf: "center",
              userSelect: "none",
              paddingBottom: 24, // ajusta vertical para centrar con inputs
            }}
          >
            /
          </div>

          {/* Puntos totales - columna */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>Puntos totales</span>
            <input
              type="number"
              min={pointsDone}
              value={pointsTotal}
              onChange={(e) => {
                let val = parseInt(e.target.value);
                if (isNaN(val)) val = 0;
                if (val < pointsDone) val = pointsDone;
                setPointsTotal(val);
              }}
              style={{
                width: 60,
                fontWeight: 700,
                fontSize: "1.1rem",
                textAlign: "right",
                border: "1px solid #4ade80",
                borderRadius: 8,
                backgroundColor: "transparent",
                color: "#e0e0e0",
                outline: "none",
                padding: "2px 6px",
                cursor: "text",
              }}
              aria-label="Puntos totales editables"
            />
          </div>
        </div>
        {/* Texto debajo de los puntos */}
        <div
          style={{
            marginTop: 4,
            color: "#a5f3fc", // color azul claro neutro, puedes cambiar
            fontWeight: 600,
            fontSize: "0.9rem",
            textAlign: "center",
            width: 180 * 2 + 12, // ancho aproximado de ambos inputs + gap
            marginLeft: 48, // para alinearlo centrado debajo de ambos inputs y slash
          }}
        >
          Faltan {pointsTotal - pointsDone} puntos para completar el proyecto
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          marginBottom: 8,
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "#c2c2c2",
        }}
      >
        Desarrolladores
      </div>

      {/* Avatares de desarrolladores y botones + y - */}
      <ProjectAvatars
        developers={developers}
        onAdd={addDeveloper}
        onRemove={removeDeveloper}
      />

      <div
        style={{
          marginTop: 24,
          marginBottom: 8,
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "#c2c2c2",
        }}
      >
        Descripción del Proyecto
      </div>

      {/* Descripción editable con scroll */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={8}
        style={{
          marginTop: 10,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid #4ade80",
          borderRadius: 12,
          color: "#e0e0e0",
          fontSize: "1rem",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: 12,
          resize: "vertical",
          overflowY: "auto",
          minHeight: 150,
        }}
        aria-label="Descripción editable del proyecto"
      />

      {/* Después del textarea de descripción y antes del panel de tareas */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        <button
          type="button"
          aria-label="Crear nueva tarea"
          style={{
            padding: "10px 24px",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            color: "#e0e0e0",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            transition: "background 0.3s ease, box-shadow 0.3s ease",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.background = "rgba(255, 255, 255, 0.2)";
            target.style.boxShadow = "0 10px 40px 0 rgba(31, 38, 135, 0.6)";
            target.style.color = "#fafafa";
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.background = "rgba(255, 255, 255, 0.1)";
            target.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
            target.style.color = "#e0e0e0";
          }}
          onClick={() => {
            alert("+ Nueva tarea (agrega aquí la lógica)");
          }}
        >
          + Nueva Tarea
        </button>
      </div>

      {/* NUEVO PANEL ABAJO CON 4 SECCIONES HORIZONTALES */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 24,
          width: "100%",
          height: 400,
        }}
      >
        {/* Pendientes (rojo) */}
        <section
          style={{
            backgroundColor: "#f87171",
            flex: 1,
            borderRadius: 12,
            padding: 16,
            overflowY: "auto",
            color: "#121212",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Pendientes</h3>
          {tasks
            .filter((t) => t.status === "red")
            .map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
        </section>

        {/* En Progreso (naranja) */}
        <section
          style={{
            backgroundColor: "#d97706",
            flex: 1,
            borderRadius: 12,
            padding: 16,
            overflowY: "auto",
            color: "#121212",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>En Progreso</h3>
          {tasks
            .filter((t) => t.status === "yellow")
            .map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
        </section>

        {/* Completadas (amarillo clarito) */}
        <section
          style={{
            backgroundColor: "#fbbf24",
            flex: 1,
            borderRadius: 12,
            padding: 16,
            overflowY: "auto",
            color: "#121212",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Completadas</h3>
          {tasks
            .filter((t) => t.status === "green")
            .map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
        </section>

        {/* Desplegadas (verde más oscuro) */}
        <section
          style={{
            backgroundColor: "#4ade80",
            flex: 1,
            borderRadius: 12,
            padding: 16,
            overflowY: "auto",
            color: "#121212",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12, color: "#0f5132" }}>
            Desplegadas
          </h3>
          {/* Aquí podrías filtrar o mostrar las tareas con un estado distinto */}
          {/* Por ejemplo, si tienes un estado 'deployed', cámbialo aquí */}
          {/* Mientras tanto mostramos las completadas para demo */}
          {tasks
            .filter((t) => t.status === "green")
            .map((task) => (
              <TaskCard key={task.id + "-despl"} {...task} />
            ))}
        </section>
      </div>

      {/* NUEVO PANEL MÉTRICAS DE CALIDAD */}
      <section
        style={{
          marginTop: 32,
          borderRadius: 12,
          padding: 24,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 24,
            color: "#c2c2c2",
            fontWeight: 700,
            fontSize: "1.5rem",
          }}
        >
          Métricas de Calidad
        </h2>

        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {[
            "Bugs Bajos",
            "Bugs Normales",
            "Bugs Críticos",
            "Bugs Totales",
            "Cobertura de Tests",
          ].map((title, idx) => (
            <div
              key={title}
              style={{
                flex: "1 1 150px", // fijo ancho mínimo y adaptativo
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 140,
              }}
            >
              <span
                style={{
                  color: "#e0e0e0",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  marginBottom: 12,
                  textAlign: "center",
                  userSelect: "none",
                }}
              >
                {title}
              </span>
              <input
                type="number"
                min={0}
                step={1}
                defaultValue={0}
                style={{
                  width: "80px",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#4ade80",
                  textAlign: "center",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  userSelect: "text",
                  cursor: "text",
                }}
                aria-label={`${title} editable`}
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          ))}
        </div>
      </section>

      {/* NUEVO PANEL REGISTRO DE RIESGOS Y BLOQUEOS */}
      <section
        style={{
          marginTop: 32,
          borderRadius: 12,
          padding: 24,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 24,
            color: "#c2c2c2",
            fontWeight: 700,
            fontSize: "1.5rem",
          }}
        >
          Registro de Riesgos y Bloqueos
        </h2>

        {/* Botón + en esquina superior derecha */}
        <button
          type="button"
          aria-label="Agregar riesgo"
          onClick={() => {
            // Aquí pones la redirección o lógica para agregar riesgo
            alert("Redirigiendo a pantalla para añadir riesgos...");
          }}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#e0e0e0",
            fontWeight: 600,
            cursor: "pointer",
            padding: "6px 14px",
            fontSize: "1.25rem",
            lineHeight: 1,
            userSelect: "none",
            transition: "background-color 0.3s ease",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            const t = e.currentTarget;
            t.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget;
            t.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          +
        </button>

        {/* Lista de riesgos */}
        <div
          style={{
            marginTop: 12,
            maxHeight: 200,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingRight: 12, // para evitar que scroll tape contenido
          }}
        >
          {/* Muestra los riesgos */}
          {risks.length === 0 && (
            <p style={{ color: "#c2c2c2", fontStyle: "italic" }}>
              No hay riesgos registrados todavía.
            </p>
          )}

          {risks.map((risk, idx) => {
            // Color cuadrado según alcance
            const colorMap: Record<string, string> = {
              bajo: "#4ade80", // verde
              medio: "#facc15", // amarillo
              alto: "#f87171", // rojo
            };
            const color = colorMap[risk.impacto] || "#6b7280"; // gris por defecto

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: 8,
                }}
              >
                <span style={{ flex: 1, color: "#e0e0e0" }}>
                  {risk.descripcion}
                </span>
                <div
                  title={`Impacto: ${risk.impacto}`}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    backgroundColor: color,
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Botones guardar y salir */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 24, // suficiente espacio separa del panel
          justifyContent: "flex-end", // para alinearlo a la derecha
        }}
      >
        <button
          type="button"
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#e0e0e0",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            const t = e.currentTarget;
            t.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget;
            t.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onClick={() => {
            alert("Guardar cambios (implementar lógica)");
          }}
        >
          Guardar
        </button>

        <button
          type="button"
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#e0e0e0",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            const t = e.currentTarget;
            t.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget;
            t.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onClick={() => {
            alert("Salir de la edición (implementar lógica)");
          }}
        >
          Salir
        </button>
      </div>
    </main>
  );
}
