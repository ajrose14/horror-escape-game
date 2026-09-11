const game = {
    currentRoom: 'entrance',
    inventory: [],
    discovered: {
        entrance: false,
        bedroom: false,
        basement: false,
        outside: false
    },
    puzzles: {
        door: false,
        safe: false,
        ritual: false
    },
    rooms: {
        entrance: {
            name: '🚪 Dark Entrance',
            description: 'You wake up in a cold, dark entrance hall. A thick fog surrounds you. The air smells of decay. Above you, a rusted chandelier creaks. To your left is a locked bedroom door. To your right, stairs lead down into darkness.',
            exits: ['bedroom', 'basement'],
            items: ['rusty_key', 'flashlight']
        },
        bedroom: {
            name: '🛏️ Creepy Bedroom',
            description: 'A dusty bedroom with peeling wallpaper. Grotesque shadows dance on the walls. A broken mirror reflects nothing. There\'s a locked safe on the wall, and a strange symbol carved into the wooden floor.',
            exits: ['entrance', 'basement'],
            items: ['safe_key', 'note'],
            puzzle: 'safe'
        },
        basement: {
            name: '⚰️ Haunted Basement',
            description: 'A cold, damp basement filled with cobwebs. Candles flicker mysteriously. In the center is an ancient ritual circle. You see a skeleton\'s hand reaching from a coffin.',
            exits: ['entrance', 'bedroom'],
            items: ['ritual_book', 'ancient_coin'],
            puzzle: 'ritual'
        },
        outside: {
            name: '🌙 Outside - Freedom!',
            description: '<span class="success">You burst through the front door and escape into the night! The mansion crumbles behind you. You are FREE!</span>',
            exits: [],
            items: []
        }
    }
};

function init() {
    updateDisplay();
}

function updateDisplay() {
    displayRoom();
    displayInventory();
    displayButtons();
}

function displayRoom() {
    const room = game.rooms[game.currentRoom];
    let html = `<h2>${room.name}</h2>`;
    html += `<p>${room.description}</p>`;
    
    if (room.items.length > 0 && !game.discovered[game.currentRoom]) {
        html += `<p style="color: #ffaa00;">📦 You see some items here...</p>`;
    }
    
    document.getElementById('room').innerHTML = html;
}

function displayInventory() {
    const itemsDiv = document.getElementById('items');
    if (game.inventory.length === 0) {
        itemsDiv.innerHTML = '<p style="color: #666;">Empty</p>';
    } else {
        itemsDiv.innerHTML = game.inventory.map(item => `<div class="item">• ${formatName(item)}</div>`).join('');
    }
}

function displayButtons() {
    const buttonsDiv = document.getElementById('buttons');
    let html = '';
    
    const room = game.rooms[game.currentRoom];
    
    // Explore button
    if (!game.discovered[game.currentRoom] && room.items.length > 0) {
        html += '<button onclick="explore()">🔍 Explore Room</button>';
    }
    
    // Puzzle buttons
    if (room.puzzle === 'safe' && game.puzzles.safe === false && game.inventory.includes('safe_key')) {
        html += '<button onclick="solveSafe()">🔓 Open Safe</button>';
    }
    
    if (room.puzzle === 'ritual' && game.puzzles.ritual === false && game.inventory.includes('ritual_book')) {
        html += '<button onclick="solveRitual()">📖 Perform Ritual</button>';
    }
    
    // Exit buttons
    room.exits.forEach(exit => {
        const exitRoom = game.rooms[exit];
        html += `<button onclick="goToRoom('${exit}')">→ Go to ${exitRoom.name}</button>`;
    });
    
    // Escape button (only if all puzzles solved)
    if (game.currentRoom === 'entrance' && game.puzzles.safe && game.puzzles.ritual) {
        html += '<button onclick="escape()" style="background-color: #00aa00; border: 2px solid #00ff00;">🚪 ESCAPE!</button>';
    }
    
    buttonsDiv.innerHTML = html;
}

function explore() {
    game.discovered[game.currentRoom] = true;
    const room = game.rooms[game.currentRoom];
    const outputDiv = document.getElementById('output');
    
    let html = '<p class="success">✓ You found:</p>';
    room.items.forEach(item => {
        game.inventory.push(item);
        html += `<p class="success">• ${formatName(item)}</p>`;
    });
    
    outputDiv.innerHTML = html;
    updateDisplay();
}

function solveSafe() {
    game.puzzles.safe = true;
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
        <p class="success">✓ You unlock the safe with a CLICK...</p>
        <p>Inside, you find a mysterious glowing amulet. It resonates with dark energy. One puzzle solved...</p>
    `;
    game.inventory = game.inventory.filter(item => item !== 'safe_key');
    game.inventory.push('amulet');
    updateDisplay();
}

function solveRitual() {
    game.puzzles.ritual = true;
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
        <p class="success">✓ You perform the ancient ritual...</p>
        <p>The candles flare up! The skeleton's grip loosens. The circle glows red. The curse is broken!</p>
        <p class="success">Two puzzles solved. You can now ESCAPE!</p>
    `;
    game.inventory = game.inventory.filter(item => item !== 'ritual_book');
    updateDisplay();
}

function goToRoom(roomName) {
    game.currentRoom = roomName;
    document.getElementById('output').innerHTML = '';
    updateDisplay();
}

function escape() {
    if (game.puzzles.safe && game.puzzles.ritual) {
        game.currentRoom = 'outside';
        document.getElementById('output').innerHTML = '<p class="success">🎉 CONGRATULATIONS! YOU ESCAPED! 🎉</p>';
        const buttonsDiv = document.getElementById('buttons');
        buttonsDiv.innerHTML = '<button onclick="init()">🔄 Play Again</button>';
        updateDisplay();
    }
}

function formatName(item) {
    return item.replace(/_/g, ' ').toUpperCase();
}

// Start the game
init();