// npm install zenrows
const { ZenRows } = require("zenrows");

(async () => {
    const client = new ZenRows("b82bb6098f50d83fc0221048bfe8b6e789b30558");
    const url = "https://www.realestate.com.au/buy/in-nsw/list-1";

    try {
        const { data } = await client.get(url, {
            "js_render": "true"
});
        console.log(data);
    } catch (error) {
        console.error(error.message);
        if (error.response) {
            console.error(error.response.data);
        }
    }
})();