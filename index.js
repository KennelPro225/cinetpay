class Seamless {
    cdnjs = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.3.2/socket.io.min.js";
    close_message = "Merci d'avoir utilise CinetPay !";
    cinetpay_url_dev = "https://new-api.cinetpay.ci/v2";
    cinetpay_url = "https://api-checkout.cinetpay.com/v2";
    socket_server = "https://robot-checkout.cinetpay.com";
    checkout = null;
    payment_data = null;
    response = null;
    error = {
        message: null,
        description: null
    };
    config = {
        apikey: null,
        site_id: null,
        mode: null,
        type: null,
        notify_url: null,
        device_id: null
    };
    type = 'WEB';
    old_socket_id = null;
    new_socket_id = null;
    socket_disconnect = false;
    async setConfig(config = this.config) {
        if (typeof config !== "object") {
            this.error.message = "OBJECT_REQUIRED";
            this.error.description = "Set an object in your setConfig method";
            return;
        } else {
            this.config = config;
            this.config.mode = config.mode ? config.mode : this.config.mode;
            this.type = this.config.type ? (this.config.type.toUpperCase() == "MOBILE" ? "MOBILE" : this.type) : this.type;
            delete this.config.mode;
            delete this.config.type;
        }
    }
    createHtmlModalElement() {
        var modal_first_parent = document.getElementById("cp_modal_first_parent");
        var modal_first_parent_content_wrapper = document.createElement("div");
        modal_first_parent_content_wrapper.className = "cp-content-wrapper";
        modal_first_parent_content_wrapper.id = "modal_first_parent_content_wrapper";
        var modal_first_parent_content_wrapper_button = document.createElement("button");
        modal_first_parent_content_wrapper_button.className = "cp-close";
        modal_first_parent_content_wrapper_button.id = "cp-close";
        var modal_first_parent_content_wrapper_content = document.createElement("div");
        modal_first_parent_content_wrapper_content.className = "cp-content";
        modal_first_parent_content_wrapper_content.id = "cp-content";
        modal_first_parent.appendChild(modal_first_parent_content_wrapper);
        modal_first_parent_content_wrapper.appendChild(modal_first_parent_content_wrapper_content);
        modal_first_parent_content_wrapper.appendChild(modal_first_parent_content_wrapper_button);
        this.insertSvgCloseBtn(modal_first_parent_content_wrapper_button);
        this.closeCheckout();
    }
    closeCheckout() {
        var button = document.getElementById("cp-close");
        button.addEventListener('click', () => {
            var modal = document.getElementById("cp_modal_first_parent");
            modal.classList.toggle('open');
            window.location.reload();
        });
    }
    insertSvgCloseBtn(button) {
        button.innerHTML = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\"\n" +
            "\t viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n" +
            "<g>\n" +
            "\t<g>\n" +
            "\t\t<polygon points=\"512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512\n" +
            "\t\t\t512,452.922 315.076,256 \t\t\"/>\n" +
            "\t</g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "<g>\n" +
            "</g>\n" +
            "</svg>";
    }
    async getCheckout(data) {
        if (typeof data !== "object") {
            this.error.message = "OBJECT_REQUIRED";
            this.error.description = "Set an object in your getCheckout method";
            return;
        } else {
            this.payment_data = data;
            var head = document.getElementsByTagName("head")[0];
            var body = document.getElementsByTagName("body")[0];
            var modal_first_parent = document.createElement("div");
            modal_first_parent.className = "cp-modal";
            modal_first_parent.id = "cp_modal_first_parent";
            modal_first_parent.setAttribute("data-tiorna", "trigger-modal");
            var modal_first_parent_content_wrapper_loader = document.createElement("div");
            modal_first_parent_content_wrapper_loader.id = "cp-loader";
            modal_first_parent_content_wrapper_loader.className = "text-center cp-loader";
            var modal_first_parent_content_wrapper_loader_tiorna_spinner = document.createElement("div");
            modal_first_parent_content_wrapper_loader_tiorna_spinner.id = "germinator";
            modal_first_parent_content_wrapper_loader_tiorna_spinner.className = "germinator";
            var spinner_span1 = document.createElement("span");
            var spinner_span2 = document.createElement("span");
            var spinner_span3 = document.createElement("span");
            var style = document.createElement("style");
            style.innerHTML = "input[type='text'], input[type='number'], input[type='email'], input[type='tel'], input[type='password'] {font-size: 16px;}#cp-close svg {fill: #fff;stroke: #fff;width: 10px;height: 10px;}button {cursor: pointer;}#cp-close:hover svg {fill: red;}body {overflow: hidden;position: relative;display: flex;align-items: center;justify-content: center;width: 100%;height: 100vh;}.cp-modal {position: fixed;top: .6rem;left: 0;display: flex;align-items: center;justify-content: center;height: 0vh;background-color: transparent;overflow: hidden;transition: background-color 0.25s ease;z-index: 9999;}.cp-modal.open {position: fixed;width: 100%;height: 100vh;background-color: rgba(0, 0, 0, 0.75);transition: background-color 0.25s;}.cp-modal.open > .cp-content-wrapper {transform: scale(1);}.cp-modal .cp-content-wrapper {position: relative;display: flex;flex-direction: column;align-items: center;justify-content: flex-start;width: 540px;height: 710px;margin: 0;padding: 2.5rem;background-color: transparent;border-radius: 0.3125rem;transform: scale(0);transition: transform 0.25s;transition-delay: 0.15s;}.cp-modal .cp-content-wrapper .cp-close {position: absolute;top: 0.5rem;right: 0.5rem;display: flex;align-items: center;justify-content: center;width: 1.5rem;height: 1.5rem;border: none;background-color: transparent;font-size: 1.5rem;transition: 0.25s linear;}.cp-modal .cp-content-wrapper .cp-modal-header {position: relative;display: flex;flex-direction: row;align-items: center;justify-content: space-between;width: 100%;margin: 0;padding: 0 0 1.25rem;}.cp-modal .cp-content-wrapper .cp-modal-header h2 {font-size: 1.5rem;font-weight: bold;}.cp-modal .cp-content-wrapper .cp-content {position: relative;display: flex;width: 100%;height: 100%;}.cp-modal .cp-content-wrapper .cp-content p {font-size: 0.875rem;line-height: 1.75;}.cp-modal .cp-content-wrapper .cp-modal-footer {position: relative;display: flex;align-items: center;justify-content: flex-end;width: 100%;margin: 0;padding: 1.875rem 0 0;}.cp-modal .cp-content-wrapper .cp-modal-footer .action {position: relative;margin-left: 0.625rem;padding: 0.625rem 1.25rem;border: none;background-color: slategray;border-radius: 0.25rem;color: white;font-size: 0.87rem;font-weight: 300;overflow: hidden;z-index: 1;}.cp-modal .cp-content-wrapper .cp-modal-footer .action:before {position: absolute;cp-content: \"\";top: .6rem;left: 0;width: 0%;height: 100%;background-color: rgba(255, 255, 255, 0.2);transition: width 0.25s;z-index: 0;}.cp-modal .cp-content-wrapper .cp-modal-footer .action:first-child {background-color: #2ecc71;}.cp-modal .cp-content-wrapper .cp-modal-footer .action:last-child {background-color: #e74c3c;}.cp-modal .cp-content-wrapper .cp-modal-footer .action:hover:before {width: 100%;}.germinator {display: block;position: absolute;z-index: 100;background-position: center;left: 50%;top: 50%;transform: translate(-50%, -50%);}.germinator span {vertical-align: middle;border-radius: 100%;display: inline-block;width: 3rem;height: 3rem;margin: 3px 2px;-webkit-animation: germinator 0.8s linear infinite alternate;animation: germinator 0.8s linear infinite alternate;}.germinator span:nth-child(1) {-webkit-animation-delay: -0.8s;animation-delay: -0.8s;background: #41ac4c;}.germinator span:nth-child(2) {-webkit-animation-delay: -0.26666s;animation-delay: -0.26666s;background: #357a4f;}.germinator span:nth-child(3) {-webkit-animation-delay: -0.8s;animation-delay: -0.8s;background: #41ac4c;}@keyframes germinator {from {transform: scale(0, 0);}to {transform: scale(1, 1);}}@-webkit-keyframes germinator {from {-webkit-transform: scale(0, 0);}to {-webkit-transform: scale(1, 1);}}@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 2) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 320px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 320px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 320px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 320px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 320px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 4) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 4) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 4) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 4) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 4) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}}@media screen and (device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 4) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 384px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 2) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 384px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 384px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 3) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 4) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 360px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 4) and (orientation: portrait) {}@media screen and (device-width: 360px) and (device-height: 592px) and (-webkit-device-pixel-ratio: 4) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 480px) and (device-height: 800px) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 480px) and (device-height: 800px) and (orientation: portrait) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}@media screen and (device-width: 480px) and (device-height: 800px) and (orientation: landscape) {.cp-modal .cp-content-wrapper {width: 100%;padding: .0rem;}#cp-close svg {fill: red;stroke: red;width: 15px;height: 15px;}.cp-modal .cp-content-wrapper .cp-close {top: .6rem;right: .6rem;}.cp-modal .cp-content-wrapper {height: clamp(600px, calc(100vh - 2rem), 741px);}}";
            body.appendChild(modal_first_parent);
            modal_first_parent.appendChild(modal_first_parent_content_wrapper_loader);
            modal_first_parent_content_wrapper_loader.appendChild(modal_first_parent_content_wrapper_loader_tiorna_spinner);
            modal_first_parent_content_wrapper_loader_tiorna_spinner.appendChild(spinner_span1);
            modal_first_parent_content_wrapper_loader_tiorna_spinner.appendChild(spinner_span2);
            modal_first_parent_content_wrapper_loader_tiorna_spinner.appendChild(spinner_span3);
            head.appendChild(style);
            var cinetpay = document.getElementById("cp_modal_first_parent");
            cinetpay.classList.toggle("open")
            await this.initCheckout();
        }
    }
    async initCheckout() {
        var connect = window.navigator.onLine;
        if (connect) {
            var cdnjs = this.cdnjs;
            var done = false;
            var socket_io = document.createElement('script');
            socket_io.onload = function () {
                if (!done) {
                    done = true;
                    const socket = io(this.socket_server);
                    socket.on("connect", () => {
                        this.config.device_id = socket.id;
                        if (this.socket_disconnect) {
                            console.log("reconnect");
                            this.old_socket_id = this.new_socket_id;
                            if (this.response == null) {
                                var xmlhttp = this.http();
                                xmlhttp.onprogress = function (progress) {}
                                xmlhttp.onreadystatechange = function (state) {
                                    var DONE = (typeof XMLHttpRequest.DONE !== 'undefined') ? XMLHttpRequest.DONE : 4;
                                    if (xmlhttp.readyState == DONE && xmlhttp.status == 200) {
                                        if (code != 202) {
                                            this.error.message = xmlhttp.response.message;
                                            this.error.description = "An error occurred";
                                            return;
                                        }
                                    } else if (xmlhttp.readyState == DONE && xmlhttp.status != 200) {
                                        this.error.message = xmlhttp.response.message;
                                        this.error.description = "An error occurred";
                                        return;
                                    }
                                }.bind(this);
                                xmlhttp.onload = function (load) {}
                                xmlhttp.onerror = function (error) {}
                                xmlhttp.open("POST", this.cinetpay_url + "/seamless/device");
                                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                xmlhttp.responseType = 'json';
                                var _data = {
                                    old_device_id: this.old_socket_id,
                                    new_device_id: socket.id
                                };
                                xmlhttp.send(JSON.stringify(_data));
                            }
                        } else {
                            this.new_socket_id = socket.id;
                            var xmlhttp = this.http();
                            xmlhttp.onprogress = function (progress) {}
                            xmlhttp.onreadystatechange = function (state) {
                                var DONE = (typeof XMLHttpRequest.DONE !== 'undefined') ? XMLHttpRequest.DONE : 4;
                                if (xmlhttp.readyState == DONE && xmlhttp.status == 200) {
                                    var response = xmlhttp.response;
                                    var code = response.code;
                                    if (code == "201") {
                                        var data = response.data;
                                        var paymentUrl = data.payment_url;
                                        this.checkout = paymentUrl;
                                        this.openCheckout();
                                    } else {
                                        this.error.message = response.message;
                                        this.error.description = response.description;
                                        return;
                                    }
                                } else if (xmlhttp.readyState === DONE && xmlhttp.status !== 200) {
                                    this.error.message = xmlhttp.response.message;
                                    this.error.description = xmlhttp.response.description;
                                    return;
                                }
                            }.bind(this);
                            xmlhttp.onload = function (load) {}
                            xmlhttp.onerror = function (error) {}
                            xmlhttp.open("POST", this.cinetpay_url + "/payment");
                            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            xmlhttp.responseType = 'json';
                            var _data = {
                                ...this.config,
                                ...this.payment_data
                            };
                            xmlhttp.send(JSON.stringify(_data));
                        }
                    });
                    socket.on("disconnect", () => {
                        console.log("disconnect");
                        this.socket_disconnect = true;
                    });
                    socket.on("channel", (message) => {
                        console.log("channel");
                        this.response = message;
                    });
                }
            }.bind(this);
            socket_io.onreadystatechange = handleReadyStateChange;
            socket_io.onerror = handleError;
            socket_io.src = cdnjs;
            document.body.appendChild(socket_io);

            function handleReadyStateChange() {
                var state;
                if (!done) {
                    state = socket_io.readyState;
                    if (state === "complete") {
                        handleLoad();
                    }
                }
            }

            function handleError() {
                if (!done) {
                    done = true;
                }
            }
        } else {
            document.getElementById('cp_modal_first_parent').style.pointerEvents = 'none';
            if (this.type == "WEB") {
                setTimeout(() => {
                    document.getElementById('cp_modal_first_parent').style.display = "none";
                    window.location.reload();
                }, 3000);
            }
        }
    }
    openCheckout() {
        var iframe = document.createElement("iframe");
        iframe.id = "checkout";
        iframe.src = this.checkout;
        iframe.test = "0";
        iframe.style.borderWidth = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        this.createHtmlModalElement();
        var content = document.getElementById("cp-content");
        content.appendChild(iframe);
        var closeLoader = setInterval(function () {
            var that = this;
            document.getElementById("checkout").onload = function () {
                document.getElementById("cp-loader").style.display = "none";
                clearInterval(closeLoader);
            }.bind(that);
        }.bind(this), 100);
    }
    waitResponse(callback) {
        var interval = setInterval(function () {
            if (this.response != null) {
                callback(this.response);
                clearInterval(interval);
            }
        }.bind(this), 1000);
    }
    onError(callback) {
        var interval = setInterval(function () {
            if ((this.error.message != null) && (this.error.description != null)) {
                callback(this.error);
                clearInterval(interval);
            }
        }.bind(this), 1000);
    }
    http() {
        var xmlhttp = null;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            for (var _xmlhttp, a = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"], b = 0; b < a.length; b++) {
                try {
                    _xmlhttp = new ActiveXObject(a[b]);
                    break
                } catch (error) {
                    this.error.message = error.name;
                    this.error.description = error.message;
                    return;
                }
            }
            _xmlhttp.setRequestHeader("Accept", "*/*");
            xmlhttp = _xmlhttp;
        }
        return xmlhttp;
    }
}
CinetPay = new Seamless();

export default CinetPay;