const el = {
    busTitle: document.getElementById("bus-title"),
    busTable: document.getElementById("bus-table"),
    busContainer: document.getElementById("bus-container"),
    
    slideDots: document.querySelectorAll('.slide-dot')
};

//Bus Widget
//#########################################

// Buss stops. for more go to:https://entur.no/kart
const STOPS = [
    { id: "NSR:StopPlace:44029", name: "Tillerterminalen" },
    { id: "NSR:StopPlace:41587", name: "Tiller VGS" },
    { id: "NSR:StopPlace:44031", name: "City Syd E6" }
];

let currentStopIndex = 0;

// Fetch bus data from Entur API
async function fetchBus(stopId) {
    try {
        const res = await fetch(
            "https://api.entur.io/journey-planner/v3/graphql",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ET-Client-Name": "tiller-screen"
                },
                body: JSON.stringify({
                    query: `
            {
              stopPlace(id: "${stopId}") {
                name
                estimatedCalls(timeRange: 3600, numberOfDepartures: 10) {
                  expectedDepartureTime
                  destinationDisplay { frontText }
                  serviceJourney { line { publicCode } }
                }
              }
            }
          `
                })
            }
        );

        const json = await res.json();

        if (!json.data || !json.data.stopPlace) {
            throw new Error("Invalid API response");
        }

        const calls = json.data.stopPlace.estimatedCalls;

        const now = new Date();
        const trondheimTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Oslo" }));
        //const exact = dep.toLocaleTimeString("no-NO", {hour: "2-digit",minute: "2-digit"});

        const rows = calls.slice(0, 6).map(call => {
            const line = call.serviceJourney.line.publicCode;
            const dest = call.destinationDisplay.frontText;

            const dep = new Date(call.expectedDepartureTime);

            const diffMin = Math.max(0, Math.round((dep - trondheimTime) / 60000));

            const exact = dep.toLocaleTimeString("no-NO", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Oslo"
            });

            //Set urgency class
            let urgencyClass = "";
            if (diffMin <= 5) {
                urgencyClass = "soon";
            } else if (diffMin <= 15) {
                urgencyClass = "medium";
            } else {
                urgencyClass = "later";
            }

            return `
        <div class="bus-row">
          <div class="bus-exact">${exact}</div>
          <div><span class="bus-line">${line}</span></div>
          <div class="bus-dest">${dest}</div>
          <div class="bus-time ${urgencyClass}">${diffMin === 0 ? "Nå" : diffMin + " min"}</div>
        </div>
      `;
        });

        return rows.join("");

    } catch (err) {
        console.error("Bus fetch error:", err);
        return "<div style='padding:20px;'>Bus info unavailable</div>";
    }
}

//change slideshow every 6 seconds
async function updateSlideshow() {
    const stopA = STOPS[currentStopIndex];

    el.slideDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentStopIndex);
    });
    const container = el.busContainer;
    const html = await fetchBus(stopA.id);

    el.busTitle.textContent = stop.name;
    setHTML(el.busTable, html);
    currentStopIndex = (currentStopIndex + 1) % STOPS.length;
}


function initDotNavigation() {
    el.slideDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentStopIndex = index;
        });
    });
}

//iniitialize buss slideshow
function init() {
    initDotNavigation();
    updateSlideshow();
    setInterval(updateSlideshow, 6000);
}

init();