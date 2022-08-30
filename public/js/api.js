const postRequest = (url, queryParams, data) => {
	let finalUrl = "";

	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	const raw = JSON.stringify(data);
	const requestOptions = {
		method: "POST",
		headers: headers,
		body: raw,
		credentials: "include"
	};

	if (queryParams === undefined || queryParams === null) {
		finalUrl = url;
	} else {
		finalUrl = `${url}?${new URLSearchParams(queryParams)}`;
	}

	return fetch(url, requestOptions).catch((error) => console.log("api-error", error));
};

const putRequest = (url, queryParams, data) => {
	let finalUrl = "";

	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	const raw = JSON.stringify(data);
	const requestOptions = {
		method: "PUT",
		headers: headers,
		body: raw,
		credentials: "include"
	};

	if (queryParams === undefined || queryParams === null) {
		finalUrl = url;
	} else {
		finalUrl = `${url}?${new URLSearchParams(queryParams)}`;
	}

	return fetch(finalUrl, requestOptions).catch((error) => console.log("api-error", error));
};

const getRequest = (url, queryParams) => {
	let finalUrl = "";

	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	const requestOptions = {
		method: "GET",
		headers: headers,
		credentials: "include"
	};

	if (queryParams === undefined || queryParams === null) {
		finalUrl = url;
	} else {
		finalUrl = `${url}?${new URLSearchParams(queryParams)}`;
	}

	return fetch(finalUrl, requestOptions).catch((error) => console.log("api-error", error));
};

const deleteRequest = (url, queryParams) => {
	if (queryParams === undefined || queryParams === null) {
		return fetch(url, { credentials: "include", method: "DELETE" }).catch((error) =>
			console.log("api-error", error)
		);
	} else {
		return fetch(`${url}?${new URLSearchParams(queryParams)}`, {
			credentials: "include",
			method: "DELETE"
		}).catch((error) => log("api-error", error));
	}
};

const api = {
	uploadFile: (options, fileData) => {
		const formData = new FormData();
		formData.append("file", fileData);
		const queryParams = {
			type: options.type || "image"
		};

		return fetch(`/api/v1/admin/files/upload?${new URLSearchParams(queryParams)}`, {
			method: "POST",
			body: formData,
			redirect: "follow",
			credentials: "include"
		});
	},
	login: ({ username, password, captcha, setCookie }) => {
		return postRequest("/api/v1/auth/login", null, { username, password, captcha, setCookie });
	},
	addServiceRequest: ({ email, serviceId, description, mobile, name, captcha }) => {
		return postRequest("/api/v1/service", null, {
			email,
			serviceId,
			description,
			mobile,
			name,
			captcha
		});
	},
	verifyServiceRequest: ({ requestId, otp }) => {
		return postRequest(`/api/v1/service/${requestId}/verify`, null, { otp });
	},
	library: {
		getItems: ({ page, limit, type, tag, orderBy, searchTitle, searchUrl }) => {
			return getRequest('/api/v1/library', {
				p: page,
				l: limit,
				t: type,
				tg: tag,
				o: orderBy,
				st: searchTitle,
				su: searchUrl
			});
		},
		getItemById: (id) => {
			return getRequest(`/api/v1/library/${id}`, {});
		},
		deleteItemById: (id) => {
			return deleteRequest(`/api/v1/library/${id}`, {});
		},
		getTags: () => {
			return getRequest(`/api/v1/library/tags`, {});
		},
		getTypes: () => {
			return getRequest(`/api/v1/library/types`, {});
		},
		addItem: ({ title, type, url, tags, date, img, thumb, content }) => {
			return postRequest(`/api/v1/library`, null, { title, type, url, tags, date, img, thumb, content });
		}
	}
};
