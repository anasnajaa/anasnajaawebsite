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
	},
	getFileSize: (bytes) => {
		const i = Math.floor(Math.log(bytes) / Math.log(1024)),
			sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
	},
	calculateSize: (img, maxWidth, maxHeight) => {
		let width = img.width;
		let height = img.height;

		if (width > height) {
			if (width > maxWidth) {
				height = Math.round((height * maxWidth) / width);
				width = maxWidth;
			}
		} else {
			if (height > maxHeight) {
				width = Math.round((width * maxHeight) / height);
				height = maxHeight;
			}
		}
		return [width, height];
	},
	compressImage: (file, options, onCompressed) => {
		const MAX_WIDTH = options.maxWidth || 1000;
		const MAX_HEIGHT = options.maxHeight || 1000;
		const QUALITY = options.quality || .8;
		const MIME_TYPE = options.mimeType || "image/jpeg";
		const blobURL = URL.createObjectURL(file);

		const img = new Image();

		img.src = blobURL;
		img.onload = function () {
			URL.revokeObjectURL(this.src);
			const [newWidth, newHeight] = util.calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
			const canvas = document.createElement("canvas");
			canvas.style = "display:none;"
			canvas.width = newWidth;
			canvas.height = newHeight;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, newWidth, newHeight);
			canvas.toBlob(async (blob) => {
				var blobFile = new File([blob], file.name, { type: blob.type });
				onCompressed({
					name: blobFile.name,
					file: blobFile,
					sizeFriendly: util.getFileSize(blobFile.size),
					sizeRaw: blobFile.size,
					src: URL.createObjectURL(blobFile),
				});
			}, MIME_TYPE, QUALITY);
			document.getElementById("main").append(canvas);
		};	
	},
 	consumeFlash: () => {
		const flash = localStorage.getItem('flash');
		if (flash === null) { return; }

		const flashObject = JSON.parse(flash);

		localStorage.removeItem("flash");

		if (flashObject.variation === "toast") {
			toasts.simple({
				title: flashObject.title, 
				body: flashObject.message, 
				type: flashObject.type,
				duration: 5000, 
				pos: "tr"
			});
			return;
		}

		if (flashObject.variation === "modal") {
			const alert = alerts.simple(flashObject.title, flashObject.message,
				flashObject.type, (dismiss) => { dismiss(); });
			alert.modal.show();
			return;
		}
	},
	setFlashMessage: ({variation, title, message, type}) => {
		localStorage.setItem('flash', JSON.stringify({
			title, message, type, variation
		}));
	}
};
