var RIDDLING_GAME = "riddling";
var LEVEL = 0, answer=document.getElementById("answer"), answers = ['',''];
function toggleAbout() { document.getElementById("about").classList.toggle("showing"); }
function hideAbout(e) {
    if (e.target.nodeName.toLowerCase() == "a") {
        return;
    }
    document.getElementById("about").classList.remove("showing");
    e.preventDefault();
}
document.getElementById("about").addEventListener("touchstart", hideAbout, false);
document.getElementById("about").addEventListener("click", hideAbout, false);
function resetgame() {
    localStorage.removeItem(RIDDLING_GAME + "answers");
    localStorage.removeItem(RIDDLING_GAME + "quote");
    location.reload();
}
function hidequote() {
    localStorage.setItem(RIDDLING_GAME + "quote", "quote");
    var q = document.getElementById("quote");
    q.classList.add("faded");
    setTimeout(function() {
        q.parentNode.removeChild(document.getElementById("quote"));
        answer.focus();
    }, 400);
}
answer.onfocus = function() {
    setTimeout(function() { window.scrollTop = 0; }, 0);
}
function updateAnswersPage() {
    var ul = document.querySelector(".answers ul");
    ul.innerHTML = "";
    for (var i=2; i<answers.length; i++) {
        var li = document.createElement("li");
        var strong = document.createElement("strong");
        var span = document.createElement("span");
        var em = document.createElement("em");
        strong.appendChild(document.createTextNode((i-1).toString()));
        span.appendChild(document.createTextNode(answers[i].answer));
        em.innerHTML = answers[i].explanation;
        span.appendChild(em);
        li.appendChild(strong);
        li.appendChild(span);
        ul.appendChild(li);
    }
}
function loadAnswersFromStorage() {
    if (window.localStorage) {
        var ls = localStorage[RIDDLING_GAME + "answers"];
        try {
            var a = JSON.parse(localStorage[RIDDLING_GAME + "answers"]);
            if (a.length) {
                answers = a;
                LEVEL = answers.length - 1 - 1; // one less to be on level, one more less because we inclevel now
                updateAnswersPage();
            }
        } catch(e) {}
    }
}
var LAST_FLIPPED_ANSWER_TIME = 0;
function showAnswers() {
    var timenow = Date.now();
    if (timenow - LAST_FLIPPED_ANSWER_TIME < 1000) return;
    LAST_FLIPPED_ANSWER_TIME = timenow;
    answer.blur();
    document.body.classList.add("show-subsidiary");
    document.body.classList.add("answers");
}
function unflip() {
    var timenow = Date.now();
    if (timenow - LAST_FLIPPED_ANSWER_TIME < 1000) return;
    LAST_FLIPPED_ANSWER_TIME = timenow;
    document.body.classList.remove("show-subsidiary");
    document.body.classList.remove("answers");
    setTimeout(function() { answer.focus(); }, 300);
}
function winscreen() {
    document.getElementById("winscreen").className = "showing";
}
function incrementLevel() {
    answer.value = "";
    document.body.classList.remove("right");
    LEVEL += 1;
    if (LEVEL >= (riddles.length-1)) {
        winscreen();
        return;
    }
    document.querySelector("p span span").innerHTML = riddles[LEVEL+1].clue;
    document.querySelector("h2 strong span").innerHTML = LEVEL;
    setTimeout(function() {
        if (window.localStorage && localStorage[RIDDLING_GAME + "quote"] == "quote") {
            // don't focus if the quote is showing
            answer.focus();
        }
    }, 300);
}

function interceptLinks() {
    Array.prototype.slice.call(document.querySelectorAll("a")).forEach(function(a) {
        a.addEventListener("click", function(e) {
            window.open(a.href, "_system");
            e.preventDefault();
        }, false);
    });
}

function playMedia(mediaElementId) {
    if (document.querySelector("h1 button.sound img").src.indexOf("mute") != -1) return;
    document.getElementById(mediaElementId).play();
}

function toggleSound() {
    var img = document.querySelector("h1 button.sound img");
    if (img.src.indexOf("mute") == -1) {
        img.src = "images/audio-volume-muted-symbolic.svg";
        localStorage.setItem(RIDDLING_GAME + "sound", "mute");
    } else {
        img.src = "images/audio-volume-high-symbolic.svg";
        localStorage.setItem(RIDDLING_GAME + "sound", "play");
    }
}

function showHelp(e) {
    document.getElementById("help").style.display = "block";
    Array.prototype.slice.call(document.querySelectorAll("span.levelno")).forEach(function(s) {
        s.innerHTML = LEVEL.toString();
    })
    Array.prototype.slice.call(document.querySelectorAll("span.levelup")).forEach(function(s) {
        s.innerHTML = (LEVEL + 1).toString();
    })
    nextHelp(e);
}
function nextHelp(e) {
    var ring = document.getElementById("ring");
    var line = document.getElementById("line");
    function setRingTo(helpsection, selector) {
        var el = document.querySelector(selector).getBoundingClientRect();
        ring.style.width = el.width + "px";
        ring.style.height = el.height + "px";
        ring.style.top = el.top + "px";
        ring.style.left = el.left + "px";
        ring.style.display = "block";
        var words = document.getElementById(helpsection).getBoundingClientRect();
        line.style.left = words.left + "px";
        line.style.top = (el.bottom - 3) + "px";
        line.style.height = (words.top - el.bottom) + 3 + "px";
        var reqw = ((el.width / 2) + el.left - words.left);
        line.style.width = reqw + "px";
        line.style.display = "block";
        line.getElementsByTagName("path")[0].style.strokeWidth = (document.body.offsetWidth - reqw) / 100;
    }

    e.preventDefault();
    var h = document.getElementById("help");
    var nclass;
    switch (h.className) {
        case "": nclass = "help-level"; setRingTo(nclass, "#main > h2 strong"); break;
        case "help-level": nclass = "help-clue"; setRingTo(nclass, "#main > p"); break;
        case "help-clue": nclass = "help-answer"; setRingTo(nclass, "#main form"); break;
        case "help-answer": nclass = null; ring.style.display = "none"; line.style.display = "none"; break;
        default: nclass = null; break;
    }
    if (nclass) {
        h.className = nclass;
    } else {
        h.className = "";
        document.getElementById("help").style.display = "none";
    }
}

function confirmLocalStorageOK() {
    try {
        localStorage.setItem("lsok", "yes");
    } catch(e) {
        document.getElementById("lswarning").style.display = "block";
    }
}

function formsubmit() {
    answer.blur();
    if (answer.value == "CHEAT") {
        winscreen();
        e.preventDefault();
        return false;
    }
    if (exports.checksum(answer.value.toLowerCase()) == riddles[LEVEL+1].answer || exports.checksum(answer.value.toLowerCase()) == universal) {
        if (exports.checksum(answer.value.toLowerCase()) == universal) {
            // used the universal answer
            document.querySelector("#right h4 strong").innerHTML = "???";
            document.querySelector("#right p").innerHTML = "(no explanations for cheaters)";
            answers.push({
                answer: "(cheated)",
                explanation: "(no explanations for cheaters)",
                time: new Date().getTime()
            });
        } else {
            // got it right
            document.querySelector("#right h4 strong").innerHTML = answer.value;
            document.querySelector("#right p").innerHTML = exports.decrypt(answer.value.toLowerCase(), riddles[LEVEL+1].explanation);
            answers.push({
                answer: answer.value.toLowerCase(),
                explanation: exports.decrypt(answer.value.toLowerCase(), riddles[LEVEL+1].explanation),
                time: new Date().getTime()
            });
        }
        document.querySelector("#right h4 span").innerHTML = LEVEL+1;
        document.body.classList.add("right");
        playMedia("soundright");
        setTimeout(incrementLevel, 3300);
        localStorage.setItem(RIDDLING_GAME + "answers", JSON.stringify(answers));
        updateAnswersPage();
    } else {
        document.body.classList.add("wrong");
        document.body.classList.add("no-subsidiary");
        playMedia("soundwrong");
        setTimeout(function() {
            document.body.classList.remove("wrong");
            setTimeout(function() {
                document.body.classList.remove("no-subsidiary");
                answer.focus();
            }, 300);
        }, 1050);
    }
}
document.getElementsByTagName("form")[0].addEventListener("submit", function(e) {
    e.preventDefault();
    try {
        formsubmit(e);
    } catch(err) {
        console.log("submit error", err);
    }
}, false);

if (window.localStorage && localStorage[RIDDLING_GAME + "quote"] == "quote") {
    document.getElementById("quote").parentNode.removeChild(document.getElementById("quote"));
}

if (window.localStorage && localStorage[RIDDLING_GAME + "sound"] == "mute") {
    document.querySelector("h1 button.sound img").src = "images/audio-volume-muted-symbolic.svg";
}

confirmLocalStorageOK();

loadAnswersFromStorage();
incrementLevel();
document.getElementById("whiteness").style.display = "none";
document.getElementById("help").addEventListener("click", nextHelp, false);
document.getElementById("help").addEventListener("touchstart", nextHelp, false);
document.querySelector("button.helpbutton").addEventListener("click", showHelp, false);
document.querySelector("button.helpbutton").addEventListener("touchstart", showHelp, false);

if (window.screen.availHeight < 650) { document.body.className += " shrunk"; }
