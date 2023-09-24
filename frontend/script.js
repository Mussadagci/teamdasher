document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('driverWorkTable');
    const GAS_PRICE_PER_GALLON = 5.85; 
    const MILE_COST = 0.3; // Adjust as needed
    
    const carMileage = {
        'Car G14': 45,
        'Car S07': 35,
        'Car B02': 45
    };

    const driverColors = {
        'Driver G14': 'yellow',
        'Driver S07': 'blue',
        'Driver B02': 'red'
    };

    table.addEventListener('click', (event) => {
        const cell = event.target;
        const row = cell.closest('tr');

        if (cell === row.lastElementChild) {
            if (row.dataset.id) {
                const shareLink = "https://www.example.com/share?id=" + row.dataset.id;
                alert("Share this link with your team: " + shareLink);
            } else {
                alert("Sorry, unable to generate a share link for this entry.");
            }
        }
    });

    window.addEntry = function(event) {
        event.preventDefault();
    
        const driverName = document.getElementById('driverName').value;
        const whichCar = document.getElementById('whichCar').value;
        const startingMiles = parseFloat(document.getElementById('startingMiles').value);
        const endingMiles = parseFloat(document.getElementById('endingMiles').value);
        const whichCarMileage = carMileage[whichCar];
        
        const PORT = 300

        app.listen(PORT, () => {
            console.log('Server is running on http://localhost:${PORT}');
        })
        
        if (!whichCarMileage) {
            alert('Please enter a valid car name.');
            return;
        }
    
        const milesDriven = endingMiles - startingMiles;
        const gasExpenses = (milesDriven / whichCarMileage) * GAS_PRICE_PER_GALLON;
        const additionalExp = parseFloat(document.getElementById('additionalExpenses').value) || 0; // Get additional expenses
        const mileageCost = milesDriven * MILE_COST;
        const totalExpenses = gasExpenses + mileageCost + additionalExp; // Add gas, mileage cost, and additional expenses together
        const totalMoneyInput = parseFloat(document.getElementById('totalMoney').value);
        const netProfit = totalMoneyInput - totalExpenses; // Subtract the total expenses from the total money
    
        if (isNaN(gasExpenses) || milesDriven < 0) {
            alert('There was an error calculating the expenses. Please check your input values.');
            return;
        }
    
        // ... rest of the code ...
        if (!localStorage.getItem('token')) {
            window.location.href = "/login";
        }
        
    
    
        const newRow = table.insertRow(-1);
        newRow.style.backgroundColor = driverColors[driverName] || 'white';
        newRow.insertCell(0).innerHTML = document.getElementById('date').value;
        newRow.insertCell(1).innerHTML = document.getElementById('startTime').value;
        newRow.insertCell(2).innerHTML = driverName;
        newRow.insertCell(3).innerHTML = whichCar;
        newRow.insertCell(4).innerHTML = startingMiles;
        newRow.insertCell(5).innerHTML = endingMiles;
        newRow.insertCell(6).innerHTML = milesDriven;
        newRow.insertCell(7).innerHTML = totalExpenses.toFixed(2); // This now represents total expenses, not just gas expenses
        newRow.insertCell(8).innerHTML = netProfit.toFixed(2);
        newRow.insertCell(9).innerHTML = "Click for Link";
    
        const deleteCell = newRow.insertCell(10);
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = function() {
            deleteRow(this);
        }
        deleteCell.appendChild(deleteButton);
    
        document.getElementById('entryForm').reset();
        calculateTotals();
    };
    
    

    function deleteRow(button) {
        const row = button.parentElement.parentElement;
        row.remove();
        calculateTotals();
    }

    function calculateTotals() {
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        let totalExpenses = 0;
        let totalMoneyMade = 0;

        for(let i = 0; i < rows.length; i++) {
            totalExpenses += parseFloat(rows[i].cells[7].innerText) || 0;
            totalMoneyMade += parseFloat(rows[i].cells[8].innerText) || 0;
        }
        document.getElementById('myButton').addEventListener('click', addEntry);

        document.getElementById('totalExpenses').innerText = 'Total Expenses: $' + totalExpenses.toFixed(2);
        document.getElementById('totalMoneyMade').innerText = 'Total Money Earned: $' + totalMoneyMade.toFixed(2);
    }
});

