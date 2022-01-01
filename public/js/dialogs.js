const dialogs = {
	dialogBuilder: (data) => {
		const modalId = util.GUID();
		const btnCloseId = util.GUID();

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
	},
	confirmDialog: ({title, message, action, onConfirm, onCancel}) => {
        const btnConfirmId = util.GUID();

        const confirmButton = () => {
            return `<button type="button" id="${btnConfirmId}" class="btn btn-success">${action}</button>`;
        };

        const dialog = dialogs.dialogBuilder({
            title: title,
            body: message,
            closeTitle: "Cancel",
            css: "modal-sm",
            onClose: (dismiss) => {
                onCancel(dismiss);
            },
            showCloseHeader: false,
            footer: confirmButton()
        });

        dialog.modal.show();

        $(`#${btnConfirmId}`).on("click", () => {
            onConfirm(dialog.dismiss);
        });
    }
};
