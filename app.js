// Srorage Controller 
const StorageCtrl = (function(){

    // Public method
    return {
        storeItem:function(item){
           let items;
           // Check if any item
           if(localStorage.getItem('items') === null){
            items = [];
            // Push items
            items .push(item);
            // Set localstorage 
            localStorage.setItem('items',JSON.stringify(items));
           }else{
            // Get what is already in localstorage
            items = JSON.parse(localStorage.getItem('items'));
            // Push items
            items.push(item);
            // Resite items 
            localStorage.setItem('items',JSON.stringify(items));


           }
        },
        getItemsFromStorage:function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));

            }
            return items;
        },
        upDateItmeStorage:function(updatedItme){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item,index) =>{
                if(updatedItme.id === item.id){
                    items.splice(index,1,updatedItme);
                }

            });
            localStorage.setItem('items',JSON.stringify(items));

            
        },
        deleteItmeFromStorage:function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item,index) =>{
                if(id === item.id){
                    items.splice(index,1);
                }

            });
            localStorage.setItem('items',JSON.stringify(items));


        },
        clearItemStorage:function(){
            localStorage.removeItem('items');
        },
    }
})();

// Item controller
const ItemCtrl = (function(){
    const item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;

    }
 // Data stucture / State 
    const data = {
        // items:[
        //     // {id:0 ,name:'Steak Dinner' ,calories:1200},
        //     // {id:1 ,name:'Cookies ' ,calories:400},
        //     // {id:2 ,name:'Egg' ,calories:200}
        // ]
        items:StorageCtrl.getItemsFromStorage(),
        currentItem:null,
        totalcalories:0
    }
    // Public method
    return{
        getItem:function(){
            return data.items;
        },
        addItem:function(name,calories){
            let ID;
            // Create ID
            
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id+1;

            }else{
                ID = 0;
            }
            // Calories to number 
             calories = parseInt(calories);
             // Create new item 
             newItem = new item(ID,name,calories);

             // add to items array
             data.items.push(newItem);
             return newItem;

        },
        getItemById:function(id){
            let found = null;
            // loop through the item 
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }

            });
            return found;

        },
        upDateItme:function(name,calories){
            // Calories to Number
            calories = parseInt(calories);


            let found = null;
            data.items.forEach(item =>{
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;

                }
            });
            return found;



        },
        deleteItem:function(id){
          // Get the Id
          const ids = data.items.map(function(item){
            return item.id;
          });
          // Get the index
          const index = ids.indexOf(id);
          // Remove item 
          data.items.splice(index,1);

        },
        clearAllItems:function(){
            data.items = [];
        },
        setCurrentItem:function(item){
            data.currentItem = item;

        },
        getCurrentItem:function(){
            return data.currentItem;
        },
        getTotalCalories:function(){
            let total = 0;
            data.items.forEach(function(item){
                total += item.calories;
            });
            data.totalcalories = total;
            return data.totalcalories;
        },
        logData: function(){
            return data;
        }
    }
})();
// UI controller
const UICtrl = (function(){
    const UISelector = {
        itemlist:'#item-list',
        clearBtn:'.clear-btn',
        ListItems:'#item-list li',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deletetBtn:'.delete-btn',
        backBtn:'.back-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories:'.total-calories'
    }



    // Public method
    return {
        populateItemList:function(items){
            let html = '';
            items.forEach(item => {
                html += `
            <li class="collection-item" id='item-${item.id}'> 
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"> <i class='edit-item fa fa-pencil'></i></a>
             </li>
                
                `;
                
            });
            // insert List item
            document.querySelector(UISelector.itemlist).innerHTML = html;


        },
        addListItem:function(item){
            // show the list
            document.querySelector(UISelector.itemlist).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class 
            li.className = 'collection-item';
            // Add id 
            li.id = `item-${item.id}`;
            // Add HTML 
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"> <i class='edit-item fa fa-pencil'></i></a>`;
            // insert item 
            document.querySelector(UISelector.itemlist).insertAdjacentElement('beforeend',li);
            
        },
        getIteminput:function(){
            return {
                name:document.querySelector(UISelector.itemNameInput).value,
                calories:document.querySelector(UISelector.itemCaloriesInput).value,
            }
        },
        showCalories:function(totalCalories){
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;

        },
        clearInput:function(){
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';

        },
        addItemToFrom:function(){
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();

        },
        showEditState:function(){
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deletetBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        hideList:function(){
            document.querySelector(UISelector.itemlist).style.display = 'none';

        },
        upDateListItem:function(item){
            let listItems = document.querySelectorAll(UISelector.ListItems);
            // Turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(listitem){
             const itemId = listitem.getAttribute('id');
             if(itemId === `item-${item.id}`){
                 document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                 <a href="#" class="secondary-content"> <i class='edit-item fa fa-pencil'></i></a>`;
             }

            });

        },
        deleteListItem:function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();

        },
        removeItems:function(){
           let listItmes = document.querySelectorAll(UISelector.ListItems);
            // Trun node list into array 
            listItmes = Array.from(listItmes);
            listItmes.forEach(function(item){
                item.remove();
            });
        
            
            
        },
        clearEditState:function(){
            UICtrl.clearInput();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deletetBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';


        },

        getSelector:function(){
            return UISelector;
        }

    }

})();

// app Controller
const App = (function(ItemCtrl,UICtrl,StorageCtrl){
    // load event listerner
    const loadEventListeners = function(){
        // Get UI selector
        const UIselectors = UICtrl.getSelector();
       
        // Add item event
        document.querySelector(UIselectors.addBtn).addEventListener('click',itemAddSubmit);
        
        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }

        });
        
        // Edit icon click event
        document.querySelector(UIselectors.itemlist).addEventListener('click',itemEditClick);

        // Update item event
        document.querySelector(UIselectors.updateBtn).addEventListener('click',itemUpdateSubmit);
        // Delete item event
        document.querySelector(UIselectors.deletetBtn).addEventListener('click',itemDeleteSubmit);
        // Back button event
        document.querySelector(UIselectors.backBtn).addEventListener('click',UICtrl.clearEditState);
        // Clear all items 
        document.querySelector(UIselectors.clearBtn).addEventListener('click',clearAllItemClick);
        

    }
    // Add item submit 
    const itemAddSubmit = function(e){
        // Get form input form UI controller
        const input = UICtrl.getIteminput();
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name,input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);
             // total calories 
             const totalCalories = ItemCtrl.getTotalCalories();
             // Add total calories to UI 
             UICtrl.showCalories(totalCalories);
            // Store in local storage
            StorageCtrl.storeItem(newItem);
            // Clear fields
            UICtrl.clearInput();

        }

        e.preventDefault();

    }
    // Click Edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item id(item-0, item-1);
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split('-');
            // Get the acual id
            const id = parseInt(listIdArr[1]);
            // get item 
            const itemtoEdit = ItemCtrl.getItemById(id);
            // Set current item 
            ItemCtrl.setCurrentItem(itemtoEdit);
            // Add item to form 
            UICtrl.addItemToFrom();

        }
        e.preventDefault();

    }
    // Update item submit
    const itemUpdateSubmit = function(e){
        // Get item input
        const input = UICtrl.getIteminput();
        // Update item
        const upDateItme = ItemCtrl.upDateItme(input.name,input.calories);
        UICtrl.upDateListItem(upDateItme);
         // total calories 
         const totalCalories = ItemCtrl.getTotalCalories();
         // Add total calories to UI 
         UICtrl.showCalories(totalCalories);
         // Update localstorage 
         StorageCtrl.upDateItmeStorage(upDateItme);

         // Clear input 
         UICtrl.clearEditState();


        e.preventDefault();

    }
    // function Delete button 
    const itemDeleteSubmit = function(e){
        // Get current Item 
        const currentItem = ItemCtrl.getCurrentItem();
        //Dellete form Data Stuctrue 
        ItemCtrl.deleteItem(currentItem.id);
        // Delete from UI 
        UICtrl.deleteListItem(currentItem.id);
        // total calories 
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI 
        UICtrl.showCalories(totalCalories);
        // Delete from localStorage
        StorageCtrl.deleteItmeFromStorage(currentItem.id);


        UICtrl.clearEditState();
        
    



        e.preventDefault()

    }
    const clearAllItemClick = function(){
        if(confirm("Are you sure ?")){
        //Delete All item from Data Structure
        ItemCtrl.clearAllItems();
        // Remove from UI 
        UICtrl.removeItems();
         // total calories 
         const totalCalories = ItemCtrl.getTotalCalories();
         // Add total calories to UI 
         UICtrl.showCalories(totalCalories);
         UICtrl.hideList();
         StorageCtrl.clearItemStorage();
        }
        

    }

    // Public method
    return{
        init:function(){
            // Clear Edit state
            UICtrl.clearEditState();
            // Fetch items from datastucture
            const items = ItemCtrl.getItem();
            // check if any item
            if(items.length === 0){
                UICtrl.hideList();

            }else{
            // Populate list with items
            UICtrl.populateItemList(items);
            
            }
            // total calories 
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI 
            UICtrl.showCalories(totalCalories);
            

           
            // Load Event listener
            loadEventListeners();
        }
    }

})(ItemCtrl,UICtrl,StorageCtrl);
App.init();