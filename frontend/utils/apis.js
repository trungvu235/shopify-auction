export const apiLink = window.location.protocol + "//" + window.location.host + '/apps/frontend';

export const testFetch = async () => {
    try {
        const response = await fetch(`${apiLink}/frontend/testApi`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":'*',
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Error fetching data",error);
        return null;
    }
}

export const testFetch_2 = async (id) => {
    try {
        const response = await fetch(`${apiLink}/frontend/testApi_2?id=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":'*',
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Error fetching data",error);
        return null;
    }
}

export const getUpcomingListApi = async () => {
    try {
        const response = await fetch(`${apiLink}/frontend/upcomingApi`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":'*',
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Error fetching data",error);
        return null;
    }
}

export const getCustomerAuctionsApi = async (winner_id) => {
    try {
        const response = await fetch(`${apiLink}/frontend/customerAuctionsApi?winner=${winner_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":'*',
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Error fetching data",error);
        return null;
    }
}

export const getAuctionDetail = async (key) => {
    try {
        const response = await fetch(`${apiLink}/frontend/auctionDetailApi?key=${key}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":'*',
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Error fetching data",error);
        return null;
    }
}

export const getActiveListApi = async () => {
    try {
        const response = await fetch(`${apiLink}/frontend/activeApi`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":'*',
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Error fetching data",error);
        return null;
    }
}
