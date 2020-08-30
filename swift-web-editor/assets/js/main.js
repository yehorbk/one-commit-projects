Vue.config.keyCodes.f6 = 117;

const compileCode = async function(request) {
    const PROXYSERVER = 'https://cors-anywhere.herokuapp.com/';
    const url = PROXYSERVER + 'https://api.jdoodle.com/v1/execute';
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(request),
    });
    return await response.json();
};

const app = new Vue({
    el: '.app',
    data: {
        request: {
            script: '',
            language: 'swift',
            versionIndex: '0',
            clientId: '', // TODO
            clientSecret: '', // TODO
        },
        response: {
            output: '',
            statusCode: '',
            memory: '',
            cpuTime: '',
        },
    }, methods: {
        runScript: async function () {
            this.response.output = 'Running...';
            this.response = await compileCode(this.request);
        },
        downloadFile: function () {
            alert('Not ready yet!');
        },
        showDonationAlert: function () {
            alert('Not ready yet!');
        },
        showInfoAlert: function() {
            alert(`
                Compilation is possible thanks to the JDoodle.\n
                Designed and developed by Yehor Bublyk.
                Powered by Generics.`
            );
        },
    },
});
