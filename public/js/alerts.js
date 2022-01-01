
const alerts = {
    prompt: (title, body, type,
        onConfirm, onCancel) => {
        const modalId = util.GUID();
        const btnCancelId = util.GUID();
        const btnConfirmId = util.GUID();

        const confirmTitle = "Ok";
        const cancelTitle = "Cancel";

        let tmplTitle = "";
        let tmplCancelButton = `<button type="button" id="${btnCancelId}" class="btn btn-secondary">${cancelTitle}</button>`;
        let tmplConfirmButton = `<button type="button" id="${btnConfirmId}" class="btn btn-success">${confirmTitle}</button>`;

        if (onConfirm === null) {
            tmplConfirmButton = "";
        }

        if (onCancel === null) {
            tmplCancelButton = "";
        }

        if (title !== null) {
            tmplTitle = `
            <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button style="display:none;" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>`;
        }

        const modalTemplate = `
        <div class="modal" id="${modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    ${tmplTitle}
                    <div class="modal-body p-0">
                        <div class="alert alert-${type} mb-0" role="alert">
                            ${body}
                        </div>
                    </div>
                    <div class="modal-footer">
                        ${tmplCancelButton}
                        ${tmplConfirmButton}
                    </div>
                </div>
            </div>
        </div>`;

        $('body').append($(modalTemplate));
        const modal = new bootstrap.Modal(document.getElementById(modalId), { backdrop: "static" });

        const dismiss = () => {
            modal.hide();
            modal.dispose();
            $(`#${modalId}`).remove();
        };

        $(`#${btnCancelId}`).on("click", async () => {
            $(`#${btnCancelId}`).html(`
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            `);
            await onCancel(dismiss, btnCancelId);
        });

        $(`#${btnConfirmId}`).on("click", async () => {
            $(`#${btnConfirmId}`).html(`
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            `);
            await onConfirm(dismiss, btnConfirmId);
        });

        return {
            modal,
            dismiss,
            btnConfirmId,
            btnCancelId
        };
    },
    simple: (title, body, type, onClose) => {
        const modalId = util.GUID();
        const btnCloseId = util.GUID();
        const closeTitle = "Close";

        let tmplTitle = "";
        let tmplCloseButton = `<button type="button" id="${btnCloseId}" class="btn btn-secondary">${closeTitle}</button>`;

        if (title !== null) {
            tmplTitle = `
            <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button style="display:none;" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>`;
        }

        const modalTemplate = `
        <div class="modal" id="${modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    ${tmplTitle}
                    <div class="modal-body p-0">
                        <div class="alert alert-${type} mb-0" role="alert">
                            ${body}
                        </div>
                    </div>
                    <div class="modal-footer">
                        ${tmplCloseButton}
                    </div>
                </div>
            </div>
        </div>`;

        $('body').append($(modalTemplate));
        const modal = new bootstrap.Modal(document.getElementById(modalId), { backdrop: "static" });

        const dismiss = () => {
            modal.hide();
            modal.dispose();
            $(`#${modalId}`).remove();
        };

        $(`#${btnCloseId}`).on("click", async () => {
            $(`#${btnCloseId}`).html(`
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            `);
            await onClose(dismiss, btnCloseId);
        });

        return {
            modal,
            btnCloseId,
            dismiss
        };
    },
    fromBody: (body) => {
        const alert = alerts.simple(body.title, body.message, body.type, (dismiss) => { dismiss(); });
        alert.modal.show();
    }
};