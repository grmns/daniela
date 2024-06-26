document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const datesSelect = document.getElementById('dates');
    const airlinesSelect = document.getElementById('airlines');
    const mapSection = document.getElementById('map-section');

    // Datos simulados
    const airports = ['Lima', 'Nueva York', 'Los Ángeles', 'Chicago', 'Miami'];
    const flights = [
        { id: 1, origin: 'Lima', destination: 'Nueva York', date: '01-07-2024', time: '10:00 AM', airline: 'Aerolínea A', price: '$500' },
        { id: 2, origin: 'Lima', destination: 'Los Ángeles', date: '02-07-2024', time: '12:00 PM', airline: 'Aerolínea B', price: '$450' },
        { id: 3, origin: 'Lima', destination: 'Chicago', date: '03-07-2024', time: '02:00 PM', airline: 'Aerolínea C', price: '$400' },
        { id: 4, origin: 'Lima', destination: 'Miami', date: '04-07-2024', time: '04:00 PM', airline: 'Aerolínea D', price: '$550' }
    ];

    // Llenar el combobox de origen
    if (originSelect) {
        airports.forEach(airport => {
            const option = document.createElement('option');
            option.value = airport;
            option.textContent = airport;
            originSelect.appendChild(option);
        });

        // Manejar la selección de origen
        originSelect.addEventListener('change', function () {
            destinationSelect.innerHTML = '<option value="">Selecciona el destino</option>';
            datesSelect.innerHTML = '<option value="">Selecciona la fecha</option>';
            airlinesSelect.innerHTML = '<option value="">Selecciona la aerolínea</option>';
            datesSelect.disabled = true;
            airlinesSelect.disabled = true;
            destinationSelect.disabled = false;

            const selectedOrigin = originSelect.value;
            const destinations = flights.filter(flight => flight.origin === selectedOrigin).map(flight => flight.destination);
            [...new Set(destinations)].forEach(destination => {
                const option = document.createElement('option');
                option.value = destination;
                option.textContent = destination;
                destinationSelect.appendChild(option);
            });
        });
    }

    // Manejar la selección de destino
    if (destinationSelect) {
        destinationSelect.addEventListener('change', function () {
            datesSelect.innerHTML = '<option value="">Selecciona la fecha</option>';
            airlinesSelect.innerHTML = '<option value="">Selecciona la aerolínea</option>';
            datesSelect.disabled = false;
            airlinesSelect.disabled = true;

            const selectedOrigin = originSelect.value;
            const selectedDestination = destinationSelect.value;
            const dates = flights.filter(flight => flight.origin === selectedOrigin && flight.destination === selectedDestination).map(flight => flight.date);
            [...new Set(dates)].forEach(date => {
                const option = document.createElement('option');
                option.value = date;
                option.textContent = date;
                datesSelect.appendChild(option);
            });

            // Mostrar el mapa
            initMap(selectedOrigin, selectedDestination);
        });
    }

    // Manejar la selección de fecha
    if (datesSelect) {
        datesSelect.addEventListener('change', function () {
            airlinesSelect.innerHTML = '<option value="">Selecciona la aerolínea</option>';
            airlinesSelect.disabled = false;

            const selectedOrigin = originSelect.value;
            const selectedDestination = destinationSelect.value;
            const selectedDate = datesSelect.value;
            const airlines = flights.filter(flight => flight.origin === selectedOrigin && flight.destination === selectedDestination && flight.date === selectedDate).map(flight => flight.airline);
            [...new Set(airlines)].forEach(airline => {
                const option = document.createElement('option');
                option.value = airline;
                option.textContent = airline;
                airlinesSelect.appendChild(option);
            });
        });
    }

    // Manejar el envío del formulario
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const searchParams = {
                origin: originSelect.value,
                destination: destinationSelect.value,
                date: datesSelect.value,
                airline: airlinesSelect.value
            };
            localStorage.setItem('searchParams', JSON.stringify(searchParams));
            window.location.href = 'available.html';
        });
    }

    const flightsList = document.getElementById('flights-list');
    if (flightsList) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html') {
            displayAllFlights();
        } else if (currentPage === 'available.html') {
            const searchParams = JSON.parse(localStorage.getItem('searchParams'));
            displayFilteredFlights(searchParams);
            initMap(searchParams.origin, searchParams.destination); // Inicializar el mapa con los datos recuperados
        } else if (currentPage === 'flight.html') {
            displayFlightDetails();
        }
    }
});

function displayAllFlights() {
    const flights = getFlightsData();
    displayFlights(flights);
}

function displayFilteredFlights(searchParams) {
    const flights = getFlightsData();
    const filteredFlights = flights.filter(flight => {
        return flight.origin === searchParams.origin &&
            flight.destination === searchParams.destination &&
            flight.date === searchParams.date &&
            flight.airline === searchParams.airline;
    });
    displayFlights(filteredFlights);
}

function displayFlights(flights) {
    const flightsList = document.getElementById('flights-list');
    flightsList.innerHTML = '';
    if (flights.length === 0) {
        flightsList.innerHTML = '<li>No se encontraron vuelos.</li>';
        return;
    }

    flights.forEach(flight => {
        const flightCard = document.createElement('div');
        flightCard.className = 'card';
        flightCard.innerHTML = `
                <h3>${flight.origin} a ${flight.destination}</h3>
                <p><strong>Fecha:</strong> ${flight.date}</p>
                <p><strong>Hora:</strong> ${flight.time}</p>
                <p><strong>Aerolínea:</strong> ${flight.airline}</p>
                <p><strong>Precio:</strong> ${flight.price}</p>
            `;
        flightCard.addEventListener('click', function () {
            console.log('Guardando vuelo seleccionado en localStorage:', flight);
            localStorage.setItem('selectedFlight', JSON.stringify(flight));
            window.location.href = 'flight.html';
        });
        flightsList.appendChild(flightCard);

        // Agregar animación de aparición
        setTimeout(() => {
            flightCard.style.opacity = '1';
            flightCard.style.transform = 'translateX(0)';
        }, 100);
    });
}

function displayFlightDetails() {
    const flight = JSON.parse(localStorage.getItem('selectedFlight'));
    console.log('Recuperando vuelo seleccionado de localStorage:', flight);
    const flightDetails = document.getElementById('flight-details');
    if (flight) {
        flightDetails.innerHTML = `
            <p><strong>Origen:</strong> ${flight.origin}</p>
            <p><strong>Destino:</strong> ${flight.destination}</p>
            <p><strong>Fecha:</strong> ${flight.date}</p>
            <p><strong>Hora:</strong> ${flight.time}</p>
            <p><strong>Aerolínea:</strong> ${flight.airline}</p>
            <p><strong>Precio:</strong> ${flight.price}</p>
        `;
    } else {
        flightDetails.innerHTML = '<p>No se encontraron detalles del vuelo.</p>';
    }
}

function getFlightsData() {
    return [
        { id: 1, origin: 'Lima', destination: 'Nueva York', date: '01-07-2024', time: '10:00 AM', airline: 'Aerolínea A', price: '$500' },
        { id: 2, origin: 'Lima', destination: 'Los Ángeles', date: '02-07-2024', time: '12:00 PM', airline: 'Aerolínea B', price: '$450' },
        { id: 3, origin: 'Lima', destination: 'Chicago', date: '03-07-2024', time: '02:00 PM', airline: 'Aerolínea C', price: '$400' },
        { id: 4, origin: 'Lima', destination: 'Miami', date: '04-07-2024', time: '04:00 PM', airline: 'Aerolínea D', price: '$550' }
    ];
}

function initMap(origin, destination) {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: -12.0464, lng: -77.0428 } // Coordenadas de Lima
    });
    const markerOrigin = new google.maps.Marker({
        position: { lat: -12.0464, lng: -77.0428 },
        map: map,
        title: 'Origen: Lima'
    });

    const destinationsCoordinates = {
        'Nueva York': { lat: 40.7128, lng: -74.0060 },
        'Los Ángeles': { lat: 34.0522, lng: -118.2437 },
        'Chicago': { lat: 41.8781, lng: -87.6298 },
        'Miami': { lat: 25.7617, lng: -80.1918 }
    };

    const markerDestination = new google.maps.Marker({
        position: destinationsCoordinates[destination],
        map: map,
        title: `Destino: ${destination}`
    });

    // Dibujar línea entre origen y destino
    const flightPath = new google.maps.Polyline({
        path: [
            { lat: -12.0464, lng: -77.0428 },
            destinationsCoordinates[destination]
        ],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);

    map.setCenter(destinationsCoordinates[destination]);

    // Mostrar detalles del vuelo
    const flightDetails = document.getElementById('flight-details');
    flightDetails.innerHTML = `
<p><strong>Origen:</strong> ${origin}</p>
<p><strong>Destino:</strong> ${destination}</p>
<p><strong>Fecha:</strong> ${date}</p>
<p><strong>Hora:</strong> ${time}</p>
<p><strong>Aerolínea:</strong> ${airline}</p>
<p><strong>Precio:</strong> ${price}</p>
`;
}

$('.image-gallery').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false
});