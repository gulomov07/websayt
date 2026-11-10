
const planets = [
    {name:"Merkuriy",en:"Mercury",type:"rock",emoji:"🌑",color:"radial-gradient(circle at 30% 25%,#ddd,#777 55%,#292929)",info:"Quyoshga eng yaqin sayyora. Atmosferasi juda siyrak.",distance:"57,9 mln km"},
    {name:"Venera",en:"Venus",type:"rock",emoji:"🟠",color:"radial-gradient(circle at 30% 25%,#ffe3a0,#c17b35 60%,#603b24)",info:"Juda issiq sayyora. Atmosferasi asosan karbonat angidriddan iborat.",distance:"108,2 mln km"},
    {name:"Yer",en:"Earth",type:"rock",emoji:"🌍",color:"radial-gradient(circle at 30% 25%,#a4f4ff,#2479d5 45%,#104024)",info:"Bizning uyimiz. Hayot mavjudligi tasdiqlangan yagona sayyora.",distance:"149,6 mln km"},
    {name:"Mars",en:"Mars",type:"rock",emoji:"🔴",color:"radial-gradient(circle at 30% 25%,#ffc09b,#ce5837 55%,#64251e)",info:"Qizil sayyora. Olimlar unda qadimiy hayot izlarini o‘rganmoqda.",distance:"227,9 mln km"},
    {name:"Yupiter",en:"Jupiter",type:"gas",emoji:"🪐",color:"radial-gradient(circle at 30% 25%,#ffe1bd,#b77d54 50%,#5c3527)",info:"Quyosh tizimidagi eng katta sayyora.",distance:"778,5 mln km"},
    {name:"Saturn",en:"Saturn",type:"gas",emoji:"🪐",color:"radial-gradient(circle at 30% 25%,#fff0bc,#c5a46c 60%,#67523a)",info:"Chiroyli halqalari bilan mashhur gaz giganti.",distance:"1,43 mlrd km"},
    {name:"Uran",en:"Uranus",type:"ice",emoji:"🔵",color:"radial-gradient(circle at 30% 25%,#d6ffff,#68b9ca 60%,#24556c)",info:"Muz giganti. Aylanish o‘qi keskin qiyshaygan.",distance:"2,87 mlrd km"},
    {name:"Neptun",en:"Neptune",type:"ice",emoji:"🔵",color:"radial-gradient(circle at 30% 25%,#9ad5ff,#3154db 60%,#151e67)",info:"Quyoshdan eng uzoq sayyora.",distance:"4,5 mlrd km"}
];

let favorites = JSON.parse(localStorage.getItem("nebulaFav") || "[]");
let currentFilter = "all";

const grid = document.getElementById("planetGrid");

function render() {
    const search = document.getElementById("search").value.toLowerCase();

    const list = planets.filter(p =>
        (currentFilter === "all" ||
        (currentFilter === "fav" ? favorites.includes(p.en) : p.type === currentFilter)) &&
        (p.name.toLowerCase().includes(search) ||
        p.en.toLowerCase().includes(search))
    );

    grid.innerHTML = list.length ? list.map(p => `
        <article class="planet-card">
            <div class="planet-image">
                <div class="ball" style="background:${p.color}"></div>
            </div>
            <div class="planet-info">
                <h3>${p.name}</h3>
                <p>${p.en} · ${p.type === "rock" ? "Toshli" : p.type === "gas" ? "Gazli" : "Muzli"}</p>
                <div class="card-bottom">
                    <button class="details" data-name="${p.en}">Batafsil ↗</button>
                    <button class="favorite ${favorites.includes(p.en) ? "active" : ""}" data-fav="${p.en}">
                        ${favorites.includes(p.en) ? "♥" : "♡"}
                    </button>
                </div>
            </div>
        </article>
    `).join("") : "<p class='description'>Hech narsa topilmadi.</p>";
}

grid.addEventListener("click", e => {
    const detail = e.target.closest("[data-name]");
    const fav = e.target.closest("[data-fav]");

    if (detail) {
        const p = planets.find(x => x.en === detail.dataset.name);

        document.getElementById("modalEmoji").textContent = p.emoji;
        document.getElementById("modalName").textContent = p.name;
        document.getElementById("modalInfo").textContent =
            p.info + " Quyoshdan masofasi: " + p.distance;

        document.getElementById("modal").classList.add("show");
    }

    if (fav) {
        const name = fav.dataset.fav;

        favorites = favorites.includes(name)
            ? favorites.filter(x => x !== name)
            : [...favorites, name];

        localStorage.setItem("nebulaFav", JSON.stringify(favorites));
        render();
    }
});

document.querySelectorAll(".filter").forEach(button => {
    button.onclick = () => {
        document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));

        button.classList.add("active");
        currentFilter = button.dataset.filter;
        render();
    };
});

document.getElementById("search").addEventListener("input", render);

document.getElementById("closeModal").onclick = () => {
    document.getElementById("modal").classList.remove("show");
};

document.getElementById("modal").onclick = e => {
    if (e.target.id === "modal") {
        e.currentTarget.classList.remove("show");
    }
};

document.getElementById("themeBtn").onclick = () => {
    document.body.classList.toggle("light");

    document.getElementById("themeBtn").textContent =
        document.body.classList.contains("light") ? "☾" : "☀";
};

document.getElementById("menuBtn").onclick = () => {
    document.getElementById("navLinks").classList.toggle("open");
};

document.querySelectorAll(".links a").forEach(a => {
    a.onclick = () => {
        document.getElementById("navLinks").classList.remove("open");
    };
});

render();

// QUIZ

const questions = [
    {q:"Quyosh tizimidagi eng katta sayyora qaysi?",a:["Yer","Yupiter","Mars","Neptun"],correct:1},
    {q:"Qaysi sayyora qizil sayyora deb ataladi?",a:["Venera","Uran","Mars","Saturn"],correct:2},
    {q:"Biz qaysi sayyorada yashaymiz?",a:["Yer","Merkuriy","Yupiter","Neptun"],correct:0},
    {q:"Qaysi sayyora halqalari bilan mashhur?",a:["Mars","Venera","Saturn","Yer"],correct:2},
    {q:"Quyoshga eng yaqin sayyora qaysi?",a:["Yer","Merkuriy","Mars","Uran"],correct:1}
];

let qi = 0;
let score = 0;
let answered = false;

const question = document.getElementById("question");
const options = document.getElementById("options");
const result = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");

function showQuestion() {
    answered = false;
    result.textContent = "";
    nextBtn.style.display = "none";

    const q = questions[qi];

    question.textContent = (qi + 1) + ". " + q.q;

    options.innerHTML = q.a.map((a, i) =>
        `<button class="option" data-index="${i}">${a}</button>`
    ).join("");
}

options.onclick = e => {
    const button = e.target.closest(".option");

    if (!button || answered) return;

    answered = true;

    const answer = Number(button.dataset.index);

    if (answer === questions[qi].correct) {
        score++;
        button.classList.add("correct");
        result.textContent = "✓ To‘g‘ri javob!";
    } else {
        button.classList.add("wrong");
        options.children[questions[qi].correct].classList.add("correct");
        result.textContent = "✕ To‘g‘ri javob: " + questions[qi].a[questions[qi].correct];
    }

    nextBtn.textContent = qi === questions.length - 1
        ? "Natijani ko‘rish"
        : "Keyingi savol →";

    nextBtn.style.display = "inline-block";
};

nextBtn.onclick = () => {
    if (qi === questions.length - 1) {
        question.textContent = "Quiz yakunlandi!";
        options.innerHTML = "";
        result.textContent = `Siz ${questions.length} ta savoldan ${score} tasiga to‘g‘ri javob berdingiz!`;
        nextBtn.textContent = "Qayta boshlash";
        nextBtn.onclick = () => {
            qi = 0;
            score = 0;
            showQuestion();
        };
    } else {
        qi++;
        showQuestion();
    }
};

showQuestion();

// YULDUZLAR ANIMATSIYASI

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    stars = Array.from({length:130}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + .3,
        a: Math.random()
    }));
}

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    stars.forEach(s => {
        s.a += .015;

        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(180,190,255,${.25 + .55 * Math.abs(Math.sin(s.a))})`;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);

resize();
animate();
