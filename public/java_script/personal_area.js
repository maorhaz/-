document.addEventListener("DOMContentLoaded", async () => {
    const customerId = sessionStorage.getItem("customerId");
    const loginMessage = document.getElementById("login-message");
    const ordersContainer = document.querySelector(".orders-container");
    const ordersList = document.getElementById("orders-list");

    if (!customerId) {
        loginMessage.textContent = "כדי לראות את ההזמנות האחרונות יש להתחבר תחילה";
        loginMessage.style.display = "block";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/orders/all?customer_id=${customerId}`);

        if (!response.ok) {
            throw new Error("Failed to retrieve orders");
        }

        const data = await response.json();

        if (data.message === "לא נמצאו הזמנות למשתמש זה.") {
            loginMessage.textContent = "לא נמצאו הזמנות למשתמש זה.";
            loginMessage.style.display = "block";
        } else {
            renderOrders(data);
            loginMessage.style.display = "none";
            ordersContainer.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        loginMessage.textContent = "שגיאה בהשגת פרטי ההזמנות. אנא נסה שוב מאוחר יותר.";
        loginMessage.style.display = "block";
    }
});

function renderOrders(orders) {
    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = "";

    orders.forEach(order => {
        const card = document.createElement("div");
        card.className = "card mb-3";
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">מספר הזמנה: ${order.order_id}</h5>
                <p class="card-text"><strong>תאריך הזמנה:</strong> ${new Date(order.order_date).toLocaleDateString("he-IL")}</p>
                <p class="card-text"><strong>סטטוס:</strong> ${order.status}</p>
                <p class="card-text"><strong>סה"כ לתשלום:</strong> ${order.total_amount}</p>
                <p class="card-text"><strong>כתובת למשלוח:</strong> ${order.shipping_address}</p>
            </div>
        `;
        ordersList.appendChild(card);
    });
}
