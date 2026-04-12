export class header {

    static getToken() {
        return localStorage.getItem("access")
    }

    static regular() {
        return {
            headers: {
                'Content-Type': 'application/json',
            }
        };

    }

    static json() {
        const token = this.getToken();

        return {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        };

    }

    static formdata() {
        const token = this.getToken();
        return {
            headers: {
                "Content-Type": "multipart/form-data",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        };
    }

    static blob() {
        const token = this.getToken();
        return {
            headers: {
                "Content-Type": "multipart/form-data",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            responseType: "blob" as const,
        };
    }
}