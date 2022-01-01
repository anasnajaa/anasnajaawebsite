const util = {
	GUID: () => {
		return (
			"id_" +
			"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
				const r = (Math.random() * 16) | 0;
				const v = c === "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			})
		);
	},
	initTooltips: () => {
		var tooltipTriggerList = [].slice.call(
			document.querySelectorAll('[data-bs-toggle="tooltip"]')
		);
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl);
		});
	},
 	localizeMomentDateTime: (lang, moment, includeTime) => {
		if (lang === "ar") {
			if (includeTime) {
				return moment.format("YYYY/MM/DD hh:mm A").toLowerCase().replace("am", "ص").replace("pm", "م");
			}
			return moment.format("YYYY/MM/DD");
		}

		if (includeTime) {
			return moment.format("DD/MM/YYYY hh:mm A");
		}
		return moment.format("DD/MM/YYYY");
	},
	localizeMomentTime: (lang, time) => {
		return lang === "ar" ? moment(time, "hh:mm A").format("hh:mm A").toLowerCase().replace("am", "ص").replace("pm", "م") : moment(time, "hh:mm A").format("hh:mm A");
	},
	paginationInit: (element, recordsCount, recordsPerPage, startPage, onPageChanged) => {
		let tPages = 1;
		if (recordsCount !== 0) {
			tPages = Math.ceil(recordsCount / recordsPerPage);
		}

		startPage = parseInt(startPage) || 1;

		element.twbsPagination({
			paginationClass: "pagination pagination-sm",
			totalPages: tPages,
			visiblePages: 4,
			startPage: startPage,
			next: "Next",
			prev: "Previous",
			last: "Last",
			first: "First",
			onPageClick: (event, page) => {
				onPageChanged(page);
			}
		});
	},
	paginationDestroy: (element) => {
		element.twbsPagination('destroy');
	},
	showLoading: (element) => {
		$(element).LoadingOverlay("show", {
			zIndex: 1000
		});
	},
	hideLoading: (element) => {
		$(element).LoadingOverlay("hide", {});
	},
	jsonParamsFromUrl: () => {
		let query = location.search.substr(1).toLowerCase();
		const result = {};
		if (query.split("&")[0] === "") {
			return null;
		}
		query.split("&").forEach((part) => {
			const item = part.split("=");
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	},
	splitUrlParams: (url) => {
		let tempUrl = "", params = null;
		if (url.indexOf("?") >= 0) {
			tempUrl = url.substring(0, url.indexOf("?"));
			params = util.jsonParamsFromUrl(url.substring(url.indexOf("?"), url.length));
		} else {
			tempUrl = url;
		}

		return {
			url: tempUrl,
			params: params
		};
	},
	attachEnterEvent: (element, onEnter) => {
		element.on('keyup', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
				onEnter();
            }
        });
	}
};
