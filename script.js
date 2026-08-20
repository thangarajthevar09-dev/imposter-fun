<<<<<<< HEAD
/* =========================================================
   IMPOSTER FUN — COMPLETE UPDATED SCRIPT
   Compatible with the HTML supplied by Thangaraj Thevar
========================================================= */

"use strict";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
    {
        name: "Food",
        icon: "🍕",
        words: [
            "Pizza","Burger","Sushi","Biryani","Dosa","Pasta",
            "Tacos","Ice Cream","Noodles","Sandwich","Momos","Fried Rice"
        ]
    },
    {
        name: "Movies",
        icon: "🎬",
        words: [
            "Avatar","Titanic","Inception","Interstellar","Dangal",
            "Joker","Frozen","The Matrix","Avengers","Harry Potter",
            "Jurassic Park","The Lion King"
        ]
    },
    {
        name: "South Indian Movies",
        icon: "🎥",
        words: [
            "Baahubali","RRR","KGF","Pushpa","Kantara","Leo",
            "Vikram","Jailer","Master","Drishyam","Eega","Lucifer",
            "Premam","Kumbalangi Nights","Aavesham","Manjummel Boys",
            "Arjun Reddy","Jersey","Rangasthalam","Dasara"
        ]
    },
    {
        name: "IPL Teams",
        icon: "🏏",
        words: [
            "Chennai Super Kings","Mumbai Indians",
            "Royal Challengers Bengaluru","Kolkata Knight Riders",
            "Rajasthan Royals","Sunrisers Hyderabad","Delhi Capitals",
            "Punjab Kings","Lucknow Super Giants","Gujarat Titans"
        ]
    },
    {
        name: "Indian Food",
        icon: "🍛",
        words: [
            "Butter Chicken","Biryani","Pav Bhaji","Chole Bhature",
            "Masala Dosa","Idli","Vada","Samosa","Pani Puri",
            "Rajma Chawal","Palak Paneer","Dal Makhani","Pongal",
            "Parotta","Chicken 65","Fish Curry","Gulab Jamun",
            "Jalebi","Rasgulla","Kheer"
        ]
    },
    {
        name: "Places",
        icon: "🌍",
        words: [
            "Beach","Airport","School","Hospital","Mall","Temple",
            "Mountain","Cinema","Restaurant","Hotel","Park",
            "Railway Station"
        ]
    },
    {
        name: "Animals",
        icon: "🐯",
        words: [
            "Tiger","Lion","Elephant","Dog","Cat","Monkey",
            "Giraffe","Penguin","Dolphin","Horse","Rabbit","Crocodile"
        ]
    },
    {
        name: "Sports",
        icon: "⚽",
        words: [
            "Cricket","Football","Tennis","Basketball","Badminton",
            "Hockey","Boxing","Swimming","Golf","Volleyball",
            "Kabaddi","Wrestling"
        ]
    },
    {
        name: "Everyday",
        icon: "🏠",
        words: [
            "Phone","Laptop","Bed","Chair","Mirror","Toothbrush",
            "Umbrella","Backpack","Clock","Shoes","Television","Keys"
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

let selectedCategory = null;
let selectedCategoryIndex = null;
let customCategory = null;

let imposterCount = 1;

let dareEnabled = null;
let dareText = "";

let secretWord = "";

let imposters = [];
let recentImposters = [];

let currentRevealIndex = 0;
let secretShown = false;

let selectedVotes = [];
let voteRevealIndex = 0;

let result = null;

/* =========================================================
   DOM REFERENCES
========================================================= */

const screens = {
    home: document.getElementById("homeScreen"),
    players: document.getElementById("playersScreen"),
    category: document.getElementById("categoryScreen"),
    imposter: document.getElementById("imposterScreen"),
    dare: document.getElementById("dareScreen"),
    ready: document.getElementById("readyScreen"),
    reveal: document.getElementById("revealScreen"),
    pass: document.getElementById("passScreen"),
    discussion: document.getElementById("discussionScreen"),
    voting: document.getElementById("votingScreen"),
    voteReveal: document.getElementById("voteRevealScreen"),
    result: document.getElementById("resultScreen")
};

const startGameBtn = document.getElementById("startGameBtn");

const playerNameInput = document.getElementById("playerNameInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const playersList = document.getElementById("playersList");
const playerCountText = document.getElementById("playerCountText");
const playersContinueBtn = document.getElementById("playersContinueBtn");

const categoryGrid = document.getElementById("categoryGrid");
const categoryContinueBtn = document.getElementById("categoryContinueBtn");
const categoryStatus = document.getElementById("categoryStatus");
const customCategoryBtn = document.getElementById("customCategoryBtn");
const customCategoryForm = document.getElementById("customCategoryForm");
const customCategoryName = document.getElementById("customCategoryName");
const customCategoryWords = document.getElementById("customCategoryWords");

const imposterContinueBtn = document.getElementById("imposterContinueBtn");
const imposterBackBtn = document.getElementById("imposterBackBtn");
const imposterLimitText = document.getElementById("imposterLimitText");

const dareYesBtn = document.getElementById("dareYesBtn");
const dareNoBtn = document.getElementById("dareNoBtn");
const dareInputContainer = document.getElementById("dareInputContainer");
const dareInput = document.getElementById("dareInput");
const dareStatus = document.getElementById("dareStatus");
const startRoundBtn = document.getElementById("startRoundBtn");
const dareBackBtn = document.getElementById("dareBackBtn");

const nextRevealBtn = document.getElementById("nextRevealBtn");
const goVotingBtn = document.getElementById("goVotingBtn");

const submitVoteBtn = document.getElementById("submitVoteBtn");

const playAgainBtn = document.getElementById("playAgainBtn");
const newPlayersBtn = document.getElementById("newPlayersBtn");

/* =========================================================
   SCREEN NAVIGATION
========================================================= */

function showScreen(screen) {
    Object.values(screens).forEach(element => {
        if (element) {
            element.classList.remove("active");
        }
    });

    if (screen) {
        screen.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================================
   HOME
========================================================= */

if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
        showScreen(screens.players);
        renderPlayers();
    });
}

/* =========================================================
   PLAYER SETUP
========================================================= */

function addPlayer() {
    if (!playerNameInput) return;

    const name = playerNameInput.value.trim();

    if (!name) {
        playerNameInput.focus();
        return;
    }

    if (players.length >= 12) {
        alert("You can have a maximum of 12 players.");
        return;
    }

    if (
        players.some(
            player => player.toLowerCase() === name.toLowerCase()
        )
    ) {
        alert("That player is already added.");
        return;
    }

    players.push(name);

    playerNameInput.value = "";

    renderPlayers();

    playerNameInput.focus();
}

if (addPlayerBtn) {
    addPlayerBtn.addEventListener("click", addPlayer);
}

if (playerNameInput) {
    playerNameInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            addPlayer();
        }
    });
}

function renderPlayers() {
    if (!playersList) return;

    playersList.innerHTML = "";

    players.forEach((player, index) => {
        const card = document.createElement("div");

        card.className = "player-card";

        card.innerHTML = `
            <div class="avatar">
                ${escapeHTML(player.charAt(0).toUpperCase())}
            </div>

            <span>
                ${escapeHTML(player)}
            </span>
        `;

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "EDIT";

        editButton.addEventListener("click", () => {
            editPlayer(index);
        });

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.textContent = "×";
        removeButton.style.fontSize = "20px";

        removeButton.addEventListener("click", () => {
            removePlayer(index);
        });

        card.appendChild(editButton);
        card.appendChild(removeButton);

        playersList.appendChild(card);
    });

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
    const newName = prompt(
        "Edit player name:",
        players[index]
    );

    if (newName === null) return;

    const cleanName = newName.trim();

    if (!cleanName) return;

    const duplicate = players.some(
        (player, i) =>
            i !== index &&
            player.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
        alert("That player name already exists.");
        return;
    }

    players[index] = cleanName;

    renderPlayers();
}

function removePlayer(index) {
    players.splice(index, 1);

    if (players.length < 3) {
        imposterCount = 1;
    } else if (imposterCount >= players.length) {
        imposterCount = Math.max(1, players.length - 1);
    }

    renderPlayers();
    updateImposterOptions();
}

const playersBackBtn =
    document.getElementById("playersBackBtn");

if (playersBackBtn) {
    playersBackBtn.addEventListener("click", () => {
        showScreen(screens.home);
    });
}

if (playersContinueBtn) {
    playersContinueBtn.addEventListener("click", () => {
        if (players.length < 3) {
            alert("You need at least 3 players.");
            return;
        }

        renderCategories();
        showScreen(screens.category);
    });
}

/* =========================================================
   CATEGORY SELECTION
========================================================= */

function chooseRandomCategory() {
    const availableCategories = categories.filter(
        category =>
            category.name !== "Random" &&
            category.words &&
            category.words.length > 0
    );

    if (!availableCategories.length) {
        return null;
    }

    return randomItem(availableCategories);
}

function renderCategories() {
    if (!categoryGrid) return;

    categoryGrid.innerHTML = "";

    categories.forEach((category, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "category-option";

        if (
            selectedCategoryIndex === index &&
            selectedCategory
        ) {
            button.classList.add("selected");
        }

        button.innerHTML = `
            <span class="category-icon">
                ${category.icon}
            </span>

            <span>
                ${escapeHTML(category.name)}
            </span>
        `;

        button.addEventListener("click", () => {
            selectCategory(index);
        });

        categoryGrid.appendChild(button);
    });

    if (
        customCategory &&
        customCategory.words &&
        customCategory.words.length > 0
    ) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "category-option";

        if (selectedCategory === customCategory) {
            button.classList.add("selected");
        }

        button.innerHTML = `
            <span class="category-icon">✨</span>
            <span>${escapeHTML(customCategory.name)}</span>
        `;

        button.addEventListener("click", () => {
            if (selectedCategory === customCategory) {
                selectedCategory = null;
                selectedCategoryIndex = null;
            } else {
                selectedCategory = customCategory;
                selectedCategoryIndex = null;
            }

            updateCategoryUI();
            renderCategories();
        });

        categoryGrid.appendChild(button);
    }

    updateCategoryUI();
}

function selectCategory(index) {
    const category = categories[index];

    if (!category) return;

    /* -----------------------------------------------------
       RANDOM
       Click once = choose a random real category.
       Click again = deselect.
    ----------------------------------------------------- */

    if (category.name === "Random") {
        if (
            selectedCategory &&
            selectedCategory.__randomSelection === true
        ) {
            selectedCategory = null;
            selectedCategoryIndex = null;

            updateCategoryUI();
            renderCategories();

            return;
        }

        const randomCategory = chooseRandomCategory();

        if (!randomCategory) {
            alert("No categories are available.");
            return;
        }

        selectedCategory = {
            name: randomCategory.name,
            icon: randomCategory.icon,
            words: [...randomCategory.words],
            __randomSelection: true
        };

        selectedCategoryIndex = index;

        customCategory = null;

        updateCategoryUI();
        renderCategories();

        return;
    }

    /* -----------------------------------------------------
       NORMAL CATEGORY
       Click once = select.
       Click again = deselect.
    ----------------------------------------------------- */

    if (
        selectedCategoryIndex === index &&
        selectedCategory &&
        selectedCategory.__randomSelection !== true
    ) {
        selectedCategory = null;
        selectedCategoryIndex = null;
    } else {
        selectedCategory = category;
        selectedCategoryIndex = index;
    }

    customCategory = null;

    if (customCategoryForm) {
        customCategoryForm.classList.add("hidden");
    }

    updateCategoryUI();
    renderCategories();
}

/* =========================================================
   CUSTOM CATEGORY
========================================================= */

if (customCategoryBtn) {
    customCategoryBtn.addEventListener("click", () => {
        if (!customCategoryForm) return;

        customCategoryForm.classList.toggle("hidden");

        if (
            !customCategoryForm.classList.contains("hidden") &&
            customCategoryName
        ) {
            customCategoryName.focus();
        }
    });
}

function buildCustomCategoryFromInputs() {
    if (!customCategoryName || !customCategoryWords) {
        return null;
    }

    const name = customCategoryName.value.trim();

    const words = customCategoryWords.value
        .split(",")
        .map(word => word.trim())
        .filter(Boolean);

    if (!name || words.length < 1) {
        return null;
    }

    return {
        name: name,
        icon: "✨",
        words: words
    };
}

function updateCustomCategory() {
    const category = buildCustomCategoryFromInputs();

    if (!category) {
        return;
    }

    customCategory = category;
    selectedCategory = category;
    selectedCategoryIndex = null;

    updateCategoryUI();
    renderCategories();
}

if (customCategoryName) {
    customCategoryName.addEventListener(
        "input",
        updateCustomCategory
    );
}

if (customCategoryWords) {
    customCategoryWords.addEventListener(
        "input",
        updateCustomCategory
    );
}

function updateCategoryUI() {
    if (!categoryStatus) return;

    if (!selectedCategory) {
        categoryStatus.textContent =
            "Choose a category";

        if (categoryContinueBtn) {
            categoryContinueBtn.disabled = true;
        }

        return;
    }

    categoryStatus.textContent =
        `Category = ${selectedCategory.name}`;

    if (categoryContinueBtn) {
        categoryContinueBtn.disabled = false;
    }
}

/* =========================================================
   CATEGORY CONTINUE
========================================================= */

if (categoryContinueBtn) {
    categoryContinueBtn.addEventListener("click", () => {
        /* Make sure a category is selected. */
        if (!selectedCategory) {
            alert("Please select a category.");
            return;
        }

        if (
            !selectedCategory.words ||
            selectedCategory.words.length === 0
        ) {
            alert("This category has no words.");
            return;
        }

        setupImposterScreen();

        showScreen(screens.imposter);
    });
}

const categoryBackBtn =
    document.getElementById("categoryBackBtn");

if (categoryBackBtn) {
    categoryBackBtn.addEventListener("click", () => {
        showScreen(screens.players);
    });
}

/* =========================================================
   IMPOSTER COUNT
========================================================= */

function getMaxImposters() {
    if (players.length < 2) {
        return 1;
    }

    /*
       10 civilians + maximum 9 imposters.
       In general:
       max imposters = players - 1.
    */
    return Math.max(1, players.length - 1);
}

function setupImposterScreen() {
    updateImposterOptions();

    showScreen(screens.imposter);
}

function updateImposterOptions() {
    const max = getMaxImposters();

    if (imposterCount > max) {
        imposterCount = max;
    }

    const options =
        document.querySelectorAll(".imposter-option");

    options.forEach(option => {
        const count = Number(
            option.dataset.count
        );

        option.classList.toggle(
            "selected",
            count === imposterCount
        );

        option.disabled = count > max;

        option.style.display =
            count > max ? "none" : "";
    });

    /*
       Create extra buttons dynamically for
       4 through maximum.
    */

    const container =
        document.querySelector(".imposter-options");

    if (container) {
        let dynamicOptions =
            container.querySelectorAll(
                ".dynamic-imposter-option"
            );

        dynamicOptions.forEach(option => {
            option.remove();
        });

        for (let count = 4; count <= max; count++) {
            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "imposter-option dynamic-imposter-option";

            if (count === imposterCount) {
                button.classList.add("selected");
            }

            button.dataset.count = String(count);

            button.innerHTML = `
                <strong>${count}</strong>
                <span>${getImposterLabel(count)}</span>
            `;

            button.addEventListener("click", () => {
                imposterCount = count;
                updateImposterOptions();
            });

            container.appendChild(button);
        }
    }

    if (imposterLimitText) {
        imposterLimitText.textContent =
            `Maximum: ${max} imposter${max === 1 ? "" : "s"}`;
    }
}

function getImposterLabel(count) {
    if (count === 1) return "Lone Wolf";
    if (count === 2) return "Double Trouble";
    if (count === 3) return "Triple Threat";
    if (count === 4) return "Quad Squad";
    if (count === 5) return "Five Alive";
    if (count === 6) return "Chaos Crew";
    if (count === 7) return "Seven Sinners";
    if (count === 8) return "Eight Invaders";
    if (count === 9) return "Ultimate Chaos";

    return `${count} Imposters`;
}

document
    .querySelectorAll(".imposter-option")
    .forEach(option => {
        option.addEventListener("click", () => {
            const count =
                Number(option.dataset.count);

            const max = getMaxImposters();

            if (count > max) {
                return;
            }

            imposterCount = count;

            updateImposterOptions();
        });
    });

if (imposterContinueBtn) {
    imposterContinueBtn.addEventListener("click", () => {
        if (players.length < 3) {
            alert("You need at least 3 players.");
            return;
        }

        const max = getMaxImposters();

        if (
            imposterCount < 1 ||
            imposterCount > max
        ) {
            imposterCount = 1;
        }

        resetDareState();

        showScreen(screens.dare);
    });
}

if (imposterBackBtn) {
    imposterBackBtn.addEventListener("click", () => {
        showScreen(screens.category);
    });
}

/* =========================================================
   DARE
========================================================= */

function resetDareState() {
    dareEnabled = null;
    dareText = "";

    if (dareYesBtn) {
        dareYesBtn.classList.remove("selected");
    }

    if (dareNoBtn) {
        dareNoBtn.classList.remove("selected");
    }

    if (dareInputContainer) {
        dareInputContainer.classList.add("hidden");
    }

    if (dareInput) {
        dareInput.value = "";
    }

    if (dareStatus) {
        dareStatus.textContent =
            "Choose YES or NO";
    }

    updateStartRoundButton();
}

if (dareYesBtn) {
    dareYesBtn.addEventListener("click", () => {
        dareEnabled = true;

        dareYesBtn.classList.add("selected");

        if (dareNoBtn) {
            dareNoBtn.classList.remove("selected");
        }

        if (dareInputContainer) {
            dareInputContainer.classList.remove("hidden");
        }

        if (dareStatus) {
            dareStatus.textContent =
                "Enter the dare below";
        }

        updateStartRoundButton();
    });
}

if (dareNoBtn) {
    dareNoBtn.addEventListener("click", () => {
        dareEnabled = false;
        dareText = "";

        dareNoBtn.classList.add("selected");

        if (dareYesBtn) {
            dareYesBtn.classList.remove("selected");
        }

        if (dareInputContainer) {
            dareInputContainer.classList.add("hidden");
        }

        if (dareInput) {
            dareInput.value = "";
        }

        if (dareStatus) {
            dareStatus.textContent =
                "No dare this round";
        }

        updateStartRoundButton();
    });
}

if (dareInput) {
    dareInput.addEventListener("input", () => {
        dareText = dareInput.value.trim();
        updateStartRoundButton();
    });
}

function updateStartRoundButton() {
    if (!startRoundBtn) return;

    if (dareEnabled === null) {
        startRoundBtn.disabled = true;
        return;
    }

    if (dareEnabled === true) {
        startRoundBtn.disabled =
            !dareInput ||
            !dareInput.value.trim();

        return;
    }

    startRoundBtn.disabled = false;
}

if (dareBackBtn) {
    dareBackBtn.addEventListener("click", () => {
        showScreen(screens.imposter);
    });
}

/* =========================================================
   START ROUND
========================================================= */

if (startRoundBtn) {
    startRoundBtn.addEventListener("click", () => {
        if (dareEnabled === null) {
            alert("Please choose YES or NO for the dare.");
            return;
        }

        if (
            dareEnabled === true &&
            (
                !dareInput ||
                !dareInput.value.trim()
            )
        ) {
            alert("Please enter the dare.");

            if (dareInput) {
                dareInput.focus();
            }

            return;
        }

        if (dareEnabled === true) {
            dareText = dareInput.value.trim();
        } else {
            dareText = "";
        }

        const success = prepareRound();

        if (!success) {
            return;
        }

        currentRevealIndex = 0;
        secretShown = false;

        /*
           IMPORTANT:
           The first thing shown is the player name.
           Word / role is NOT shown until the player
           presses SHOW WORD / ROLE.
        */
        showPlayerIdentity();

        showScreen(screens.reveal);
    });
}

/* =========================================================
   PREPARE ROUND
========================================================= */

function prepareRound() {
    if (!selectedCategory) {
        alert("Please select a category.");
        return false;
    }

    const words =
        selectedCategory.words || [];

    if (!words.length) {
        alert("This category has no words.");
        return false;
    }

    secretWord = randomItem(words);

    imposters = chooseImposters();

    if (
        !imposters ||
        imposters.length !== imposterCount
    ) {
        alert("Could not create the required number of imposters.");
        return false;
    }

    currentRevealIndex = 0;
    secretShown = false;

    selectedVotes = [];
    voteRevealIndex = 0;

    result = null;

    return true;
}

/* =========================================================
   CHOOSE IMPOSTERS
========================================================= */

function chooseImposters() {
    const available =
        players.map((_, index) => index);

    shuffleArray(available);

    /*
       Give players who were recently imposters
       lower priority.
    */

    const fresh = available.filter(
        index =>
            !recentImposters.includes(index)
    );

    const old = available.filter(
        index =>
            recentImposters.includes(index)
    );

    const pool = [
        ...fresh,
        ...old
    ];

    const chosen =
        pool.slice(0, imposterCount);

    recentImposters = [...chosen];

    return chosen;
}

/* =========================================================
   PRIVATE PLAYER REVEAL
========================================================= */

function showPlayerIdentity() {
    secretShown = false;

    const player =
        players[currentRevealIndex];

    const card =
        document.getElementById("revealCard");

    if (!card) return;

    const progress =
        (
            (currentRevealIndex + 1) /
            players.length
        ) * 100;

    const progressText =
        document.getElementById(
            "revealProgressText"
        );

    const progressBar =
        document.getElementById(
            "revealProgress"
        );

    if (progressText) {
        progressText.textContent =
            `PLAYER ${currentRevealIndex + 1} OF ${players.length}`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${progress}%`;
    }

    card.className = "reveal-card";

    card.innerHTML = `
        <div class="reveal-icon">
            👤
        </div>

        <div class="secret-label">
            THIS PLAYER
        </div>

        <div class="reveal-player">
            ${escapeHTML(player)}
        </div>

        <p class="reveal-description">
            Only ${escapeHTML(player)}
            should look at this screen.
        </p>

        <div class="category-lock">
            <span class="category-lock-label">
                CATEGORY
            </span>

            <span class="category-lock-value">
                ${escapeHTML(selectedCategory.name)}
            </span>
        </div>

        <button
            class="primary-btn"
            id="showSecretBtn"
            type="button"
        >
            SHOW WORD / ROLE
        </button>
    `;

    const showSecretBtn =
        document.getElementById(
            "showSecretBtn"
        );

    if (showSecretBtn) {
        showSecretBtn.addEventListener(
            "click",
            showCurrentSecret
        );
    }
}

/* =========================================================
   SHOW SECRET
========================================================= */

function showCurrentSecret() {
    secretShown = true;

    const player =
        players[currentRevealIndex];

    const isImposter =
        imposters.includes(currentRevealIndex);

    const card =
        document.getElementById("revealCard");

    if (!card) return;

    card.className = "reveal-card";

    if (isImposter) {
        card.classList.add("danger");

        card.innerHTML = `
            <div class="reveal-icon">
                🕵️
            </div>

            <div class="reveal-player">
                ${escapeHTML(player)}
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
                    ${escapeHTML(selectedCategory.name)}
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
                ${escapeHTML(player)}
            </div>

            <div class="role-badge safe-badge">
                CIVILIAN
            </div>

            <div class="secret-label">
                THE SECRET WORD IS
            </div>

            <div class="secret-word">
                ${escapeHTML(secretWord)}
            </div>

            <p class="reveal-description">
                Remember it. Don't show anyone.
            </p>

            <div class="category-lock">
                <span class="category-lock-label">
                    CATEGORY
                </span>

                <span class="category-lock-value">
                    ${escapeHTML(selectedCategory.name)}
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

    const hideRevealBtn =
        document.getElementById(
            "hideRevealBtn"
        );

    if (hideRevealBtn) {
        hideRevealBtn.addEventListener(
            "click",
            finishCurrentReveal
        );
    }
}

/* =========================================================
   FINISH CURRENT REVEAL
========================================================= */

function finishCurrentReveal() {
    secretShown = false;

    if (
        currentRevealIndex >=
        players.length - 1
    ) {
        showScreen(screens.discussion);
        return;
    }

    currentRevealIndex++;

    const passPlayerName =
        document.getElementById(
            "passPlayerName"
        );

    if (passPlayerName) {
        passPlayerName.textContent =
            `Give it to ${players[currentRevealIndex]}.`;
    }

    showScreen(screens.pass);
}

if (nextRevealBtn) {
    nextRevealBtn.addEventListener("click", () => {
        showPlayerIdentity();
        showScreen(screens.reveal);
    });
}

/* =========================================================
   DISCUSSION
========================================================= */

if (goVotingBtn) {
    goVotingBtn.addEventListener("click", () => {
        selectedVotes = [];

        renderVoting();

        showScreen(screens.voting);
    });
}

/* =========================================================
   VOTING
========================================================= */

function renderVoting() {
    const requiredVoteCount =
        document.getElementById(
            "requiredVoteCount"
        );

    if (requiredVoteCount) {
        requiredVoteCount.textContent =
            imposterCount;
    }

    const voteList =
        document.getElementById("voteList");

    if (!voteList) return;

    voteList.innerHTML = "";

    players.forEach((player, index) => {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "vote-card";

        if (selectedVotes.includes(index)) {
            button.classList.add("selected");
        }

        button.innerHTML = `
            <span class="avatar">
                ${escapeHTML(
                    player.charAt(0).toUpperCase()
                )}
            </span>

            <span>
                ${escapeHTML(player)}
            </span>

            <span class="vote-check">
                ${
                    selectedVotes.includes(index)
                        ? "✓"
                        : ""
                }
            </span>
        `;

        button.addEventListener("click", () => {
            toggleVote(index);
        });

        voteList.appendChild(button);
    });

    updateVoteCounter();
}

function toggleVote(index) {
    if (selectedVotes.includes(index)) {
        selectedVotes =
            selectedVotes.filter(
                vote => vote !== index
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
    const counter =
        document.getElementById(
            "voteCounter"
        );

    if (counter) {
        counter.textContent =
            `${selectedVotes.length} / ${imposterCount}`;
    }

    const submit =
        document.getElementById(
            "submitVoteBtn"
        );

    if (submit) {
        submit.disabled =
            selectedVotes.length !==
            imposterCount;
    }

    const status =
        document.getElementById(
            "voteStatus"
        );

    if (status) {
        status.textContent =
            selectedVotes.length === imposterCount
                ? "Ready to reveal."
                : `Choose ${imposterCount} player${
                    imposterCount === 1 ? "" : "s"
                  }.`;
    }
}

if (submitVoteBtn) {
    submitVoteBtn.addEventListener("click", () => {
        if (
            selectedVotes.length !==
            imposterCount
        ) {
            return;
        }

        voteRevealIndex = 0;

        renderVoteReveal();

        showScreen(screens.voteReveal);
    });
}

/* =========================================================
   VOTE REVEAL
========================================================= */

function renderVoteReveal() {
    const selectedIndex =
        selectedVotes[voteRevealIndex];

    const player =
        players[selectedIndex];

    const isActuallyImposter =
        imposters.includes(selectedIndex);

    const progress =
        (
            (voteRevealIndex + 1) /
            selectedVotes.length
        ) * 100;

    const progressText =
        document.getElementById(
            "voteRevealProgressText"
        );

    const progressBar =
        document.getElementById(
            "voteRevealProgress"
        );

    if (progressText) {
        progressText.textContent =
            `REVEAL ${voteRevealIndex + 1} OF ${selectedVotes.length}`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${progress}%`;
    }

    const card =
        document.getElementById(
            "voteRevealCard"
        );

    if (!card) return;

    card.className = "reveal-card";

    if (isActuallyImposter) {
        card.classList.add("danger");

        card.innerHTML = `
            <div class="reveal-icon">
                🕵️
            </div>

            <div class="reveal-player">
                ${escapeHTML(player)}
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
                ${escapeHTML(player)}
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

    const nextBtn =
        document.getElementById(
            "nextVoteRevealBtn"
        );

    if (nextBtn) {
        nextBtn.addEventListener(
            "click",
            nextVoteReveal
        );
    }
}

function nextVoteReveal() {
    if (
        voteRevealIndex >=
        selectedVotes.length - 1
    ) {
        calculateResult();

        showScreen(screens.result);

        return;
    }

    voteRevealIndex++;

    renderVoteReveal();
}

/* =========================================================
   CALCULATE RESULT
========================================================= */

function calculateResult() {
    const caught =
        selectedVotes.filter(
            index =>
                imposters.includes(index)
        ).length;

    const allCaught =
        caught === imposters.length;

    result = {
        caught: caught,
        allCaught: allCaught
    };

    renderResult();
}

/* =========================================================
   FINAL RESULT
========================================================= */

function renderResult() {
    const icon =
        document.getElementById("resultIcon");

    const eyebrow =
        document.getElementById("resultEyebrow");

    const title =
        document.getElementById("resultTitle");

    const description =
        document.getElementById(
            "resultDescription"
        );

    if (result && result.allCaught) {
        if (icon) {
            icon.className =
                "result-icon caught";

            icon.textContent = "✓";
        }

        if (eyebrow) {
            eyebrow.textContent =
                "ROUND WON";
        }

        if (title) {
            title.textContent =
                "IMPOSTERS CAUGHT!";
        }

        if (description) {
            description.textContent =
                "The group successfully identified every imposter.";
        }
    } else {
        if (icon) {
            icon.className =
                "result-icon escaped";

            icon.textContent = "✕";
        }

        if (eyebrow) {
            eyebrow.textContent =
                "IMPOSTERS ESCAPED";
        }

        if (title) {
            title.textContent =
                "THEY GOT AWAY!";
        }

        if (description) {
            description.textContent =
                `${result ? result.caught : 0} of ${imposters.length} imposters were caught.`;
        }
    }

    const actualList =
        document.getElementById(
            "actualImpostersList"
        );

    if (!actualList) return;

    actualList.innerHTML = `
        <div class="final-results-grid">

            <div class="final-result-column">
                <div class="final-column-title">
                    🕵️ ACTUAL IMPOSTERS
                </div>

                <div id="actualPlayersColumn"></div>
            </div>

            <div class="final-result-column">
                <div class="final-column-title">
                    🗳️ YOUR VOTES
                </div>

                <div id="votedPlayersColumn"></div>
            </div>

        </div>
    `;

    const actualColumn =
        document.getElementById(
            "actualPlayersColumn"
        );

    const votedColumn =
        document.getElementById(
            "votedPlayersColumn"
        );

    /*
       Correctly voted imposters align opposite
       themselves.

       If an actual imposter escaped, they are
       aligned opposite another escaped/wrong vote.

       If every vote was civilian, the remaining
       alignment is randomized.
    */

    const pairs =
        createAlignedResultPairs();

    pairs.forEach(pair => {
        const actualIndex =
            pair.actual;

        const votedIndex =
            pair.voted;

        if (
            actualIndex === undefined ||
            votedIndex === undefined
        ) {
            return;
        }

        const actualPlayer =
            document.createElement("div");

        actualPlayer.className =
            "final-player actual";

        const actualWasVoted =
            selectedVotes.includes(
                actualIndex
            );

        actualPlayer.innerHTML = `
            <span class="avatar">
                ${escapeHTML(
                    players[actualIndex]
                        .charAt(0)
                        .toUpperCase()
                )}
            </span>

            <span class="final-player-name">
                ${escapeHTML(
                    players[actualIndex]
                )}
            </span>

            ${
                actualWasVoted
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

        const votedPlayer =
            document.createElement("div");

        votedPlayer.className =
            "final-player voted";

        const votedWasImposter =
            imposters.includes(
                votedIndex
            );

        votedPlayer.innerHTML = `
            <span class="avatar">
                ${escapeHTML(
                    players[votedIndex]
                        .charAt(0)
                        .toUpperCase()
                )}
            </span>

            <span class="final-player-name">
                ${escapeHTML(
                    players[votedIndex]
                )}
            </span>

            ${
                votedWasImposter
                    ? `
                        <span class="correct-mark">
                            IMPOSTER ✓
                        </span>
                      `
                    : `
                        <span class="miss-mark">
                            CIVILIAN ✕
                        </span>
                      `
            }
        `;

        if (actualColumn) {
            actualColumn.appendChild(
                actualPlayer
            );
        }

        if (votedColumn) {
            votedColumn.appendChild(
                votedPlayer
            );
        }
    });

    renderDareResult();
}

/* =========================================================
   RESULT PAIRING
========================================================= */

function createAlignedResultPairs() {
    const actual =
        [...imposters];

    const votes =
        [...selectedVotes];

    const pairs = [];

    /*
       1. Correctly voted imposters align
          directly opposite themselves.
    */

    const correctVotes =
        actual.filter(
            index =>
                votes.includes(index)
        );

    const usedActual =
        new Set();

    const usedVotes =
        new Set();

    correctVotes.forEach(index => {
        pairs.push({
            actual: index,
            voted: index
        });

        usedActual.add(index);
        usedVotes.add(index);
    });

    /*
       2. Remaining actual imposters
          are escaped imposters.
    */

    const remainingActual =
        actual.filter(
            index =>
                !usedActual.has(index)
        );

    /*
       3. Remaining votes are wrong votes.
    */

    const remainingVotes =
        votes.filter(
            index =>
                !usedVotes.has(index)
        );

    /*
       Randomize the wrong votes so that
       escaped imposters do not always appear
       against the same civilian.
    */

    shuffleArray(remainingVotes);

    /*
       Align each escaped actual imposter
       against one remaining vote.

       If all votes were civilians, this
       automatically creates random alignment.
    */

    remainingActual.forEach(
        (actualIndex, position) => {
            if (
                remainingVotes[position] !==
                undefined
            ) {
                pairs.push({
                    actual: actualIndex,
                    voted: remainingVotes[position]
                });
            }
        }
    );

    return pairs;
}

/* =========================================================
   DARE ON FINAL PAGE
========================================================= */

function renderDareResult() {
    const dareResult =
        document.getElementById(
            "dareResult"
        );

    if (!dareResult) return;

    if (!dareText) {
        dareResult.classList.add("hidden");
        return;
    }

    dareResult.classList.remove("hidden");

    const message =
        document.getElementById(
            "dareResultMessage"
        );

    const finalDare =
        document.getElementById(
            "finalDare"
        );

    if (message) {
        message.textContent =
            "THE DARE FOR THIS ROUND";
    }

    if (finalDare) {
        finalDare.textContent =
            dareText;
    }
}

/* =========================================================
   PLAY AGAIN
   RETURNS TO CATEGORY PAGE
========================================================= */

if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
        selectedVotes = [];
        voteRevealIndex = 0;

        result = null;

        dareEnabled = null;
        dareText = "";

        secretWord = "";

        imposters = [];

        currentRevealIndex = 0;
        secretShown = false;

        /*
           Keep players.
           Keep category.
           Return directly to category page.
        */

        resetDareState();

        renderCategories();

        showScreen(screens.category);
    });
}

/* =========================================================
   NEW PLAYERS
========================================================= */

if (newPlayersBtn) {
    newPlayersBtn.addEventListener("click", () => {
        players = [];

        selectedCategory = null;
        selectedCategoryIndex = null;
        customCategory = null;

        imposters = [];
        recentImposters = [];

        secretWord = "";

        selectedVotes = [];

        voteRevealIndex = 0;

        result = null;

        imposterCount = 1;

        dareEnabled = null;
        dareText = "";

        currentRevealIndex = 0;
        secretShown = false;

        resetDareState();

        renderPlayers();
        renderCategories();

        showScreen(screens.players);
    });
}

/* =========================================================
   UTILITY — RANDOM ITEM
========================================================= */

function randomItem(array) {
    if (!array || array.length === 0) {
        return "";
    }

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}

/* =========================================================
   UTILITY — SHUFFLE
========================================================= */

function shuffleArray(array) {
    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {
        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }

    return array;
}

/* =========================================================
   UTILITY — HTML ESCAPE
========================================================= */

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =========================================================
   INITIALIZATION
========================================================= */

function initializeGame() {
    players = [];

    selectedCategory = null;
    selectedCategoryIndex = null;
    customCategory = null;

    imposterCount = 1;

    dareEnabled = null;
    dareText = "";

    secretWord = "";

    imposters = [];
    recentImposters = [];

    currentRevealIndex = 0;
    secretShown = false;

    selectedVotes = [];
    voteRevealIndex = 0;

    result = null;

    renderPlayers();
    renderCategories();
    updateImposterOptions();
    updateStartRoundButton();

    showScreen(screens.home);
}

/* =========================================================
   START
========================================================= */

=======
/* =========================================================
   IMPOSTER FUN — COMPLETE UPDATED SCRIPT
   Compatible with the HTML supplied by Thangaraj Thevar
========================================================= */

"use strict";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
    {
        name: "Food",
        icon: "🍕",
        words: [
            "Pizza","Burger","Sushi","Biryani","Dosa","Pasta",
            "Tacos","Ice Cream","Noodles","Sandwich","Momos","Fried Rice"
        ]
    },
    {
        name: "Movies",
        icon: "🎬",
        words: [
            "Avatar","Titanic","Inception","Interstellar","Dangal",
            "Joker","Frozen","The Matrix","Avengers","Harry Potter",
            "Jurassic Park","The Lion King"
        ]
    },
    {
        name: "South Indian Movies",
        icon: "🎥",
        words: [
            "Baahubali","RRR","KGF","Pushpa","Kantara","Leo",
            "Vikram","Jailer","Master","Drishyam","Eega","Lucifer",
            "Premam","Kumbalangi Nights","Aavesham","Manjummel Boys",
            "Arjun Reddy","Jersey","Rangasthalam","Dasara"
        ]
    },
    {
        name: "IPL Teams",
        icon: "🏏",
        words: [
            "Chennai Super Kings","Mumbai Indians",
            "Royal Challengers Bengaluru","Kolkata Knight Riders",
            "Rajasthan Royals","Sunrisers Hyderabad","Delhi Capitals",
            "Punjab Kings","Lucknow Super Giants","Gujarat Titans"
        ]
    },
    {
        name: "Indian Food",
        icon: "🍛",
        words: [
            "Butter Chicken","Biryani","Pav Bhaji","Chole Bhature",
            "Masala Dosa","Idli","Vada","Samosa","Pani Puri",
            "Rajma Chawal","Palak Paneer","Dal Makhani","Pongal",
            "Parotta","Chicken 65","Fish Curry","Gulab Jamun",
            "Jalebi","Rasgulla","Kheer"
        ]
    },
    {
        name: "Places",
        icon: "🌍",
        words: [
            "Beach","Airport","School","Hospital","Mall","Temple",
            "Mountain","Cinema","Restaurant","Hotel","Park",
            "Railway Station"
        ]
    },
    {
        name: "Animals",
        icon: "🐯",
        words: [
            "Tiger","Lion","Elephant","Dog","Cat","Monkey",
            "Giraffe","Penguin","Dolphin","Horse","Rabbit","Crocodile"
        ]
    },
    {
        name: "Sports",
        icon: "⚽",
        words: [
            "Cricket","Football","Tennis","Basketball","Badminton",
            "Hockey","Boxing","Swimming","Golf","Volleyball",
            "Kabaddi","Wrestling"
        ]
    },
    {
        name: "Everyday",
        icon: "🏠",
        words: [
            "Phone","Laptop","Bed","Chair","Mirror","Toothbrush",
            "Umbrella","Backpack","Clock","Shoes","Television","Keys"
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

let selectedCategory = null;
let selectedCategoryIndex = null;
let customCategory = null;

let imposterCount = 1;

let dareEnabled = null;
let dareText = "";

let secretWord = "";

let imposters = [];
let recentImposters = [];

let currentRevealIndex = 0;
let secretShown = false;

let selectedVotes = [];
let voteRevealIndex = 0;

let result = null;

/* =========================================================
   DOM REFERENCES
========================================================= */

const screens = {
    home: document.getElementById("homeScreen"),
    players: document.getElementById("playersScreen"),
    category: document.getElementById("categoryScreen"),
    imposter: document.getElementById("imposterScreen"),
    dare: document.getElementById("dareScreen"),
    ready: document.getElementById("readyScreen"),
    reveal: document.getElementById("revealScreen"),
    pass: document.getElementById("passScreen"),
    discussion: document.getElementById("discussionScreen"),
    voting: document.getElementById("votingScreen"),
    voteReveal: document.getElementById("voteRevealScreen"),
    result: document.getElementById("resultScreen")
};

const startGameBtn = document.getElementById("startGameBtn");

const playerNameInput = document.getElementById("playerNameInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const playersList = document.getElementById("playersList");
const playerCountText = document.getElementById("playerCountText");
const playersContinueBtn = document.getElementById("playersContinueBtn");

const categoryGrid = document.getElementById("categoryGrid");
const categoryContinueBtn = document.getElementById("categoryContinueBtn");
const categoryStatus = document.getElementById("categoryStatus");
const customCategoryBtn = document.getElementById("customCategoryBtn");
const customCategoryForm = document.getElementById("customCategoryForm");
const customCategoryName = document.getElementById("customCategoryName");
const customCategoryWords = document.getElementById("customCategoryWords");

const imposterContinueBtn = document.getElementById("imposterContinueBtn");
const imposterBackBtn = document.getElementById("imposterBackBtn");
const imposterLimitText = document.getElementById("imposterLimitText");

const dareYesBtn = document.getElementById("dareYesBtn");
const dareNoBtn = document.getElementById("dareNoBtn");
const dareInputContainer = document.getElementById("dareInputContainer");
const dareInput = document.getElementById("dareInput");
const dareStatus = document.getElementById("dareStatus");
const startRoundBtn = document.getElementById("startRoundBtn");
const dareBackBtn = document.getElementById("dareBackBtn");

const nextRevealBtn = document.getElementById("nextRevealBtn");
const goVotingBtn = document.getElementById("goVotingBtn");

const submitVoteBtn = document.getElementById("submitVoteBtn");

const playAgainBtn = document.getElementById("playAgainBtn");
const newPlayersBtn = document.getElementById("newPlayersBtn");

/* =========================================================
   SCREEN NAVIGATION
========================================================= */

function showScreen(screen) {
    Object.values(screens).forEach(element => {
        if (element) {
            element.classList.remove("active");
        }
    });

    if (screen) {
        screen.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================================
   HOME
========================================================= */

if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
        showScreen(screens.players);
        renderPlayers();
    });
}

/* =========================================================
   PLAYER SETUP
========================================================= */

function addPlayer() {
    if (!playerNameInput) return;

    const name = playerNameInput.value.trim();

    if (!name) {
        playerNameInput.focus();
        return;
    }

    if (players.length >= 12) {
        alert("You can have a maximum of 12 players.");
        return;
    }

    if (
        players.some(
            player => player.toLowerCase() === name.toLowerCase()
        )
    ) {
        alert("That player is already added.");
        return;
    }

    players.push(name);

    playerNameInput.value = "";

    renderPlayers();

    playerNameInput.focus();
}

if (addPlayerBtn) {
    addPlayerBtn.addEventListener("click", addPlayer);
}

if (playerNameInput) {
    playerNameInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            addPlayer();
        }
    });
}

function renderPlayers() {
    if (!playersList) return;

    playersList.innerHTML = "";

    players.forEach((player, index) => {
        const card = document.createElement("div");

        card.className = "player-card";

        card.innerHTML = `
            <div class="avatar">
                ${escapeHTML(player.charAt(0).toUpperCase())}
            </div>

            <span>
                ${escapeHTML(player)}
            </span>
        `;

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "EDIT";

        editButton.addEventListener("click", () => {
            editPlayer(index);
        });

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.textContent = "×";
        removeButton.style.fontSize = "20px";

        removeButton.addEventListener("click", () => {
            removePlayer(index);
        });

        card.appendChild(editButton);
        card.appendChild(removeButton);

        playersList.appendChild(card);
    });

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
    const newName = prompt(
        "Edit player name:",
        players[index]
    );

    if (newName === null) return;

    const cleanName = newName.trim();

    if (!cleanName) return;

    const duplicate = players.some(
        (player, i) =>
            i !== index &&
            player.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
        alert("That player name already exists.");
        return;
    }

    players[index] = cleanName;

    renderPlayers();
}

function removePlayer(index) {
    players.splice(index, 1);

    if (players.length < 3) {
        imposterCount = 1;
    } else if (imposterCount >= players.length) {
        imposterCount = Math.max(1, players.length - 1);
    }

    renderPlayers();
    updateImposterOptions();
}

const playersBackBtn =
    document.getElementById("playersBackBtn");

if (playersBackBtn) {
    playersBackBtn.addEventListener("click", () => {
        showScreen(screens.home);
    });
}

if (playersContinueBtn) {
    playersContinueBtn.addEventListener("click", () => {
        if (players.length < 3) {
            alert("You need at least 3 players.");
            return;
        }

        renderCategories();
        showScreen(screens.category);
    });
}

/* =========================================================
   CATEGORY SELECTION
========================================================= */

function chooseRandomCategory() {
    const availableCategories = categories.filter(
        category =>
            category.name !== "Random" &&
            category.words &&
            category.words.length > 0
    );

    if (!availableCategories.length) {
        return null;
    }

    return randomItem(availableCategories);
}

function renderCategories() {
    if (!categoryGrid) return;

    categoryGrid.innerHTML = "";

    categories.forEach((category, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "category-option";

        if (
            selectedCategoryIndex === index &&
            selectedCategory
        ) {
            button.classList.add("selected");
        }

        button.innerHTML = `
            <span class="category-icon">
                ${category.icon}
            </span>

            <span>
                ${escapeHTML(category.name)}
            </span>
        `;

        button.addEventListener("click", () => {
            selectCategory(index);
        });

        categoryGrid.appendChild(button);
    });

    if (
        customCategory &&
        customCategory.words &&
        customCategory.words.length > 0
    ) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "category-option";

        if (selectedCategory === customCategory) {
            button.classList.add("selected");
        }

        button.innerHTML = `
            <span class="category-icon">✨</span>
            <span>${escapeHTML(customCategory.name)}</span>
        `;

        button.addEventListener("click", () => {
            if (selectedCategory === customCategory) {
                selectedCategory = null;
                selectedCategoryIndex = null;
            } else {
                selectedCategory = customCategory;
                selectedCategoryIndex = null;
            }

            updateCategoryUI();
            renderCategories();
        });

        categoryGrid.appendChild(button);
    }

    updateCategoryUI();
}

function selectCategory(index) {
    const category = categories[index];

    if (!category) return;

    /* -----------------------------------------------------
       RANDOM
       Click once = choose a random real category.
       Click again = deselect.
    ----------------------------------------------------- */

    if (category.name === "Random") {
        if (
            selectedCategory &&
            selectedCategory.__randomSelection === true
        ) {
            selectedCategory = null;
            selectedCategoryIndex = null;

            updateCategoryUI();
            renderCategories();

            return;
        }

        const randomCategory = chooseRandomCategory();

        if (!randomCategory) {
            alert("No categories are available.");
            return;
        }

        selectedCategory = {
            name: randomCategory.name,
            icon: randomCategory.icon,
            words: [...randomCategory.words],
            __randomSelection: true
        };

        selectedCategoryIndex = index;

        customCategory = null;

        updateCategoryUI();
        renderCategories();

        return;
    }

    /* -----------------------------------------------------
       NORMAL CATEGORY
       Click once = select.
       Click again = deselect.
    ----------------------------------------------------- */

    if (
        selectedCategoryIndex === index &&
        selectedCategory &&
        selectedCategory.__randomSelection !== true
    ) {
        selectedCategory = null;
        selectedCategoryIndex = null;
    } else {
        selectedCategory = category;
        selectedCategoryIndex = index;
    }

    customCategory = null;

    if (customCategoryForm) {
        customCategoryForm.classList.add("hidden");
    }

    updateCategoryUI();
    renderCategories();
}

/* =========================================================
   CUSTOM CATEGORY
========================================================= */

if (customCategoryBtn) {
    customCategoryBtn.addEventListener("click", () => {
        if (!customCategoryForm) return;

        customCategoryForm.classList.toggle("hidden");

        if (
            !customCategoryForm.classList.contains("hidden") &&
            customCategoryName
        ) {
            customCategoryName.focus();
        }
    });
}

function buildCustomCategoryFromInputs() {
    if (!customCategoryName || !customCategoryWords) {
        return null;
    }

    const name = customCategoryName.value.trim();

    const words = customCategoryWords.value
        .split(",")
        .map(word => word.trim())
        .filter(Boolean);

    if (!name || words.length < 1) {
        return null;
    }

    return {
        name: name,
        icon: "✨",
        words: words
    };
}

function updateCustomCategory() {
    const category = buildCustomCategoryFromInputs();

    if (!category) {
        return;
    }

    customCategory = category;
    selectedCategory = category;
    selectedCategoryIndex = null;

    updateCategoryUI();
    renderCategories();
}

if (customCategoryName) {
    customCategoryName.addEventListener(
        "input",
        updateCustomCategory
    );
}

if (customCategoryWords) {
    customCategoryWords.addEventListener(
        "input",
        updateCustomCategory
    );
}

function updateCategoryUI() {
    if (!categoryStatus) return;

    if (!selectedCategory) {
        categoryStatus.textContent =
            "Choose a category";

        if (categoryContinueBtn) {
            categoryContinueBtn.disabled = true;
        }

        return;
    }

    categoryStatus.textContent =
        `Category = ${selectedCategory.name}`;

    if (categoryContinueBtn) {
        categoryContinueBtn.disabled = false;
    }
}

/* =========================================================
   CATEGORY CONTINUE
========================================================= */

if (categoryContinueBtn) {
    categoryContinueBtn.addEventListener("click", () => {
        /* Make sure a category is selected. */
        if (!selectedCategory) {
            alert("Please select a category.");
            return;
        }

        if (
            !selectedCategory.words ||
            selectedCategory.words.length === 0
        ) {
            alert("This category has no words.");
            return;
        }

        setupImposterScreen();

        showScreen(screens.imposter);
    });
}

const categoryBackBtn =
    document.getElementById("categoryBackBtn");

if (categoryBackBtn) {
    categoryBackBtn.addEventListener("click", () => {
        showScreen(screens.players);
    });
}

/* =========================================================
   IMPOSTER COUNT
========================================================= */

function getMaxImposters() {
    if (players.length < 2) {
        return 1;
    }

    /*
       10 civilians + maximum 9 imposters.
       In general:
       max imposters = players - 1.
    */
    return Math.max(1, players.length - 1);
}

function setupImposterScreen() {
    updateImposterOptions();

    showScreen(screens.imposter);
}

function updateImposterOptions() {
    const max = getMaxImposters();

    if (imposterCount > max) {
        imposterCount = max;
    }

    const options =
        document.querySelectorAll(".imposter-option");

    options.forEach(option => {
        const count = Number(
            option.dataset.count
        );

        option.classList.toggle(
            "selected",
            count === imposterCount
        );

        option.disabled = count > max;

        option.style.display =
            count > max ? "none" : "";
    });

    /*
       Create extra buttons dynamically for
       4 through maximum.
    */

    const container =
        document.querySelector(".imposter-options");

    if (container) {
        let dynamicOptions =
            container.querySelectorAll(
                ".dynamic-imposter-option"
            );

        dynamicOptions.forEach(option => {
            option.remove();
        });

        for (let count = 4; count <= max; count++) {
            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "imposter-option dynamic-imposter-option";

            if (count === imposterCount) {
                button.classList.add("selected");
            }

            button.dataset.count = String(count);

            button.innerHTML = `
                <strong>${count}</strong>
                <span>${getImposterLabel(count)}</span>
            `;

            button.addEventListener("click", () => {
                imposterCount = count;
                updateImposterOptions();
            });

            container.appendChild(button);
        }
    }

    if (imposterLimitText) {
        imposterLimitText.textContent =
            `Maximum: ${max} imposter${max === 1 ? "" : "s"}`;
    }
}

function getImposterLabel(count) {
    if (count === 1) return "Lone Wolf";
    if (count === 2) return "Double Trouble";
    if (count === 3) return "Triple Threat";
    if (count === 4) return "Quad Squad";
    if (count === 5) return "Five Alive";
    if (count === 6) return "Chaos Crew";
    if (count === 7) return "Seven Sinners";
    if (count === 8) return "Eight Invaders";
    if (count === 9) return "Ultimate Chaos";

    return `${count} Imposters`;
}

document
    .querySelectorAll(".imposter-option")
    .forEach(option => {
        option.addEventListener("click", () => {
            const count =
                Number(option.dataset.count);

            const max = getMaxImposters();

            if (count > max) {
                return;
            }

            imposterCount = count;

            updateImposterOptions();
        });
    });

if (imposterContinueBtn) {
    imposterContinueBtn.addEventListener("click", () => {
        if (players.length < 3) {
            alert("You need at least 3 players.");
            return;
        }

        const max = getMaxImposters();

        if (
            imposterCount < 1 ||
            imposterCount > max
        ) {
            imposterCount = 1;
        }

        resetDareState();

        showScreen(screens.dare);
    });
}

if (imposterBackBtn) {
    imposterBackBtn.addEventListener("click", () => {
        showScreen(screens.category);
    });
}

/* =========================================================
   DARE
========================================================= */

function resetDareState() {
    dareEnabled = null;
    dareText = "";

    if (dareYesBtn) {
        dareYesBtn.classList.remove("selected");
    }

    if (dareNoBtn) {
        dareNoBtn.classList.remove("selected");
    }

    if (dareInputContainer) {
        dareInputContainer.classList.add("hidden");
    }

    if (dareInput) {
        dareInput.value = "";
    }

    if (dareStatus) {
        dareStatus.textContent =
            "Choose YES or NO";
    }

    updateStartRoundButton();
}

if (dareYesBtn) {
    dareYesBtn.addEventListener("click", () => {
        dareEnabled = true;

        dareYesBtn.classList.add("selected");

        if (dareNoBtn) {
            dareNoBtn.classList.remove("selected");
        }

        if (dareInputContainer) {
            dareInputContainer.classList.remove("hidden");
        }

        if (dareStatus) {
            dareStatus.textContent =
                "Enter the dare below";
        }

        updateStartRoundButton();
    });
}

if (dareNoBtn) {
    dareNoBtn.addEventListener("click", () => {
        dareEnabled = false;
        dareText = "";

        dareNoBtn.classList.add("selected");

        if (dareYesBtn) {
            dareYesBtn.classList.remove("selected");
        }

        if (dareInputContainer) {
            dareInputContainer.classList.add("hidden");
        }

        if (dareInput) {
            dareInput.value = "";
        }

        if (dareStatus) {
            dareStatus.textContent =
                "No dare this round";
        }

        updateStartRoundButton();
    });
}

if (dareInput) {
    dareInput.addEventListener("input", () => {
        dareText = dareInput.value.trim();
        updateStartRoundButton();
    });
}

function updateStartRoundButton() {
    if (!startRoundBtn) return;

    if (dareEnabled === null) {
        startRoundBtn.disabled = true;
        return;
    }

    if (dareEnabled === true) {
        startRoundBtn.disabled =
            !dareInput ||
            !dareInput.value.trim();

        return;
    }

    startRoundBtn.disabled = false;
}

if (dareBackBtn) {
    dareBackBtn.addEventListener("click", () => {
        showScreen(screens.imposter);
    });
}

/* =========================================================
   START ROUND
========================================================= */

if (startRoundBtn) {
    startRoundBtn.addEventListener("click", () => {
        if (dareEnabled === null) {
            alert("Please choose YES or NO for the dare.");
            return;
        }

        if (
            dareEnabled === true &&
            (
                !dareInput ||
                !dareInput.value.trim()
            )
        ) {
            alert("Please enter the dare.");

            if (dareInput) {
                dareInput.focus();
            }

            return;
        }

        if (dareEnabled === true) {
            dareText = dareInput.value.trim();
        } else {
            dareText = "";
        }

        const success = prepareRound();

        if (!success) {
            return;
        }

        currentRevealIndex = 0;
        secretShown = false;

        /*
           IMPORTANT:
           The first thing shown is the player name.
           Word / role is NOT shown until the player
           presses SHOW WORD / ROLE.
        */
        showPlayerIdentity();

        showScreen(screens.reveal);
    });
}

/* =========================================================
   PREPARE ROUND
========================================================= */

function prepareRound() {
    if (!selectedCategory) {
        alert("Please select a category.");
        return false;
    }

    const words =
        selectedCategory.words || [];

    if (!words.length) {
        alert("This category has no words.");
        return false;
    }

    secretWord = randomItem(words);

    imposters = chooseImposters();

    if (
        !imposters ||
        imposters.length !== imposterCount
    ) {
        alert("Could not create the required number of imposters.");
        return false;
    }

    currentRevealIndex = 0;
    secretShown = false;

    selectedVotes = [];
    voteRevealIndex = 0;

    result = null;

    return true;
}

/* =========================================================
   CHOOSE IMPOSTERS
========================================================= */

function chooseImposters() {
    const available =
        players.map((_, index) => index);

    shuffleArray(available);

    /*
       Give players who were recently imposters
       lower priority.
    */

    const fresh = available.filter(
        index =>
            !recentImposters.includes(index)
    );

    const old = available.filter(
        index =>
            recentImposters.includes(index)
    );

    const pool = [
        ...fresh,
        ...old
    ];

    const chosen =
        pool.slice(0, imposterCount);

    recentImposters = [...chosen];

    return chosen;
}

/* =========================================================
   PRIVATE PLAYER REVEAL
========================================================= */

function showPlayerIdentity() {
    secretShown = false;

    const player =
        players[currentRevealIndex];

    const card =
        document.getElementById("revealCard");

    if (!card) return;

    const progress =
        (
            (currentRevealIndex + 1) /
            players.length
        ) * 100;

    const progressText =
        document.getElementById(
            "revealProgressText"
        );

    const progressBar =
        document.getElementById(
            "revealProgress"
        );

    if (progressText) {
        progressText.textContent =
            `PLAYER ${currentRevealIndex + 1} OF ${players.length}`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${progress}%`;
    }

    card.className = "reveal-card";

    card.innerHTML = `
        <div class="reveal-icon">
            👤
        </div>

        <div class="secret-label">
            THIS PLAYER
        </div>

        <div class="reveal-player">
            ${escapeHTML(player)}
        </div>

        <p class="reveal-description">
            Only ${escapeHTML(player)}
            should look at this screen.
        </p>

        <div class="category-lock">
            <span class="category-lock-label">
                CATEGORY
            </span>

            <span class="category-lock-value">
                ${escapeHTML(selectedCategory.name)}
            </span>
        </div>

        <button
            class="primary-btn"
            id="showSecretBtn"
            type="button"
        >
            SHOW WORD / ROLE
        </button>
    `;

    const showSecretBtn =
        document.getElementById(
            "showSecretBtn"
        );

    if (showSecretBtn) {
        showSecretBtn.addEventListener(
            "click",
            showCurrentSecret
        );
    }
}

/* =========================================================
   SHOW SECRET
========================================================= */

function showCurrentSecret() {
    secretShown = true;

    const player =
        players[currentRevealIndex];

    const isImposter =
        imposters.includes(currentRevealIndex);

    const card =
        document.getElementById("revealCard");

    if (!card) return;

    card.className = "reveal-card";

    if (isImposter) {
        card.classList.add("danger");

        card.innerHTML = `
            <div class="reveal-icon">
                🕵️
            </div>

            <div class="reveal-player">
                ${escapeHTML(player)}
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
                    ${escapeHTML(selectedCategory.name)}
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
                ${escapeHTML(player)}
            </div>

            <div class="role-badge safe-badge">
                CIVILIAN
            </div>

            <div class="secret-label">
                THE SECRET WORD IS
            </div>

            <div class="secret-word">
                ${escapeHTML(secretWord)}
            </div>

            <p class="reveal-description">
                Remember it. Don't show anyone.
            </p>

            <div class="category-lock">
                <span class="category-lock-label">
                    CATEGORY
                </span>

                <span class="category-lock-value">
                    ${escapeHTML(selectedCategory.name)}
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

    const hideRevealBtn =
        document.getElementById(
            "hideRevealBtn"
        );

    if (hideRevealBtn) {
        hideRevealBtn.addEventListener(
            "click",
            finishCurrentReveal
        );
    }
}

/* =========================================================
   FINISH CURRENT REVEAL
========================================================= */

function finishCurrentReveal() {
    secretShown = false;

    if (
        currentRevealIndex >=
        players.length - 1
    ) {
        showScreen(screens.discussion);
        return;
    }

    currentRevealIndex++;

    const passPlayerName =
        document.getElementById(
            "passPlayerName"
        );

    if (passPlayerName) {
        passPlayerName.textContent =
            `Give it to ${players[currentRevealIndex]}.`;
    }

    showScreen(screens.pass);
}

if (nextRevealBtn) {
    nextRevealBtn.addEventListener("click", () => {
        showPlayerIdentity();
        showScreen(screens.reveal);
    });
}

/* =========================================================
   DISCUSSION
========================================================= */

if (goVotingBtn) {
    goVotingBtn.addEventListener("click", () => {
        selectedVotes = [];

        renderVoting();

        showScreen(screens.voting);
    });
}

/* =========================================================
   VOTING
========================================================= */

function renderVoting() {
    const requiredVoteCount =
        document.getElementById(
            "requiredVoteCount"
        );

    if (requiredVoteCount) {
        requiredVoteCount.textContent =
            imposterCount;
    }

    const voteList =
        document.getElementById("voteList");

    if (!voteList) return;

    voteList.innerHTML = "";

    players.forEach((player, index) => {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "vote-card";

        if (selectedVotes.includes(index)) {
            button.classList.add("selected");
        }

        button.innerHTML = `
            <span class="avatar">
                ${escapeHTML(
                    player.charAt(0).toUpperCase()
                )}
            </span>

            <span>
                ${escapeHTML(player)}
            </span>

            <span class="vote-check">
                ${
                    selectedVotes.includes(index)
                        ? "✓"
                        : ""
                }
            </span>
        `;

        button.addEventListener("click", () => {
            toggleVote(index);
        });

        voteList.appendChild(button);
    });

    updateVoteCounter();
}

function toggleVote(index) {
    if (selectedVotes.includes(index)) {
        selectedVotes =
            selectedVotes.filter(
                vote => vote !== index
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
    const counter =
        document.getElementById(
            "voteCounter"
        );

    if (counter) {
        counter.textContent =
            `${selectedVotes.length} / ${imposterCount}`;
    }

    const submit =
        document.getElementById(
            "submitVoteBtn"
        );

    if (submit) {
        submit.disabled =
            selectedVotes.length !==
            imposterCount;
    }

    const status =
        document.getElementById(
            "voteStatus"
        );

    if (status) {
        status.textContent =
            selectedVotes.length === imposterCount
                ? "Ready to reveal."
                : `Choose ${imposterCount} player${
                    imposterCount === 1 ? "" : "s"
                  }.`;
    }
}

if (submitVoteBtn) {
    submitVoteBtn.addEventListener("click", () => {
        if (
            selectedVotes.length !==
            imposterCount
        ) {
            return;
        }

        voteRevealIndex = 0;

        renderVoteReveal();

        showScreen(screens.voteReveal);
    });
}

/* =========================================================
   VOTE REVEAL
========================================================= */

function renderVoteReveal() {
    const selectedIndex =
        selectedVotes[voteRevealIndex];

    const player =
        players[selectedIndex];

    const isActuallyImposter =
        imposters.includes(selectedIndex);

    const progress =
        (
            (voteRevealIndex + 1) /
            selectedVotes.length
        ) * 100;

    const progressText =
        document.getElementById(
            "voteRevealProgressText"
        );

    const progressBar =
        document.getElementById(
            "voteRevealProgress"
        );

    if (progressText) {
        progressText.textContent =
            `REVEAL ${voteRevealIndex + 1} OF ${selectedVotes.length}`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${progress}%`;
    }

    const card =
        document.getElementById(
            "voteRevealCard"
        );

    if (!card) return;

    card.className = "reveal-card";

    if (isActuallyImposter) {
        card.classList.add("danger");

        card.innerHTML = `
            <div class="reveal-icon">
                🕵️
            </div>

            <div class="reveal-player">
                ${escapeHTML(player)}
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
                ${escapeHTML(player)}
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

    const nextBtn =
        document.getElementById(
            "nextVoteRevealBtn"
        );

    if (nextBtn) {
        nextBtn.addEventListener(
            "click",
            nextVoteReveal
        );
    }
}

function nextVoteReveal() {
    if (
        voteRevealIndex >=
        selectedVotes.length - 1
    ) {
        calculateResult();

        showScreen(screens.result);

        return;
    }

    voteRevealIndex++;

    renderVoteReveal();
}

/* =========================================================
   CALCULATE RESULT
========================================================= */

function calculateResult() {
    const caught =
        selectedVotes.filter(
            index =>
                imposters.includes(index)
        ).length;

    const allCaught =
        caught === imposters.length;

    result = {
        caught: caught,
        allCaught: allCaught
    };

    renderResult();
}

/* =========================================================
   FINAL RESULT
========================================================= */

function renderResult() {
    const icon =
        document.getElementById("resultIcon");

    const eyebrow =
        document.getElementById("resultEyebrow");

    const title =
        document.getElementById("resultTitle");

    const description =
        document.getElementById(
            "resultDescription"
        );

    if (result && result.allCaught) {
        if (icon) {
            icon.className =
                "result-icon caught";

            icon.textContent = "✓";
        }

        if (eyebrow) {
            eyebrow.textContent =
                "ROUND WON";
        }

        if (title) {
            title.textContent =
                "IMPOSTERS CAUGHT!";
        }

        if (description) {
            description.textContent =
                "The group successfully identified every imposter.";
        }
    } else {
        if (icon) {
            icon.className =
                "result-icon escaped";

            icon.textContent = "✕";
        }

        if (eyebrow) {
            eyebrow.textContent =
                "IMPOSTERS ESCAPED";
        }

        if (title) {
            title.textContent =
                "THEY GOT AWAY!";
        }

        if (description) {
            description.textContent =
                `${result ? result.caught : 0} of ${imposters.length} imposters were caught.`;
        }
    }

    const actualList =
        document.getElementById(
            "actualImpostersList"
        );

    if (!actualList) return;

    actualList.innerHTML = `
        <div class="final-results-grid">

            <div class="final-result-column">
                <div class="final-column-title">
                    🕵️ ACTUAL IMPOSTERS
                </div>

                <div id="actualPlayersColumn"></div>
            </div>

            <div class="final-result-column">
                <div class="final-column-title">
                    🗳️ YOUR VOTES
                </div>

                <div id="votedPlayersColumn"></div>
            </div>

        </div>
    `;

    const actualColumn =
        document.getElementById(
            "actualPlayersColumn"
        );

    const votedColumn =
        document.getElementById(
            "votedPlayersColumn"
        );

    /*
       Correctly voted imposters align opposite
       themselves.

       If an actual imposter escaped, they are
       aligned opposite another escaped/wrong vote.

       If every vote was civilian, the remaining
       alignment is randomized.
    */

    const pairs =
        createAlignedResultPairs();

    pairs.forEach(pair => {
        const actualIndex =
            pair.actual;

        const votedIndex =
            pair.voted;

        if (
            actualIndex === undefined ||
            votedIndex === undefined
        ) {
            return;
        }

        const actualPlayer =
            document.createElement("div");

        actualPlayer.className =
            "final-player actual";

        const actualWasVoted =
            selectedVotes.includes(
                actualIndex
            );

        actualPlayer.innerHTML = `
            <span class="avatar">
                ${escapeHTML(
                    players[actualIndex]
                        .charAt(0)
                        .toUpperCase()
                )}
            </span>

            <span class="final-player-name">
                ${escapeHTML(
                    players[actualIndex]
                )}
            </span>

            ${
                actualWasVoted
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

        const votedPlayer =
            document.createElement("div");

        votedPlayer.className =
            "final-player voted";

        const votedWasImposter =
            imposters.includes(
                votedIndex
            );

        votedPlayer.innerHTML = `
            <span class="avatar">
                ${escapeHTML(
                    players[votedIndex]
                        .charAt(0)
                        .toUpperCase()
                )}
            </span>

            <span class="final-player-name">
                ${escapeHTML(
                    players[votedIndex]
                )}
            </span>

            ${
                votedWasImposter
                    ? `
                        <span class="correct-mark">
                            IMPOSTER ✓
                        </span>
                      `
                    : `
                        <span class="miss-mark">
                            CIVILIAN ✕
                        </span>
                      `
            }
        `;

        if (actualColumn) {
            actualColumn.appendChild(
                actualPlayer
            );
        }

        if (votedColumn) {
            votedColumn.appendChild(
                votedPlayer
            );
        }
    });

    renderDareResult();
}

/* =========================================================
   RESULT PAIRING
========================================================= */

function createAlignedResultPairs() {
    const actual =
        [...imposters];

    const votes =
        [...selectedVotes];

    const pairs = [];

    /*
       1. Correctly voted imposters align
          directly opposite themselves.
    */

    const correctVotes =
        actual.filter(
            index =>
                votes.includes(index)
        );

    const usedActual =
        new Set();

    const usedVotes =
        new Set();

    correctVotes.forEach(index => {
        pairs.push({
            actual: index,
            voted: index
        });

        usedActual.add(index);
        usedVotes.add(index);
    });

    /*
       2. Remaining actual imposters
          are escaped imposters.
    */

    const remainingActual =
        actual.filter(
            index =>
                !usedActual.has(index)
        );

    /*
       3. Remaining votes are wrong votes.
    */

    const remainingVotes =
        votes.filter(
            index =>
                !usedVotes.has(index)
        );

    /*
       Randomize the wrong votes so that
       escaped imposters do not always appear
       against the same civilian.
    */

    shuffleArray(remainingVotes);

    /*
       Align each escaped actual imposter
       against one remaining vote.

       If all votes were civilians, this
       automatically creates random alignment.
    */

    remainingActual.forEach(
        (actualIndex, position) => {
            if (
                remainingVotes[position] !==
                undefined
            ) {
                pairs.push({
                    actual: actualIndex,
                    voted: remainingVotes[position]
                });
            }
        }
    );

    return pairs;
}

/* =========================================================
   DARE ON FINAL PAGE
========================================================= */

function renderDareResult() {
    const dareResult =
        document.getElementById(
            "dareResult"
        );

    if (!dareResult) return;

    if (!dareText) {
        dareResult.classList.add("hidden");
        return;
    }

    dareResult.classList.remove("hidden");

    const message =
        document.getElementById(
            "dareResultMessage"
        );

    const finalDare =
        document.getElementById(
            "finalDare"
        );

    if (message) {
        message.textContent =
            "THE DARE FOR THIS ROUND";
    }

    if (finalDare) {
        finalDare.textContent =
            dareText;
    }
}

/* =========================================================
   PLAY AGAIN
   RETURNS TO CATEGORY PAGE
========================================================= */

if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
        selectedVotes = [];
        voteRevealIndex = 0;

        result = null;

        dareEnabled = null;
        dareText = "";

        secretWord = "";

        imposters = [];

        currentRevealIndex = 0;
        secretShown = false;

        /*
           Keep players.
           Keep category.
           Return directly to category page.
        */

        resetDareState();

        renderCategories();

        showScreen(screens.category);
    });
}

/* =========================================================
   NEW PLAYERS
========================================================= */

if (newPlayersBtn) {
    newPlayersBtn.addEventListener("click", () => {
        players = [];

        selectedCategory = null;
        selectedCategoryIndex = null;
        customCategory = null;

        imposters = [];
        recentImposters = [];

        secretWord = "";

        selectedVotes = [];

        voteRevealIndex = 0;

        result = null;

        imposterCount = 1;

        dareEnabled = null;
        dareText = "";

        currentRevealIndex = 0;
        secretShown = false;

        resetDareState();

        renderPlayers();
        renderCategories();

        showScreen(screens.players);
    });
}

/* =========================================================
   UTILITY — RANDOM ITEM
========================================================= */

function randomItem(array) {
    if (!array || array.length === 0) {
        return "";
    }

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}

/* =========================================================
   UTILITY — SHUFFLE
========================================================= */

function shuffleArray(array) {
    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {
        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }

    return array;
}

/* =========================================================
   UTILITY — HTML ESCAPE
========================================================= */

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =========================================================
   INITIALIZATION
========================================================= */

function initializeGame() {
    players = [];

    selectedCategory = null;
    selectedCategoryIndex = null;
    customCategory = null;

    imposterCount = 1;

    dareEnabled = null;
    dareText = "";

    secretWord = "";

    imposters = [];
    recentImposters = [];

    currentRevealIndex = 0;
    secretShown = false;

    selectedVotes = [];
    voteRevealIndex = 0;

    result = null;

    renderPlayers();
    renderCategories();
    updateImposterOptions();
    updateStartRoundButton();

    showScreen(screens.home);
}

/* =========================================================
   START
========================================================= */

>>>>>>> 5196cfa6028afc15ab27b7bc237eb2ece1972928
initializeGame();