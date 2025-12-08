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


        window.onload = checkLoginStatus;
 
 //default constructor for watch objects
        const WatchItem = {
            brand: "",
            model: "",
            price: 0,
            description: ""
        }

        //initializing watch objects
        function createWatch(serialNum,brand,model,price,description,stock){
            new object({
                serialNum: serialNum,
                brand: brand,
                model: model,
                price: price,
                description: description,
                stock: stock
            });
        }


        let watchInventory = [
        {id:1, brand:"Audemars Piguet",model:"Royal Oak Offshore",price:25000,description:"A luxury sports watch with a bold design and exceptional craftsmanship.",stock:10,imgURL:"Assets/royal oak offshore.jpg",quantity:1},
        {id:2,brand:"Rolex",model:"Submariner",price:15000,description:"A classic dive watch known for its durability and timeless style.",stock:5,imgURL:"Assets/rolex submariner.jpg",quantity:1},
        {id:3,brand:"Patek Philippe",model:"Nautilus",price:30000,description:"An elegant timepiece that combines sophistication with sporty aesthetics.",stock:3,imgURL:"Assets/Patek Philippe Nautilus.jpg",quantity:1},
        {id:4,brand:"Omega",model:"Seamaster",price:12000,description:"A versatile watch that offers both style and functionality for everyday wear.",stock:7,imgURL:"Assets/OMEGA Seamaster.jpg",quantity:1},
        {id:5,brand:"Tag Heuer",model:"Carrera",price:8000,description:"A racing-inspired watch that embodies precision and performance.",stock:15,imgURL:"Assets/TAG Heuer Carrera.jpg",quantity:1},
        {id:6,brand:"Breitling",model:"Navitimer",price:20000,description:"A pilot's watch with advanced features and a distinctive design.",stock:0,imgURL:"Assets/navitimer.jpg",quantity:1}
        ];
        
        localStorage.setItem("allProducts", JSON.stringify(watchInventory));
        let cart = [];
        const addToCartButtons = document.querySelectorAll('.addBtn');

        

        //finding the watch that was chosen to be added to cart
        const watchList = document.getElementById('watchList');
        watchList.addEventListener('click', (e) => {
            if (e.target.classList.contains('addBtn')) {//anytime a Add to cart button is clicked
                const watchID = e.target.closest('div').dataset.id;//finding the id number of the item selected
                const watch = watchInventory.find((w) => w.id == parseInt(watchID));//connecting the watch id to the id in the array 'wacth inventory'
                
                //determine if the same item is already there
                const duplicateCheck = (item) => {
                    return cart.includes(item);
                }
                
                if(duplicateCheck(watch)){
                    alert(`${watch.model} is already in the cart.`);
                }else{
                    // calculate tax, discount, subtotal, total
                    const taxRate = 0.15; // 15%
                    const discountRate = 0.10; // 10%

                    const tax = watch.price * taxRate;
                    const discount = watch.price * discountRate;
                    const subtotal = watch.price;
                    const total = subtotal + tax - discount;

                    const cartItem = {
                    ...watch,
                    tax: tax.toFixed(2),
                    discount: discount.toFixed(2),
                    subtotal: subtotal.toFixed(2),
                    total: total.toFixed(2)
                    };

                    cart.push(cartItem);
                    alert(`Added ${watch.model} to cart. Total items in cart: ${cart.length}`);
                    console.log(`Added ${watch.model} to cart.`);
                    console.log(cart);
                    updateCartCount(cart.length);
                    localStorage.setItem('cart', JSON.stringify(cart));//save the cart to local storage so it can be retrieved later        
                }
            }
            
            
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
        
        //filtering functionality 
        const filterOptions = document.querySelectorAll(".filterOption");
        const watchItems = document.querySelectorAll(".watchItem");

filterOptions.forEach(option => {
    option.addEventListener("change", filterWatches);
});

function filterWatches() {
    const selectedBrands = [...document.querySelectorAll("#options input[type=checkbox]:checked")]
                            .map(opt => opt.id);

    watchItems.forEach(item => {
        let visible = true;

        // Example brand association (adjust as needed)
        const brandMap = {
            1: "Audemars Piguet",
            2: "Rolex",
            3: "Patek Philippe",
            4: "Omega",
            5: "TAG Heuer",
            6: "Breitling"
        };

        if (selectedBrands.length > 0 && !selectedBrands.includes(brandMap[item.dataset.id])) {
            visible = false;
        }

        item.style.display = visible ? "block" : "none";
    });
}
