
        localStorage.getItem('cart');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsDiv = document.getElementById('cartItems');
        const totalAmountSpan = document.getElementById('totalAmount');
        const checkoutBtn = document.getElementById('checkoutBtn');
        let cartCount = document.getElementById('cartCount');
        let emptyMsg = document.getElementById('empty');
        let totalAmount = 0;
       

       function checkLoginStatus() {
            const activeUser = JSON.parse(localStorage.getItem("ActiveUser"));
            const greeting = document.getElementById("greeting");
            const loginBtn = document.getElementById("loginBtn");
            const dropdown = document.querySelector(".dropdown");

            if (activeUser) {
                // Show user name
                greeting.textContent = `Welcome, ${activeUser.firstName}!`;

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
        
        function loadCart() {
            cartItemsDiv.innerHTML = "";
            totalAmount = 0;

            if (cart.length === 0) {
                emptyMsg.textContent = "Your cart is empty.";
                checkoutBtn.disabled = true;
                updateCartCount(0);
                totalAmountSpan.textContent = "0.00";
                return;
            }

            emptyMsg.textContent = "";
            checkoutBtn.disabled = false;

            cart.forEach(item => {
                const itemDiv = createCartItem(item);
                cartItemsDiv.appendChild(itemDiv);
            });

            updateTotal();
        }

        function saveCart() {
            localStorage.setItem("cart", JSON.stringify(cart));
        }


        function createCartItem(watch) {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cartItem';
            cartItemDiv.setAttribute('data-id', watch.id);
            subTotal = watch.price * (watch.quantity || 1);
            tax = subTotal * 0.15;
            price = subTotal + tax;


            
            cartItemDiv.innerHTML = `
                <img src="${watch.imgURL}" alt="${watch.model}" height="100px" width="100px">
                <div class="itemDetails">
                    <h3>${watch.model}-${watch.brand}</h3>
                    <p>Subtotal: $${watch.price.toFixed(2)}</p>
                    <p>Tax (15%): $${(watch.price * 0.15).toFixed(2)}</p>
                    <p>Quantity: <input type="number" class="itemQuantity" value="1" min="1"></p>
                    <button class="removeBtn">Remove</button>
                </div>
                `;
                
                const quantityInput = cartItemDiv.querySelector('.itemQuantity');
                quantityInput.addEventListener('change', (e)=>{
                    const newQuantity = parseInt(quantityInput.value);
                    const itemIndex = cart.findIndex(item => item.id === watch.id);

                    if(itemIndex !== -1){
                        if(newQuantity> cart[itemIndex].stock){
                            alert(`We only have ${cart[itemIndex].stock} available.`);
                            quantityInput.value = cart[itemIndex].stock;
                            cart[itemIndex].quantity = cart[itemIndex].stock;
                        }else{
                            cart[itemIndex].quantity = newQuantity; //update the quantity in the cart array
                            localStorage.setItem('cart', JSON.stringify(cart));
                        updateTotal();
                    }
                    
                }
            });

            const removeBtn = cartItemDiv.querySelector('.removeBtn');
            removeBtn.addEventListener('click', () => {
                removeFromCart(watch.id);
                cartItemDiv.remove();
                updateTotal();
            });
            
            return cartItemDiv;
        }

        function removeFromCart(id) {
            const index = cart.findIndex(watch => watch.id === id);
            if (index !== -1) {
                cart.splice(index, 1); // removes from array
                localStorage.setItem('cart', JSON.stringify(cart)); // persist change
                updateCartCount(cart.length);
            }
        }
        
        
        function clearAllItems(){
            cart.length = 0;  
            localStorage.setItem('cart', JSON.stringify(cart));
            cartItemsDiv.innerHTML = '';
            
            cartCount.classList.add ("hidden");
                
                totalAmount = 0;
                if (totalAmountSpan) totalAmountSpan.textContent = totalAmount.toFixed(2);
                localStorage.setItem('Total',JSON.stringify(totalAmount));
                sessionStorage.setItem('total',JSON.stringify(totalAmount));

                if(cartCount){
                    cartCount.style.display = 'none';
                    cartCount.classList.add('hidden');
                }
                if(emptyMsg){
                    emptyMsg.textContent = 'Your cart is empty.';
                }
                if(checkoutBtn){
                    checkoutBtn.disabled = true;
                }
                
            }
            
            
            
            
            
            function updateTotal() {
            totalAmount = 0;
            tax = 0;
            cart.forEach(watch => {
                const quantity = watch.quantity || 1;
                totalAmount += watch.price * quantity * 1.15;
                tax += watch.price * 0.15 * quantity;
            });
            
            totalAmountSpan.textContent = totalAmount.toFixed(2);
            localStorage.setItem('Total',JSON.stringify(totalAmount));
            sessionStorage.setItem('subTotal',JSON.stringify(totalAmount));
            sessionStorage.setItem('tax', JSON.stringify(tax));
        }
        
        
        function updateCart(){
             const watch = cart.find(w => w.id === id);
             localStorage.setItem('cart',cart);
            }

        checkoutBtn.addEventListener('click', () => {
            if (!localStorage.getItem('ActiveUser')) {
                alert("Please login before checking out.");
            return;
        }
        saveCart();

        window.location.href = 'checkoutPg.html';
        updateCart();
    });
    
    function updateCartCount(count){
        const cartCount = document.getElementById('cartCount');
            
        if(cartCount){
                cartCount.textContent= count;

                if(count ===0){
                    cartCount.style.display = 'none';
                    cartCount.classList.add = 'hidden';
                }else{
                    cartCount.style.display = 'block';
                    cartCount.classList.remove = 'hidden';
                }
            }
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

        window.onclick = function(event) {
            const popup = document.getElementById("invoicePopup");
            if (event.target === popup) {
                popup.style.display = "none";
            }
        };
        
        window.onload = function() {
            console.log('Loading cart page...');
            console.log('Current cart:', cart);
            checkLoginStatus();
            updateCartCount(cart.length);
            loadCart();
        };


    function exitCartPage(){
        window.location.href = 'watchPg.html';
    }
    
    