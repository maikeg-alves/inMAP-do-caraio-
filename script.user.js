// ==UserScript==
// @name          InMAP DO Caraio
// @namespace     http://tampermonkey.net/
// @version       1.0.0
// @description   Script para fechar o inmap -- via fiber
// @author        Maicon Gabriel Alves
// @match         https://central.viafiber.com.br/mapas.php
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at        document-start
// @grant         none
// @updateURL     https://raw.githubusercontent.com/maikeg-alves/inMAP-do-caraio-/main/script.meta.js
// @downloadURL   https://github.com/maikeg-alves/inMAP-do-caraio-/releases/latest/download/script.user.js
// ==/UserScript==

console.log(`[Opa] readyState: ${document.readyState}`);

const TEMPO_LIMITE_RESPOSTA_CLIENTE = 1;

(() => {
    "use strict";

    console.time("[Opa] Tempo de execução");
    console.timeEnd("[Opa] Tempo de execução");

    runScript();

    setInterval(runScript, 5000);
})();

async function runScript() {
    await new Promise((resolve) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", resolve);
        } else {
            resolve();
        }
    });

    const iframe = document.getElementById("ykbwagfosevnmgy"); // muda o id do btn se necessario 

    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        if (iframeDocument) {
            observeContainer(iframeDocument)
                .then(({ Btncancelar }) => {
                    if (Btncancelar) {
                        console.log("btn cancelar encontrado");
                        Btncancelar.click()
                    }
                })
                .catch((error) => {
                    console.error("Erro ao observar o contêiner:", error);
                });
        } else {
            console.log("Contêiner dentro do iframe não encontrado");
        }
    } else {
        console.log("iframe não encontrado");
    }
}

function observeContainer(container) {
    return new Promise((resolve, reject) => {
        const btnCancelar = "html > body > button#bt1"; // muda aqui conforme a necesidade

        const checkContainer = () => {
            const cancelar = container.querySelector(btnCancelar);
            if (cancelar) {
                resolve({ cancelar });
                observer.disconnect();
            }
        };

        const observer = new MutationObserver((mutations, observer) => {
            for (let mutation of mutations) {
                if (mutation.type === "childList" || mutation.type === "subtree") {
                    checkContainer();
                    break;
                }
            }
        });

        observer.observe(container, { childList: true, subtree: true });

        checkContainer();
    });
}
