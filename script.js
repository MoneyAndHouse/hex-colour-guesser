const myInput = document.getElementById("guess-input");
const modal = document.getElementById("win-modal");
const guessSquare = document.getElementById("guessed-colour-square");
const targetSquare = document.getElementById("target-colour-square");
const parentSection = document.getElementById("guessed-codes-section");
const pFeedback = document.getElementById("feedback-text");
const arrHexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
const hexNumbers = "0123456789ABCDEF";


let numOfGuesses = 5;
let currentResult = '';
let colour = "#";
let hasWon = false;

for (let i = 0; i < 6; i++) {
    const randomNumber = Math.floor(Math.random() * 16);
    colour += hexNumbers[randomNumber];
}
targetSquare.style.backgroundColor = colour;

document.getElementById("submit-guess").onclick = function() {
    if (hasWon || numOfGuesses <= 0) {
        return;
    }
    const code = myInput.value.toUpperCase();
    if (code.length != 7) {
        pFeedback.innerHTML = "Hex code must be 6 digits. Try again.";
        return;
    }
    for (let i = 1; i < code.length; i++) {
        if (!arrHexDigits.includes(code[i])) {
            pFeedback.innerHTML = "Invalid code. All digits must be in the range 0-9 or A-F.";
            return;
        }
    }

    numOfGuesses -= 1;
    pFeedback.innerHTML = `${numOfGuesses} guesses left!`;

    const parentDiv = document.createElement("div");
    parentDiv.className = "guessed-code";
    hexLogic(code, parentDiv);
    guessSquare.style.backgroundColor = code;
    parentSection.insertBefore(parentDiv, parentSection.children[1]);
    myInput.value = "#";

    if (code == colour) {
        const output = document.getElementById("modal-result");
        const answer = document.getElementById("modal-answer");
        answer.innerHTML = `The hidden colour was <strong>${code}</strong>`;
        pFeedback.textContent = "Congratulations!!";
        myInput.readOnly = true;
        modal.classList.add("open");
        output.textContent += currentResult + "\n";
        hasWon = true;
    } else if (numOfGuesses == 0) {
        pFeedback.textContent = `Out of guesses! The colour was ${colour}`;
    }
}

function hexLogic(code, parentDiv) {
    for (let i = 1; i < code.length; i++) {
        const div = document.createElement("div");
        div.className = "guessed-code-element";
        parentDiv.appendChild(div);

        let p1 = document.createElement("p");
        p1.innerHTML = code[i];
        div.appendChild(p1);

        let p2 = document.createElement("p");
        if (convertToDecimal(code[i]) >= (convertToDecimal(colour[i]) + 3)) {
            currentResult += "⏬️";
            p2.innerHTML = "⏬️";
        } else if (convertToDecimal(code[i]) <= convertToDecimal(colour[i]) - 3) {
            currentResult += "⏫️";
            p2.innerHTML = "⏫️";
        }
        else if (convertToDecimal(code[i]) > convertToDecimal(colour[i])) {
            currentResult += "🔽";
            p2.innerHTML = "🔽";
        } else if (convertToDecimal(code[i]) < convertToDecimal(colour[i])) {
            currentResult += "🔼";
            p2.innerHTML = "🔼";
        }
        else if (convertToDecimal(code[i]) == convertToDecimal(colour[i])) {
            currentResult += "✅";
            p2.innerHTML = "✅";
        }
        div.appendChild(p2);
    }

    currentResult += "\n";
    for (let i = 0; i < parentDiv.children.length; i++) {
        parentDiv.children[i].style.border = `4px solid ${code}`;
    }
}

myInput.addEventListener("input", function() {
    const code = myInput.value.toUpperCase();

    if (code[0] != "#") {
        this.value = "#" + code.replace(/#/g, "");
    }
});
myInput.addEventListener("keydown", function(e) {
    if ((e.key === "Backspace" || e.key === "Delete") && this.selectionStart === 1) {
        e.preventDefault();
    } else if (e.key === "Enter") {
        document.getElementById("submit-guess").click();
    }
});

function convertToDecimal(hexDigit) {
    let total = 0;
    for (let i = 1; i <= hexDigit.length; i++) {
        switch (hexDigit[i - 1]) {
            case "A":
                total += 10 * Math.pow(16, (hexDigit.length - i));
                break;
            case "B":
                total += 11 * Math.pow(16, (hexDigit.length - i));
                break;
            case "C":
                total += 12 * Math.pow(16, (hexDigit.length - i));
                break;
            case "D":
                total += 13 * Math.pow(16, (hexDigit.length - i));
                break;
            case "E":
                total += 14 * Math.pow(16, (hexDigit.length - i));
                break;
            case "F":
                total += 15 * Math.pow(16, (hexDigit.length - i));
                break;
            case "#":
                continue;
            default:
                total += Number(hexDigit[i - 1]) * Math.pow(16, (hexDigit.length - i));
        }
    }
    return total;
}

document.getElementById("modal-exit-btn").onclick = function() {
    modal.classList.remove("open");
}
modal.addEventListener("click", function(e) {
    if (e.target === modal) {
        modal.classList.remove("open");
    }
})
