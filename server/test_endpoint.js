import "dotenv/config";

async function test() {
    try {
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "manishdewangan1302@gmail.com",
                password: "admin123",
                role_type: "admin"
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        
        const res = await fetch("http://localhost:4000/api/leaves", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

test();
