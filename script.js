document.addEventListener("DOMContentLoaded", function () {
	const inputElements = document.getElementsByClassName("wordle-input");
	DailyGame(inputElements);
});

async function DailyGame(inputElements) {
	const guess = await getDailyWord();
	const guessArray = await guess.split("");
	for (let i = 0; i < inputElements.length; i++) {
		inputElements[i].addEventListener("input", function (event) {
			const input = event.target;
			const value = input.value;
			if (value.length > 1) {
				input.value = value.charAt(0);
			}

			if (
				i < inputElements.length - 1 &&
				value.length === 1 &&
				!(i === 4 || i === 9 || i === 14 || i === 19 || i === 24)
			) {
				inputElements[i + 1].focus();
			}

			if (value.length === 1 && !isLetter(value)) {
				input.classList.add("invalid");
			} else {
				input.classList.remove("invalid");
			}

			if (i === 4 || i === 9 || i === 14 || i === 19 || i === 24) {
				let rowIndex = i / 5;
				rowIndex = rowIndex.toFixed(0);

				let word = getWordFromRow("row-" + rowIndex);

				validWord(word).then((isValid) => {
					if (!isValid) {
						for (let j = i - 4; j <= i; j++) {
							inputElements[j].classList.add("invalid");
						}
					} else {
						let counter = 0;
						for (let j = i - 4; j <= i; j++) {
							inputElements[j].classList.remove("invalid");
							inputElements[j].classList.add("inactive");
							for (let k = 0; k < guessArray.length; k++) {
								if (inputElements[j].value === guessArray[k]) {
									if (j % 5 === k) {
										inputElements[j].classList.add("correct");
										counter++;
									} else {
										inputElements[j].classList.add("half-correct");
									}
								}
								if (counter === 5) {
									alert("You win!");
								}
							}
						}
						for (let j = i + 1; j <= i + 4; j++) {
							if (counter < 5) inputElements[j].classList.remove("inactive");

							if (j === i + 4 && counter < 5) inputElements[j - 3].focus();
						}
					}
				});
			}
		});
	}
}

function isLetter(str) {
	str = str.toLowerCase();
	return str.match(/[a-z]/i);
}

function getWordFromRow(row) {
	let word = "";
	const inputs = document.getElementsByClassName(row);
	for (i = 0; i < inputs.length; i++) {
		word += inputs[i].value;
	}
	return word.toLowerCase();
}

async function validWord(word) {
	const response = await fetch("https://words.dev-apis.com/validate-word", {
		method: "POST",
		body: JSON.stringify({
			word: word,
		}),
	});
	const data = await response.json();
	return data.validWord;
}

async function getDailyWord() {
	const response = await fetch("https://words.dev-apis.com/word-of-the-day");
	const data = await response.json();
	return data.word;
}
