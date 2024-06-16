// Categories of items to match
const categories = {
    emojis: ["🖕","✌","🤟","🤜","👍","🙏","🧠","💪","🤍","☠","👺","❤","💙","😝","🙃","😂","🤥","👿"],
    animals: ["🐵","🦊","🐻","🐼","🐧","🐥","🐟","🐅","🐓","🐲","🐑","🦓","🦎","🪰","🐞","🦉","🐝","🦀","🪲","🐛","🦚","🦔"],
    fruits: ["🍎","🍏","🍇","🍓","🫐","🍒","🍋‍🟩","🍌","🍋","🥑","🌶","🥒","🥕","🥭","🍉","🍄","🌻","🍕","🍨","🍫","🍩"],
    sports: ["⚽","🏈","🎾","🏓","🏏","🥊","🛼","🛹","⛳","🎯","🧩","🥁","🎲","🎗","🥇","🏆","🎻","🎮","♟"],
    vehicles: ["✈","🚔","🚜","🚗","🚑","🚲","🛴","🏍","🛺","🛞","🚀","🛟","🚦","🛥","⛱","🚧","🛸","🚁"],
    numbers: ["#️⃣","*️⃣","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔢","🔠","🔤","🆗","🆒"]
};

// Shuffling function
function shuffle(array) {
    let tmp, c, p = array.length;
    if (p) while (--p) {
        c = Math.floor(Math.random() * (p + 1));
        tmp = array[c];
        array[c] = array[p];
        array[p] = tmp;
    }
    return array;
}

// Variables
let em = categories.smileys; // default category
let pre = "", pID, ppID = 0, turn = 0, t = "transform", flip = "rotateY(180deg)", flipBack = "rotateY(0deg)", time, mode;

// Resizing Screen
window.onresize = init;
function init() {
    W = innerWidth;
    H = innerHeight;
    $('body').height(H + "px");
    $('#ol').height(H + "px");
}

// Showing instructions and category selection
window.onload = function() {
    const categoryOptions = Object.keys(categories).map(category => `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`).join('');
    $("#ol").html(`
        <center>
            <div id="inst">
                <h3>Welcome !</h3>
                Instructions For Game<br/><br/>
                <li>Make pairs of similar blocks by flipping them.</li>
                <li>To flip a block you can click on it.</li>
                <li>If two blocks you clicked are not similar, they will be flipped back.</li>
                <p style="font-size:18px;">Select a category and a mode to start the game.</p>
                <select id="categorySelect">${categoryOptions}</select>
            </div>
            <button onclick="start(3, 4)">3 x 4</button>
            <button onclick="start(4, 4)">4 x 4</button>
            <button onclick="start(4, 5)">4 x 5</button>
            <button onclick="start(5, 6)">5 x 6</button>
            <button onclick="start(6, 6)">6 x 6</button>
        </center>
    `);
}

// Starting the game
function start(r, l) {
    const selectedCategory = $('#categorySelect').val();
    em = categories[selectedCategory];
    em = shuffle([...em]); // Shuffle the selected category

    // Timer and moves
    min = 0, sec = 0, moves = 0;
    $("#time").html("Time: 00:00");
    $("#moves").html("Moves: 0");
    time = setInterval(function() {
        sec++;
        if (sec == 60) {
            min++;
            sec = 0;
        }
        if (sec < 10)
            $("#time").html("Time: 0" + min + ":0" + sec);
        else
            $("#time").html("Time: 0" + min + ":" + sec);
    }, 1000);
    rem = r * l / 2, noItems = rem;
    mode = r + "x" + l;

    // Generating item array and shuffling it
    let items = [];
    for (let i = 0; i < noItems; i++)
        items.push(em[i]);
    for (let i = 0; i < noItems; i++)
        items.push(em[i]);
    items = shuffle(items);

    // Creating table
    $("table").html("");
    let n = 1;
    for (let i = 1; i <= r; i++) {
        $("table").append("<tr>");
        for (let j = 1; j <= l; j++) {
            $("table").append(`<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'><p>${items[n - 1]}</p></div></div></td>`);
            n++;
        }
        $("table").append("</tr>");
    }

    // Hiding instructions screen
    $("#ol").fadeOut(500);
}

// Function for flipping blocks
function change(x) {
    // Variables
    let i = "#" + x + " .inner";
    let f = "#" + x + " .inner .front";
    let b = "#" + x + " .inner .back";

    // Dont flip for these conditions
    if (turn == 2 || $(i).attr("flip") == "block" || ppID == x) {}

    // Flip
    else {
        $(i).css(t, flip);
        if (turn == 1) {
            // This value will prevent spam clicking
            turn = 2;

            // If both flipped blocks are not same
            if (pre != $(b).text()) {
                setTimeout(function() {
                    $(pID).css(t, flipBack);
                    $(i).css(t, flipBack);
                    ppID = 0;
                }, 1000);
            }

            // If blocks flipped are same
            else {
                rem--;
                $(i).attr("flip", "block");
                $(pID).attr("flip", "block");
            }

            setTimeout(function() {
                turn = 0;
                // Increase moves
                moves++;
                $("#moves").html("Moves: " + moves);
            }, 1150);

        } else {
            pre = $(b).text();
            ppID = x;
            pID = "#" + x + " .inner";
            turn = 1;
        }

        // If all pairs are matched
        if (rem == 0) {
            clearInterval(time);
            let timeTaken = (min == 0) ? `${sec} seconds` : `${min} minute(s) and ${sec} second(s)`;
            setTimeout(function() {
                $("#ol").html(`
                    <center>
                        <div id="iol">
                            <h2>Congrats!</h2>
                            <p style="font-size:23px;padding:10px;">You completed the ${mode} mode in ${moves} moves. It took you ${timeTaken}.</p>
                            <p style="font-size:18px">Comment Your Score!<br/>Play Again ?</p>
                            <select id="categorySelect">${Object.keys(categories).map(category => `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`).join('')}</select>
                            <button onclick="start(3, 4)">3 x 4</button>
                            <button onclick="start(4, 4)">4 x 4</button>
                            <button onclick="start(4, 5)">4 x 5</button>
                            <button onclick="start(5, 6)">5 x 6</button>
                            <button onclick="start(6, 6)">6 x 6</button>
                        </div>
                    </center>
                `);
                $("#ol").fadeIn(750);
            }, 1500);
        }
    }
}

