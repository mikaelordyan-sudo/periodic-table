const tableData = [
    [1, "H", "Hydrogen", 1, 1], [18, "He", "Helium", 18, 1],
    [1, "Li", "Lithium", 1, 2], [2, "Be", "Beryllium", 2, 2],
    [13, "B", "Boron", 13, 2], [14, "C", "Carbon", 14, 2],
    [15, "N", "Nitrogen", 15, 2], [16, "O", "Oxygen", 16, 2],
    [17, "F", "Fluorine", 17, 2], [18, "Ne", "Neon", 18, 2]
];

// Заполняем остальные для массовки (118 элементов)
for (let i = 11; i <= 118; i++) {
    tableData.push([i, "X", "Element", (i % 18) + 1, Math.floor(i / 18) + 3]);
}

const scene = document.getElementById('scene');
const elements = [];

// Создание
tableData.forEach(data => {
    const el = document.createElement('div');
    el.className = 'element';
    el.innerHTML = `<div class="num">${data[0]}</div><div class="sym">${data[1]}</div><div class="name">${data[2]}</div>`;
    scene.appendChild(el);
    elements.push(el);
});

// Формулы расстановки
const pos = {
    table: (i) => ({
        x: (tableData[i][3] - 9.5) * 110,
        y: (tableData[i][4] - 4) * 140,
        z: 0, ry: 0
    }),
    sphere: (i) => {
        const phi = Math.acos(-1 + (2 * i) / elements.length);
        const theta = Math.sqrt(elements.length * Math.PI) * phi;
        return {
            x: 600 * Math.cos(theta) * Math.sin(phi),
            y: 600 * Math.sin(theta) * Math.sin(phi),
            z: 600 * Math.cos(phi),
            ry: theta * (180 / Math.PI) + 90
        };
    },
    helix: (i) => {
        const theta = i * 0.175 + Math.PI;
        return {
            x: 700 * Math.sin(theta),
            y: -(i * 10) + 500,
            z: 700 * Math.cos(theta),
            ry: theta * (180 / Math.PI)
        };
    },
    grid: (i) => ({
        x: ((i % 5) * 300) - 600,
        y: (-(Math.floor(i / 5) % 5) * 300) + 600,
        z: (Math.floor(i / 25)) * 800 - 1600,
        ry: 0
    })
};

function transform(type, btn) {
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    document.getElementById(btn).classList.add('active');

    elements.forEach((el, i) => {
        const target = pos[type](i);
        anime({
            targets: el,
            left: target.x,
            top: target.y,
            translateZ: target.z,
            rotateY: target.ry,
            duration: 2000,
            easing: 'easeInOutExpo',
            delay: i * 2
        });
    });
}

// Управление кнопками
document.getElementById('tableBtn').onclick = () => transform('table', 'tableBtn');
document.getElementById('sphereBtn').onclick = () => transform('sphere', 'sphereBtn');
document.getElementById('helixBtn').onclick = () => transform('helix', 'helixBtn');
document.getElementById('gridBtn').onclick = () => transform('grid', 'gridBtn');

// Вращение и зум
let rotX = 0, rotY = 0, zoom = -1500;
document.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) {
        rotY += e.movementX * 0.2;
        rotX -= e.movementY * 0.2;
        scene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
});

document.addEventListener('wheel', (e) => {
    zoom += e.deltaY * -1;
    // Ограничение, чтобы не улететь слишком далеко
    zoom = Math.min(-500, Math.max(-4000, zoom));
    document.getElementById('camera').style.transform = `translateZ(${zoom}px)`;
});

window.onload = () => transform('table', 'tableBtn');