import { GM_getValue, GM_registerMenuCommand, GM_setValue, GM_unregisterMenuCommand } from "vite-plugin-monkey/dist/client"
import { translateDOM } from "./translate";

class McseaConfig {
    lang: "simplified" | "traditional" = GM_getValue("lang", "simplified");
    selector = {
        pc: {
            mainpost: "td[id^=postmessage_]",
        },
        mb: {
            mainpost: "#ainuoloadmore .message",
        }
    }
}
export let config = new McseaConfig();



class MenuItem {
    cal_title: () => string
    callback: () => void
    command_id: string | undefined
    constructor(title_: () => string, callback_: (item: MenuItem) => void) {
        this.cal_title = title_;
        this.callback = () => {
            callback_(this);
            update();
        };
    }
}
let menuitems = Array.of(
    new MenuItem(() => `设为简体 ${config.lang === "simplified" ? "✔️" : "⭕"}`, (item: MenuItem) => {
        config.lang = "simplified";
        GM_setValue("lang", config.lang);
        translateDOM(document);
    }),
    new MenuItem(() => `设为繁体 ${config.lang === "traditional" ? "✔️" : "⭕"}`, (item: MenuItem) => {
        config.lang = "traditional";
        GM_setValue("lang", config.lang);
        translateDOM(document);
    }),
);




function update() {
    for (let menu of menuitems) {
        if (menu.command_id) GM_unregisterMenuCommand(menu.command_id);
        menu.command_id = GM_registerMenuCommand(menu.cal_title(), menu.callback);
        // console.log(`config:${menu.cal_title}`);
    }
}

update();

