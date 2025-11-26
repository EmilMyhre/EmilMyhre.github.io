# TillerScreen

### A easy and modern information screen website for Raspberry Pi

TillerScreen is a simple, modern, and fully automated info-screen designed for kiosks, classrooms and offices.

---

## ✨ Features

* **Real-time clock**
* **Weather data** for Tiller / Trondheim
* **Live bus departures** powered by **Entur API**
* Automatic screen scaling for TVs and large displays
* Works offline after load (caches styles and layout)

---

### Running on Raspberry Pi (Kiosk Mode)

1. Install Chromium
2. Autostart it in kiosk mode loading the local file or hosted version
3. Disable sleep/screensaver
4. Done

---

## 🚌 Bus Data (Entur)

TillerScreen fetches live bus departures using:

* `NSR:StopPlace:44029` — **Tillerterminalen**
* `NSR:StopPlace:41587` — **Tiller VGS**

---

## 🌦 Weather Data

Weather is fetched from a public API from yr.no and updates automatically every few minutes.

---

## 🧩 File Structure

```
TillerScreen/
│── index.html
│── style.css
│── script.js
└──background.jpg   (optional)

```

## 🤝 Contributions

Pull requests, issues, and feature suggestions are welcome :)
