const cart = [];

function fmt(n){
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ");
}

function toggleCart(){
  document.getElementById("cart-panel").classList.toggle("open");
}

function showTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.style.display="none");
  document.getElementById(id).style.display="grid";
}

function addItem(name, price){
  let i = cart.find(x=>x.name===name);
  if(!i) cart.push({name, price, qty:1});
  else i.qty++;
  updateCart();
}

function updateCart(){
  const div = document.getElementById("cart-items");
  div.innerHTML = "";
  let total = 0;

  cart.forEach(i=>{
    total += i.qty * i.price;
    div.innerHTML += `
      <div class="cart-item">
        ${i.name} x${i.qty} = ${fmt(i.qty*i.price)}$
        <button onclick="removeItem('${i.name}')">Usuń</button>
      </div>
    `;
  });

  document.getElementById("cart-total").textContent =
    `Suma: ${fmt(total)}$`;

  document.getElementById("cart-count").textContent = cart.length;
}

function removeItem(name){
  const index = cart.findIndex(x=>x.name===name);
  if(index>-1) cart.splice(index,1);
  updateCart();
}

function sendOrder(){
  if(!org.value || !phone.value || !bossD.value || !bossF.value){
    alert("Wypełnij wszystkie wymagane pola! Brak danych skutkuje nie zrealizowaniem zamówienia.");
    return;
  }

  fetch("/order",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      orgName:org.value,
      phoneIC:phone.value,
      bossDiscord:bossD.value,
      bossFiveM:bossF.value,
      authorized:auth.value || "BRAK",
      items:cart,
      total:cart.reduce((a,b)=>a+b.qty*b.price,0)
    })
  }).then(()=>{
    alert("Zamówienie wysłane");
    cart.length = 0;
    updateCart();
    toggleCart();
  });
}

/* === PRODUKTY === */

const weapons = [
 ["Pistolet",12000],
 ["Pistolet bojowy",18000],
 ["Pistolet ppanc",25000],
 ["Paralizator",8000],
 ["AK-47",85000],
 ["AK-47 v2",110000],
 ["Karabinek",70000],
 ["Specjalny karabinek",95000],
 ["Ciężki karabin",130000],
 ["Karabin wojskowy",150000],
 ["SMG",45000],
 ["Skorpion",55000],
 ["PDW",90000],
 ["Tec-9",50000],
 ["Kompaktowy SMG",60000],
 ["AWP",250000],
 ["Ciężki AWP",350000]
];

const armor = [
 ["Lekki pancerz",20000],
 ["Średni pancerz",50000],
 ["Ciężki pancerz",90000]
];

const cars = [
 ["Zentorno",1200000],
 ["Adder",1000000],
 ["Sultan RS",750000],
 ["Kuruma",450000],
 ["Banshee",650000],
 ["Buffalo S",550000],
 ["Comet S2",900000],
 ["Elegy RH8",350000],
 ["Infernus",850000],
 ["Toros (SUV)",600000]
];

function render(list,id){
  const d = document.getElementById(id);
  list.forEach(p=>{
    d.innerHTML += `
      <div class="card">
        <h3>${p[0]}</h3>
        <p>Cena: ${fmt(p[1])}$</p>
        <button onclick="addItem('${p[0]}',${p[1]})">Dodaj</button>
      </div>
    `;
  });
}

render(weapons,"weapons");
render(armor,"armor");
render(cars,"cars");
showTab("weapons");
