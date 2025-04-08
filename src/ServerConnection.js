export default class ServerConnection {
    constructor(base_url) {
        this.base_url = base_url;

        this.method = "POST";
        this.headers = {
            "Content-Type": "application/json"
        }
    }

    async send (action, data, recv=json => { console.log(json); }, fail=err => { console.error(err); }) {
        console.log(JSON.stringify(data));
        try {
            const res = await fetch(this.base_url + action, {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(data)
            });

            if (res.ok) recv(await res.json());
            else fail(await res.text());
        } catch {
            fail(err);
        }
    }
}