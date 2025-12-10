
        function destringify(item){
            return JSON.parse(item);
        }

        const customer = destringify(sessionStorage.getItem('name'));
        const email = destringify(sessionStorage.getItem('email'));
        const address = destringify(sessionStorage.getItem('address'));
        const city = destringify(sessionStorage.getItem('city'));
        const country = destringify(sessionStorage.getItem('country'));
        const cart = destringify(sessionStorage.getItem('cart')) || [];
        const addressLine = document.getElementById('addressDiv');
        const itemsList = document.getElementById('itemsList')
        const activeUser = JSON.parse(localStorage.getItem("ActiveUser"));

        function checkLoginStatus() {
            const greeting = document.getElementById("greeting");
            const loginBtn = document.getElementById("loginBtn");
            const dropdown = document.querySelector(".dropdown");

            if (activeUser) {
                // Show user name
                greeting.textContent = `Welcome, ${activeUser.firstName}!`;
                if(activeUser.role === "admin"){
                   greeting.textContent = `Welcome, ${activeUser.role.toUpperCase()}!`
                }
                // Hide login button
                loginBtn.style.display = "none";

                // Show dropdown
                dropdown.style.display = "inline-block";
            } else {
                // Not logged in
                greeting.textContent = "";

                loginBtn.style.display = "inline-block";
                dropdown.style.display = "none";
            }
        }


       function logout() {
            localStorage.removeItem("ActiveUser");
            alert("You have been logged out.");
            window.location.reload();
        }

        function generateInvoiceNumber() {
            return "INV-" + Date.now() + "-" + Math.floor(Math.random() * 9000 + 1000);
        }

        function displayInvoiceDate() {
            document.getElementById("invoiceDate").textContent =
                new Date().toLocaleDateString();
        }

        function buildInvoiceObject() {
            return {
                invoiceNumber: generateInvoiceNumber(),
                company: "Rendezvous Luxury Ltd.",
                date: new Date().toISOString(),
                trn: activeUser.trn,
                shipping: {
                    name: customer,
                    email: email,
                    address: `${address}, ${city}, ${country}`
                },
                items: cart.map(w => ({
                    name: `${w.brand} ${w.model}`,
                    quantity: w.quantity,
                    price: w.price,
                    discount: w.discount || 0,
                    lineTotal: (w.price * w.quantity)
                })),
                subtotal: JSON.parse(sessionStorage.getItem("subTotal")) || 0,
                tax: JSON.parse(sessionStorage.getItem("salesTax")) || 0,
                total: JSON.parse(sessionStorage.getItem("grandTotal")) || 0
            };
        }


        function displayCustomerInfo(){
            const trn = activeUser.trn;
            let invoiceNum = generateInvoiceNumber();
            const newAddress = document.createElement('p');
            const customerInfo = document.createElement('div');
            newAddress.innerHTML = `
                ${address}, ${city}, ${country}
            `;

            customerInfo.innerHTML =`
                <p><strong>Customer :</strong> ${customer}</p>
                <p><strong>E-mail:</strong> ${email}<p>
                <p><strong>Address:</strong> ${address},<p>
                <p> ${city},<p>
                <p> ${country}<p>
                <p><strong>TRN:</strong> ${trn}</p>
                <p><strong>Invoice # </strong>${invoiceNum}</p>
            `;
           addressLine.appendChild(customerInfo);
        }

        function createInvoiceItem(watch){
            const newTableRow = document.createElement('tr');
            newTableRow.dataset.id = watch.id;
            let itemPrice = watch.price * watch.quantity;
            newTableRow.innerHTML = `
            <td> 
                <img src="${watch.imgURL}" alt="${watch.model}" height="20px" width="20px">
                ${watch.brand} - ${watch.model}
            </td>
                
            <td>
                ${watch.quantity}
            </td>

            <td>
                $${itemPrice.toFixed(2)}
            </td>
            `;

            return newTableRow;
        }

        function displayInvoice(){
            cart.forEach(watch => {
                const newTableRow = createInvoiceItem(watch);
                itemsList.appendChild(newTableRow);
            });
           
            const subTotal = parseInt(sessionStorage.getItem('subTotal'));
            const tax = parseInt(sessionStorage.getItem('salesTax'));
            const total = parseInt(sessionStorage.getItem('grandTotal'));
            
            const subTotalRow= document.createElement('tr');
            subTotal.id = 'subTotal';
            subTotalRow.innerHTML = ` 
                <td class ="noBorder"></td>
                <td class ="noBorder"></td>
                <td id="subTotalDisplay"><strong>Sub-Total: $${subTotal.toFixed(2)}</strong></td>
    
            `;

             const taxRow= document.createElement('tr');
            taxRow.id = 'tax';
            taxRow.innerHTML = ` 
                <td class ="noBorder"></td>
                <td class ="noBorder"></td>
                <td id="taxDisplay"><strong>Tax: $${tax.toFixed(2)}</strong></td>
    
            `;
        
             const totalRow= document.createElement('tr');
            totalRow.id = 'subTotal';
            totalRow.innerHTML = ` 
                <td class ="noBorder"></td>
                <td class ="noBorder"></td>
                <td id="totalDisplay"><strong>Total: $${total.toFixed(2)}</strong></td>
    
            `;
            
            
            
            
        itemsList.appendChild(subTotalRow);
        itemsList.appendChild(taxRow);
        itemsList.appendChild(totalRow);
        }


        const invoiceSection = document.getElementById("invoiceSection");

        function printInvoice() {
            const printContents = invoiceSection.innerHTML;
            const originalContents = document.body.innerHTML;

            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;

            location.reload(); // restore JS functionality
        }


        function saveInvoice(invoice) {
            console.log("Saving invoice:", invoice);

            // --- GLOBAL INVOICE STORAGE ---
            let allInvoices = JSON.parse(localStorage.getItem("AllInvoices"));
            if (!Array.isArray(allInvoices)) {
                allInvoices = [];
            }

            allInvoices.push(invoice);
            localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));
            console.log("AllInvoices updated:", allInvoices);
        }

        function saveInvoiceToUser() {
            // Load active user
            const activeUser = JSON.parse(localStorage.getItem("ActiveUser"));
            if (!activeUser) {
                console.log("No active user – invoice cannot be saved.");
                return;
            }

            // Load all users
            let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

            // Find matching user entry
            const userIndex = users.findIndex(u => u.trn === activeUser.trn);
            if (userIndex === -1) {
                console.log("User not found in RegistrationData.");
                return;
            }

            // Build invoice object
            const invoice = {
                id: Date.now(), // unique invoice ID
                date: new Date().toISOString(),
                customer: activeUser.firstName + " " + activeUser.lastName,
                items: cart,  // cart comes from your sessionStorage
                subTotal: JSON.parse(sessionStorage.getItem("subTotal")),
                tax: JSON.parse(sessionStorage.getItem("salesTax")),
                total: JSON.parse(sessionStorage.getItem("grandTotal"))
            };

            // Ensure invoice array exists
            if (!users[userIndex].invoices) {
                users[userIndex].invoices = [];
            }

            // Save invoice to the user
            users[userIndex].invoices.push(invoice);

            // Save updated user list back to LocalStorage
            localStorage.setItem("RegistrationData", JSON.stringify(users));

            console.log("Invoice saved successfully:", invoice);
        }



        function getUserInvoices() {
            console.log("Getting user invoices...");

            const activeUser = JSON.parse(localStorage.getItem("ActiveUser"));
            if (!activeUser) {
                console.log("No user is currently logged in.");
                return;
            }

            const trn = activeUser.trn;
            console.log("Logged-in User TRN:", trn);

            const allUsers = JSON.parse(localStorage.getItem("RegistrationData")) || [];
            const user = allUsers.find(u => u.trn === trn);

            if (!user) {
                console.log("User not found in RegistrationData.");
                return;
            }

            if (!user.invoices || user.invoices.length === 0) {
                console.log("This user has no invoices stored.");
                return;
            }

            console.log(`Invoices for ${user.firstName} ${user.lastName} (TRN: ${trn})`);
            console.log(user.invoices);

            return user.invoices;
        }

        function notifyInvoiceSent(email) {
            alert(`An invoice has been sent to your email: ${email}`);
        }

        function loadSavedInvoice(invoiceId) {
            const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
            const invoice = allInvoices.find(inv => inv.invoiceNumber === invoiceId);

            if (!invoice) {
                alert("Invoice not found.");
                return;
            }

            // Fill Customer / Shipping Info
            addressLine.innerHTML = `
                <p><strong>Customer:</strong> ${invoice.shipping.name}</p>
                <p><strong>Email:</strong> ${invoice.shipping.email}</p>
                <p><strong>Address:</strong> ${invoice.shipping.address}</p>
                <p><strong>TRN:</strong> ${invoice.trn}</p>
                <p><strong>Invoice Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            `;

            // Fill Table Items
            itemsList.innerHTML = `
                <tr>
                    <th class="invoiceItem">Item</th>
                    <th class="quantities">Quantity</th>
                    <th class="prices">Price</th>
                </tr>
            `;

            invoice.items.forEach(i => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${i.name}</td>
                    <td>${i.quantity}</td>
                    <td>$${i.lineTotal.toFixed(2)}</td>
                `;
                itemsList.appendChild(row);
            });

            // Add totals
            itemsList.innerHTML += `
                <tr><td colspan="2"></td><td><strong>Subtotal: $${invoice.subtotal.toFixed(2)}</strong></td></tr>
                <tr><td colspan="2"></td><td><strong>Tax: $${invoice.tax.toFixed(2)}</strong></td></tr>
                <tr><td colspan="2"></td><td><strong>Total: $${invoice.total.toFixed(2)}</strong></td></tr>
            `;
        }


        window.onload = function(){
                console.log('loading invoice...');
                checkLoginStatus();

                //if this page is opened to view an invoice from history
                const selectedId = localStorage.getItem("SelectedInvoice");

                if (selectedId) {
                    loadSavedInvoice(selectedId);
                    localStorage.removeItem("SelectedInvoice");
                    return;
                }

                displayCustomerInfo();
                displayInvoice();
                displayInvoiceDate();
                const invoice = buildInvoiceObject();
                saveInvoice(invoice);
                
                const email = destringify(sessionStorage.getItem('email'));
            }
            
            window.close = function(){
                notifyInvoiceSent(email);
                saveInvoiceToUser();         
        }


    function ShowInvoices() {
    let allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    const trnSearch = document.getElementById("searchTRN").value.trim();

    const table = document.getElementById("allInvoiceTable");

    // Reset table except header
    table.innerHTML = `
        <tr>
            <th>Invoice #</th>
            <th>TRN</th>
            <th>Date</th>
            <th>Total</th>
        </tr>
    `;

    if (trnSearch !== "") {
        allInvoices = allInvoices.filter(inv => inv.trn.toString() === trnSearch);
    }

    if (allInvoices.length === 0) {
        table.innerHTML += `
            <tr><td colspan="4" style="text-align:center;">No invoices found.</td></tr>
        `;
        return;
    }

    allInvoices.forEach(inv => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><a href="#" onclick="openInvoice('${inv.invoiceNumber}')">${inv.invoiceNumber}</a></td>
            <td>${inv.trn}</td>
            <td>${new Date(inv.date).toLocaleDateString()}</td>
            <td>$${inv.total.toFixed(2)}</td>
        `;

        table.appendChild(row);
    });
}

    function openInvoice(invoiceNumber) {
        localStorage.setItem("SelectedInvoice", invoiceNumber);
        window.location.href = "invoicePg.html"; 
}

    function getUserInvoices() {
        const activeUser = JSON.parse(localStorage.getItem("ActiveUser"));
        const popup = document.getElementById("invoicePopup");
        const listContainer = document.getElementById("invoiceListContainer");

        if (!activeUser) {
            alert("You must be logged in to view invoices.");
            return;
        }

        const allUsers = JSON.parse(localStorage.getItem("RegistrationData")) || [];
        const user = allUsers.find(u => u.trn === activeUser.trn);

        // Clear old results
        listContainer.innerHTML = "";

        if (!user || !user.invoices || user.invoices.length === 0) {
            listContainer.innerHTML = "<p>No invoices found.</p>";
        } else {
            user.invoices.forEach((invoice, index) => {
                const card = document.createElement("div");
                card.className = "invoice-card";
                card.innerHTML = `
                    <button class="invoice-btn" data-id="${invoice.invoiceNumber}">
                        <p><strong>Invoice #${index + 1}</strong></p>
                        <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> $${invoice.total.toFixed(2)}</p>
                    </button>
                `;
                listContainer.appendChild(card);
                card.querySelector(".invoice-btn").addEventListener("click", function (e) {
                    const invoiceId = e.target.closest(".invoice-btn").getAttribute("data-id");
    
                    // Save the selected invoice number
                    localStorage.setItem("selectedInvoice", invoiceId);
    
                    // Redirect to invoice page
                    window.location.href = "invoicePg.html";
                });
            });
        }

        // Show popup
        popup.style.display = "flex";
    }


    document.getElementById("closeInvoicePopup").onclick = function() {
        document.getElementById("invoicePopup").style.display = "none";
    };



