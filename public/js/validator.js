const validator = {
	applyValidationMessages: (formElement, errors, formKeys) => {
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
	},
	removeValidationMessages: (formElement) => {
		$(formElement).find(".invalid-feedback").remove();
		$(formElement).find(".is-invalid").removeClass("is-invalid");
	},
	handleFormSubmit: (response, body, formElement, formKeys, onSuccess, onError) => {
		if (response.status === 422) {
			validator.applyValidationMessages(formElement, body.errors, formKeys);
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
	},
	validateEmail: (val) => {
		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		return emailPattern.test(val);
	}
};
