/* =========================================================
   IMPOSTER FUN — COMPLETE GAME LOGIC
   =========================================================
   FLOW:
   HOME
   → PLAYERS
   → CATEGORY
   → IMPOSTER COUNT
   → DARE
   → PRIVATE PLAYER REVEAL
   → DISCUSSION + RANDOM WHEEL
   → VOTING
   → VOTE REVEAL
   → RESULT
   → DARE ASSIGNMENT

   DARE RULES:
   ✓ All caught imposters must do the dare
   ✓ Every escaped imposter chooses one civilian
   ✓ Escaped imposters themselves do NOT do the dare
   ✓ No civilian can be selected twice
   ✓ Final dare message combines:
       CAUGHT IMPOSTERS + SELECTED CIVILIANS
   ✓ Final dare message stays visible
   ✓ Result list clearly shows EVERYONE who must do the dare
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

let dareAssignedPlayers = [];

let finalDarePlayers = [];

let wheelSpinning = false;

/* =========================================================
   DOM HELPERS
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

    Object.values(screens).forEach(screenElement => {

        if (!screenElement) return;

        screenElement.classList.remove("active");
        screenElement.setAttribute("aria-hidden", "true");
    });

    if (!screen) return;

    screen.classList.add("active");
    screen.setAttribute("aria-hidden", "false");

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });
}

/* =========================================================
   HELPERS
========================================================= */

function randomItem(array) {

    if (!array || !array.length) {
        return null;
    }

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];
    }

    return copy;
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
        .map(category => category.name)
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

    const duplicate =
        players.some(
            player =>
                player.toLowerCase() ===
                name.toLowerCase()
        );

    if (duplicate) {

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
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            addPlayer();
        }
    }
);

function renderPlayers() {

    if (!playersList) return;

    playersList.innerHTML = "";

    players.forEach(
        (name, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "player-card";

            card.innerHTML = `
                <div class="avatar">
                    ${esc(
                        name.charAt(0).toUpperCase()
                    )}
                </div>

                <span>
                    ${esc(name)}
                </span>
            `;

            const editButton =
                document.createElement(
                    "button"
                );

            editButton.type = "button";
            editButton.textContent = "EDIT";

            editButton.addEventListener(
                "click",
                () => editPlayer(index)
            );

            const removeButton =
                document.createElement(
                    "button"
                );

            removeButton.type = "button";
            removeButton.textContent = "×";
            removeButton.style.fontSize = "20px";

            removeButton.addEventListener(
                "click",
                () => removePlayer(index)
            );

            card.append(
                editButton,
                removeButton
            );

            playersList.appendChild(card);
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

function editPlayer(index) {

    const oldName =
        players[index];

    const edited =
        prompt(
            "Edit player name:",
            oldName
        );

    if (edited === null) return;

    const name =
        edited.trim();

    if (!name) return;

    const duplicate =
        players.some(
            (player, i) =>
                i !== index &&
                player.toLowerCase() ===
                name.toLowerCase()
        );

    if (duplicate) {

        alert(
            "That player name already exists."
        );

        return;
    }

    players[index] = name;

    renderPlayers();
}

function removePlayer(index) {

    players.splice(index, 1);

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
   CATEGORY
========================================================= */

function renderCategories() {

    if (!categoryGrid) return;

    categoryGrid.innerHTML = "";

    categories.forEach(
        (category, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "category-option";

            const selected =
                selectedCategories.some(
                    item =>
                        item.name ===
                        category.name
                );

            if (selected) {

                button.classList.add(
                    "selected"
                );
            }

            button.innerHTML = `
                <span class="category-icon">
                    ${category.icon}
                </span>

                <span>
                    ${esc(category.name)}
                </span>
            `;

            button.addEventListener(
                "click",
                () => {

                    selectCategory(index);
                }
            );

            categoryGrid.appendChild(button);
        }
    );

    if (
        customCategory &&
        customCategory.words &&
        customCategory.words.length
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.className =
            "category-option";

        const selected =
            selectedCategories.some(
                category =>
                    category.name ===
                    customCategory.name
            );

        if (selected) {

            button.classList.add(
                "selected"
            );
        }

        button.innerHTML = `
            <span class="category-icon">
                ✨
            </span>

            <span>
                ${esc(customCategory.name)}
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

        categoryGrid.appendChild(button);
    }

    updateCategoryUI();
}

function selectCategory(index) {

    const category =
        categories[index];

    if (!category) return;

    if (category.name === "Random") {

        const available =
            categories.filter(
                item =>
                    item.name !== "Random" &&
                    item.words.length > 0
            );

        const randomCategory =
            randomItem(available);

        if (!randomCategory) return;

        selectedCategories = [
            randomCategory
        ];

        renderCategories();

        return;
    }

    toggleCategory(category);
}

function toggleCategory(category) {

    const index =
        selectedCategories.findIndex(
            item =>
                item.name ===
                category.name
        );

    if (index >= 0) {

        selectedCategories.splice(
            index,
            1
        );

    } else {

        selectedCategories.push(
            category
        );
    }

    renderCategories();
}

/* =========================================================
   CUSTOM CATEGORY
========================================================= */

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
            .map(word => word.trim())
            .filter(Boolean);

    if (!name || !words.length) {

        return;
    }

    customCategory = {
        name,
        icon: "✨",
        words
    };

    const existingIndex =
        selectedCategories.findIndex(
            category =>
                category.name === name
        );

    if (existingIndex >= 0) {

        selectedCategories[
            existingIndex
        ] = customCategory;

    } else {

        selectedCategories.push(
            customCategory
        );
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

/* =========================================================
   CATEGORY UI
========================================================= */

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
   IMPOSTER SETUP
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

    const maximum =
        maxImposters();

    if (
        imposterCount >
        maximum
    ) {

        imposterCount =
            maximum;
    }

    const container =
        document.querySelector(
            ".imposter-options"
        );

    if (!container) return;

    container.innerHTML = "";

    for (
        let count = 1;
        count <= maximum;
        count++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.className =
            "imposter-option";

        if (
            count ===
            imposterCount
        ) {

            button.classList.add(
                "selected"
            );
        }

        button.innerHTML = `
            <strong>
                ${count}
            </strong>

            <span>
                ${
                    imposterLabels[count] ||
                    `${count} Imposters`
                }
            </span>
        `;

        button.addEventListener(
            "click",
            () => {

                imposterCount =
                    count;

                updateImposterOptions();
            }
        );

        container.appendChild(
            button
        );
    }

    if (imposterLimitText) {

        imposterLimitText.textContent =
            `Maximum: ${maximum} imposter${
                maximum === 1
                    ? ""
                    : "s"
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

    const valid =
        dareEnabled !== null &&
        (
            !dareEnabled ||
            Boolean(
                dareInput?.value.trim()
            )
        );

    startRoundBtn.disabled =
        !valid;
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

        showScreen(
            screens.reveal
        );

        showPlayerIdentity();
    }
);

/* =========================================================
   PREPARE ROUND
========================================================= */

function prepareRound() {

    const words =
        selectedCategories.flatMap(
            category =>
                category.words || []
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

    finalDarePlayers = [];

    return true;
}

/* =========================================================
   CHOOSE IMPOSTERS
========================================================= */

function chooseImposters() {

    const indexes =
        shuffle(
            players.map(
                (_, index) => index
            )
        );

    const fresh =
        indexes.filter(
            index =>
                !recentImposters.includes(
                    index
                )
        );

    const previous =
        indexes.filter(
            index =>
                recentImposters.includes(
                    index
                )
        );

    const chosen =
        [
            ...fresh,
            ...previous
        ].slice(
            0,
            imposterCount
        );

    recentImposters =
        [...chosen];

    return chosen;
}

/* =========================================================
   PRIVATE PLAYER REVEAL
========================================================= */

function showPlayerIdentity() {

    const card =
        $("revealCard");

    if (!card) return;

    const player =
        players[currentRevealIndex];

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
        players[currentRevealIndex];

    const isImposter =
        imposters.includes(
            currentRevealIndex
        );

    card.className =
        "reveal-card";

    if (isImposter) {

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
   FINISH REVEAL
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

nextRevealBtn?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        showPlayerIdentity();

        showScreen(
            screens.reveal
        );
    }
);

/* =========================================================
   DISCUSSION
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

/* =========================================================
   RANDOM SPEAKER WHEEL
========================================================= */

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

        const finalPlayer =
            randomItem(players);

        const interval =
            setInterval(
                () => {

                    const previewIndex =
                        step %
                        players.length;

                    const preview =
                        players[
                            previewIndex
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
                            finalPlayer;

                        if (box) {

                            box.innerHTML = `
                                <div class="wheel-display">
                                    🎤
                                </div>

                                <strong>
                                    ${esc(
                                        finalPlayer
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
        (player, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "vote-card";

            const selected =
                selectedVotes.includes(
                    index
                );

            if (selected) {

                button.classList.add(
                    "selected"
                );
            }

            button.innerHTML = `
                <span class="avatar">
                    ${esc(
                        player.charAt(0)
                            .toUpperCase()
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

                    toggleVote(index);
                }
            );

            list.appendChild(button);
        }
    );

    updateVoteCounter();
}

function toggleVote(index) {

    if (
        selectedVotes.includes(index)
    ) {

        selectedVotes =
            selectedVotes.filter(
                value =>
                    value !== index
            );

    } else {

        if (
            selectedVotes.length >=
            imposterCount
        ) {

            return;
        }

        selectedVotes.push(index);
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

/* =========================================================
   SUBMIT VOTE
========================================================= */

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

    const caughtImposters =
        imposters.filter(
            index =>
                selectedVotes.includes(index)
        );

    const escapedImposters =
        imposters.filter(
            index =>
                !selectedVotes.includes(index)
        );

    result = {

        caught,

        escaped:
            escapedImposters.length,

        caughtImposters,

        escapedImposters,

        allCaught:
            caught ===
            imposters.length
    };

    /*
       IMPORTANT:
       At this stage ONLY caught imposters
       are guaranteed to do the dare.

       Escaped imposters will add civilians
       later when they select them.
    */

    finalDarePlayers =
        [...caughtImposters];

    dareAssignedPlayers = [];

    renderResult();
}

function renderResult() {

    if (!result) return;

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
/* =========================================================
   ACTUAL IMPOSTERS
========================================================= */

function renderActualImposters() {

    const list =
        $("actualImpostersList");

    if (!list) return;

    list.innerHTML = "";

    if (!imposters.length) {

        list.innerHTML = `
            <div class="final-player">
                No imposters found.
            </div>
        `;

        return;
    }

    imposters.forEach(
        index => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "final-player actual";

            div.innerHTML = `
                <span class="avatar">
                    ${esc(
                        players[index][0]
                            .toUpperCase()
                    )}
                </span>

                <span class="final-player-name">
                    ${esc(players[index])}
                </span>
            `;

            list.appendChild(div);
        }
    );

    renderSelectedByVoting();
}


/* =========================================================
   SELECTED BY VOTING
========================================================= */

function renderSelectedByVoting() {

    /*
       Find an existing voting-result container.
       If it doesn't exist, create one automatically.
    */

    let section =
        $("selectedByVotingSection");

    let list =
        $("selectedByVotingList");

    if (!section) {

        const actualList =
            $("actualImpostersList");

        if (!actualList) return;

        section =
            document.createElement("div");

        section.id =
            "selectedByVotingSection";

        section.className =
            "result-voting-section";

        section.innerHTML = `
            <div class="result-section-title">
                🗳️ SELECTED BY VOTING
            </div>

            <div id="selectedByVotingList"></div>
        `;

        actualList.parentElement?.appendChild(
            section
        );

        list =
            section.querySelector(
                "#selectedByVotingList"
            );
    }

    if (!list) return;

    list.innerHTML = "";

    if (!selectedVotes.length) {

        list.innerHTML = `
            <div class="final-player">
                No players were selected.
            </div>
        `;

        return;
    }

    selectedVotes.forEach(
        index => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "final-player voted";

            div.innerHTML = `
                <span class="avatar">
                    ${esc(
                        players[index][0]
                            .toUpperCase()
                    )}
                </span>

                <span class="final-player-name">
                    ${esc(players[index])}
                </span>
            `;

            list.appendChild(div);
        }
    );
}

/* =========================================================
   DARE RESULT — MASTER LOGIC
========================================================= */

function renderDareResult() {

    const dareBox =
        $("dareResult");

    const assignmentBox =
        $("dareAssignment");

    const civilianList =
        $("civilianList");

    const assignmentMessage =
        $("assignedDareMessage");

    if (!dareBox) return;

    /* =====================================================
       NO DARE
    ===================================================== */

    if (!dareText) {

        dareBox.classList.add(
            "hidden"
        );

        if (assignmentBox) {

            assignmentBox.classList.add(
                "hidden"
            );
        }

        if (civilianList) {

            civilianList.innerHTML =
                "";
        }

        if (assignmentMessage) {

            assignmentMessage.innerHTML =
                "";

            assignmentMessage.classList.add(
                "hidden"
            );
        }

        return;
    }

    /* =====================================================
       SHOW DARE
    ===================================================== */

    dareBox.classList.remove(
        "hidden"
    );

    if ($("dareResultMessage")) {

        $("dareResultMessage").textContent =
            result.allCaught
                ? "The caught imposters must do this dare:"
                : "The escaped imposters must each select a civilian to do this dare:";
    }

    if ($("finalDare")) {

        $("finalDare").textContent =
            dareText;
    }

    /* =====================================================
       GET CAUGHT + ESCAPED
    ===================================================== */

    const caughtImposters =
        imposters.filter(
            index =>
                selectedVotes.includes(index)
        );

    const escapedImposters =
        imposters.filter(
            index =>
                !selectedVotes.includes(index)
        );

    /*
       Rebuild final dare list.

       Caught imposters ALWAYS belong in it.
    */

    finalDarePlayers =
        [...caughtImposters];

    /*
       No escaped imposters:
       only caught imposters do dare.
    */

    if (
        escapedImposters.length === 0
    ) {

        dareAssignedPlayers = [];

        if (assignmentBox) {

            assignmentBox.classList.add(
                "hidden"
            );
        }

        if (civilianList) {

            civilianList.innerHTML =
                "";
        }

        renderFinalDarePlayers();

        return;
    }

    /*
       Escaped imposters exist.
       They must select civilians.
    */

    showCivilianAssignmentFixed(
        escapedImposters
    );
}

/* =========================================================
   ESCAPED IMPOSTER → CIVILIAN SELECTION
========================================================= */

function showCivilianAssignmentFixed(
    escapedImposters
) {

    const assignmentBox =
        $("dareAssignment");

    const civilianList =
        $("civilianList");

    const assignmentMessage =
        $("assignedDareMessage");

    if (
        !assignmentBox ||
        !civilianList
    ) {

        /*
           Even if the optional assignment
           container is missing, still show
           caught imposters in final list.
        */

        finalDarePlayers =
            imposters.filter(
                index =>
                    selectedVotes.includes(index)
            );

        renderFinalDarePlayers();

        return;
    }

    assignmentBox.classList.remove(
        "hidden"
    );

    civilianList.innerHTML = "";

    /*
       DO NOT reset dareAssignedPlayers
       if selections already exist.

       This prevents the final selection
       from disappearing.
    */

    if (!Array.isArray(dareAssignedPlayers)) {

        dareAssignedPlayers = [];
    }

    const required =
        escapedImposters.length;

    /* =====================================================
       MESSAGE
    ===================================================== */

    if (assignmentMessage) {

        assignmentMessage.classList.remove(
            "hidden"
        );

        const selected =
            dareAssignedPlayers.length;

        if (selected < required) {

            assignmentMessage.innerHTML = `
                😈
                <strong>
                    ${required}
                </strong>
                escaped imposter${
                    required === 1
                        ? ""
                        : "s"
                }
                ${
                    selected > 0
                        ? ` — ${selected}/${required} civilians selected`
                        : " must each choose a civilian"
                }.
            `;

        } else {

            assignmentMessage.innerHTML = `
                🎯
                All required civilians have been selected!
            `;
        }
    }

    /* =====================================================
       CIVILIANS
    ===================================================== */

    const civilians =
        players
            .map(
                (_, index) =>
                    index
            )
            .filter(
                index =>
                    !imposters.includes(
                        index
                    )
            );

    /* =====================================================
       IF ALL ALREADY SELECTED
    ===================================================== */

    if (
        dareAssignedPlayers.length >=
        required
    ) {

        renderFinalDarePlayers();

        showCompletedDareAssignment();

        return;
    }

    /* =====================================================
       DISPLAY CIVILIANS
    ===================================================== */

    civilians.forEach(
        index => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "vote-card";

            button.dataset.playerIndex =
                String(index);

            const alreadySelected =
                dareAssignedPlayers.includes(
                    index
                );

            if (alreadySelected) {

                button.classList.add(
                    "selected"
                );

                button.disabled = true;
            }

            button.innerHTML = `
                <span class="avatar">
                    ${esc(
                        players[index][0]
                            .toUpperCase()
                    )}
                </span>

                <span>
                    ${esc(players[index])}
                </span>

                <span>
                    ${
                        alreadySelected
                            ? "✓"
                            : "🎯"
                    }
                </span>
            `;

            button.addEventListener(
                "click",
                () => {

                    selectDareCivilian(
                        index,
                        button,
                        required
                    );
                }
            );

            civilianList.appendChild(
                button
            );
        }
    );
}

/* =========================================================
   SELECT CIVILIAN
========================================================= */

function selectDareCivilian(
    playerIndex,
    button,
    required
) {

    /* =====================================================
       NEVER ALLOW IMPOSTER
    ===================================================== */

    if (
        imposters.includes(
            playerIndex
        )
    ) {

        return;
    }

    /* =====================================================
       NO DUPLICATES
    ===================================================== */

    if (
        dareAssignedPlayers.includes(
            playerIndex
        )
    ) {

        return;
    }

    /* =====================================================
       MAX LIMIT
    ===================================================== */

    if (
        dareAssignedPlayers.length >=
        required
    ) {

        return;
    }

    /* =====================================================
       SAVE CIVILIAN
    ===================================================== */

    dareAssignedPlayers.push(
        playerIndex
    );

    /*
       IMPORTANT:
       Add the civilian to the MASTER
       final dare list.

       Caught imposters were already added.
    */

    rebuildFinalDarePlayers();

    /* =====================================================
       UPDATE BUTTON
    ===================================================== */

    if (button) {

        button.classList.add(
            "selected"
        );

        button.disabled = true;

        button.innerHTML = `
            <span class="avatar">
                ${esc(
                    players[playerIndex][0]
                        .toUpperCase()
                )}
            </span>

            <span>
                ${esc(players[playerIndex])}
            </span>

            <span>
                ✓
            </span>
        `;
    }

    /* =====================================================
       UPDATE COUNTER
    ===================================================== */

    const selected =
        dareAssignedPlayers.length;

    const assignmentMessage =
        $("assignedDareMessage");

    if (
        selected < required
    ) {

        if (assignmentMessage) {

            assignmentMessage.classList.remove(
                "hidden"
            );

            assignmentMessage.innerHTML = `
                🎯
                <strong>
                    ${selected} / ${required}
                </strong>
                civilians selected.
            `;
        }

        /*
           CRITICAL:
           Render the current master list
           immediately.

           This means if 1 civilian is selected
           and another still needs to be selected,
           caught imposters + selected civilian
           are already visible.
        */

        renderFinalDarePlayers();

        return;
    }

    /* =====================================================
       ALL REQUIRED CIVILIANS SELECTED
    ===================================================== */

    rebuildFinalDarePlayers();

    showCompletedDareAssignment();

    renderFinalDarePlayers();
}

/* =========================================================
   REBUILD MASTER DARE LIST
========================================================= */

function rebuildFinalDarePlayers() {

    const caughtImposters =
        imposters.filter(
            index =>
                selectedVotes.includes(index)
        );

    /*
       Remove duplicates while preserving
       the order:
       caught imposters first,
       civilians second.
    */

    finalDarePlayers =
        [
            ...new Set(
                [
                    ...caughtImposters,
                    ...dareAssignedPlayers
                ]
            )
        ];
}

/* =========================================================
   RENDER EVERYONE WHO MUST DO DARE
========================================================= */

function renderFinalDarePlayers() {

    /*
       Always rebuild before rendering.
    */

    rebuildFinalDarePlayers();

    /*
       Find possible containers.

       The first is your existing actual
       imposters list.

       The second is an optional dedicated
       final dare list if your HTML has one.
    */

    const dedicatedList =
        $("finalDarePlayersList");

    /*
       If the HTML has a dedicated final
       list, use it.
    */

    if (dedicatedList) {

        dedicatedList.innerHTML = "";

        finalDarePlayers.forEach(
            index => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "final-player dare-final-player";

                div.innerHTML = `
                    <span class="avatar">
                        ${esc(
                            players[index][0]
                                .toUpperCase()
                        )}
                    </span>

                    <span class="final-player-name">
                        ${esc(players[index])}
                    </span>

                    <span class="correct-mark">
                        MUST DO DARE 🎯
                    </span>
                `;

                dedicatedList.appendChild(
                    div
                );
            }
        );
    }

    /*
       Also update the main assignment
       message so the user can ALWAYS see
       the complete list.
    */

    const assignmentMessage =
        $("assignedDareMessage");

    if (!assignmentMessage) return;

    if (!finalDarePlayers.length) {

        assignmentMessage.classList.add(
            "hidden"
        );

        return;
    }

    const names =
        finalDarePlayers
            .map(
                index =>
                    esc(players[index])
            )
            .join(", ");

    assignmentMessage.classList.remove(
        "hidden"
    );

    assignmentMessage.innerHTML = `
        <div>
            🎯
        </div>

        <div>
            <strong>
                ${names}
            </strong>
        </div>

        <div>
            must do the dare!
        </div>
    `;
}
/* =========================================================
   FINAL ASSIGNMENT MESSAGE
========================================================= */

function showCompletedDareAssignment() {

    rebuildFinalDarePlayers();

    const assignmentMessage =
        $("assignedDareMessage");

    if (!assignmentMessage) return;

    const names =
        finalDarePlayers
            .map(
                index =>
                    esc(players[index])
            )
            .join(", ");

    assignmentMessage.classList.remove(
        "hidden"
    );

    assignmentMessage.innerHTML = `
        <div>
            🎯
        </div>

        <strong>
            ${names}
        </strong>

        <div>
            must do the dare!
        </div>
    `;

    /*
       IMPORTANT:
       Do NOT put another message inside
       civilianList. The final message above
       is the ONLY dare-selection message.
    */

    const civilianList =
        $("civilianList");

    if (civilianList) {
        civilianList.innerHTML = "";
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

        finalDarePlayers = [];

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

        finalDarePlayers = [];

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
   INITIALIZE GAME
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

    finalDarePlayers = [];

    wheelSpinning = false;

    renderPlayers();

    renderCategories();

    updateImposterOptions();

    updateStartRound();

    showScreen(
        screens.home
    );
}

/* =========================================================
   START
========================================================= */

initializeGame();