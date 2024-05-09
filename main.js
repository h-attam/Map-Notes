import { detecIcon,detecType, setStorage } from "./helpers.js";

//!HTML'den gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//! olay izleyicileri
form.addEventListener("submit", handleSubmit);

//! ortak kullanım alanı
let map;
let coords = [];
let notes = [];
let layerGroup =L.layerGroup();

//* kullanıcının konumunu öğrenme
navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log("Kulanıcı kabul etmedi")
);
//* haritaya tıklanınca çalışır
function onMapClick(e) {
  form.style.display = "flex";
  coords = [e.latlng.lat, e.latlng.lng];
  console.log(coords);
}
//* kullanıcının konumuna göre ekrana haritayı gösterme
function loadMap(e) {
  // haritanın kurulumu
  map = new L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);
  L.control;
  //haritanın nasıl gözükeceğini belirler
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //har,tada ekrana basılacak imleçleri tutacağımız katman
  layerGroup = L.layerGroup().addTo(map);

  // haritada bir tıklanma olduğunda çalışacak fonksiyon
  map.on("click", onMapClick);
}
//* ekrana marker basma
function renderMarker(item) {
  console.log(item);
  // markerı oluşturur
  L.marker(item.coords, { icon: detecIcon(item.status) })
    //imleçlerin olduğu katmana ekler
    .addTo(layerGroup)
    // üzerine tıklanınca a.ılacak popup ekleme
    .bindPopup(`${item.desc}`);
}
//* form gönderildiğinde çalışır
function handleSubmit(e) {
  e.preventDefault();
  console.log(e);
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  // notes dizisine eleman ekleme
  notes.push({ id: new Date().getTime(), desc, date, status, coords });
  console.log(notes);
  // localStorage güncelleme
  setStorage(notes);
  // Notları ekrana aktarabilmek için fonksiyone notes dizisini parametre olarak gönderdik.
  renderNoteList(notes);

  // Form gönderildiğinde kapanır
  form.style.display = "none";
}

function renderNoteList(item) {
  list.innerHTML = "";

  // markerları temizler
  layerGroup.clearLayers();
  item.forEach((item) => {
    const listElement = document.createElement("li");
    // datasına sahip olduğu idyi ekleme
    listElement.dataset.id = item.id;
    listElement.innerHTML = `
      
      <div>
          <p>${item.desc}</p>
          <p><span>Tarih:</span>${item.date}</p>
          <p><span>Durum:</span>${detecType(item.status)}</p>
      </div>
      <i class="bi bi-x" id="delete"></i>
      <i class="bi bi-airplane-fill" id="fly"></i>
      `;
    list.insertAdjacentElement("afterbegin", listElement);
    // Ekrana marker basma
    renderMarker(item);
  });
}
