//Clock

let lastTime = "";

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("no-NO", {
        hour12: false,
        timeZone: "Europe/Oslo"
    });

    if (time !== lastTime) {
        el.clock.textContent = time;
        lastTime = time;
    }
}

