const GUID = () => {
	return (
		"id_" +
		"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		})
	);
};

const validateEmail = (val) => {
	var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(val);
};

const dialogBuilder = (data) => {
	const modalId = GUID();
	const btnCloseId = GUID();

	let { title, body, footer, closeTitle, css, onClose, showCloseHeader } = data;

	title = title || "";
	body = body || "";
	footer = footer || "";
	closeTitle = closeTitle;
	css = css || "modal-lg";

	let tmplCloseButton = "";
	let tmplCloseSmall = "";
	let tmplModalTitle = "";
	let tmplModalHeader = "";

	if (onClose !== undefined && onClose !== null) {
		tmplCloseButton = `<button type="button" id="${btnCloseId}" class="btn btn-secondary">${closeTitle}</button>`;
	}

	if (showCloseHeader) {
		tmplCloseSmall = `<button id="${btnCloseId}_small" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
	}

	if (title !== undefined && title !== null && title !== "") {
		tmplModalTitle = `<h5 class="modal-title">${title}</h5>`;
	}

	if (tmplModalTitle !== "" || tmplCloseSmall !== "") {
		tmplModalHeader = `<div class="modal-header">${tmplModalTitle}${tmplCloseSmall}</div>`;
	}

	const modalTemplate = `
    <div class="modal" id="${modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog ${css}">
            <div class="modal-content">
                ${tmplModalHeader}
                <div class="modal-body">
                    ${body}
                </div>
                <div class="modal-footer">
                    ${tmplCloseButton}
                    ${footer}
                </div>
            </div>
        </div>
    </div>`;

	$("body").append($(modalTemplate));
	const modal = new bootstrap.Modal(document.getElementById(modalId), { backdrop: "static" });

	const dismiss = () => {
		modal.hide();
		modal.dispose();
		$(`#${modalId}`).remove();
	};

	$(`#${btnCloseId}_small`).on("click", () => {
		onClose(dismiss, `#${btnCloseId}_small`);
	});

	$(`#${btnCloseId}`).on("click", () => {
		$(`#${btnCloseId}`).html(`
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">loading...</span>
        `);
		onClose(dismiss, btnCloseId);
	});

	return {
		modal,
		dismiss,
		btnCloseId
	};
};

const post = (url, data) => {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	const raw = JSON.stringify(data);
	const requestOptions = {
		method: "POST",
		headers: headers,
		body: raw,
		credentials: "include"
	};
	return fetch(url, requestOptions).catch((error) => console.log("api-error", error));
};

const uploadFile = (type, fileData) => {
	const formData = new FormData();
	formData.append("file", fileData);
	const queryParams = { type };

	return fetch(`/api/v1/admin/upload-file?${new URLSearchParams(queryParams)}`, {
		method: "POST",
		body: formData,
		redirect: "follow",
		credentials: "include"
	});
};

const applyValidationMessages = (formElement, errors, formKeys) => {
	for (var key in errors) {
		if (errors.hasOwnProperty(key)) {
			$(formElement).find(formKeys[key]).addClass("is-invalid");
			const errorsArray = errors[key];
			errorsArray.forEach((message) => {
				const el = $(formElement).find(formKeys[key]);
				$(`<div class="invalid-feedback ${key}Error">${message}</div>`).insertAfter(el);
			});
		}
	}
};

const removeValidationMessages = (formElement) => {
	$(formElement).find(".invalid-feedback").remove();
	$(formElement).find(".is-invalid").removeClass("is-invalid");
};

const handleFormSubmit = (response, body, formElement, formKeys, onSuccess, onError) => {
	if (response.status === 422) {
		applyValidationMessages(formElement, body.errors, formKeys);
		onError(response.status);
		return;
	}

	if (response.ok) {
		onSuccess();
		return;
	}

	if (!response.ok) {
		onError(response.status);
		return;
	}
};
