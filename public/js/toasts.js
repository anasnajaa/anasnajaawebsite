const toasts = {
    simple: ({title, body, type, duration, pos}) => {
        let newPos = "toast-top-right";

        if(pos === "tl") {
            newPos = "toast-top-left";
        } else if (pos === "tr") {
            newPos = "toast-top-right";
        }

        const aConfig = {
            positionClass: newPos,
            rtl: pos === "tl" ? false : true,
            timeOut: duration === undefined ? 5000 : duration,
            closeButton: true
        };

        switch (type) {
            case "danger":
                toastr.error(body, title, aConfig);
                break;
            case "info":
                toastr.info(body, title, aConfig);
                break;
            case "warning":
                toastr.warning(body, title, aConfig);
                break;
            default:
                toastr.success(body, title, aConfig);
                break;
        }
    },
    fromBody: (body) => {
        toasts.simple({title: body.title, body: body.message, type: body.type, duration: 5000, pos: "tr"});
    },
    recordDeleted: () => {
        toasts.simple({title: null, body: "Record Deleted", type: "success", duration: 5000, pos: "tr"});
    }
};