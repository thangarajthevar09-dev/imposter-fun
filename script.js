/* =========================================================
   IMPOSTER FUN — FULL GAME LOGIC

   Features:
   1. Combined PASS PHONE + YOU ARE screen
   2. Random speaker spin wheel
   3. Prevent inactive screens from scrolling
   4. Multiple escaped imposters can select civilians
========================================================= */

"use strict";

/* =========================================================
   CATEGORY DATA
========================================================= */

const categories = [
    {
        name: "Food",
        icon: "🍕",
        words: [
            "Pizza",
            "Burger",
            "Sushi",
            "Biryani",
            "Dosa",
            "Pasta",
            "Tacos",
            "Ice Cream",
            "Noodles",
            "Sandwich",
            "Momos",
            "Fried Rice"
        ]
    },

    {
        name: "Movies",
        icon: "🎬",
        words: [
            "Avatar",
            "Titanic",
            "Inception",
            "Interstellar",
            "Dangal",
            "Joker",
            "Frozen",
            "The Matrix",
            "Avengers",
            "Harry Potter",
            "Jurassic Park",
            "The Lion King"
        ]
    },

    {
        name: "South Indian Movies",
        icon: "🎥",
        words: [
            "Baahubali",
            "RRR",
            "KGF",
            "Pushpa",
            "Kantara",
            "Leo",
            "Vikram",
            "Jailer",
            "Master",
            "Drishyam",
            "Eega",
            "Lucifer",
            "Premam",
            "Kumbalangi Nights",
            "Aavesham",
            "Manjummel Boys",
            "Arjun Reddy",
            "Jersey",
            "Rangasthalam",
            "Dasara"
        ]
    },

    {
        name: "IPL Teams",
        icon: "🏏",
        words: [
            "Chennai Super Kings",
            "Mumbai Indians",
            "Royal Challengers Bengaluru",
            "Kolkata Knight Riders",
            "Rajasthan Royals",
            "Sunrisers Hyderabad",
            "Delhi Capitals",
            "Punjab Kings",
            "Lucknow Super Giants",
            "Gujarat Titans"
        ]
    },

    {
        name: "Indian Food",
        icon: "🍛",
        words: [
            "Butter Chicken",
            "Biryani",
            "Pav Bhaji",
            "Chole Bhature",
            "Masala Dosa",
            "Idli",
            "Vada",
            "Samosa",
            "Pani Puri",
            "Rajma Chawal",
            "Palak Paneer",
            "Dal Makhani",
            "Pongal",
            "Parotta",
            "Chicken 65",
            "Fish Curry",
            "Gulab Jamun",
            "Jalebi",
            "Rasgulla",
            "Kheer"
        ]
    },

    {
        name: "Places",
        icon: "🌍",
        words: [
            "Beach",
            "Airport",
            "School",
            "Hospital",
            "Mall",
            "Temple",
            "Mountain",
            "Cinema",
            "Restaurant",
            "Hotel",
            "Park",
            "Railway Station"
        ]
    },

    {
        name: "Animals",
        icon: "🐯",
        words: [
            "Tiger",
            "Lion",
            "Elephant",
            "Dog",
            "Cat",
            "Monkey",
            "Giraffe",
            "Penguin",
            "Dolphin",
            "Horse",
            "Rabbit",
            "Crocodile"
        ]
    },

    {
        name: "Sports",
        icon: "⚽",
        words: [
            "Cricket",
            "Football",
            "Tennis",
            "Basketball",
            "Badminton",
            "Hockey",
            "Boxing",
            "Swimming",
            "Golf",
            "Volleyball",
            "Kabaddi",
            "Wrestling"
        ]
    },

    {
        name: "Everyday",
        icon: "🏠",
        words: [
            "Phone",
            "Laptop",
            "Bed",
            "Chair",
            "Mirror",
            "Toothbrush",
            "Umbrella",
            "Backpack",
            "Clock",
            "Shoes",
            "Television",
            "Keys"
        ]
    },

    {
        name: "Random",
        icon: "🎲",
        words: []
    }
];

/* =========================================================
   GAME STATE
========================================================= */

let players = [];
let selectedCategories = [];
let customCategory = null;

let imposterCount = 1;

let dareEnabled = null;
let dareText = "";

let secretWord = "";
let imposters = [];
let recentImposters = [];

let currentRevealIndex = 0;

let selectedVotes = [];
let voteRevealIndex = 0;

let result = null;
let randomSpeakingPlayer = null;

/*
   Stores all civilians selected for the dare.
   Example:
   1 escaped imposter -> [2]
   2 escaped imposters -> [2, 5]
   3 escaped imposters -> [1, 4, 6]
*/
let dareAssignedPlayers = [];

let wheelSpinning = false;

/* =========================================================
   DOM
========================================================= */

const $ = id => document.getElementById(id);

const screens = {
    home: $("homeScreen"),
    players: $("playersScreen"),
    category: $("categoryScreen"),
    imposter: $("imposterScreen"),
    dare: $("dareScreen"),
    ready: $("readyScreen"),
    reveal: $("revealScreen"),
    pass: $("passScreen"),
    discussion: $("discussionScreen"),
    voting: $("votingScreen"),
    voteReveal: $("voteRevealScreen"),
    result: $("resultScreen")
};

const startGameBtn = $("startGameBtn");

const playerNameInput = $("playerNameInput");
const addPlayerBtn = $("addPlayerBtn");
const playersList = $("playersList");
const playerCountText = $("playerCountText");
const playersContinueBtn = $("playersContinueBtn");
const playersBackBtn = $("playersBackBtn");

const categoryGrid = $("categoryGrid");
const categoryContinueBtn = $("categoryContinueBtn");
const categoryStatus = $("categoryStatus");
const categoryBackBtn = $("categoryBackBtn");

const customCategoryBtn = $("customCategoryBtn");
const customCategoryForm = $("customCategoryForm");
const customCategoryName = $("customCategoryName");
const customCategoryWords = $("customCategoryWords");

const imposterContinueBtn = $("imposterContinueBtn");
const imposterBackBtn = $("imposterBackBtn");
const imposterLimitText = $("imposterLimitText");

const dareYesBtn = $("dareYesBtn");
const dareNoBtn = $("dareNoBtn");
const dareInputContainer = $("dareInputContainer");
const dareInput = $("dareInput");
const dareStatus = $("dareStatus");
const startRoundBtn = $("startRoundBtn");
const dareBackBtn = $("dareBackBtn");

const nextRevealBtn = $("nextRevealBtn");
const goVotingBtn = $("goVotingBtn");
const submitVoteBtn = $("submitVoteBtn");
const playAgainBtn = $("playAgainBtn");
const newPlayersBtn = $("newPlayersBtn");
const pickRandomPlayerBtn = $("pickRandomPlayerBtn");

/* =========================================================
   SCREEN CONTROL
========================================================= */

function showScreen(screen) {

    Object.values(screens).forEach(s => {

        if (!s) return;

        s.classList.remove("active");
        s.setAttribute("aria-hidden", "true");
    });

    if (screen) {

        screen.classList.add("active");
        screen.setAttribute("aria-hidden", "false");
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    window.scrollTo(0, 0);
}

/* =========================================================
   HELPERS
========================================================= */

const randomItem = arr =>
    arr?.length
        ? arr[Math.floor(Math.random() * arr.length)]
        : null;


function shuffle(arr) {

    for (let i = arr.length - 1; i > 0; i--) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [arr[i], arr[j]] =
            [arr[j], arr[i]];
    }

    return arr;
}


function esc(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function maxImposters() {

    return Math.max(
        1,
        players.length - 1
    );
}


function categoryName() {

    return selectedCategories
        .map(c => c.name)
        .join(" + ");
}

/* =========================================================
   HOME
========================================================= */

startGameBtn?.addEventListener(
    "click",
    () => {

        renderPlayers();

        showScreen(
            screens.players
        );

        setTimeout(() => {

            playerNameInput?.focus();

        }, 100);
    }
);

/* =========================================================
   PLAYERS
========================================================= */

function addPlayer() {

    const name =
        playerNameInput?.value.trim();

    if (!name) {

        playerNameInput?.focus();

        return;
    }

    if (players.length >= 12) {

        alert(
            "You can have a maximum of 12 players."
        );

        return;
    }

    if (
        players.some(
            p =>
                p.toLowerCase() ===
                name.toLowerCase()
        )
    ) {

        alert(
            "That player is already added."
        );

        return;
    }

    players.push(name);

    playerNameInput.value = "";

    renderPlayers();

    playerNameInput.focus();
}


addPlayerBtn?.addEventListener(
    "click",
    addPlayer
);


playerNameInput?.addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {

            e.preventDefault();

            addPlayer();
        }
    }
);


function renderPlayers() {

    if (!playersList) return;

    playersList.innerHTML = "";

    players.forEach(
        (name, i) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "player-card";

            card.innerHTML = `
                <div class="avatar">
                    ${esc(
                        name[0].toUpperCase()
                    )}
                </div>

                <span>
                    ${esc(name)}
                </span>
            `;

            const edit =
                document.createElement(
                    "button"
                );

            edit.type = "button";
            edit.textContent = "EDIT";

            edit.addEventListener(
                "click",
                () => {
                    editPlayer(i);
                }
            );

            const remove =
                document.createElement(
                    "button"
                );

            remove.type = "button";
            remove.textContent = "×";
            remove.style.fontSize = "20px";

            remove.addEventListener(
                "click",
                () => {
                    removePlayer(i);
                }
            );

            card.append(
                edit,
                remove
            );

            playersList.appendChild(
                card
            );
        }
    );

    if (playerCountText) {

        playerCountText.textContent =
            `${players.length}/12 players`;
    }

    if (playersContinueBtn) {

        playersContinueBtn.disabled =
            players.length < 3;
    }

    updateImposterOptions();
}


function editPlayer(i) {

    const newName =
        prompt(
            "Edit player name:",
            players[i]
        );

    if (newName === null) return;

    const name =
        newName.trim();

    if (!name) return;

    if (
        players.some(
            (p, index) =>
                index !== i &&
                p.toLowerCase() ===
                name.toLowerCase()
        )
    ) {

        alert(
            "That player name already exists."
        );

        return;
    }

    players[i] = name;

    renderPlayers();
}


function removePlayer(i) {

    players.splice(i, 1);

    if (
        imposterCount >
        maxImposters()
    ) {

        imposterCount =
            maxImposters();
    }

    renderPlayers();
}


playersBackBtn?.addEventListener(
    "click",
    () => {

        showScreen(
            screens.home
        );
    }
);


playersContinueBtn?.addEventListener(
    "click",
    () => {

        if (players.length < 3) {

            alert(
                "You need at least 3 players."
            );

            return;
        }

        renderCategories();

        showScreen(
            screens.category
        );
    }
);

/* =========================================================
   CATEGORIES
========================================================= */

function renderCategories() {

    if (!categoryGrid) return;

    categoryGrid.innerHTML = "";

    categories.forEach(
        (cat, i) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "category-option";

            if (
                selectedCategories.some(
                    c =>
                        c.name ===
                        cat.name
                )
            ) {

                button.classList.add(
                    "selected"
                );
            }

            button.innerHTML = `
                <span class="category-icon">
                    ${cat.icon}
                </span>

                <span>
                    ${esc(cat.name)}
                </span>
            `;

            button.addEventListener(
                "click",
                () => {

                    selectCategory(i);
                }
            );

            categoryGrid.appendChild(
                button
            );
        }
    );

    if (
        customCategory?.words?.length
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.className =
            "category-option";

        if (
            selectedCategories.some(
                c =>
                    c.name ===
                    customCategory.name
            )
        ) {

            button.classList.add(
                "selected"
            );
        }

        button.innerHTML = `
            <span class="category-icon">
                ✨
            </span>

            <span>
                ${esc(
                    customCategory.name
                )}
            </span>
        `;

        button.addEventListener(
            "click",
            () => {

                toggleCategory(
                    customCategory
                );
            }
        );

        categoryGrid.appendChild(
            button
        );
    }

    updateCategoryUI();
}


function selectCategory(i) {

    const cat =
        categories[i];

    if (!cat) return;

    if (cat.name === "Random") {

        const available =
            categories.filter(
                c =>
                    c.name !== "Random" &&
                    c.words.length
            );

        selectedCategories = [
            randomItem(available)
        ];

        customCategory = null;

        renderCategories();

        return;
    }

    toggleCategory(cat);
}


function toggleCategory(cat) {

    const i =
        selectedCategories.findIndex(
            c =>
                c.name ===
                cat.name
        );

    if (i >= 0) {

        selectedCategories.splice(
            i,
            1
        );

    } else {

        selectedCategories.push(
            cat
        );
    }

    renderCategories();
}


customCategoryBtn?.addEventListener(
    "click",
    () => {

        customCategoryForm?.classList.toggle(
            "hidden"
        );

        if (
            customCategoryForm &&
            !customCategoryForm.classList.contains(
                "hidden"
            )
        ) {

            customCategoryName?.focus();
        }
    }
);


function updateCustomCategory() {

    if (
        !customCategoryName ||
        !customCategoryWords
    ) {

        return;
    }

    const name =
        customCategoryName.value.trim();

    const words =
        customCategoryWords.value
            .split(",")
            .map(
                w => w.trim()
            )
            .filter(Boolean);

    if (
        !name ||
        !words.length
    ) {

        return;
    }

    customCategory = {
        name,
        icon: "✨",
        words
    };

    const i =
        selectedCategories.findIndex(
            c =>
                c.name === name
        );

    if (i < 0) {

        selectedCategories.push(
            customCategory
        );

    } else {

        selectedCategories[i] =
            customCategory;
    }

    renderCategories();
}


customCategoryName?.addEventListener(
    "input",
    updateCustomCategory
);


customCategoryWords?.addEventListener(
    "input",
    updateCustomCategory
);


function updateCategoryUI() {

    if (!categoryStatus) return;

    if (!selectedCategories.length) {

        categoryStatus.textContent =
            "Choose at least one category";

        if (categoryContinueBtn) {

            categoryContinueBtn.disabled =
                true;
        }

        return;
    }

    categoryStatus.textContent =
        selectedCategories.length === 1
            ? `Category = ${selectedCategories[0].name}`
            : `${selectedCategories.length} categories selected`;

    if (categoryContinueBtn) {

        categoryContinueBtn.disabled =
            false;
    }
}


categoryBackBtn?.addEventListener(
    "click",
    () => {

        showScreen(
            screens.players
        );
    }
);


categoryContinueBtn?.addEventListener(
    "click",
    () => {

        if (!selectedCategories.length) {

            alert(
                "Please select at least one category."
            );

            return;
        }

        updateImposterOptions();

        showScreen(
            screens.imposter
        );
    }
);

/* =========================================================
   IMPOSTERS
========================================================= */

const imposterLabels = {

    1: "Lone Wolf",
    2: "Double Trouble",
    3: "Triple Threat",
    4: "Quad Squad",
    5: "Five Alive",
    6: "Chaos Crew",
    7: "Seven Sinners",
    8: "Eight Invaders",
    9: "Ultimate Chaos",
    10: "Total Mayhem",
    11: "Almost Everyone"
};


function updateImposterOptions() {

    if (!players.length) return;

    const max =
        maxImposters();

    if (
        imposterCount > max
    ) {

        imposterCount = max;
    }

    const container =
        document.querySelector(
            ".imposter-options"
        );

    if (!container) return;

    container.innerHTML = "";

    for (
        let n = 1;
        n <= max;
        n++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.className =
            "imposter-option";

        if (
            n === imposterCount
        ) {

            button.classList.add(
                "selected"
            );
        }

        button.innerHTML = `
            <strong>
                ${n}
            </strong>

            <span>
                ${
                    imposterLabels[n] ||
                    `${n} Imposters`
                }
            </span>
        `;

        button.addEventListener(
            "click",
            () => {

                imposterCount = n;

                updateImposterOptions();
            }
        );

        container.appendChild(
            button
        );
    }

    if (imposterLimitText) {

        imposterLimitText.textContent =
            `Maximum: ${max} imposter${
                max === 1 ? "" : "s"
            }`;
    }
}


imposterBackBtn?.addEventListener(
    "click",
    () => {

        showScreen(
            screens.category
        );
    }
);


imposterContinueBtn?.addEventListener(
    "click",
    () => {

        resetDare();

        showScreen(
            screens.dare
        );
    }
);

/* =========================================================
   DARE SETUP
========================================================= */

function resetDare() {

    dareEnabled = null;

    dareText = "";

    dareYesBtn?.classList.remove(
        "selected"
    );

    dareNoBtn?.classList.remove(
        "selected"
    );

    dareInputContainer?.classList.add(
        "hidden"
    );

    if (dareInput) {

        dareInput.value = "";
    }

    if (dareStatus) {

        dareStatus.textContent =
            "Choose YES or NO";
    }

    updateStartRound();
}


dareYesBtn?.addEventListener(
    "click",
    () => {

        dareEnabled = true;

        dareYesBtn.classList.add(
            "selected"
        );

        dareNoBtn?.classList.remove(
            "selected"
        );

        dareInputContainer?.classList.remove(
            "hidden"
        );

        if (dareStatus) {

            dareStatus.textContent =
                "Enter the dare below";
        }

        updateStartRound();
    }
);


dareNoBtn?.addEventListener(
    "click",
    () => {

        dareEnabled = false;

        dareText = "";

        dareNoBtn.classList.add(
            "selected"
        );

        dareYesBtn?.classList.remove(
            "selected"
        );

        dareInputContainer?.classList.add(
            "hidden"
        );

        if (dareInput) {

            dareInput.value = "";
        }

        if (dareStatus) {

            dareStatus.textContent =
                "No dare this round";
        }

        updateStartRound();
    }
);


dareInput?.addEventListener(
    "input",
    () => {

        dareText =
            dareInput.value.trim();

        updateStartRound();
    }
);


function updateStartRound() {

    if (!startRoundBtn) return;

    startRoundBtn.disabled =
        dareEnabled === null ||
        (
            dareEnabled &&
            !dareInput?.value.trim()
        );
}


dareBackBtn?.addEventListener(
    "click",
    () => {

        showScreen(
            screens.imposter
        );
    }
);

/* =========================================================
   START ROUND
========================================================= */

startRoundBtn?.addEventListener(
    "click",
    () => {

        if (dareEnabled === null) {

            alert(
                "Please choose YES or NO for the dare."
            );

            return;
        }

        if (
            dareEnabled &&
            !dareInput?.value.trim()
        ) {

            alert(
                "Please enter the dare."
            );

            dareInput?.focus();

            return;
        }

        dareText =
            dareEnabled
                ? dareInput.value.trim()
                : "";

        if (!prepareRound()) {
            return;
        }

        currentRevealIndex = 0;

        showPlayerIdentity();

        showScreen(
            screens.reveal
        );
    }
);

/* =========================================================
   PREPARE ROUND
========================================================= */

function prepareRound() {

    const words =
        selectedCategories.flatMap(
            c =>
                c.words || []
        );

    if (!words.length) {

        alert(
            "The selected categories contain no words."
        );

        return false;
    }

    secretWord =
        randomItem(words);

    imposters =
        chooseImposters();

    if (
        imposters.length !==
        imposterCount
    ) {

        alert(
            "Could not create the required number of imposters."
        );

        return false;
    }

    selectedVotes = [];

    voteRevealIndex = 0;

    result = null;

    randomSpeakingPlayer = null;

    dareAssignedPlayers = [];

    return true;
}


function chooseImposters() {

    const indexes =
        shuffle(
            players.map(
                (_, i) => i
            )
        );

    const fresh =
        indexes.filter(
            i =>
                !recentImposters.includes(
                    i
                )
        );

    const old =
        indexes.filter(
            i =>
                recentImposters.includes(
                    i
                )
        );

    const chosen =
        [
            ...fresh,
            ...old
        ].slice(
            0,
            imposterCount
        );

    recentImposters =
        [...chosen];

    return chosen;
}

/* =========================================================
   COMBINED PASS PHONE + PLAYER REVEAL
========================================================= */

function showPlayerIdentity() {

    const card =
        $("revealCard");

    if (!card) return;

    const player =
        players[
            currentRevealIndex
        ];

    const progress =
        (
            (currentRevealIndex + 1) /
            players.length
        ) * 100;

    if ($("revealProgressText")) {

        $("revealProgressText").textContent =
            `PLAYER ${
                currentRevealIndex + 1
            } OF ${
                players.length
            }`;
    }

    if ($("revealProgress")) {

        $("revealProgress").style.width =
            `${progress}%`;
    }

    card.className =
        "reveal-card";

    card.innerHTML = `
        <div class="reveal-icon">
            📱
        </div>

        <div class="secret-label">
            PASS THE PHONE TO
        </div>

        <p class="reveal-description">
            Make sure no one is watching you.
            Keep the phone hidden from other
            players before continuing.
        </p>

        <div class="pass-player-name">
            ${esc(player)}
        </div>

        <div class="reveal-divider"></div>

        <button
            class="primary-btn"
            id="showSecretBtn"
            type="button"
        >
            TAP TO REVEAL
        </button>
    `;

    $("showSecretBtn")?.addEventListener(
        "click",
        showCurrentSecret
    );
}

/* =========================================================
   SHOW SECRET
========================================================= */

function showCurrentSecret() {

    const card =
        $("revealCard");

    if (!card) return;

    const player =
        players[
            currentRevealIndex
        ];

    const imposter =
        imposters.includes(
            currentRevealIndex
        );

    card.className =
        "reveal-card";

    if (imposter) {

        card.classList.add(
            "danger"
        );

        card.innerHTML = `
            <div class="reveal-icon">
                🕵️
            </div>

            <div class="reveal-player">
                ${esc(player)}
            </div>

            <div class="role-badge danger-badge">
                IMPOSTER
            </div>

            <div class="role-title">
                You don't know the word.
            </div>

            <p class="reveal-description">
                Blend in. Give believable clues.
                Don't get caught.
            </p>

            <div class="category-lock">
                <span class="category-lock-label">
                    CATEGORY
                </span>

                <span class="category-lock-value">
                    ${esc(categoryName())}
                </span>
            </div>

            <div class="reveal-private">
                🔒 Keep this secret
            </div>

            <button
                class="primary-btn"
                id="hideRevealBtn"
                type="button"
            >
                HIDE & PASS →
            </button>
        `;

    } else {

        card.innerHTML = `
            <div class="reveal-icon">
                🔐
            </div>

            <div class="reveal-player">
                ${esc(player)}
            </div>

            <div class="role-badge safe-badge">
                CIVILIAN
            </div>

            <div class="secret-label">
                THE SECRET WORD IS
            </div>

            <div class="secret-word">
                ${esc(secretWord)}
            </div>

            <p class="reveal-description">
                Remember it. Don't show anyone.
            </p>

            <div class="category-lock">
                <span class="category-lock-label">
                    CATEGORY
                </span>

                <span class="category-lock-value">
                    ${esc(categoryName())}
                </span>
            </div>

            <div class="reveal-private">
                🔒 Keep this secret
            </div>

            <button
                class="primary-btn"
                id="hideRevealBtn"
                type="button"
            >
                HIDE & PASS →
            </button>
        `;
    }

    $("hideRevealBtn")?.addEventListener(
        "click",
        finishReveal
    );
}

/* =========================================================
   FINISH PLAYER REVEAL
========================================================= */

function finishReveal() {

    if (
        currentRevealIndex >=
        players.length - 1
    ) {

        showDiscussion();

        return;
    }

    currentRevealIndex++;

    showPlayerIdentity();

    showScreen(
        screens.reveal
    );
}

/* =========================================================
   OLD PASS SCREEN DISABLED
========================================================= */

nextRevealBtn?.addEventListener(
    "click",
    e => {

        e.preventDefault();

        showPlayerIdentity();

        showScreen(
            screens.reveal
        );
    }
);

/* =========================================================
   DISCUSSION + SPIN WHEEL
========================================================= */

function showDiscussion() {

    randomSpeakingPlayer = null;

    wheelSpinning = false;

    const box =
        $("randomPlayerBox");

    if (box) {

        box.innerHTML = `
            <div class="wheel-display">
                🎡
            </div>

            <strong>
                Spin to choose a random player
            </strong>
        `;
    }

    if (pickRandomPlayerBtn) {

        pickRandomPlayerBtn.disabled =
            false;

        pickRandomPlayerBtn.textContent =
            "🎡 SPIN THE WHEEL";
    }

    showScreen(
        screens.discussion
    );
}


pickRandomPlayerBtn?.addEventListener(
    "click",
    () => {

        if (
            wheelSpinning ||
            !players.length
        ) {

            return;
        }

        wheelSpinning = true;

        pickRandomPlayerBtn.disabled =
            true;

        pickRandomPlayerBtn.textContent =
            "🎡 SPINNING...";

        const box =
            $("randomPlayerBox");

        let step = 0;

        const totalSteps =
            18 +
            Math.floor(
                Math.random() * 12
            );

        const interval =
            setInterval(
                () => {

                    const preview =
                        players[
                            step %
                            players.length
                        ];

                    if (box) {

                        box.innerHTML = `
                            <div class="wheel-display">
                                🎡
                            </div>

                            <strong>
                                ${esc(preview)}
                            </strong>
                        `;
                    }

                    step++;

                    if (
                        step >=
                        totalSteps
                    ) {

                        clearInterval(
                            interval
                        );

                        randomSpeakingPlayer =
                            randomItem(
                                players
                            );

                        if (box) {

                            box.innerHTML = `
                                <div class="wheel-display">
                                    🎤
                                </div>

                                <strong>
                                    ${esc(
                                        randomSpeakingPlayer
                                    )}
                                </strong>

                                <span>
                                    speaks first!
                                </span>
                            `;
                        }

                        pickRandomPlayerBtn.disabled =
                            false;

                        pickRandomPlayerBtn.textContent =
                            "🎡 SPIN AGAIN";

                        wheelSpinning =
                            false;
                    }

                },
                80
            );
    }
);

/* =========================================================
   GO TO VOTING
========================================================= */

goVotingBtn?.addEventListener(
    "click",
    () => {

        selectedVotes = [];

        renderVoting();

        showScreen(
            screens.voting
        );
    }
);

/* =========================================================
   VOTING
========================================================= */

function renderVoting() {

    if ($("requiredVoteCount")) {

        $("requiredVoteCount").textContent =
            String(imposterCount);
    }

    const list =
        $("voteList");

    if (!list) return;

    list.innerHTML = "";

    players.forEach(
        (player, i) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "vote-card";

            const selected =
                selectedVotes.includes(i);

            if (selected) {

                button.classList.add(
                    "selected"
                );
            }

            button.innerHTML = `
                <span class="avatar">
                    ${esc(
                        player[0].toUpperCase()
                    )}
                </span>

                <span>
                    ${esc(player)}
                </span>

                <span class="vote-check">
                    ${
                        selected
                            ? "✓"
                            : ""
                    }
                </span>
            `;

            button.addEventListener(
                "click",
                () => {

                    toggleVote(i);
                }
            );

            list.appendChild(
                button
            );
        }
    );

    updateVoteCounter();
}


function toggleVote(i) {

    if (
        selectedVotes.includes(i)
    ) {

        selectedVotes =
            selectedVotes.filter(
                v =>
                    v !== i
            );

    } else {

        if (
            selectedVotes.length >=
            imposterCount
        ) {

            return;
        }

        selectedVotes.push(i);
    }

    renderVoting();
}


function updateVoteCounter() {

    const count =
        selectedVotes.length;

    if ($("voteCounter")) {

        $("voteCounter").textContent =
            `${count} / ${imposterCount}`;
    }

    if ($("submitVoteBtn")) {

        $("submitVoteBtn").disabled =
            count !== imposterCount;
    }

    if ($("voteStatus")) {

        $("voteStatus").textContent =
            count === imposterCount
                ? "Ready to reveal."
                : `Choose ${
                    imposterCount
                } player${
                    imposterCount === 1
                        ? ""
                        : "s"
                }.`;
    }
}


submitVoteBtn?.addEventListener(
    "click",
    () => {

        if (
            selectedVotes.length !==
            imposterCount
        ) {

            return;
        }

        voteRevealIndex = 0;

        renderVoteReveal();

        showScreen(
            screens.voteReveal
        );
    }
);

/* =========================================================
   VOTE REVEAL
========================================================= */

function renderVoteReveal() {

    const selectedIndex =
        selectedVotes[
            voteRevealIndex
        ];

    const player =
        players[selectedIndex];

    const actualImposter =
        imposters.includes(
            selectedIndex
        );

    const progress =
        (
            (voteRevealIndex + 1) /
            selectedVotes.length
        ) * 100;

    if ($("voteRevealProgressText")) {

        $("voteRevealProgressText").textContent =
            `REVEAL ${
                voteRevealIndex + 1
            } OF ${
                selectedVotes.length
            }`;
    }

    if ($("voteRevealProgress")) {

        $("voteRevealProgress").style.width =
            `${progress}%`;
    }

    const card =
        $("voteRevealCard");

    if (!card) return;

    card.className =
        "reveal-card";

    if (actualImposter) {

        card.classList.add(
            "danger"
        );

        card.innerHTML = `
            <div class="reveal-icon">
                🕵️
            </div>

            <div class="reveal-player">
                ${esc(player)}
            </div>

            <div class="role-badge danger-badge">
                ACTUAL IMPOSTER
            </div>

            <div class="role-title">
                Correct vote!
            </div>

            <p class="reveal-description">
                This player really was an imposter.
            </p>

            <button
                class="primary-btn"
                id="nextVoteRevealBtn"
                type="button"
            >
                CONTINUE →
            </button>
        `;

    } else {

        card.innerHTML = `
            <div class="reveal-icon">
                ❌
            </div>

            <div class="reveal-player">
                ${esc(player)}
            </div>

            <div class="role-badge safe-badge">
                CIVILIAN
            </div>

            <div class="role-title">
                Wrong vote.
            </div>

            <p class="reveal-description">
                This player was not an imposter.
            </p>

            <button
                class="primary-btn"
                id="nextVoteRevealBtn"
                type="button"
            >
                CONTINUE →
            </button>
        `;
    }

    $("nextVoteRevealBtn")?.addEventListener(
        "click",
        nextVoteReveal
    );
}


function nextVoteReveal() {

    if (
        voteRevealIndex >=
        selectedVotes.length - 1
    ) {

        calculateResult();

        showScreen(
            screens.result
        );

        return;
    }

    voteRevealIndex++;

    renderVoteReveal();
}

/* =========================================================
   RESULT
========================================================= */

function calculateResult() {

    const caught =
        selectedVotes.filter(
            i =>
                imposters.includes(i)
        ).length;

    result = {

        caught,

        allCaught:
            caught ===
            imposters.length
    };

    renderResult();
}


function renderResult() {

    const {
        caught,
        allCaught
    } = result;

    if (allCaught) {

        if ($("resultIcon")) {

            $("resultIcon").className =
                "result-icon caught";

            $("resultIcon").textContent =
                "✓";
        }

        if ($("resultEyebrow")) {

            $("resultEyebrow").textContent =
                "ROUND WON";
        }

        if ($("resultTitle")) {

            $("resultTitle").textContent =
                "IMPOSTERS CAUGHT!";
        }

        if ($("resultDescription")) {

            $("resultDescription").textContent =
                "The group successfully identified every imposter.";
        }

    } else {

        if ($("resultIcon")) {

            $("resultIcon").className =
                "result-icon escaped";

            $("resultIcon").textContent =
                "✕";
        }

        if ($("resultEyebrow")) {

            $("resultEyebrow").textContent =
                "IMPOSTERS ESCAPED";
        }

        if ($("resultTitle")) {

            $("resultTitle").textContent =
                "THEY GOT AWAY!";
        }

        if ($("resultDescription")) {

            $("resultDescription").textContent =
                `${caught} of ${imposters.length} imposters were caught.`;
        }
    }

    renderActualImposters();

    renderDareResult();
}


function renderActualImposters() {

    const list =
        $("actualImpostersList");

    if (!list) return;

    list.innerHTML = "";

    imposters.forEach(
        i => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "final-player actual";

            const caught =
                selectedVotes.includes(i);

            div.innerHTML = `
                <span class="avatar">
                    ${esc(
                        players[i][0]
                            .toUpperCase()
                    )}
                </span>

                <span class="final-player-name">
                    ${esc(players[i])}
                </span>

                ${
                    caught
                        ? `
                            <span class="correct-mark">
                                CAUGHT ✓
                            </span>
                        `
                        : `
                            <span class="miss-mark">
                                ESCAPED ✕
                            </span>
                        `
                }
            `;

            list.appendChild(
                div
            );
        }
    );
}

/* =========================================================
   DARE RESULT
========================================================= */

function renderDareResult() {

    const box =
        $("dareResult");

    const assignment =
        $("dareAssignment");

    if (!box) return;

    if (!dareText) {

        box.classList.add(
            "hidden"
        );

        assignment?.classList.add(
            "hidden"
        );

        return;
    }

    box.classList.remove(
        "hidden"
    );

    if ($("dareResultMessage")) {

        $("dareResultMessage").textContent =
            result.allCaught
                ? "The caught imposter must do this dare:"
                : "The escaped imposters must each select a civilian to do this dare:";
    }

    if ($("finalDare")) {

        $("finalDare").textContent =
            dareText;
    }

    if (result.allCaught) {

        dareAssignedPlayers = [];

        const caughtImposter =
            getCaughtImposter();

        if (
            caughtImposter !== null &&
            caughtImposter !== undefined
        ) {

            dareAssignedPlayers.push(
                caughtImposter
            );
        }

        assignment?.classList.add(
            "hidden"
        );

    } else {

        showCivilianAssignment();
    }
}


function getCaughtImposter() {

    const caught =
        imposters.filter(
            i =>
                selectedVotes.includes(i)
        );

    return randomItem(
        caught
    );
}

/* =========================================================
   CIVILIAN DARE
========================================================= */

function showCivilianAssignment() {

    const assignment =
        $("dareAssignment");

    const list =
        $("civilianList");

    const message =
        $("assignedDareMessage");

    if (
        !assignment ||
        !list
    ) {

        return;
    }

    assignment.classList.remove(
        "hidden"
    );

    list.innerHTML = "";

    message?.classList.add(
        "hidden"
    );

    dareAssignedPlayers = [];

    /*
       IMPORTANT:
       Only ESCAPED imposters count.

       Example:

       2 total imposters
       2 escaped
       -> 2 civilians required

       2 total imposters
       1 escaped
       -> 1 civilian required
    */

    const escapedImposters =
        imposters.filter(
            i =>
                !selectedVotes.includes(i)
        );

    const requiredSelections =
        escapedImposters.length;

    const civilians =
        shuffle(
            players
                .map(
                    (_, i) => i
                )
                .filter(
                    i =>
                        !imposters.includes(
                            i
                        )
                )
        );

    civilians.forEach(
        i => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "vote-card";

            button.innerHTML = `
                <span class="avatar">
                    ${esc(
                        players[i][0]
                            .toUpperCase()
                    )}
                </span>

                <span>
                    ${esc(players[i])}
                </span>

                <span>
                    🎯
                </span>
            `;

            button.addEventListener(
                "click",
                () => {

                    assignDare(
                        i,
                        button,
                        requiredSelections
                    );
                }
            );

            list.appendChild(
                button
            );
        }
    );

    if (message) {

        message.classList.remove(
            "hidden"
        );

        message.innerHTML = `
            🎯 Select
            <strong>
                ${requiredSelections}
            </strong>
            civilian${
                requiredSelections > 1
                    ? "s"
                    : ""
            }
            for the dare.
        `;
    }
}


function assignDare(
    i,
    button,
    requiredSelections
) {

    const list =
        $("civilianList");

    const message =
        $("assignedDareMessage");

    /*
       Safety check:
       An imposter can never receive this
       civilian dare.
    */

    if (
        imposters.includes(i)
    ) {

        alert(
            "An imposter cannot be selected. Choose a civilian."
        );

        return;
    }

    /*
       Prevent the same civilian from
       being selected twice.
    */

    if (
        dareAssignedPlayers.includes(i)
    ) {

        return;
    }

    /*
       Prevent selecting more civilians
       than the number of escaped imposters.
    */

    if (
        dareAssignedPlayers.length >=
        requiredSelections
    ) {

        return;
    }

    /*
       Add selected civilian.
    */

    dareAssignedPlayers.push(i);

    /*
       Mark selected button.
    */

    if (button) {

        button.classList.add(
            "selected"
        );

        button.innerHTML = `
            <span class="avatar">
                ${esc(
                    players[i][0]
                        .toUpperCase()
                )}
            </span>

            <span>
                ${esc(players[i])}
            </span>

            <span>
                ✓
            </span>
        `;
    }

    /*
       Update progress.
    */

    if (message) {

        message.classList.remove(
            "hidden"
        );

        message.innerHTML = `
            🎯
            <strong>
                ${dareAssignedPlayers.length}
                / ${requiredSelections}
            </strong>
            civilians selected.
        `;
    }

    /*
       All required civilians selected.
    */

    if (
        dareAssignedPlayers.length ===
        requiredSelections
    ) {

        const selectedNames =
            dareAssignedPlayers
                .map(
                    i =>
                        esc(
                            players[i]
                        )
                )
                .join(", ");

        const verb =
            requiredSelections > 1
                ? "have been chosen"
                : "has been chosen";

        if (list) {

            list.innerHTML = `
                <div class="assigned-dare-message">
                    🎯

                    <strong>
                        ${selectedNames}
                    </strong>

                    must do the dare!
                </div>
            `;
        }

        if (message) {

            message.classList.remove(
                "hidden"
            );

            message.innerHTML = `
                🎯

                <strong>
                    ${selectedNames}
                </strong>

                ${verb}
                for the dare!
            `;
        }
    }
}

/* =========================================================
   PLAY AGAIN
========================================================= */

playAgainBtn?.addEventListener(
    "click",
    () => {

        selectedVotes = [];

        voteRevealIndex = 0;

        result = null;

        secretWord = "";

        imposters = [];

        currentRevealIndex = 0;

        randomSpeakingPlayer = null;

        dareAssignedPlayers = [];

        resetDare();

        renderCategories();

        showScreen(
            screens.category
        );
    }
);

/* =========================================================
   NEW PLAYERS
========================================================= */

newPlayersBtn?.addEventListener(
    "click",
    () => {

        players = [];

        selectedCategories = [];

        customCategory = null;

        imposterCount = 1;

        dareEnabled = null;

        dareText = "";

        secretWord = "";

        imposters = [];

        recentImposters = [];

        currentRevealIndex = 0;

        selectedVotes = [];

        voteRevealIndex = 0;

        result = null;

        randomSpeakingPlayer = null;

        dareAssignedPlayers = [];

        wheelSpinning = false;

        resetDare();

        renderPlayers();

        renderCategories();

        updateImposterOptions();

        showScreen(
            screens.players
        );
    }
);

/* =========================================================
   INITIALIZE
========================================================= */

function initializeGame() {

    players = [];

    selectedCategories = [];

    customCategory = null;

    imposterCount = 1;

    dareEnabled = null;

    dareText = "";

    secretWord = "";

    imposters = [];

    recentImposters = [];

    currentRevealIndex = 0;

    selectedVotes = [];

    voteRevealIndex = 0;

    result = null;

    randomSpeakingPlayer = null;

    dareAssignedPlayers = [];

    wheelSpinning = false;

    renderPlayers();

    renderCategories();

    updateImposterOptions();

    updateStartRound();

    showScreen(
        screens.home
    );
}

initializeGame();