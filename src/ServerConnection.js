export default class ServerConnection {
    constructor(base_url) {
        this.base_url = base_url;

        this.method = "POST";
        this.headers = {
            "Content-Type": "application/json"
        }
    }

    send (action, data, recv=json => { console.log(json); }, fail=err => { console.error(err); }) {
        console.log(JSON.stringify(data));
        fetch(this.base_url + action, {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(data)
        })
            .then(res => res.text())
            .then(data => { recv(JSON.parse(data)); })
            .catch(err => { fail(err) });
    }
}