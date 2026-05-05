const formEl = document.getElementById("prompt-form");
const promptEl = document.getElementById("prompt");
const submitBtnEl = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const responseWithoutEl = document.getElementById("response-without");
const responseWithEl = document.getElementById("response-with");

formEl.addEventListener("submit", async (event) => {
	event.preventDefault();

	const text = promptEl.value.trim();
	if (!text) {
		statusEl.textContent = "Please enter some text.";
		return;
	}

	statusEl.textContent = "Loading...";
	responseWithoutEl.textContent = "";
	responseWithEl.textContent = "";
	submitBtnEl.disabled = true;

	try {
		const [withoutResponse, withResponse] = await Promise.all([
			fetch(`/ask_without?text=${encodeURIComponent(text)}`),
			fetch(`/ask_with?text=${encodeURIComponent(text)}`),
		]);

		if (!withoutResponse.ok) {
			throw new Error(`/ask_without failed with status ${withoutResponse.status}`);
		}

		if (!withResponse.ok) {
			throw new Error(`/ask_with failed with status ${withResponse.status}`);
		}

		const [withoutResult, withResult] = await Promise.all([
			withoutResponse.json(),
			withResponse.json(),
		]);

		responseWithoutEl.textContent = withoutResult;
		responseWithEl.textContent = withResult;
		statusEl.textContent = "";
	} catch (error) {
		statusEl.textContent = `Request failed: ${error.message}`;
	} finally {
		submitBtnEl.disabled = false;
	}
});
