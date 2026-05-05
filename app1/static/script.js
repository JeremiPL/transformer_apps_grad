const formEl = document.getElementById("prompt-form");
const promptEl = document.getElementById("prompt");
const submitBtnEl = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const responseEl = document.getElementById("response");

formEl.addEventListener("submit", async (event) => {
	event.preventDefault();

	const text = promptEl.value.trim();
	if (!text) {
		statusEl.textContent = "Please enter some text.";
		return;
	}

	statusEl.textContent = "Loading...";
	responseEl.textContent = "";
	submitBtnEl.disabled = true;

	try {
		const response = await fetch(`/classify?text=${encodeURIComponent(text)}`);
		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const result = await response.json();
		responseEl.textContent = result;
		statusEl.textContent = "";
	} catch (error) {
		statusEl.textContent = `Request failed: ${error.message}`;
	} finally {
		submitBtnEl.disabled = false;
	}
});
