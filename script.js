let map;
let directionsService;
let directionsRenderer;

// Inizializza la mappa e i servizi di Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.8518, lng: 14.2681 }, // Napoli
        zoom: 13,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

// Calcola il percorso utilizzando Google Maps Directions API
function calculateRoute(from, to, mode) {
    return new Promise((resolve, reject) => {
        const request = {
            origin: from,
            destination: to,
            travelMode: mode,
        };

        directionsService.route(request, (result, status) => {
            if (status === "OK") {
                resolve(result);
            } else {
                reject(`Errore nel calcolo del percorso: ${status}`);
            }
        });
    });
}

// Gestione del form di pianificazione del viaggio
document.getElementById("travelForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const mode = document.getElementById("preferences").value;

    const resultsContainer = document.getElementById("routeDetails");

    if (!from || !to) {
        resultsContainer.innerHTML = `<p style="color: red;">Inserisci partenza e destinazione valide.</p>`;
        return;
    }

    try {
        const route = await calculateRoute(from, to, mode);

        // Mostra i dettagli del percorso
        const leg = route.routes[0].legs[0];
        resultsContainer.innerHTML = `
            <p><strong>Punto di Partenza:</strong> ${from}</p>
            <p><strong>Destinazione:</strong> ${to}</p>
            <p><strong>Durata:</strong> ${leg.duration.text}</p>
            <p><strong>Distanza:</strong> ${leg.distance.text}</p>
            <p><strong>Indicazioni:</strong><br>${leg.steps.map(step => step.instructions).join("<br>")}</p>
        `;

        // Disegna il percorso sulla mappa
        directionsRenderer.setDirections(route);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = `<p style="color: red;">${error}</p>`;
    }
});
