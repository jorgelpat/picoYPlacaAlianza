let mensajeros = [];

fetch("config.json")
    .then(response => response.json())
    .then(data => {
        mensajeros = data;
    })
    .catch(error => console.error("Error al cargar los mensajeros:", error));

function obtenerDiaYPicoYPlaca(fecha) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const date = new Date(fecha);
    const diaSemana = dias[date.getDay()]; // Obtiene el día de la semana

    // Definir las restricciones de pico y placa por periodo
    const restricciones = [
        // Enero - Marzo
        ["9 y 0", "1 y 2", "3 y 4", "5 y 6", "7 y 8"],
        // Abril - Junio
        ["1 y 2", "3 y 4", "5 y 6", "7 y 8", "9 y 0"],
        // Julio - Septiembre
        ["3 y 4", "5 y 6", "7 y 8", "9 y 0", "1 y 2"],
        // Octubre - Diciembre
        ["5 y 6", "7 y 8", "9 y 0", "1 y 2", "3 y 4"]
    ];

    // Determinar el periodo (0: Enero-Marzo, 1: Abril-Junio, 2: Julio-Septiembre, 3: Octubre-Diciembre)
    const periodo = Math.floor(date.getMonth() / 3);

    // Obtener las restricciones del día (Lunes: 0, Martes: 1, ..., Viernes: 4)
    let picoYPlaca;
    if (diaSemana === "Sábado" || diaSemana === "Domingo") {
        picoYPlaca = "Sin restricción"; // No hay restricciones los fines de semana
    } else {
        picoYPlaca = restricciones[periodo][date.getDay()] || "Sin restricción";
    }

    return { diaSemana, picoYPlaca };
}

// // Ejemplo de uso
// const fecha = "2023-10-05"; // Jueves, 5 de Octubre de 2023
// const resultado = obtenerDiaYPicoYPlaca(fecha);
// console.log(resultado); // { diaSemana: "Jueves", picoYPlaca: "1 y 2" }

function buscarPicoYPlaca() {
    const fecha = document.getElementById("fecha").value;
    if (!fecha) return alert("Seleccione una fecha");

    // Obtener el pico y placa del día
    const { picoYPlaca } = obtenerDiaYPicoYPlaca(fecha);
    const [hoy1, hoy2] = picoYPlaca.split(" y ");

    // Contadores para mensajeros con y sin pico y placa
    let conPicoYPlaca = 0;
    let sinPicoYPlaca = 0;

    // Procesar los mensajeros
    const resultado = mensajeros.map(m => {
        let digito = m.placa.match(/\d(?=\D*$)/)?.[0]; // Obtener el último dígito de la placa
        if (digito === hoy1 || digito === hoy2) {
            conPicoYPlaca++; // Incrementar contador de pico y placa
            return { ...m, clase: "rojo" };
        } else {
            sinPicoYPlaca++; // Incrementar contador de sin pico y placa
            return { ...m, clase: "verde" };
        }
    });

    // Ordenar el resultado: primero los que no tienen pico y placa (clase "verde")
    resultado.sort((a, b) => {
        if (a.clase === "verde" && b.clase === "rojo") return -1;
        if (a.clase === "rojo" && b.clase === "verde") return 1;
        return 0;
    });

    // Mostrar los resultados
    mostrarResultados(resultado);

    // Mostrar la cantidad de mensajeros con y sin pico y placa
    const contador = document.getElementById("contador");
    contador.innerHTML = `
        <p>Mensajeros con pico y placa: ${conPicoYPlaca}</p>
        <p>Mensajeros sin pico y placa: ${sinPicoYPlaca}</p>
    `;
}

function mostrarResultados(lista) {
    const ul = document.getElementById("resultado");
    ul.innerHTML = "";
    lista.forEach(m => {
        let li = document.createElement("li");
        li.textContent = m.nombre;
        li.className = m.clase;
        ul.appendChild(li);
    });
}